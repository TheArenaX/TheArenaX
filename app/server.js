import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

const app = express();
let vite;

if (!isProd) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: "ssr" },
  });
  app.use(vite.middlewares);
} else {
  app.use(
    "/assets",
    express.static(path.resolve(__dirname, "dist/client/assets"))
  );
}

app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl;

    let template, render;
    if (!isProd) {
      template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
    } else {
      template = fs.readFileSync(
        path.resolve(__dirname, "dist/client/index.html"),
        "utf-8"
      );
      render = (await import("./dist/server/entry-server.js")).render;
    }

    const appHtml = await render(url);
    const html = template.replace(`<!--app-html-->`, appHtml);

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error(e.stack);
    res.status(500).end(e.stack);
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
