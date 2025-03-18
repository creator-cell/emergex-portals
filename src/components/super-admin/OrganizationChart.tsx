import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from "@/components/ui/card";

const CustomNode = ({ data }: { data: any }) => {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <Card className="p-3 w-[200px] text-center border border-border bg-white">
        <div className="text-sm font-medium">{data.role}</div>
        <div className="text-sm">{data.name}</div>
        <div className="text-xs text-muted-foreground mt-1">{data.email}</div>
      </Card>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export function OrganizationChart({ data = {} }) {
  const processChart = () => {
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    const ySpacing = 150;

    // Process each priority level
    Object.entries(data).forEach(([priority, priorityData]) => {
      const currentLevel = parseInt(priority);
      const yPosition = (currentLevel - 1) * ySpacing;

      // Get all employees at this level
      const employeesAtLevel = Object.values(priorityData as { [key: string]: any }).flatMap((group: any) =>
        group.roles.map((role: any) => ({
          ...role.employee,
          fromEmployee: group.fromEmployee
        }))
      );

      // Calculate the required xSpacing to avoid overlaps
      const nodeWidth = 200; // Width of the node
      const minSpacing = nodeWidth * 1.5; // Minimum spacing between nodes
      const totalWidth = employeesAtLevel.length * minSpacing;
      const startX = -totalWidth / 2+ minSpacing / 2;

      employeesAtLevel.forEach((employee, index) => {
        const nodeId = employee._id;
        const xPosition = startX + (index *2* minSpacing);

        console.log("employee: ",employee)

        // Create node
        nodes.push({
          id: nodeId,
          type: 'custom',
          position: { x: xPosition, y: yPosition },
          data: {
            name: employee.name,
            designation: employee.designation,
            email: employee.email,
            role: employee.title,
            priority: currentLevel
          }
        });

        // Create edge if there's a parent
        if (employee.fromEmployee) {
          edges.push({
            id: `edge-${employee.fromEmployee._id}-${nodeId}`,
            source: employee.fromEmployee._id,
            target: nodeId,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#2563eb', strokeWidth: 2 }
          });
        }
      });
    });

    return { nodes, edges };
  };

  const { nodes, edges } = processChart();

  if (!Object.keys(data).length) {
    return <div className="text-center p-4">No organization data available</div>;
  }

  return (
    <div className="h-[600px] w-full border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.5,
          includeHiddenNodes: true
        }}
        className="bg-slate-50"
        minZoom={0.1}
        maxZoom={1.5}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#2563eb', strokeWidth: 2 }
        }}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default OrganizationChart;