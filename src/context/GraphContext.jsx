import { createContext, useContext, useMemo, useRef, useState } from 'react'
import useGraphRenderer from '../hooks/useGraphRenderer.js'
import useVisibility from '../hooks/useVisibility.js'
import { INITIAL_LINK_TYPES, INITIAL_NODE_TYPES } from '../config/graphPresets.js'
import { buildExportPayload, buildNeo4jExportPayload, normalizeImport, normalizeNeo4jImport } from '../utils/graphData.js'
import {
  addNodeToGraph,
  addQuickLink,
  applyNodeLabelAutoId,
  deleteLinkFromGraph,
  deleteNodeFromGraph,
  updateNewNodeType,
} from '../actions/graphActions.js'
import {
  addLinkTypeConfig,
  createNodeTypeConfig,
  deleteLinkTypeConfig,
  deleteNodeTypeConfig,
  renameLinkTypeInLinks,
  updateLinkTypeConfig,
  updateNodeTypeConfig,
  renameNodeTypeConfig,
} from '../actions/typeActions.js'

const GraphContext = createContext(null)

export const GraphProvider = ({ children, svgRef, containerRef }) => {
  const [nodes, setNodes] = useState([
    { id: 'LMM', label: '李某某', type: 'AGENT', visibleTo: ['BSZ'] },
    { id: 'TB01', label: '投保人01', type: 'MEMBER', visibleTo: ['BSZ'] },
    { id: 'BSZ', label: '保司-Z', type: 'INSURER', visibleTo: ['BSZ'] },
  ])
  const [links, setLinks] = useState([
    { id: 'L1', source: 'LMM', target: 'TB01', type: '垫付保费' },
    { id: 'L2', source: 'TB01', target: 'LMM', type: '资金回流' },
    { id: 'L3', source: 'LMM', target: 'TB01', type: '代理销售' },
  ])

  const [nodeTypeConfigs, setNodeTypeConfigs] = useState(INITIAL_NODE_TYPES)
  const [linkTypeConfigs, setLinkTypeConfigs] = useState(INITIAL_LINK_TYPES)
  const [newNode, setNewNode] = useState({
    id: '',
    label: '',
    type: 'MEMBER',
    icon: undefined,
    color: undefined,
  })
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedLink, setSelectedLink] = useState(null)
  const [isQuickLinkMode, setIsQuickLinkMode] = useState(false)
  const [linkSource, setLinkSource] = useState(null)
  const [showTypeManager, setShowTypeManager] = useState(false)
  const [showNodeTypeManager, setShowNodeTypeManager] = useState(false)
  const [showColorPaletteManager, setShowColorPaletteManager] = useState(false)
  const [commonColors, setCommonColors] = useState([
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#94a3b8',
    '#0f172a',
  ])
  const [autoLayoutEnabled, setAutoLayoutEnabled] = useState(false)
  const [layoutOnceToken, setLayoutOnceToken] = useState(0)
  const [singleInsurerMode, setSingleInsurerMode] = useState(false)
  const [activeInsurerId, setActiveInsurerId] = useState('')
  const [visibilityMode, setVisibilityMode] = useState('dim')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isLegendOpen, setIsLegendOpen] = useState(false)
  const [hiddenNodeTypes, setHiddenNodeTypes] = useState({})

  const fileInputRef = useRef(null)
  const neo4jFileInputRef = useRef(null)
  const labelInputRef = useRef(null)

  const { insurerNodes, insurerIds, isNodeVisibleForInsurer, isLinkVisibleForInsurer } = useVisibility({
    nodes,
    singleInsurerMode,
    activeInsurerId,
  })

  const ensureNodeVisibility = (node, allInsurerIds) => {
    if (Array.isArray(node.visibleTo)) return node
    return { ...node, visibleTo: allInsurerIds }
  }

  const getNodeColor = (node) => node.color || nodeTypeConfigs[node.type]?.color || '#cbd5e1'
  const getNodeIcon = (node) => node.icon || nodeTypeConfigs[node.type]?.icon || '⬤'
  const getLinkTypeDefaults = (typeName) => linkTypeConfigs.find((t) => t.name === typeName) || {}
  const getLinkStrokeColor = (link) => link.color || getLinkTypeDefaults(link.type).color || '#cbd5e1'
  const getLinkWeight = (link) => link.weight ?? getLinkTypeDefaults(link.type).weight ?? 1.5
  const getLinkStyle = (link) => link.style || getLinkTypeDefaults(link.type).style || 'solid'

  const nodeTypeUsage = useMemo(() => {
    return nodes.reduce((acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1
      return acc
    }, {})
  }, [nodes])

  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => !hiddenNodeTypes[node.type])
  }, [nodes, hiddenNodeTypes])

  const filteredLinks = useMemo(() => {
    const nodeIdSet = new Set(filteredNodes.map((node) => node.id))
    const getId = (value) => (typeof value === 'object' ? value.id : value)
    return links.filter((link) => nodeIdSet.has(getId(link.source)) && nodeIdSet.has(getId(link.target)))
  }, [links, filteredNodes])

  const toggleNodeTypeVisibility = (typeKey) => {
    setHiddenNodeTypes((prev) => ({
      ...prev,
      [typeKey]: !prev[typeKey],
    }))
  }

  const createNodeType = () => createNodeTypeConfig({ nodeTypeConfigs, setNodeTypeConfigs })

  const updateNodeType = (key, patch) => updateNodeTypeConfig({ key, patch, nodeTypeConfigs, setNodeTypeConfigs })

  const deleteNodeType = (key) =>
    deleteNodeTypeConfig({ key, nodeTypeConfigs, nodeTypeUsage, setNodeTypeConfigs })

  const renameNodeType = (oldKey, newKey) =>
    renameNodeTypeConfig({
      oldKey,
      newKey,
      nodeTypeConfigs,
      setNodeTypeConfigs,
      nodes,
      setNodes,
      newNode,
      setNewNode,
    })

  const updateLinkType = (index, patch) =>
    updateLinkTypeConfig({ index, patch, linkTypeConfigs, setLinkTypeConfigs })

  const addLinkType = () => addLinkTypeConfig({ linkTypeConfigs, setLinkTypeConfigs })

  const deleteLinkType = (index) => deleteLinkTypeConfig({ index, linkTypeConfigs, setLinkTypeConfigs })

  const renameLinkType = (oldName, newName) => renameLinkTypeInLinks({ oldName, newName, links, setLinks })

  const handleLabelBlur = () => {
    applyNodeLabelAutoId({ label: newNode.label, newNode, nodes, nodeTypeConfigs, setNewNode })
  }

  const handleNodeClick = (node) => {
    if (isQuickLinkMode) {
      if (!linkSource) setLinkSource(node)
      else {
        addQuickLink({
          linkSource,
          targetNode: node,
          links,
          linkTypeConfigs,
          setLinks,
          setLinkSource,
        })
      }
    } else {
      setSelectedLink(null)
      setSelectedNode(node)
    }
  }

  const simulationRef = useGraphRenderer({
    svgRef,
    containerRef,
    nodes: filteredNodes,
    links: filteredLinks,
    selectedNode,
    selectedLink,
    linkSource,
    isQuickLinkMode,
    linkTypeConfigs,
    singleInsurerMode,
    activeInsurerId,
    visibilityMode,
    autoLayoutEnabled,
    layoutOnceToken,
    setLayoutOnceToken,
    getLinkStrokeColor,
    getLinkWeight,
    getLinkStyle,
    getNodeColor,
    getNodeIcon,
    isNodeVisibleForInsurer,
    isLinkVisibleForInsurer,
    onNodeClick: handleNodeClick,
    onLinkClick: (d) => {
      setSelectedNode(null)
      setSelectedLink(d)
    },
    onBackgroundClick: () => {
      setSelectedNode(null)
      setSelectedLink(null)
      if (!isQuickLinkMode) setLinkSource(null)
    },
  })

  const aggregateNodes = () => {
    if (!simulationRef.current || !containerRef.current) return
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    nodes.forEach((d) => {
      d.x = width / 2 + (Math.random() - 0.5) * 100
      d.y = height / 2 + (Math.random() - 0.5) * 100
      d.fx = null
      d.fy = null
    })
    if (autoLayoutEnabled) {
      simulationRef.current.alpha(1).restart()
    } else {
      setLayoutOnceToken(Date.now())
    }
  }

  const addNode = () => {
    addNodeToGraph({
      nodes,
      newNode,
      insurerIds,
      nodeTypeConfigs,
      ensureNodeVisibility,
      setNodes,
      setNewNode,
      initialNodeTypes: INITIAL_NODE_TYPES,
    })
    labelInputRef.current?.focus()
  }

  const handleNewNodeTypeChange = (type) => {
    updateNewNodeType({ type, newNode, nodeTypeConfigs, initialNodeTypes: INITIAL_NODE_TYPES, setNewNode })
  }

  const deleteNode = (nDel) => {
    deleteNodeFromGraph({ nodes, links, targetNode: nDel, setNodes, setLinks, setSelectedNode })
  }

  const deleteLink = (lDel) => {
    deleteLinkFromGraph({ links, targetLink: lDel, setLinks, setSelectedLink })
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        const normalized = normalizeImport({ data, ensureNodeVisibility })
        if (normalized) {
          setNodes(normalized.nodes)
          setLinks(normalized.links)
          if (normalized.linkTypes) setLinkTypeConfigs(normalized.linkTypes)
          if (normalized.nodeTypes) setNodeTypeConfigs(normalized.nodeTypes)
          if (normalized.commonColors) setCommonColors(normalized.commonColors)
        }
      } catch (err) {
        console.error('导入失败', err)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const exportData = () => {
    const payload = buildExportPayload({ nodes, links, linkTypeConfigs, nodeTypeConfigs, commonColors })
    const dataBlob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(dataBlob)
    a.download = 'case_graph.json'
    a.click()
  }

  const handleNeo4jImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        const normalized = normalizeNeo4jImport({
          data,
          ensureNodeVisibility,
          nodeTypeConfigs,
          linkTypeConfigs,
        })
        if (normalized) {
          setNodes(normalized.nodes)
          setLinks(normalized.links)
          if (normalized.linkTypes) setLinkTypeConfigs(normalized.linkTypes)
          if (normalized.nodeTypes) setNodeTypeConfigs(normalized.nodeTypes)
        }
      } catch (err) {
        console.error('Neo4j 导入失败', err)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const exportNeo4j = () => {
    const payload = buildNeo4jExportPayload({ nodes, links })
    const dataBlob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(dataBlob)
    a.download = 'neo4j_graph.json'
    a.click()
  }

  return (
    <GraphContext.Provider
      value={{
        nodes,
        setNodes,
        links,
        setLinks,
        nodeTypeConfigs,
        setNodeTypeConfigs,
        linkTypeConfigs,
        setLinkTypeConfigs,
        newNode,
        setNewNode,
        selectedNode,
        setSelectedNode,
        selectedLink,
        setSelectedLink,
        isQuickLinkMode,
        setIsQuickLinkMode,
        linkSource,
        setLinkSource,
        showTypeManager,
        setShowTypeManager,
        showNodeTypeManager,
        setShowNodeTypeManager,
        showColorPaletteManager,
        setShowColorPaletteManager,
        commonColors,
        setCommonColors,
        autoLayoutEnabled,
        setAutoLayoutEnabled,
        singleInsurerMode,
        setSingleInsurerMode,
        activeInsurerId,
        setActiveInsurerId,
        visibilityMode,
        setVisibilityMode,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isLegendOpen,
        setIsLegendOpen,
        hiddenNodeTypes,
        toggleNodeTypeVisibility,
        filteredNodes,
        filteredLinks,
        insurerNodes,
        insurerIds,
        nodeTypeUsage,
        createNodeType,
        updateNodeType,
        deleteNodeType,
        renameNodeType,
        updateLinkType,
        addLinkType,
        deleteLinkType,
        renameLinkType,
        handleLabelBlur,
        handleNodeClick,
        aggregateNodes,
        addNode,
        handleNewNodeTypeChange,
        deleteNode,
        deleteLink,
        handleImport,
        exportData,
        handleNeo4jImport,
        exportNeo4j,
        fileInputRef,
        neo4jFileInputRef,
        labelInputRef,
        getNodeColor,
        getNodeIcon,
        getLinkStrokeColor,
        getLinkWeight,
        getLinkStyle,
      }}
    >
      {children}
    </GraphContext.Provider>
  )
}

export const useGraphContext = () => {
  const context = useContext(GraphContext)
  if (!context) {
    throw new Error('useGraphContext must be used within GraphProvider')
  }
  return context
}

export { INITIAL_NODE_TYPES, INITIAL_LINK_TYPES }
