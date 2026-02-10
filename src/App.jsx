import { useRef } from 'react'
import Sidebar from './components/Sidebar.jsx'
import NodeTypeManager from './components/NodeTypeManager.jsx'
import LinkTypeManager from './components/LinkTypeManager.jsx'
import ColorPaletteManager from './components/ColorPaletteManager.jsx'
import DetailsPanel from './components/DetailsPanel.jsx'
import { GraphProvider, useGraphContext } from './context/GraphContext.jsx'

const AppLayout = ({ svgRef, containerRef }) => {
  const {
    filteredNodes,
    filteredLinks,
    selectedNode,
    selectedLink,
    showTypeManager,
    showNodeTypeManager,
    showColorPaletteManager,
    nodeTypeConfigs,
    nodeTypeUsage,
    hiddenNodeTypes,
    toggleNodeTypeVisibility,
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
              className="pointer-events-auto px-3 py-1.5 bg-white/90 backdrop-blur border rounded-full shadow-sm flex items-center gap-3 hover:bg-white transition-all"
            >
              <span className="text-[10px] font-bold text-slate-500">
                实体: <b className="text-slate-800">{filteredNodes.length}</b>
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                关系: <b className="text-slate-800">{filteredLinks.length}</b>
              </span>
              {/* <span className="text-[10px] font-bold text-slate-400">图例 ▾</span> */}
            </button>
          ) : (
            <div className="pointer-events-auto w-52 rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-500">
                    实体: <b className="text-slate-800">{filteredNodes.length}</b>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    关系: <b className="text-slate-800">{filteredLinks.length}</b>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLegendOpen(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
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
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all ${
                          isHidden
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-sm">{icon}</span>
                          <span className={`text-[11px] font-semibold ${isHidden ? 'line-through' : ''}`}>{label}</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">{nodeTypeUsage[typeKey] || 0}</span>
                      </button>
                    )
                  })}
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
