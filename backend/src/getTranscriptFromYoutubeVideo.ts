import { TranscriptResponse, YoutubeTranscript } from "youtube-transcript";
import he from "he";

export type Transcript = TranscriptResponse[];

/**
 * turns encoded html entities like `&#39;` or `&quot` into `'` and `"`.
 *
 * we need this because the "youtube-transcript" package returns html encoded entities for some reason.
 */
const htmlDecode = (snippet: TranscriptResponse) => {
  snippet.text = he.decode(snippet.text);

  return snippet;
};

export async function getTranscriptFromYoutubeVideo(
  videoUrl: string
): Promise<Transcript | null> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);

    const processedTranscript = transcript.map(htmlDecode);

    console.log(processedTranscript.map((i) => i.text).join(" "));

    return processedTranscript;
  } catch (err) {
    return null;
  }
}
