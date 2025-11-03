import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import {
  Designer,
  Workbench,
  ResourceWidget,
  ViewportPanel,
  ViewPanel,
  SettingsPanel,
  ComponentTreeWidget,
} from "@designable/react";
import { Engine, createResource, TreeNode } from "@designable/core";
import { createForm } from "@formily/core";
import { FormProvider, createSchemaField } from "@formily/react";
import {
  Form,
  FormItem,
  Input,
  Select,
  Switch,
  NumberPicker,
  DatePicker,
} from "@formily/antd";

import schemaJson from "../schema/schema.json";

const SchemaField = createSchemaField({
  components: { FormItem, Input, Select, Switch, NumberPicker, DatePicker },
});

// 定义组件映射，用于 ComponentTreeWidget
const components = {
  FormItem,
  Input,
  Select,
  Switch,
  NumberPicker,
  DatePicker,
};

// 创建组件资源列表
const resources = createResource(
  {
    title: "输入框",
    description: "单行文本输入框",
    elements: [
      new TreeNode({
        componentName: "FormItem",
        props: {
          title: "输入框",
        },
        children: [
          new TreeNode({
            componentName: "Input",
            props: {
              placeholder: "请输入",
            },
          }),
        ],
      }),
    ],
  },
  {
    title: "选择器",
    description: "下拉选择框",
    elements: [
      new TreeNode({
        componentName: "FormItem",
        props: {
          title: "选择器",
        },
        children: [
          new TreeNode({
            componentName: "Select",
            props: {
              placeholder: "请选择",
            },
          }),
        ],
      }),
    ],
  },
  {
    title: "开关",
    description: "开关切换组件",
    elements: [
      new TreeNode({
        componentName: "FormItem",
        props: {
          title: "开关",
        },
        children: [
          new TreeNode({
            componentName: "Switch",
            props: {
              defaultChecked: false,
            },
          }),
        ],
      }),
    ],
  },
  {
    title: "数字输入",
    description: "数字输入框",
    elements: [
      new TreeNode({
        componentName: "FormItem",
        props: {
          title: "数字输入",
        },
        children: [
          new TreeNode({
            componentName: "NumberPicker",
            props: {
              placeholder: "请输入数字",
            },
          }),
        ],
      }),
    ],
  },
  {
    title: "日期选择",
    description: "日期选择器",
    elements: [
      new TreeNode({
        componentName: "FormItem",
        props: {
          title: "日期选择",
        },
        children: [
          new TreeNode({
            componentName: "DatePicker",
            props: {
              placeholder: "请选择日期",
            },
          }),
        ],
      }),
    ],
  }
);

// 将设计器的序列化结果转换为 Formily schema
const convertToFormilySchema = (serialized: any): any => {
  if (!serialized || typeof serialized !== "object") {
    return schemaJson;
  }

  // 如果已经是 Formily schema 格式，直接返回
  if (serialized.type === "object" && serialized.properties) {
    return serialized;
  }

  // 尝试转换设计器的格式到 Formily 格式
  if (serialized.componentName) {
    // 如果是一个组件节点，转换为 Formily schema
    return {
      type: "object",
      properties: convertNodeToSchema(serialized),
    };
  }

  return schemaJson;
};

// 递归转换节点为 Formily schema
const convertNodeToSchema = (node: any, fieldName: string = "field"): any => {
  const properties: any = {};

  if (
    node.componentName === "FormItem" &&
    node.children &&
    node.children.length > 0
  ) {
    const child = node.children[0];
    const componentName = child.componentName || "Input";
    const name = node.props?.name || fieldName;

    properties[name] = {
      type: "string",
      title: node.props?.title || name,
      "x-decorator": "FormItem",
      "x-component": componentName,
      "x-component-props": child.props || {},
    };
  } else if (node.children && node.children.length > 0) {
    // 递归处理子节点
    node.children.forEach((child: any, index: number) => {
      Object.assign(
        properties,
        convertNodeToSchema(child, `${fieldName}_${index}`)
      );
    });
  }

  return properties;
};

export default function DesignablePage() {
  const [engine] = useState(() => {
    const eng = new Engine({ shortcuts: [] });
    // 初始化时设置 schema
    eng.setCurrentTree(schemaJson as any);
    return eng;
  });
  const [form] = useState(() => createForm());
  const [schema, setSchema] = useState<any>(schemaJson);

  // 监听引擎变化，更新 schema
  useEffect(() => {
    let timer: number | null = null;

    const checkForChanges = () => {
      try {
        const treeNode = engine.getCurrentTree();
        if (treeNode) {
          // 将 TreeNode 序列化为 schema
          const serialized = treeNode.serialize();
          // 转换为 Formily schema 格式
          const formilySchema = convertToFormilySchema(serialized);
          setSchema((prevSchema: any) => {
            // 简单的深度比较，避免不必要的更新
            if (JSON.stringify(prevSchema) !== JSON.stringify(formilySchema)) {
              return formilySchema;
            }
            return prevSchema;
          });
        }
      } catch (error) {
        console.error("Error updating schema:", error);
      }

      // 每 300ms 检查一次变化
      timer = window.setTimeout(checkForChanges, 300);
    };

    checkForChanges();

    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [engine]);

  // 保存 schema
  const handleSave = () => {
    try {
      const treeNode = engine.getCurrentTree();
      const serialized = treeNode.serialize();
      const currentSchema = convertToFormilySchema(serialized);
      const schemaString = JSON.stringify(currentSchema, null, 2);
      const blob = new Blob([schemaString], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "schema.json";
      link.click();
      message.success("Schema 已保存！");
    } catch (err) {
      message.error("保存失败：" + (err as Error).message);
    }
  };

  const DesignerWithChildren = Designer as React.FC<{
    engine: Engine;
    children?: React.ReactNode;
  }>;

  return (
    <DesignerWithChildren engine={engine}>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* 顶部工具栏 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 20px",
            background: "#fff",
            borderBottom: "1px solid #eee",
          }}
        >
          <h3 style={{ margin: 0 }}>表单设计器</h3>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            保存 Schema
          </Button>
        </div>

        {/* 主体三栏布局 */}
        <Workbench />
        <div style={{ display: "flex", flex: 1, height: "calc(100vh - 60px)" }}>
          {/* 左侧：组件资源面板 */}
          <div
            style={{
              width: 220,
              background: "#fafafa",
              borderRight: "1px solid #eee",
            }}
          >
            <ResourceWidget title="基础组件" sources={[resources]} />
          </div>

          {/* 中间：设计画布 */}
          {/* @ts-expect-error - ViewportPanel accepts children but types are incomplete */}
          <ViewportPanel style={{ flex: 1, background: "#fff" }}>
            <ViewPanel type="DESIGNABLE">
              {() => (
                <FormProvider form={form}>
                  <Form layout="vertical">
                    <SchemaField schema={schema} />
                  </Form>
                </FormProvider>
              )}
            </ViewPanel>
          </ViewportPanel>

          {/* 右侧：属性配置与组件树 */}
          <div
            style={{
              width: 300,
              background: "#fafafa",
              borderLeft: "1px solid #eee",
            }}
          >
            <SettingsPanel title="属性配置" />
            <ComponentTreeWidget components={components} />
          </div>
        </div>
      </div>
    </DesignerWithChildren>
  );
}
