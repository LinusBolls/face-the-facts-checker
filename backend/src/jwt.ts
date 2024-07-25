import * as jose from "jose";

import { env } from "./env";

export type JwtPayload = {
  sub: string;
};

export async function issueToken(clientId: string): Promise<string> {
  const secret = new TextEncoder().encode(env.auth.token.secret);

  const payload: JwtPayload = {
    sub: clientId,
  };

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(secret);

  return jwt;
}

export async function verifyToken(jwt: string): Promise<JwtPayload> {
  const secret = new TextEncoder().encode(env.auth.token.secret);

  const { payload } = await jose.jwtVerify(jwt, secret);

  return payload as JwtPayload;
}
