import http from "node:http";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.mjs";

const port = Number(process.env.BETTER_AUTH_PORT || process.env.PORT || 3000);
const authHandler = toNodeHandler(auth);

const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith("/api/auth")) {
    await authHandler(req, res);
    return;
  }

  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, () => {
  console.log(`Better Auth server running on http://localhost:${port}`);
  console.log(`Auth routes: http://localhost:${port}/api/auth/*`);
  console.log(`JWKS endpoint: http://localhost:${port}/api/auth/jwks`);
});
