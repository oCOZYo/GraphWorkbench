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
    selectedNode,
    selectedLink,
    showTypeManager,
    showNodeTypeManager,
    showColorPaletteManager,
  } = useGraphContext()

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans overflow-hidden text-slate-900">
      <Sidebar />

      {showTypeManager && <LinkTypeManager />}

      {showNodeTypeManager && <NodeTypeManager />}

      {showColorPaletteManager && <ColorPaletteManager />}

      <main className="flex-1 relative" ref={containerRef}>
        <div className="absolute top-6 left-6 z-10 pointer-events-none flex flex-col gap-2">
          <div className="px-4 py-2 bg-white/90 backdrop-blur border rounded-full shadow-sm flex gap-4">
            <span className="text-[10px] font-bold text-slate-500">
              实体: <b className="text-slate-800">{nodes.length}</b>
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              关系: <b className="text-slate-800">{links.length}</b>
            </span>
          </div>
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
