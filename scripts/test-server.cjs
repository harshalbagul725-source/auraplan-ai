const http = require("node:http");
const { createReadStream, statSync } = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  let requestedPath;
  try {
    requestedPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }

  const file = path.resolve(root, `.${requestedPath === "/" ? "/index.html" : requestedPath}`);
  if (!file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    if (!statSync(file).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
  } catch {
    response.writeHead(404).end("Not found");
    return;
  }

  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff"
  });
  if (request.method === "HEAD") response.end();
  else createReadStream(file).pipe(response);
}).listen(4173, "127.0.0.1");
