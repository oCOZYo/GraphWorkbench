export const normalizeImport = ({ data, ensureNodeVisibility }) => {
  if (!data?.nodes || !data?.links) return null

  const processedLinks = data.links.map((l) => ({
    ...l,
    id: l.id || 'L' + Math.random().toString(36).substr(2, 9),
  }))
  const importedNodes = data.nodes
  const importedInsurerIds = importedNodes.filter((n) => n.type === 'INSURER').map((n) => n.id)
  const normalizedNodes = importedNodes.map((n) => ensureNodeVisibility(n, importedInsurerIds))

  return {
    nodes: normalizedNodes,
    links: processedLinks,
    linkTypes: data.linkTypes,
    nodeTypes: data.nodeTypes,
    commonColors: data.commonColors,
  }
}

export const buildExportPayload = ({ nodes, links, linkTypeConfigs, nodeTypeConfigs, commonColors }) => {
  const cleanLinks = links.map((l) => ({
    source: typeof l.source === 'object' ? l.source.id : l.source,
    target: typeof l.target === 'object' ? l.target.id : l.target,
    type: l.type,
    id: l.id,
  }))

  return {
    nodes: nodes.map(({ vx, vy, fx, fy, ...r }) => r),
    links: cleanLinks,
    linkTypes: linkTypeConfigs,
    nodeTypes: nodeTypeConfigs,
    commonColors,
  }
}

const DEFAULT_NODE_STYLE = {
  label: '新类型',
  color: '#94a3b8',
  icon: '⬤',
  keywords: [],
  prefix: 'NT',
}

const DEFAULT_LINK_STYLE = {
  color: '#94a3b8',
  style: 'solid',
  weight: 1.5,
}

export const normalizeNeo4jImport = ({ data, ensureNodeVisibility, nodeTypeConfigs, linkTypeConfigs }) => {
  if (!data?.nodes || !data?.relationships) return null

  const nodes = data.nodes.map((n) => {
    const id = n.id || n.identity || n.key
    const labels = n.labels || (n.label ? [n.label] : [])
    const type = (n.type || labels[0] || 'TYPE').toString()
    const props = n.properties || {}
    return {
      id,
      label: props.label || props.name || id,
      type,
      icon: props.icon,
      color: props.color,
      visibleTo: props.visibleTo,
    }
  })

  const processedLinks = data.relationships.map((r) => ({
    id: r.id || r.identity || 'L' + Math.random().toString(36).substr(2, 9),
    source: r.start || r.from || r.source,
    target: r.end || r.to || r.target,
    type: r.type,
    color: r.properties?.color,
    style: r.properties?.style,
    weight: r.properties?.weight,
  }))

  const importedInsurerIds = nodes.filter((n) => n.type === 'INSURER').map((n) => n.id)
  const normalizedNodes = nodes.map((n) => ensureNodeVisibility(n, importedInsurerIds))

  const nextNodeTypes = { ...nodeTypeConfigs }
  nodes.forEach((n) => {
    if (!nextNodeTypes[n.type]) {
      nextNodeTypes[n.type] = {
        ...DEFAULT_NODE_STYLE,
        label: n.type,
      }
    }
  })

  const linkTypeMap = new Map(linkTypeConfigs.map((t) => [t.name, t]))
  processedLinks.forEach((l) => {
    if (!linkTypeMap.has(l.type)) {
      linkTypeMap.set(l.type, { name: l.type, ...DEFAULT_LINK_STYLE })
    }
  })

  return {
    nodes: normalizedNodes,
    links: processedLinks,
    nodeTypes: nextNodeTypes,
    linkTypes: Array.from(linkTypeMap.values()),
  }
}

export const buildNeo4jExportPayload = ({ nodes, links }) => {
  const exportNodes = nodes.map(({ vx, vy, fx, fy, ...n }) => ({
    id: n.id,
    labels: [n.type],
    properties: {
      label: n.label,
      type: n.type,
      icon: n.icon,
      color: n.color,
      visibleTo: n.visibleTo,
    },
  }))

  const exportLinks = links.map((l) => ({
    id: l.id,
    type: l.type,
    start: typeof l.source === 'object' ? l.source.id : l.source,
    end: typeof l.target === 'object' ? l.target.id : l.target,
    properties: {
      color: l.color,
      style: l.style,
      weight: l.weight,
    },
  }))

  return {
    nodes: exportNodes,
    relationships: exportLinks,
  }
}
