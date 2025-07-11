import api from "./api";
import { log } from "./utils/logging/logger";

const PORT = 5000;

async function startServer() {
  try {
    api.listen(PORT, () => {
      log({ type: "success", message: `Server running on port ${PORT}` });
      log({ type: "info", message: `API URL: http://localhost:${PORT}` });
    });
  } catch (err) {
    log({ type: "error", message: "Server failed to start", meta: err });
    process.exit(1);
  }
}

startServer();
