import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const useGraphRenderer = ({
  svgRef,
  containerRef,
  nodes,
  links,
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
  onNodeClick,
  onLinkClick,
  onBackgroundClick,
}) => {
  const simulationRef = useRef(null)
  const zoomTransformRef = useRef(d3.zoomIdentity)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    const previousTransform = d3.zoomTransform(svgRef.current)
    const svg = d3.select(svgRef.current).attr('viewBox', [0, 0, width, height])
    svg.selectAll('*').remove()
    const container = svg.append('g')

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', (e) => {
        zoomTransformRef.current = e.transform
        container.attr('transform', e.transform)
      })
    svg.call(zoom)
    svg.call(zoom.transform, zoomTransformRef.current || previousTransform || d3.zoomIdentity)

    svg.append('defs')

    const shouldHideNonVisible = singleInsurerMode && visibilityMode === 'hide'
    const visibleNodes = shouldHideNonVisible ? nodes.filter((n) => isNodeVisibleForInsurer(n, activeInsurerId)) : nodes
    const visibleLinks = shouldHideNonVisible ? links.filter((l) => isLinkVisibleForInsurer(l, activeInsurerId)) : links

    const linkData = visibleLinks.map((l) => ({
      ...l,
      source: typeof l.source === 'object' ? l.source.id : l.source,
      target: typeof l.target === 'object' ? l.target.id : l.target,
    }))

    const linkGroupMap = {}
    linkData.forEach((l) => {
      const s = l.source
      const t = l.target
      const key = s < t ? `${s}-${t}` : `${t}-${s}`
      if (!linkGroupMap[key]) linkGroupMap[key] = []
      l.bundleIndex = linkGroupMap[key].length
      linkGroupMap[key].push(l)
    })
    Object.values(linkGroupMap).forEach((group) => {
      group.forEach((l) => {
        l.bundleTotal = group.length
      })
    })

    const shouldAutoLayout = autoLayoutEnabled || !!layoutOnceToken

    const simulation = d3
      .forceSimulation(visibleNodes)
      .alphaDecay(0.04)
      .velocityDecay(0.3)
      .force(
        'link',
        d3
          .forceLink(linkData)
          .id((d) => d.id)
          .distance(180)
          .strength(shouldAutoLayout ? 0.4 : 0),
      )
      .force('charge', d3.forceManyBody().strength(shouldAutoLayout ? -450 : 0))
      .force('x', shouldAutoLayout ? d3.forceX(width / 2).strength(0.02) : null)
      .force('y', shouldAutoLayout ? d3.forceY(height / 2).strength(0.02) : null)
      .force('collision', shouldAutoLayout ? d3.forceCollide().radius(55) : null)

    simulationRef.current = simulation

    const linkG = container.append('g').selectAll('g').data(linkData).join('g')

    const linkHitAreas = linkG
      .append('path')
      .attr('fill', 'transparent')
      .attr('stroke', 'transparent')
      .attr('stroke-width', 20)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation()
        onLinkClick(d)
      })

    const linkPaths = linkG
      .append('path')
      .attr('fill', 'transparent')
      .attr('stroke', (d) => (selectedLink && selectedLink.id === d.id ? '#3b82f6' : getLinkStrokeColor(d)))
      .attr('stroke-width', (d) => {
        const baseWeight = getLinkWeight(d)
        return selectedLink && selectedLink.id === d.id ? baseWeight + 1.5 : baseWeight
      })
      .attr('stroke-dasharray', (d) => (getLinkStyle(d) === 'dashed' ? '4 3' : ''))
      .attr('stroke-opacity', (d) =>
        shouldHideNonVisible ? 0.8 : isLinkVisibleForInsurer(d, activeInsurerId) ? 0.8 : 0.15,
      )
      .style('pointer-events', 'none')

    const linkLabels = linkG
      .append('text')
      .text((d) => d.type)
      .attr('font-size', '10px')
      .attr('fill', (d) => (selectedLink && selectedLink.id === d.id ? '#2563eb' : getLinkStrokeColor(d)))
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .attr('opacity', (d) => (shouldHideNonVisible ? 1 : isLinkVisibleForInsurer(d, activeInsurerId) ? 1 : 0.2))
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation()
        onLinkClick(d)
      })

    const nodeElements = container
      .append('g')
      .selectAll('g')
      .data(visibleNodes)
      .join('g')
      .style('cursor', 'pointer')
      .style('opacity', (d) => (shouldHideNonVisible ? 1 : isNodeVisibleForInsurer(d, activeInsurerId) ? 1 : 0.2))
      .call(
        d3
          .drag()
          .on('start', (e, d) => {
            if (!e.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (e, d) => {
            d.fx = e.x
            d.fy = e.y
          })
          .on('end', (e, d) => {
            if (!e.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          }),
      )
      .on('click', (event, d) => {
        event.stopPropagation()
        onNodeClick(d)
      })

    nodeElements
      .append('circle')
      .attr('r', 24)
      .attr('fill', 'transparent')
      .attr('stroke', (d) => (selectedNode === d || linkSource === d ? '#3b82f6' : 'transparent'))
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', (d) => (linkSource === d ? '3,2' : '0'))

    nodeElements
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d) => getNodeColor(d))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    nodeElements
      .append('text')
      .text((d) => getNodeIcon(d))
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '16px')

    nodeElements
      .append('text')
      .text((d) => d.label)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('fill', '#334155')

    simulation.on('tick', () => {
      const updatePath = (d) => {
        const sx = d.source.x
        const sy = d.source.y
        const tx = d.target.x
        const ty = d.target.y
        const dx = tx - sx
        const dy = ty - sy
        const dr = Math.sqrt(dx * dx + dy * dy)
        if (d.bundleTotal === 1) return `M${sx},${sy} L${tx},${ty}`
        const offsetStep = 30
        const index = d.bundleIndex - (d.bundleTotal - 1) / 2
        const curve = index * offsetStep
        const midX = (sx + tx) / 2
        const midY = (sy + ty) / 2
        const invDr = 1 / dr
        const qx = midX + curve * dy * invDr
        const qy = midY - curve * dx * invDr
        return `M${sx},${sy} Q${qx},${qy} ${tx},${ty}`
      }

      if (simulation.alpha() < 0.005) {
        simulation.stop()
        if (!autoLayoutEnabled && layoutOnceToken) {
          setLayoutOnceToken(0)
        }
      }

      linkHitAreas.attr('d', updatePath)
      linkPaths.attr('d', updatePath)

      linkLabels.attr('transform', (d) => {
        const sx = d.source.x
        const sy = d.source.y
        const tx = d.target.x
        const ty = d.target.y
        const dx = tx - sx
        const dy = ty - sy
        const dr = Math.sqrt(dx * dx + dy * dy)
        const midX = (sx + tx) / 2
        const midY = (sy + ty) / 2
        const offsetStep = 30
        const index = d.bundleIndex - (d.bundleTotal - 1) / 2
        const curve = index * offsetStep
        const invDr = 1 / dr
        const qx = midX + curve * dy * invDr
        const qy = midY - curve * dx * invDr
        return `translate(${qx},${qy - 6})`
      })

      nodeElements.attr('transform', (d) => `translate(${d.x},${d.y})`)
    })

    svg.on('click', () => {
      onBackgroundClick()
    })

    return () => simulation.stop()
  }, [
    svgRef,
    containerRef,
    nodes,
    links,
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
    onNodeClick,
    onLinkClick,
    onBackgroundClick,
  ])

  return simulationRef
}

export default useGraphRenderer
