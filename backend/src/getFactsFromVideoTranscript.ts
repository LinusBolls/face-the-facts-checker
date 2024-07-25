import OpenAI from "openai";
const { nanoid } = require("fix-esm").require("nanoid");

import type { Transcript } from "./getTranscriptFromYoutubeVideo";
import { env } from "./env";

export interface Fact {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
  shareLink: string;
  shareText: string;
  userRatedHelpfulness?: string;
}

export interface Facts {
  facts: Fact[];
}

export async function getFactsFromVideoTranscript(
  transcript: Transcript | null
): Promise<Facts> {
  try {
    // const openai = new OpenAI({ apiKey: env.openai.apiKey });

    //   const response = await openai.chat.completions.create({
    //     model: "gpt-4o",
    //     messages: [],
    //     temperature: 1,
    //     max_tokens: 256,
    //     top_p: 1,
    //     frequency_penalty: 0,
    //     presence_penalty: 0,
    //   });
    //   return response;

    const factId = nanoid();

    const clientId = "bar";

    return {
      facts: [
        {
          id: factId,
          shareLink: env.publicUrl + `/f/${factId}?s=` + clientId,
          shareText: `At 0:00 https://www.youtube.com/watch?v=DpO3FX3lnAE&t=0: \nThis restaurant lost a wage theft lawsuit with 263 employees in 2022, resulting in an undisclosed settlement. Claims of employee mistreatment resulted in boycotts (https://example.org).`,
          startMs: 0,
          endMs: 5000,
          text: `This restaurant lost a wage theft lawsuit with 263 employees in 2022, resulting in an undisclosed settlement. Claims of employee mistreatment resulted in [boycotts](https://example.org).`,
        },
      ],
    };
  } catch (err) {
    return { facts: [] };
  }
}
