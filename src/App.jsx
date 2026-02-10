import { useRef } from 'react'
import Sidebar from './components/Sidebar.jsx'
import NodeTypeManager from './components/NodeTypeManager.jsx'
import LinkTypeManager from './components/LinkTypeManager.jsx'
import ColorPaletteManager from './components/ColorPaletteManager.jsx'
import DetailsPanel from './components/DetailsPanel.jsx'
import { GraphProvider, useGraphContext } from './context/GraphContext.jsx'

const AppLayout = ({ svgRef, containerRef }) => {
  const {
    nodes,
    links,
    filteredNodes,
    filteredLinks,
    selectedNode,
    selectedLink,
    showTypeManager,
    showNodeTypeManager,
    showColorPaletteManager,
    nodeTypeConfigs,
    linkTypeConfigs,
    nodeTypeUsage,
    linkTypeUsage,
    hiddenNodeTypes,
    toggleNodeTypeVisibility,
    hiddenLinkTypes,
    toggleLinkTypeVisibility,
    isLegendOpen,
    setIsLegendOpen,
  } = useGraphContext()

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans overflow-hidden text-slate-900">
      <Sidebar />

      {showTypeManager && <LinkTypeManager />}

      {showNodeTypeManager && <NodeTypeManager />}

      {showColorPaletteManager && <ColorPaletteManager />}

      <main className="flex-1 relative" ref={containerRef}>
        <div className="absolute top-6 left-6 z-10">
          {!isLegendOpen ? (
            <button
              type="button"
              onClick={() => setIsLegendOpen(true)}
              className="pointer-events-auto px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-full shadow-lg flex items-center gap-4 hover:bg-white hover:scale-105 active:scale-95 transition-all group"
            >
              <span className="text-[11px] font-black text-slate-500 group-hover:text-slate-700 transition-colors">
                实体: <b className="text-slate-800 ml-0.5">{filteredNodes.length < nodes.length ? `${filteredNodes.length}/${nodes.length}` : nodes.length}</b>
              </span>
              <div className="w-px h-3 bg-slate-200" />
              <span className="text-[11px] font-black text-slate-500 group-hover:text-slate-700 transition-colors">
                关系: <b className="text-slate-800 ml-0.5">{filteredLinks.length < links.length ? `${filteredLinks.length}/${links.length}` : links.length}</b>
              </span>
            </button>
          ) : (
            <div className="pointer-events-auto w-56 rounded-[2rem] bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-2xl p-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-black text-slate-500">
                    实体: <b className="text-slate-800 ml-0.5">{filteredNodes.length < nodes.length ? `${filteredNodes.length}/${nodes.length}` : nodes.length}</b>
                  </span>
                  <span className="text-[11px] font-black text-slate-500">
                    关系: <b className="text-slate-800 ml-0.5">{filteredLinks.length < links.length ? `${filteredLinks.length}/${links.length}` : links.length}</b>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLegendOpen(false)}
                  className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  收起 ▴
                </button>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-auto pr-1">
                {Object.entries(nodeTypeConfigs)
                  .filter(([typeKey]) => (nodeTypeUsage[typeKey] || 0) > 0)
                  .map(([typeKey, config]) => {
                    const isHidden = !!hiddenNodeTypes[typeKey]
                    const color = config.color || '#cbd5e1'
                    const icon = config.icon || '⬤'
                    const label = config.label || typeKey
                    return (
                      <button
                        key={typeKey}
                        type="button"
                        onClick={() => toggleNodeTypeVisibility(typeKey)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${isHidden
                            ? 'bg-slate-100/50 text-slate-400 border border-transparent'
                            : 'bg-white text-slate-700 border border-transparent hover:border-slate-100 hover:shadow-sm'
                          }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full shadow-inner" style={{ backgroundColor: color }} />
                          <span className="text-xs">{icon}</span>
                          <span className={`text-[11px] font-black tracking-tight ${isHidden ? 'line-through opacity-50' : ''}`}>{label}</span>
                        </span>
                        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">{nodeTypeUsage[typeKey] || 0}</span>
                      </button>
                    )
                  })}

                {Object.values(linkTypeConfigs).some((config) => (linkTypeUsage[config.name] || 0) > 0) && (
                  <>
                    <div className="pt-2 mt-2 border-t border-slate-100 mb-1.5" />
                    {linkTypeConfigs
                      .filter((config) => (linkTypeUsage[config.name] || 0) > 0)
                      .map((config) => {
                        const isHidden = !!hiddenLinkTypes[config.name]
                        const color = config.color || '#cbd5e1'
                        const label = config.name
                        return (
                          <button
                            key={config.name}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleLinkTypeVisibility(config.name)
                            }}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all ${isHidden
                                ? 'bg-slate-100 text-slate-400'
                                : 'bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                          >
                            <span className="flex items-center gap-2">
                              {config.style === 'dashed' ? (
                                <span className="w-3 flex items-center">
                                  <span className="w-full h-[1.5px] border-t border-dashed" style={{ borderColor: color }} />
                                </span>
                              ) : (
                                <span className="w-3 h-[2px]" style={{ backgroundColor: color }} />
                              )}
                              <span className={`text-[11px] font-semibold ${isHidden ? 'line-through' : ''}`}>{label}</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">{linkTypeUsage[config.name] || 0}</span>
                          </button>
                        )
                      })}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing bg-[#fcfcfd]" />

        {(selectedNode || selectedLink) && <DetailsPanel />}
      </main>
    </div>
  )
}

const App = () => {
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  return (
    <GraphProvider svgRef={svgRef} containerRef={containerRef}>
      <AppLayout svgRef={svgRef} containerRef={containerRef} />
    </GraphProvider>
  )
}

export default App
