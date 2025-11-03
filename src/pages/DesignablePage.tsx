import { useState, useEffect } from "react";
import { Button, message, Space } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { Designer } from "@designable/react";
import { Engine } from "@designable/core";
import {
  Form,
  FormItem,
  Input,
  NumberPicker,
  DatePicker,
  Select,
  Switch,
  Radio,
  Checkbox,
} from "@formily/antd";
import { createForm } from "@formily/core";
import { FormProvider, createSchemaField } from "@formily/react";
import schemaJson from "../schema/schema.json";

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    NumberPicker,
    DatePicker,
    Select,
    Switch,
    Radio: Radio.Group as any,
    Checkbox: Checkbox.Group as any,
  },
});

// 将 TreeNode 转换为 Formily Schema
const treeNodeToSchema = (treeNode: any): any => {
  if (!treeNode) return schemaJson;

  // 如果已经是 schema 格式，直接返回
  if (treeNode.type && treeNode.properties) {
    return treeNode;
  }

  // 尝试从 TreeNode 中提取 schema
  if (treeNode.props && treeNode.props.schema) {
    return treeNode.props.schema;
  }

  // 默认返回原始 schema
  return schemaJson;
};

export default function DesignablePage() {
  const [engine] = useState(() => {
    const eng = new Engine({
      shortcuts: [],
      effects: [],
    });
    // 初始化时设置 schema
    eng.setCurrentTree(schemaJson as any);
    return eng;
  });

  const [schema, setSchema] = useState<any>(schemaJson);
  const [form] = useState(() => createForm());

  // 监听引擎变化，更新 schema
  //   useEffect(() => {
  //     const handleChange = () => {
  //       try {
  //         const treeNode = engine.getCurrentTree();
  //         if (treeNode) {
  //           // 将 TreeNode 转换为 schema 格式
  //           const formilySchema = treeNodeToSchema(treeNode);
  //           setSchema(formilySchema);
  //         }
  //       } catch (error) {
  //         console.error("Error updating schema:", error);
  //       }
  //     };

  //     // 监听引擎的各种事件
  //     engine.on("*", handleChange);

  //     return () => {
  //       engine.off("*", handleChange);
  //     };
  //   }, [engine]);

  // 保存 schema 到文件
  const handleSave = () => {
    try {
      const treeNode = engine.getCurrentTree();
      const currentSchema = treeNodeToSchema(treeNode);
      const schemaString = JSON.stringify(currentSchema, null, 2);

      // 创建下载链接
      const blob = new Blob([schemaString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "schema.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success("Schema 已保存！");
    } catch (error) {
      message.error("保存失败：" + (error as Error).message);
    }
  };

  // 加载 schema
  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const loadedSchema = JSON.parse(content);
        setSchema(loadedSchema);
        engine.setCurrentTree(loadedSchema as any);
        message.success("Schema 加载成功！");
      } catch (error) {
        message.error("加载失败：" + (error as Error).message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <div
        style={{
          backgroundColor: "white",
          padding: "16px 24px",
          borderBottom: "1px solid #e8e8e8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>表单设计器</h2>
        <Space>
          <input
            type="file"
            accept=".json"
            onChange={handleLoad}
            style={{ display: "none" }}
            id="schema-file-input"
          />
          <label htmlFor="schema-file-input">
            <Button>加载 Schema</Button>
          </label>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            保存 Schema
          </Button>
        </Space>
      </div>

      <div style={{ padding: "24px" }}>
        {/* @ts-expect-error - Designer component accepts children but types are incomplete */}
        <Designer engine={engine}>
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <FormProvider form={form}>
              <Form form={form} layout="vertical">
                <SchemaField schema={schema} />
              </Form>
            </FormProvider>
          </div>
        </Designer>
      </div>
    </div>
  );
}
