import { useState } from "react";
import {
  Form,
  FormItem,
  Input,
  FormButtonGroup,
  Submit,
  Reset,
} from "@formily/antd";
import { createForm } from "@formily/core";
import { FormProvider, createSchemaField } from "@formily/react";
import { Designer } from "@designable/react";
import { Engine } from "@designable/core";

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
  },
});

function App() {
  const [engine] = useState(() => {
    return new Engine({
      shortcuts: [],
      effects: [],
    });
  });

  const form = createForm({
    initialValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (values: any) => {
    console.log("表单提交:", values);
    alert(`提交成功！\n姓名: ${values.name}\n邮箱: ${values.email}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* @ts-expect-error - Designer component accepts children but types are incomplete */}
      <Designer engine={engine}>
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
          <h1
            style={{ marginBottom: "24px", textAlign: "center", color: "#333" }}
          >
            Formily + Designable 表单示例
          </h1>
          <FormProvider form={form}>
            <Form form={form} layout="vertical" onAutoSubmit={onSubmit}>
              <SchemaField>
                <SchemaField.String
                  name="name"
                  title="姓名"
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{
                    placeholder: "请输入姓名",
                  }}
                  required
                />
                <SchemaField.String
                  name="email"
                  title="邮箱"
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{
                    type: "email",
                    placeholder: "请输入邮箱",
                  }}
                  required
                />
              </SchemaField>
              <FormButtonGroup>
                <Submit>提交</Submit>
                <Reset>重置</Reset>
              </FormButtonGroup>
            </Form>
          </FormProvider>
        </div>
      </Designer>
    </div>
  );
}

export default App;
