import { useMemo } from 'react'
import {
  getInsurerIds,
  getInsurerNodes,
  isLinkVisibleForInsurer as selectLinkVisible,
  isNodeVisibleForInsurer as selectNodeVisible,
} from '../selectors/visibilitySelectors.js'

const useVisibility = ({ nodes, singleInsurerMode, activeInsurerId }) => {
  const insurerNodes = useMemo(() => getInsurerNodes(nodes), [nodes])
  const insurerIds = useMemo(() => getInsurerIds(insurerNodes), [insurerNodes])

  const isNodeVisibleForInsurer = (node, insurerId) =>
    selectNodeVisible({ node, insurerId, singleInsurerMode, insurerIds })

  const isLinkVisibleForInsurer = (link, insurerId) =>
    selectLinkVisible({ link, insurerId, singleInsurerMode, insurerIds, nodes })

  return {
    insurerNodes,
    insurerIds,
    isNodeVisibleForInsurer,
    isLinkVisibleForInsurer,
  }
}

export default useVisibility
