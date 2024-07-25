export async function sendToServiceWorker<T>(
  key: string,
  data?: unknown
): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ key, data }, (res) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(res);
      }
    });
  });
}

/**
 * if we directly tried to fetch from a content script embedded in youtube, the youtube CORS policy would prevent this.
 *
 * because of this, we proxy our http requests over our service worker.
 */
export const fetchProxy = async <T>(
  url: RequestInfo | URL,
  init?: RequestInit
): Promise<{ data: T; status: number }> => {
  const res = await sendToServiceWorker<{ data: T; status: number }>("fetch", {
    url,
    init,
  });
  if (res.status !== 200) {
    throw new Error("[fetchProxy] failed to fetch: " + res.status);
  }
  return res;
};
