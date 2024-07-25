import { FastifyInstance, FastifyRequest } from "fastify";

const { nanoid } = require("fix-esm").require("nanoid");

import { getFactsFromVideoTranscript } from "./getFactsFromVideoTranscript";
import { getTranscriptFromYoutubeVideo } from "./getTranscriptFromYoutubeVideo";
import { env } from "./env";
import { issueToken, verifyToken } from "./jwt";

async function assertAuthHeader(request: FastifyRequest) {
  const token = request.headers.authorization?.replace("Bearer ", "")!;

  const payload = await verifyToken(token);

  return payload;
}

export async function routes(fastify: FastifyInstance) {
  fastify.post("/clients/install", async (request, reply) => {
    const clientId = nanoid();

    const token = await issueToken(clientId);

    const uninstallUrl =
      env.publicUrl + `/api/v1/clients/${clientId}/uninstall?t=` + token;

    console.log("install tracked");

    reply.send({ ok: true, data: { clientId, token, uninstallUrl } });
  });

  // has to be GET because chrome only allows us to set an uninstallURL and not an uninstall callback,
  // so we don't have a way to make a POST request on uninstall
  fastify.get("/clients/:clientId/uninstall", async (request, reply) => {
    const clientId = (request.params as any).clientId;
    const token = (request.query as any).t;

    try {
      const payload = await verifyToken(token);

      if (payload.sub !== clientId) {
        reply.code(401).type("text/html").send("Unauthorized");

        return;
      }
      console.log("uninstall tracked");

      reply.redirect("https://facethefacts.app");
    } catch (err) {
      reply.code(401).type("text/html").send("Unauthorized");
    }
  });

  fastify.get("/youtube-videos/:videoId/facts", async (request, reply) => {
    await assertAuthHeader(request);

    const videoId = (request.params as any).videoId;

    const videoUrl = "https://www.youtube.com/watch?v=" + videoId;

    const transcript = await getTranscriptFromYoutubeVideo(videoUrl);

    const data = await getFactsFromVideoTranscript(transcript);

    reply.send({ ok: true, data });
  });

  fastify.post(
    "/youtube-videos/:videoId/facts/:factId/ratings",
    async (request, reply) => {
      await assertAuthHeader(request);

      const videoId = (request.params as any).videoId;
      const factId = (request.params as any).factId;

      reply.send({ ok: true });
    }
  );

  fastify.post(
    "/youtube-videos/:videoId/facts/:factId/tracking",
    async (request, reply) => {
      await assertAuthHeader(request);

      const videoId = (request.params as any).videoId;
      const factId = (request.params as any).factId;

      reply.send({ ok: true });
    }
  );
}
