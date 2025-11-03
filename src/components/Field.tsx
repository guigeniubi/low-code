import React from "react";
import { observer } from "@formily/reactive-react";
import { createBehavior, createResource } from "@designable/core";
import { DnFC } from "@designable/react";

interface FieldProps {
  style?: React.CSSProperties;
  value?: string;
}

const Field: DnFC<FieldProps> = observer(
  ({ value, children, style, ...rest }) => {
    return (
      <div {...rest} style={{ ...style, padding: "5px 0" }}>
        {value}
      </div>
    );
  }
);

export default Field;

Field.Behavior = createBehavior({
  name: "Field",
  selector: (node) => !!node.props && node.props["x-component"] === "Field",
  designerProps: {
    droppable: true,
    propsSchema: {
      type: "object",
      properties: {
        value: {
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Input",
          "x-component-props": {
            placeholder: "请输入要展示的文本",
          },
        },
        "component-styles": {
          type: "void",
          title: "样式",
          "x-component": "CollapseItem",
          properties: {
            "style.width": {
              type: "string",
              "x-decorator": "FormItem",
              "x-component": "SizeInput",
            },
          },
        },
      },
    },
  },
  designerLocales: {
    "zh-CN": {
      title: "对象",
    },
  },
});

Field.Resource = createResource({
  // icon: 'TextSource',
  elements: [
    {
      componentName: "Field",
      props: {
        type: "object",
        "x-component": "Field",
      },
    },
  ],
});
