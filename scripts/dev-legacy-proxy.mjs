import http from "node:http";

const proxyTargets = [
  {
    name: "survey-doctor-qa",
    port: Number(process.env.SURVEY_DOCTOR_QA_PROXY_PORT || 7203),
    target: process.env.SURVEY_DOCTOR_QA_REMOTE_URL || "http://125.71.97.56:9003",
  },
  {
    name: "pdf-parser",
    port: Number(process.env.PDF_PARSER_PROXY_PORT || 7204),
    target: process.env.PDF_PARSER_REMOTE_URL || "http://125.71.97.56:9004",
  },
  {
    name: "cross-document-annotation",
    port: Number(process.env.CROSS_DOCUMENT_ANNOTATION_PROXY_PORT || 7205),
    target:
      process.env.CROSS_DOCUMENT_ANNOTATION_REMOTE_URL ||
      "http://125.71.97.56:9005",
  },
  {
    name: "knowledge-graph",
    port: Number(process.env.KNOWLEDGE_GRAPH_PROXY_PORT || 7206),
    target:
      process.env.KNOWLEDGE_GRAPH_REMOTE_URL || "http://125.71.97.56:9006/",
  },
];

const strippedResponseHeaders = new Set([
  "content-security-policy",
  "content-security-policy-report-only",
  "cross-origin-embedder-policy",
  "cross-origin-opener-policy",
  "cross-origin-resource-policy",
  "x-frame-options",
]);

function rewriteLocationHeader(value, targetUrl, localOrigin) {
  if (typeof value !== "string" || value.length === 0) {
    return value;
  }

  try {
    const resolved = new URL(value, targetUrl);

    if (resolved.origin !== targetUrl.origin) {
      return resolved.toString();
    }

    return `${localOrigin}${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return value;
  }
}

function cloneRequestHeaders(headers, targetUrl) {
  const nextHeaders = { ...headers };

  nextHeaders.host = targetUrl.host;

  if (typeof nextHeaders.origin === "string") {
    nextHeaders.origin = targetUrl.origin;
  }

  if (typeof nextHeaders.referer === "string") {
    try {
      const refererUrl = new URL(nextHeaders.referer);
      nextHeaders.referer = `${targetUrl.origin}${refererUrl.pathname}${refererUrl.search}${refererUrl.hash}`;
    } catch {
      nextHeaders.referer = targetUrl.origin;
    }
  }

  return nextHeaders;
}

function createProxyServer({ name, port, target }) {
  const targetUrl = new URL(target);

  const server = http.createServer((request, response) => {
    const upstreamRequest = http.request(
      {
        protocol: targetUrl.protocol,
        hostname: targetUrl.hostname,
        port: targetUrl.port || 80,
        method: request.method,
        path: request.url || "/",
        headers: cloneRequestHeaders(request.headers, targetUrl),
      },
      (upstreamResponse) => {
        const localOrigin = `http://localhost:${port}`;
        response.statusCode = upstreamResponse.statusCode || 502;
        response.statusMessage = upstreamResponse.statusMessage || "Bad Gateway";

        for (const [headerName, headerValue] of Object.entries(
          upstreamResponse.headers,
        )) {
          const normalizedHeaderName = headerName.toLowerCase();

          if (
            strippedResponseHeaders.has(normalizedHeaderName) ||
            headerValue === undefined
          ) {
            continue;
          }

          if (normalizedHeaderName === "location") {
            response.setHeader(
              headerName,
              rewriteLocationHeader(headerValue, targetUrl, localOrigin),
            );
            continue;
          }

          response.setHeader(headerName, headerValue);
        }

        response.setHeader("Access-Control-Allow-Origin", "*");
        upstreamResponse.pipe(response);
      },
    );

    upstreamRequest.on("error", (error) => {
      response.statusCode = 502;
      response.setHeader("Content-Type", "application/json; charset=utf-8");
      response.end(
        JSON.stringify({
          app: name,
          message: "Legacy proxy failed",
          detail: error.message,
        }),
      );
    });

    request.pipe(upstreamRequest);
  });

  server.listen(port, () => {
    console.log(`[legacy-proxy] ${name}: http://localhost:${port} -> ${target}`);
  });

  return server;
}

const servers = proxyTargets.map(createProxyServer);

function shutdown() {
  for (const server of servers) {
    server.close();
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
