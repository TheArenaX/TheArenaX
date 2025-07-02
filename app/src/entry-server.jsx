import { createApp } from "./main";
import { renderToString } from "react-dom/server";

export async function render(url) {
  const app = createApp();
  return renderToString(app);
}
