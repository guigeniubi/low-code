import React from "react";
import { observer } from "@formily/react";
import { createBehavior } from "@designable/core";
import { DnFC, DroppableWidget, TreeNodeWidget, useTreeNode } from "@designable/react";

const Root: DnFC<any> & { Behavior?: any } = observer((props) => {
  const node = useTreeNode();
  return (
    <div style={{ padding: 12 }}>
      {node.children?.length ? <TreeNodeWidget node={node} /> : <DroppableWidget />}
    </div>
  );
});

Root.Behavior = createBehavior({
  name: "Root",
  selector: (node) => node.componentName === "Root",
  designerProps: {
    droppable: true,
  },
});

export default Root;
