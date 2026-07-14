"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react"
import type { Node, Edge } from "@xyflow/react"

import { TopologyNode } from "./types"
import { useLayoutedElements } from "./use-layouted-elements"
import { ClusterNode, type ClusterNodeData } from "./cluster-node"
import { NodeGroupNode, type NodeGroupNodeData } from "./node-group-node"
import { EdgeNode, type EdgeNodeData } from "./edge-node"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ClusterTopologyProps {
  /** Topology data root node */
  data: TopologyNode
  /** Additional CSS classes */
  className?: string
  /** Node click callback */
  onNodeClick?: (nodeId: string, nodeType: string) => void
}

// ─── Node Types Registration ──────────────────────────────────────────────────

const nodeTypes = {
  clusterNode: ClusterNode,
  nodeGroupNode: NodeGroupNode,
  edgeNode: EdgeNode,
}

// ─── Internal Component ───────────────────────────────────────────────────────

const ClusterTopologyInner = ({
  data,
  className = '',
  onNodeClick
}: ClusterTopologyProps) => {
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set())
  const { fitView } = useReactFlow()

  const { nodes: layoutedNodes, edges: layoutedEdges } = useLayoutedElements(data, collapsedNodes)

  // Add collapse callbacks to node data
  const nodesWithCallbacks = layoutedNodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      collapsed: collapsedNodes.has(node.id),
      onToggle: () => handleNodeToggle(node.id),
    },
  }))

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesWithCallbacks)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)

  // Update when data or collapsed state changes
  useEffect(() => {
    const updatedNodes = layoutedNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        collapsed: collapsedNodes.has(node.id),
        onToggle: () => handleNodeToggle(node.id),
      },
    }))
    setNodes(updatedNodes)
    setEdges(layoutedEdges)

    // Auto-fit view
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 })
    }, 50)
  }, [layoutedNodes, layoutedEdges, collapsedNodes])

  const handleNodeToggle = useCallback((nodeId: string) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }, [])

  // Node click handler
  const handleNodeClickInternal = useCallback((_event: React.MouseEvent, node: Node) => {
    if (onNodeClick) {
      onNodeClick(node.id, (node.data.nodeType as string | undefined) || node.type || '')
    }
  }, [onNodeClick])

  const proOptions = { hideAttribution: true }

  return (
    <div className={`w-full h-full ${className}`} style={{ backgroundColor: 'var(--cockpit-bg)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClickInternal}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={proOptions}
        minZoom={0.3}
        maxZoom={1.5}
        nodesDraggable={false}
      >
        {/* Background dot pattern */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(100, 116, 139, 0.2)"
        />
        {/* Controls panel */}
        <Controls
          className="!bg-white !border-gray-200 !shadow-sm"
          showInteractive={false}
        />
        {/* Mini map with semantic colors */}
        <MiniMap
          className="!bg-white !border-gray-200 !shadow-sm"
          nodeColor={(node: Node) => {
            switch (node.type) {
              case 'clusterNode':
                return 'var(--cluster, #2D3748)'
              case 'nodeGroupNode':
                return 'var(--node-group, #10B981)'
              case 'edgeNode':
                return 'var(--node, #10B981)'
              default:
                return '#9CA3AF'
            }
          }}
          maskColor="rgba(241, 245, 249, 0.8)"
        />
      </ReactFlow>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

/**
 * ClusterTopology - Interactive topology visualization component
 *
 * Features:
 * - ReactFlow-based interactive topology
 * - Node collapsing/expanding support
 * - 3 node types: clusterNode, nodeGroupNode, edgeNode
 * - Background grid pattern with dots
 * - Controls panel (zoom, fit-to-view)
 * - MiniMap showing node colors by type
 * - Semantic color variables (--cluster, --node-group, --node)
 *
 * @example
 * ```tsx
 * import { ClusterTopology } from '@riseaicloud/components'
 *
 * const topologyData = {
 *   root: {
 *     id: 'host-cluster',
 *     name: 'Host Cluster',
 *     type: 'hostCluster',
 *     children: [...]
 *   }
 * }
 *
 * <ClusterTopology
 *   data={topologyData.root}
 *   onNodeClick={(nodeId, nodeType) => console.log('Clicked:', nodeId, nodeType)}
 * />
 * ```
 */
export const ClusterTopology = (props: ClusterTopologyProps) => {
  return (
    <ReactFlowProvider>
      <ClusterTopologyInner {...props} />
    </ReactFlowProvider>
  )
}

// Re-export types for convenience
export type { TopologyNode } from "./types"
export type { ClusterNodeData } from "./cluster-node"
export type { NodeGroupNodeData } from "./node-group-node"
export type { EdgeNodeData } from "./edge-node"
