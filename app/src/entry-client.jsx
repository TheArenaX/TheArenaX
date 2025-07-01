import React from "react";
import { createRoot } from "react-dom/client";
import { createApp } from "./main";

const app = createApp();
const container = document.getElementById("root");
createRoot(container).render(app);
