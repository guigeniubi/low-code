import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/antd.css";
import "@designable/react/esm/theme.less";
import "./index.css";

if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const first = args[0];
    if (typeof first === "string" && first.includes("Support for defaultProps will be removed from function components")) {
      return;
    }
    originalWarn(...(args as []));
  };
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
