import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/reset.css";
import "@designable/react/dist/designable.react.umd.production.css";
import "./index.css";

// 暂时移除 StrictMode 以抑制来自 @designable/react 的 defaultProps 警告
// 这是第三方库的问题，不影响功能。等库更新后可恢复 StrictMode
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
