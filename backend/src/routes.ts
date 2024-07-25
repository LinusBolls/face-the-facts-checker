import { FastifyInstance } from "fastify";

const { nanoid } = require("fix-esm").require("nanoid");

import { getFactsFromVideoTranscript } from "./getFactsFromVideoTranscript";
import { getTranscriptFromYoutubeVideo } from "./getTranscriptFromYoutubeVideo";
import { env } from "./env";

export async function routes(fastify: FastifyInstance) {
  fastify.post("/clients/install", (request, reply) => {
    const clientId = nanoid();

    const uninstallUrl =
      env.publicUrl + `/api/v1/clients/${clientId}/uninstall`;

    console.log("install tracked");

    reply.send({ ok: true, data: { clientId, uninstallUrl } });
  });

  // has to be GET because chrome only allows us to set an uninstallURL and not an uninstall callback,
  // so we don't have a way to make a POST request on uninstall
  fastify.get("/clients/:clientId/uninstall", (request, reply) => {
    const clientId = (request.params as any).clientId;

    console.log("uninstall tracked");

    reply.redirect("https://facethefacts.app");
  });

  fastify.get("/youtube-videos/:videoId/facts", async (request, reply) => {
    const videoId = (request.params as any).videoId;

    const videoUrl = "https://www.youtube.com/watch?v=" + videoId;

    const transcript = await getTranscriptFromYoutubeVideo(videoUrl);

    const data = await getFactsFromVideoTranscript(transcript);

    reply.send({ ok: true, data });
  });

  fastify.post(
    "/youtube-videos/:videoId/facts/:factId/ratings",
    (request, reply) => {
      const videoId = (request.params as any).videoId;
      const factId = (request.params as any).factId;

      reply.send({ ok: true });
    }
  );

  fastify.post(
    "/youtube-videos/:videoId/facts/:factId/tracking",
    (request, reply) => {
      const videoId = (request.params as any).videoId;
      const factId = (request.params as any).factId;

      reply.send({ ok: true });
    }
  );
}
