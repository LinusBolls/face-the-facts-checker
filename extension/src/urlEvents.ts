interface UrlInfo {
  videoId: string | null;
  isVideo: boolean;
  isShortsVideo: boolean;
  isLongVideo: boolean;
}

type UrlListener = (oldUrl: UrlInfo, newUrl: UrlInfo) => void;

const getVideoId = (url: URL): string | null => {
  const isLongVideo = url.pathname.startsWith("/watch");
  const isShortsVideo = url.pathname.startsWith("/shorts");

  if (isLongVideo) return url.searchParams.get("v");
  if (isShortsVideo) return url.pathname.split("/")[2];

  return null;
};

const urlsAreDifferent = (a: URL, b: URL): boolean => {
  return a.toString() !== b.toString();
};

const getInfoFromVideoUrl = (url: URL): UrlInfo => {
  const videoId = getVideoId(url);
  const isVideo = videoId != null;
  const isLongVideo = isVideo && url.pathname.startsWith("/watch");
  const isShortsVideo = isVideo && url.pathname.startsWith("/shorts");

  return {
    videoId,
    isVideo,
    isLongVideo,
    isShortsVideo,
  };
};

/**
 * notifies listeners when the url changes, and gives youtube-specific information about the old and new url.
 *
 * youtube offers long form and short form video ("longs" and "shorts").
 *
 * shorts urls look like https://www.youtube.com/shorts/DKSa01gRQWw
 *
 * long urls look like https://www.youtube.com/watch?v=DKSa01gRQWw
 *
 * you can view any short by constructing a long url from it's `videoId`.
 * you can also construct a valid short url from a long url, but the url will redirect to the short.
 *
 */
class UrlEvents {
  private lastUrl: URL;

  public videoId: string | null;
  public isVideo: boolean;
  public isShortsVideo: boolean;
  public isLongVideo: boolean;

  constructor() {
    this.setInfoFromVideoUrl();

    setInterval(this.tick.bind(this), 100);
  }

  private setInfoFromVideoUrl(): void {
    this.lastUrl = new URL(window.location.toString());

    const info = getInfoFromVideoUrl(this.lastUrl);

    this.videoId = info.videoId;
    this.isVideo = info.isVideo;
    this.isLongVideo = info.isLongVideo;
    this.isShortsVideo = info.isShortsVideo;
  }

  private async tick() {
    const currentUrl = new URL(window.location.toString());

    // notify the listeners attached using UrlEvents.instance.on("change", <...>)
    if (urlsAreDifferent(this.lastUrl, currentUrl)) {
      for (const listener of this.listeners["change"] ?? []) {
        listener(
          getInfoFromVideoUrl(this.lastUrl),
          getInfoFromVideoUrl(currentUrl)
        );
        this.setInfoFromVideoUrl();
      }
    }
  }
  // an array of callbacks that we call if the url changes
  private listeners: Record<string, UrlListener[]> = {};

  /**
   * @param callback gets called when the url changes
   */
  public on(event: "change", callback: UrlListener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
}
export const urlEvents = new UrlEvents();
