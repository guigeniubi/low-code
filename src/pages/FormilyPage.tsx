import { useState } from "react";
import { Button, message, Space } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
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
  FormButtonGroup,
  Submit,
  Reset,
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

export default function FormilyPage() {
  const [schema, setSchema] = useState<any>(schemaJson);
  const [form] = useState(() => createForm());

  // 加载 schema 文件
  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const loadedSchema = JSON.parse(content);
        setSchema(loadedSchema);
        form.reset(); // 重置表单
        message.success("Schema 加载成功！");
      } catch (error) {
        message.error("加载失败：" + (error as Error).message);
      }
    };
    reader.readAsText(file);
  };

  // 表单提交
  const onSubmit = (values: any) => {
    console.log("表单提交:", values);
    message.success("提交成功！");
    console.log("表单数据:", JSON.stringify(values, null, 2));
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
        <h2 style={{ margin: 0 }}>表单渲染器</h2>
        <Space>
          <input
            type="file"
            accept=".json"
            onChange={handleLoad}
            style={{ display: "none" }}
            id="form-schema-file-input"
          />
          <label htmlFor="form-schema-file-input">
            <Button type="primary" icon={<FileAddOutlined />}>
              加载 Schema
            </Button>
          </label>
        </Space>
      </div>

      <div style={{ padding: "40px" }}>
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <FormProvider form={form}>
            <Form form={form} layout="vertical" onAutoSubmit={onSubmit}>
              <SchemaField schema={schema} />
              <FormButtonGroup>
                <Submit>提交</Submit>
                <Reset>重置</Reset>
              </FormButtonGroup>
            </Form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
