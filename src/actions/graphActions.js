export const addNodeToGraph = ({
  nodes,
  newNode,
  insurerIds,
  nodeTypeConfigs,
  ensureNodeVisibility,
  setNodes,
  setNewNode,
  initialNodeTypes,
}) => {
  if (!newNode.id || !newNode.label || nodes.find((n) => n.id === newNode.id)) return

  const nextInsurerIds = newNode.type === 'INSURER' ? [...insurerIds, newNode.id] : insurerIds
  const updatedNode = ensureNodeVisibility(
    {
      ...newNode,
      ...(newNode.icon ? { icon: newNode.icon } : {}),
      ...(newNode.color ? { color: newNode.color } : {}),
    },
    nextInsurerIds,
  )

  if (newNode.type === 'INSURER') {
    const updatedNodes = nodes.map((n) => {
      const currentVisibleTo = Array.isArray(n.visibleTo) ? n.visibleTo : insurerIds
      if (currentVisibleTo.includes(newNode.id)) return n
      return { ...n, visibleTo: [...currentVisibleTo, newNode.id] }
    })
    setNodes([...updatedNodes, updatedNode])
  } else {
    setNodes([...nodes, updatedNode])
  }

  setNewNode({
    id: '',
    label: '',
    type: 'MEMBER',
    icon: undefined,
    color: undefined,
  })
}

export const deleteNodeFromGraph = ({ nodes, links, targetNode, setNodes, setLinks, setSelectedNode }) => {
  setNodes(nodes.filter((n) => n.id !== targetNode.id))
  setLinks(
    links.filter((l) => {
      const s = typeof l.source === 'object' ? l.source.id : l.source
      const t = typeof l.target === 'object' ? l.target.id : l.target
      return s !== targetNode.id && t !== targetNode.id
    }),
  )
  setSelectedNode(null)
}

export const deleteLinkFromGraph = ({ links, targetLink, setLinks, setSelectedLink }) => {
  setLinks(links.filter((l) => l.id !== targetLink.id))
  setSelectedLink(null)
}

export const updateNewNodeType = ({
  type,
  newNode,
  nodeTypeConfigs,
  initialNodeTypes,
  setNewNode,
}) => {
  setNewNode({
    ...newNode,
    type,
    icon: undefined,
    color: undefined,
  })
}

export const applyNodeLabelAutoId = ({ label, newNode, nodes, nodeTypeConfigs, setNewNode }) => {
  const trimmed = label.trim()
  if (!trimmed) return

  let updatedNode = { ...newNode }
  let bizPrefix = ''
  let foundKeyword = ''

  for (const [type, config] of Object.entries(nodeTypeConfigs)) {
    const match = config.keywords?.find((kw) => trimmed.includes(kw))
    if (match) {
      updatedNode.type = type
      bizPrefix = config.prefix
      foundKeyword = match
      break
    }
  }

  if (!newNode.id) {
    const isEnglish = /^[A-Za-z\s0-9]+$/.test(trimmed)
    const suffixNum = (trimmed.match(/\d+/) || [''])[0]
    if (bizPrefix) {
      const feature = trimmed.split(foundKeyword)[0].trim().replace(/[第]/g, '')
      updatedNode.id =
        (feature ? (isEnglish ? feature.toUpperCase() : feature.substring(0, 2)) : '') +
        bizPrefix +
        suffixNum
    } else {
      updatedNode.id =
        (isEnglish
          ? trimmed
              .split(/\s+/)
              .map((w) => w[0].toUpperCase())
              .join('')
          : trimmed.substring(0, 2)) + suffixNum
    }
    if (!updatedNode.id || updatedNode.id.length < 2) updatedNode.id = 'N' + Math.floor(Math.random() * 1000)
    if (nodes.find((n) => n.id === updatedNode.id)) updatedNode.id += '_' + Math.floor(Math.random() * 10)
  }

  setNewNode(updatedNode)
}

export const addQuickLink = ({ linkSource, targetNode, links, linkTypeConfigs, setLinks, setLinkSource }) => {
  if (!linkSource || linkSource.id === targetNode.id) {
    setLinkSource(null)
    return
  }

  setLinks([
    ...links,
    {
      id: 'L' + Date.now() + Math.random().toString(36).substr(2, 5),
      source: linkSource.id,
      target: targetNode.id,
      type: linkTypeConfigs[0].name,
    },
  ])
  setLinkSource(null)
}
