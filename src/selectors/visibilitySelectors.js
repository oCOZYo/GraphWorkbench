export const getInsurerNodes = (nodes) => nodes.filter((n) => n.type === 'INSURER')

export const getInsurerIds = (insurerNodes) => insurerNodes.map((n) => n.id)

export const isNodeVisibleForInsurer = ({ node, insurerId, singleInsurerMode, insurerIds }) => {
  if (!singleInsurerMode || !insurerId) return true
  const visibleTo = Array.isArray(node.visibleTo) ? node.visibleTo : insurerIds
  return visibleTo.includes(insurerId)
}

export const isLinkVisibleForInsurer = ({ link, insurerId, singleInsurerMode, insurerIds, nodes }) => {
  if (!singleInsurerMode || !insurerId) return true
  const sourceId = typeof link.source === 'object' ? link.source.id : link.source
  const targetId = typeof link.target === 'object' ? link.target.id : link.target
  const sourceNode = nodes.find((n) => n.id === sourceId)
  const targetNode = nodes.find((n) => n.id === targetId)
  if (!sourceNode || !targetNode) return true
  return (
    isNodeVisibleForInsurer({ node: sourceNode, insurerId, singleInsurerMode, insurerIds }) &&
    isNodeVisibleForInsurer({ node: targetNode, insurerId, singleInsurerMode, insurerIds })
  )
}
