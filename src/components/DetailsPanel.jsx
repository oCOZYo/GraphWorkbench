import React from 'react'
import { useGraphContext } from '../context/GraphContext.jsx'

const DetailsPanel = () => {
  const {
    selectedNode,
    selectedLink,
    nodes,
    setNodes,
    setSelectedNode,
    links,
    setLinks,
    setSelectedLink,
    insurerIds,
    insurerNodes,
    getNodeColor,
    getNodeIcon,
    commonColors,
    linkTypeConfigs,
    deleteNode,
    deleteLink,
    getLinkStrokeColor,
    getLinkWeight,
    getLinkStyle,
  } = useGraphContext()

  return (
    <div className="absolute top-6 right-6 w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 p-6 z-30 animate-in slide-in-from-right-4 duration-300">
      <button
        onClick={() => {
          setSelectedNode(null)
          setSelectedLink(null)
        }}
        className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-300 hover:text-slate-500 transition-all"
      >
        ✕
      </button>
      {selectedNode && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-inner"
              style={{ backgroundColor: getNodeColor(selectedNode) }}
            >
              {getNodeIcon(selectedNode)}
            </div>
            <div>
              <h2 className="text-[13px] font-black text-slate-800 leading-tight">{selectedNode.label}</h2>
              <p className="text-[9px] text-blue-500 font-bold uppercase tracking-wider mt-0.5">{selectedNode.id}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">名称</p>
              <input
                className="w-full text-[11px] p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                value={selectedNode.label}
                onChange={(e) => {
                  const value = e.target.value
                  const updatedNodes = nodes.map((n) => (n.id === selectedNode.id ? { ...n, label: value } : n))
                  setNodes(updatedNodes)
                  setSelectedNode({ ...selectedNode, label: value })
                }}
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">图标</p>
              <input
                className="w-full text-[11px] p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                value={selectedNode.icon || ''}
                onChange={(e) => {
                  const value = e.target.value
                  const updatedNodes = nodes.map((n) => (n.id === selectedNode.id ? { ...n, icon: value } : n))
                  setNodes(updatedNodes)
                  setSelectedNode({ ...selectedNode, icon: value })
                }}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">颜色</p>
                <button
                  className="text-[10px] text-slate-400 font-bold hover:text-blue-500 transition-colors"
                  onClick={() => {
                    const updatedNodes = nodes.map((n) =>
                      n.id === selectedNode.id ? { ...n, color: undefined, icon: undefined } : n,
                    )
                    setNodes(updatedNodes)
                    setSelectedNode({ ...selectedNode, color: undefined, icon: undefined })
                  }}
                >
                  恢复默认
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                {commonColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-5 w-5 rounded-full border-2 transition hover:scale-110 active:scale-90 ${(selectedNode.color || getNodeColor(selectedNode)) === color
                        ? 'border-slate-800'
                        : 'border-white'
                      }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      const updatedNodes = nodes.map((n) => (n.id === selectedNode.id ? { ...n, color } : n))
                      setNodes(updatedNodes)
                      setSelectedNode({ ...selectedNode, color })
                    }}
                    title={color}
                  />
                ))}
                <input
                  className="h-6 w-[72px] rounded-lg border border-slate-200 bg-white px-2 text-[10px] font-mono text-slate-600 outline-none focus:border-blue-500 transition-all"
                  value={selectedNode.color || getNodeColor(selectedNode)}
                  onChange={(e) => {
                    const value = e.target.value
                    const updatedNodes = nodes.map((n) => (n.id === selectedNode.id ? { ...n, color: value } : n))
                    setNodes(updatedNodes)
                    setSelectedNode({ ...selectedNode, color: value })
                  }}
                  placeholder="#RRGGBB"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">保险公司可见</p>
            {insurerIds.length === 0 && <p className="text-[10px] text-slate-400">暂无保司节点</p>}
            {insurerNodes.map((insurer) => {
              const visibleTo = Array.isArray(selectedNode.visibleTo) ? selectedNode.visibleTo : insurerIds
              const checked = visibleTo.includes(insurer.id)
              return (
                <label key={insurer.id} className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const nextVisibleTo = e.target.checked
                        ? [...new Set([...visibleTo, insurer.id])]
                        : visibleTo.filter((id) => id !== insurer.id)
                      const updatedNodes = nodes.map((n) =>
                        n.id === selectedNode.id ? { ...n, visibleTo: nextVisibleTo } : n,
                      )
                      setNodes(updatedNodes)
                      setSelectedNode({ ...selectedNode, visibleTo: nextVisibleTo })
                    }}
                  />
                  <span>{insurer.label}</span>
                </label>
              )
            })}
          </div>
          <button
            onClick={() => deleteNode(selectedNode)}
            className="w-full py-3 text-[10px] font-bold text-red-500 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
          >
            删除节点及其关联
          </button>
        </div>
      )}
      {selectedLink && (
        <div className="space-y-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">编辑关系</p>
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
            <div className="space-y-1.5">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">关系类型</p>
              <select
                className="w-full text-[11px] p-2.5 rounded-xl border border-slate-100 bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                value={selectedLink.type}
                onChange={(e) => {
                  const nextType = e.target.value
                  const nL = links.map((l) =>
                    l.id === selectedLink.id
                      ? {
                        ...l,
                        type: nextType,
                        color: undefined,
                        style: undefined,
                        weight: undefined,
                      }
                      : l,
                  )
                  setLinks(nL)
                  setSelectedLink({
                    ...selectedLink,
                    type: nextType,
                    color: undefined,
                    style: undefined,
                    weight: undefined,
                  })
                }}
              >
                {linkTypeConfigs.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">线条颜色</p>
                  <button
                    className="text-[10px] text-slate-400 font-bold hover:text-blue-500 transition-colors"
                    onClick={() => {
                      const nL = links.map((l) =>
                        l.id === selectedLink.id ? { ...l, color: undefined, style: undefined, weight: undefined } : l,
                      )
                      setLinks(nL)
                      setSelectedLink({ ...selectedLink, color: undefined, style: undefined, weight: undefined })
                    }}
                  >
                    恢复默认
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                  {commonColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-5 w-5 rounded-full border-2 transition hover:scale-110 active:scale-90 ${(selectedLink.color || getLinkStrokeColor(selectedLink)) === color
                          ? 'border-slate-800'
                          : 'border-white'
                        }`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        const nL = links.map((l) => (l.id === selectedLink.id ? { ...l, color } : l))
                        setLinks(nL)
                        setSelectedLink({ ...selectedLink, color })
                      }}
                      title={color}
                    />
                  ))}
                  <input
                    className="h-6 w-[72px] rounded-lg border border-slate-200 bg-white px-2 text-[10px] font-mono text-slate-600 outline-none focus:border-blue-500 transition-all"
                    value={selectedLink.color || getLinkStrokeColor(selectedLink)}
                    onChange={(e) => {
                      const value = e.target.value
                      const nL = links.map((l) => (l.id === selectedLink.id ? { ...l, color: value } : l))
                      setLinks(nL)
                      setSelectedLink({ ...selectedLink, color: value })
                    }}
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">线宽</p>
              <input
                type="range"
                min="1"
                max="6"
                step="0.5"
                value={getLinkWeight(selectedLink)}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  const nL = links.map((l) => (l.id === selectedLink.id ? { ...l, weight: value } : l))
                  setLinks(nL)
                  setSelectedLink({ ...selectedLink, weight: value })
                }}
                className="w-full accent-blue-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">线型</p>
              <select
                className="w-full text-[11px] p-2.5 rounded-xl border border-slate-100 bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                value={getLinkStyle(selectedLink)}
                onChange={(e) => {
                  const value = e.target.value
                  const nL = links.map((l) => (l.id === selectedLink.id ? { ...l, style: value } : l))
                  setLinks(nL)
                  setSelectedLink({ ...selectedLink, style: value })
                }}
              >
                <option value="solid">实线</option>
                <option value="dashed">虚线</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => deleteLink(selectedLink)}
            className="w-full py-3 text-[10px] font-bold text-red-500 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
          >
            仅删除此关系
          </button>
        </div>
      )}
    </div>
  )
}

export default DetailsPanel
