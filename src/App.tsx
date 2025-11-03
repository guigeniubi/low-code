import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Layout, Menu } from "antd";
import { FormOutlined, ToolOutlined } from "@ant-design/icons";
import DesignablePage from "./pages/DesignablePage";
import FormilyPage from "./pages/FormilyPage";

const { Header, Content } = Layout;

function Navigation() {
  const location = useLocation();

  return (
    <Header
      style={{
        backgroundColor: "#fff",
        padding: "0 24px",
        borderBottom: "1px solid #e8e8e8",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <div
          style={{ fontSize: "18px", fontWeight: "bold", marginRight: "32px" }}
        >
          低代码表单平台
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ border: "none", flex: 1 }}
          items={[
            {
              key: "/designer",
              icon: <ToolOutlined />,
              label: <Link to="/designer">表单设计器</Link>,
            },
            {
              key: "/form",
              icon: <FormOutlined />,
              label: <Link to="/form">表单渲染</Link>,
            },
          ]}
        />
      </div>
    </Header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Navigation />
        <Content>
          <Routes>
            <Route path="/" element={<DesignablePage />} />
            <Route path="/designer" element={<DesignablePage />} />
            <Route path="/form" element={<FormilyPage />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
