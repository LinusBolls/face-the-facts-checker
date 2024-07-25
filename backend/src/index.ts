import Fastify from "fastify";
import cors from "@fastify/cors";

import { routes } from "./routes";
import { env } from "./env";

async function main() {
  const fastify = Fastify({ logger: true });

  await fastify.register(cors, { origin: true });

  await fastify.register(routes, { prefix: "/api/v1" });

  fastify.get("/f/:factId", (request, reply) => {
    const factId = (request.params as any).videoId;

    reply.type("text/html").send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    ${factId}
  </body>
</html>`);
  });

  fastify.listen({ port: env.port }, (err, address) => {
    if (err) {
      fastify.log.error(err);

      process.exit(1);
    }
    console.info("listening at", address + "/api/v1");
  });
}
main();
