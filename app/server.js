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
    appType: "custom", // disable Vite's built-in HTML handling
  });
  app.use(vite.middlewares);
  console.log("Vite dev middleware enabled.");
} else {
  // Serve static assets
  app.use(
    "/assets",
    express.static(path.resolve(__dirname, "dist/client/assets"))
  );
  console.log("Serving static assets from dist/client.");
}

app.use(async (req, res) => {
  try {
    const url = req.originalUrl;

    let template, render;
    if (!isProd) {
      // Read raw HTML and transform with Vite
      template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
    } else {
      // Use built version
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
    vite?.ssrFixStacktrace?.(e);
    console.error("SSR error:\n", e.stack);
    res.status(500).end(e.stack);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
