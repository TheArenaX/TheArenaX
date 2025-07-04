import App from "./App.tsx";
import "./index.css";

export function createApp() {
  return <App />;
}

// For client-side rendering
if (typeof document !== "undefined") {
  import("react-dom/client")
    .then(({ createRoot }) => {
      const container = document.getElementById("root");
      if (container) {
        createRoot(container).render(<App />);
      }
    })
    .catch((error) => {
      console.error("Error importing react-dom/client:", error);
    });
}
