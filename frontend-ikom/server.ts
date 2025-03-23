const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./localhost+1-key.pem"),
  cert: fs.readFileSync("./localhost+1.pem"),
};

app.prepare().then(() => {
  const server = createServer(
    httpsOptions,
    (
      req: import("http").IncomingMessage,
      res: import("http").ServerResponse
    ) => {
      const parsedUrl = parse(req.url || "", true);
      handle(req, res, parsedUrl);
    }
  );

  server.listen(port, (err?: Error) => {
    if (err) throw err;
    console.log(
      `> Prêt sur https://localhost:${port} et https://192.168.57.185:${port}`
    );
  });
});
