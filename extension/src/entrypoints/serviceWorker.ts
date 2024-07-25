import { env } from "../env";
import { storage } from "../chromeStorage";

const logger = {
  error: (...args) => console.error("FaceTheFacts.worker", ...args),
  warn: (...args) => console.info("FaceTheFacts.worker", ...args),
  info: (...args) => console.info("FaceTheFacts.worker", ...args),
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.key === "fetch") {
    const isOurApi = message.data.url.startsWith(env.apiUrl);

    if (isOurApi) {
      if (!message.data.init) message.data.init = {};
      if (!message.data.init.headers) message.data.init.headers = {};

      message.data.init.headers.Authorization = "Bearer " + storage.token;
    }

    fetch(message.data.url, message.data.init)
      .then(async (res) => {
        try {
          const data = await res.json();

          sendResponse({ status: res.status, data });
        } catch (err) {
          logger.error("failed to json parse response:", err);
        }
      })
      .catch((err) => {
        logger.error("failed to fetch:", err);
        sendResponse({ status: 500 });
      });
  }
  // returning true to mark the listener as asynchronous
  return true;
});

chrome.runtime.onInstalled.addListener(async (details) => {
  const isInitialInstall =
    details.reason === chrome.runtime.OnInstalledReason.INSTALL;

  if (isInitialInstall) {
    try {
      const res = await fetch(env.apiUrl + "/clients/install", {
        method: "POST",
      });
      const data: {
        data: { clientId: string; token: string; uninstallUrl: string };
      } = await res.json();

      const clientId = data.data.clientId;
      const token = data.data.token;

      await storage.setAuthOnInstall(clientId, token);

      chrome.runtime.setUninstallURL(data.data.uninstallUrl);
    } catch (err) {
      logger.error("failed to handle extension install:", err);
    }
  }
});

chrome.runtime.onUpdateAvailable.addListener((details) => {
  console.info("updating to version", details.version);
  chrome.runtime.reload();
});
