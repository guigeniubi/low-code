import React from "react";
import {
  Designer,
  Workbench,
  ViewPanel,
  DesignerToolsWidget,
  ViewToolsWidget,
  OutlineTreeWidget,
  ResourceWidget,
  StudioPanel,
  CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  SettingsPanel,
  ComponentTreeWidget,
  HistoryWidget,
} from "@designable/react";
import { SettingsForm } from "@designable/react-settings-form";
import { createDesigner, GlobalRegistry } from "@designable/core";

import Field from "../components/Field";
import FormCollapse from "../components/FormCollapse";
import Root from "../components/Root";

GlobalRegistry.registerDesignerLocales({
  "zh-CN": {
    sources: { Inputs: "输入控件", Groups: "分组控件" },
    panels: {
      Component: "组件",
      OutlinedTree: "大纲",
      PropertySettings: "属性设置",
      History: "历史",
    },
    settings: { value: "控件值", header: "标题", field: "字段" },
  },
});

const engine = createDesigner({ rootComponentName: "Root" });

export default function DesignablePage() {
  return (
    <Designer engine={engine}>
      {/* @ts-ignore */}
      <Workbench>
        <StudioPanel>
          <CompositePanel>
            {/* @ts-ignore */}
            <CompositePanel.Item title="panels.Component" icon="Component">
              <ResourceWidget title="sources.Inputs" sources={[Field.Resource]} />
              <ResourceWidget title="sources.Groups" sources={[FormCollapse.Resource]} />
            </CompositePanel.Item>
            {/* @ts-ignore */}
            <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
              <OutlineTreeWidget />
            </CompositePanel.Item>
            {/* @ts-ignore */}
            <CompositePanel.Item title="panels.History" icon="History">
              <HistoryWidget />
            </CompositePanel.Item>
          </CompositePanel>

          {/* @ts-ignore */}
          <WorkspacePanel>
            <ToolbarPanel>
              <DesignerToolsWidget />
              <ViewToolsWidget />
            </ToolbarPanel>
            {/* @ts-ignore */}
            <ViewportPanel>
              <ViewPanel type="DESIGNABLE">
                {() => (
                  <ComponentTreeWidget
                    components={{
                      Root,
                      Field,
                      FormCollapse,
                    }}
                  />
                )}
              </ViewPanel>
              <ViewPanel type="JSONTREE">
                {(tree) => <div style={{ overflow: "hidden", height: "100%" }} />}
              </ViewPanel>
            </ViewportPanel>
          </WorkspacePanel>

          {/* @ts-ignore */}
          <SettingsPanel title="panels.PropertySettings">
            <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
          </SettingsPanel>
        </StudioPanel>
      </Workbench>
    </Designer>
  );
}
