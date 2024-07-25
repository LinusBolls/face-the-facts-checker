import { env } from "../env";
import { urlEvents } from "../urlEvents";
import { fetchProxy } from "../chromeCommunication";
import { copyTextToClipboard } from "../clipboard";
import { FactCard } from "../html";
import { loadStyles } from "../styles";

function removeAllFactCards(options?: { except?: Fact }) {
  const factsContainer = document.querySelector('[data-facts-slot="facts"]');

  if (!factsContainer) return;

  for (const el of Array.from(
    factsContainer.querySelectorAll("[data-facts-fact]")
  )) {
    if (
      !options?.except ||
      el.getAttribute("data-facts-fact") !== options?.except?.id
    ) {
      el.remove();
    }
  }
}

interface Fact {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
  shareLink: string;
  shareText: string;
  userRatedHelpfulness?: string;
}

const logger = {
  error: (...args) => console.error("FaceTheFacts.content", ...args),
  warn: (...args) => console.info("FaceTheFacts.content", ...args),
  info: (...args) => console.info("FaceTheFacts.content", ...args),
};

let videoInfo: {
  facts: Fact[];
} | null = null;

let lastFact: Fact | null = null;

async function initVideoPage(videoId: string) {
  const paidContentOverlay = document.querySelector<HTMLDivElement>(
    ".ytp-paid-content-overlay"
  );
  if (!paidContentOverlay) {
    logger.error("failed to select '.ytp-paid-content-overlay'");
    return;
  }
  paidContentOverlay.setAttribute("data-facts-slot", "facts");
  paidContentOverlay.style.display = "flex";
  paidContentOverlay.style.flexDirection = "column";
  paidContentOverlay.style.gap = "12px";

  removeAllFactCards();

  try {
    const res = await fetchProxy<{ ok: true; data: { facts: any[] } }>(
      env.apiUrl + `/youtube-videos/${videoId}/facts`
    );
    videoInfo = res.data.data;

    logger.info("updated videoInfo:", videoInfo);
  } catch (err) {
    logger.error("failed to fetch information for videoId", videoId);
  }
}

async function main() {
  urlEvents.on("change", async (oldUrl, newUrl) => {
    const isNewVideo = newUrl.isVideo && oldUrl.videoId !== newUrl.videoId;

    logger.info(
      "url change detected:",
      isNewVideo ? "initVideo called" : "initVideo not called"
    );

    if (isNewVideo) {
      initVideoPage(newUrl.videoId!);
    }
  });
  loadStyles();
  if (urlEvents.isVideo) {
    initVideoPage(urlEvents.videoId!);
  }
  setInterval(tryToUpdate, 1000);
}
main();

async function tryToUpdate() {
  if (!videoInfo) return;

  const videoElement = document.querySelector<HTMLVideoElement>(
    "video.html5-main-video"
  );
  if (!videoElement) {
    if (urlEvents.isVideo) {
      logger.error(
        "page is video, but failed to select 'video.html5-main-video'"
      );
    }
    return;
  }

  const currentSeconds = videoElement.currentTime;

  const currentFact = videoInfo.facts.find(
    (i) => i.startMs / 1000 < currentSeconds && i.endMs / 1000 > currentSeconds
  );
  const factsContainer = document.querySelector('[data-facts-slot="facts"]')!;

  if (!factsContainer) {
    logger.error(`failed to select '[data-facts-slot="facts"]'`);
    return;
  }

  if (lastFact?.id !== currentFact?.id) {
    removeAllFactCards({ except: currentFact });

    if (currentFact) {
      logger.info("creating fact card:", currentFact.id);

      const factCard = createFactCard(currentFact);

      factsContainer.appendChild(factCard);

      if (!document.querySelector('[data-facts-slot="styles"]')) {
        logger.warn(
          `failed to select '[data-facts-slot="styles"]' when creating fact card`
        );
      }
      lastFact = currentFact;
    }
  }
}

function createFactCard(fact: Fact) {
  const factCard = createElementFromHTML(FactCard(fact.id, fact.text));

  factCard
    ?.querySelector('[data-facts-action="close"]')
    ?.addEventListener("click", async () => {
      const factsContainer = document.querySelector(
        '[data-facts-slot="facts"]'
      )!;
      if (factsContainer) factsContainer.innerHTML = "";

      try {
        await fetchProxy<{ ok: true; data: { facts: any[] } }>(
          env.apiUrl +
            `/youtube-videos/${urlEvents.videoId}/facts/${fact.id}/tracking`,
          { method: "POST", body: JSON.stringify({ action: "close" }) }
        );
      } catch (err) {
        logger.error("failed to track fact close:", err);
      }
    });

  factCard
    ?.querySelector('[data-facts-action="copy"]')
    ?.addEventListener("click", async () => {
      copyTextToClipboard(fact.shareText);

      // TODO: persist button state
      try {
        await fetchProxy<{ ok: true; data: { facts: any[] } }>(
          env.apiUrl +
            `/youtube-videos/${urlEvents.videoId}/facts/${fact.id}/tracking`,
          { method: "POST", body: JSON.stringify({ action: "copy" }) }
        );
      } catch (err) {
        logger.error("failed to track fact copy:", err);
      }
    });

  const feedbackOptions = Array.from(
    factCard?.querySelectorAll('[data-facts-action="rate-helpfulness"]')
  );

  for (const el of feedbackOptions) {
    const helpfulness = el.getAttribute("data-facts-helpfulness");

    if (fact.userRatedHelpfulness === helpfulness) {
      el.classList.add("facts-pill-button--active");
    }

    if (helpfulness) {
      el.addEventListener("click", async () => {
        try {
          await fetchProxy<{ ok: true; data: { facts: any[] } }>(
            env.apiUrl +
              `/youtube-videos/${urlEvents.videoId}/facts/${fact.id}/ratings`,
            { method: "POST", body: JSON.stringify({ helpfulness }) }
          );
          for (const option of feedbackOptions) {
            option.classList.remove("facts-pill-button--active");
          }
          el.classList.add("facts-pill-button--active");
        } catch (err) {
          logger.error("failed to rate fact:", err);

          el.classList.remove("facts-pill-button--active");
        }
      });
    }
  }
  return factCard;
}

function createElementFromHTML(htmlString: string) {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild as HTMLElement;
}
