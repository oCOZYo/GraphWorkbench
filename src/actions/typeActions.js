const normalizeNodeTypeKey = (value) => (value || '').trim()

export const updateNodeTypeConfig = ({ key, patch, nodeTypeConfigs, setNodeTypeConfigs }) => {
  const next = { ...nodeTypeConfigs }
  next[key] = { ...next[key], ...patch }
  setNodeTypeConfigs(next)
}

export const renameNodeTypeConfig = ({
  oldKey,
  newKey,
  nodeTypeConfigs,
  setNodeTypeConfigs,
  nodes,
  setNodes,
  newNode,
  setNewNode,
}) => {
  const normalizedKey = normalizeNodeTypeKey(newKey)
  if (!oldKey || !normalizedKey || normalizedKey === oldKey) return false
  if (nodeTypeConfigs[normalizedKey]) return false
  const entry = nodeTypeConfigs[oldKey]
  if (!entry) return false
  const next = { ...nodeTypeConfigs }
  delete next[oldKey]
  next[normalizedKey] = entry
  setNodeTypeConfigs(next)
  setNodes(nodes.map((node) => (node.type === oldKey ? { ...node, type: normalizedKey } : node)))
  setNewNode((prev) => (prev.type === oldKey ? { ...prev, type: normalizedKey } : prev))
  return true
}

export const deleteNodeTypeConfig = ({ key, nodeTypeConfigs, nodeTypeUsage, setNodeTypeConfigs }) => {
  if (nodeTypeUsage[key]) return
  const next = { ...nodeTypeConfigs }
  delete next[key]
  setNodeTypeConfigs(next)
}

export const createNodeTypeConfig = ({ nodeTypeConfigs, setNodeTypeConfigs }) => {
  const baseKey = 'TYPE'
  let index = 1
  let key = `${baseKey}_${index}`
  while (nodeTypeConfigs[key]) {
    index += 1
    key = `${baseKey}_${index}`
  }
  setNodeTypeConfigs({
    ...nodeTypeConfigs,
    [key]: {
      label: `新类型${index}`,
      color: '#94a3b8',
      icon: '⬤',
      keywords: [],
      prefix: 'NT',
    },
  })
}

export const updateLinkTypeConfig = ({ index, patch, linkTypeConfigs, setLinkTypeConfigs }) => {
  const next = [...linkTypeConfigs]
  next[index] = { ...next[index], ...patch }
  setLinkTypeConfigs(next)
}

export const addLinkTypeConfig = ({ linkTypeConfigs, setLinkTypeConfigs }) => {
  setLinkTypeConfigs([
    ...linkTypeConfigs,
    {
      name: '新关系' + (linkTypeConfigs.length + 1),
      color: '#94a3b8',
      style: 'solid',
      weight: 1.5,
    },
  ])
}

export const deleteLinkTypeConfig = ({ index, linkTypeConfigs, setLinkTypeConfigs }) => {
  if (linkTypeConfigs.length <= 1) return
  setLinkTypeConfigs(linkTypeConfigs.filter((_, i) => i !== index))
}

export const renameLinkTypeInLinks = ({ oldName, newName, links, setLinks }) => {
  setLinks(links.map((l) => (l.type === oldName ? { ...l, type: newName } : l)))
}
