import Fastify from "fastify";
import cors from "@fastify/cors";

import { routes } from "./routes";
import { env } from "./env";

async function main() {
  const fastify = Fastify({ logger: true });

  await fastify.register(cors, { origin: true });

  await fastify.register(routes, { prefix: "/api/v1" });

  fastify.get("/f/:factId", (request, reply) => {
    const factId = (request.params as any).factId;

    reply.type("text/html").send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
  <h1>${factId}</h1>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/x0uiD362T48?si=tghb2ZEAsOZPyKaw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
