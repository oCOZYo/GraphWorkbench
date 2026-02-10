import React from 'react'
import { useGraphContext } from '../context/GraphContext.jsx'

const LinkTypeManager = () => {
  const {
    linkTypeConfigs,
    links,
    setShowTypeManager,
    updateLinkType,
    addLinkType,
    deleteLinkType,
    renameLinkType,
    commonColors,
  } = useGraphContext()
  const onClose = () => setShowTypeManager(false)

  return (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
      <div className="p-6 border-b flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-black text-slate-800">关系类型配置</h2>
        <button onClick={onClose} className="text-slate-400 text-xl">
          ✕
        </button>
      </div>
      <div className="p-6 max-h-[50vh] overflow-y-auto space-y-3">
        {linkTypeConfigs.map((type, index) => (
          <div key={index} className="p-2 bg-slate-50 rounded-xl border space-y-2">
            <div className="flex items-center gap-3">
              <input
                className="flex-1 bg-white border rounded p-1.5 text-xs font-bold"
                value={type.name}
                onChange={(e) => {
                  const old = type.name
                  const val = e.target.value
                  updateLinkType(index, { name: val })
                  renameLinkType(old, val)
                }}
              />
              <button onClick={() => deleteLinkType(index)} className="text-red-400 p-1">
                🗑️
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-slate-400 font-bold">常用颜色</p>
              <div className="flex flex-wrap gap-2">
                {commonColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-5 w-5 rounded-full border-2 transition ${
                      type.color === color ? 'border-slate-900' : 'border-white'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateLinkType(index, { color })}
                    title={color}
                  />
                ))}
                <input
                  className="h-5 w-20 rounded-full border border-slate-200 bg-white px-2 text-[10px] font-mono text-slate-600"
                  value={type.color}
                  onChange={(e) => updateLinkType(index, { color: e.target.value })}
                  placeholder="#RRGGBB"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-[9px] text-slate-400 font-bold">线型</p>
                  <select
                    className="w-full text-xs p-1.5 rounded border bg-white"
                    value={type.style || 'solid'}
                    onChange={(e) => updateLinkType(index, { style: e.target.value })}
                  >
                  <option value="solid">实线</option>
                  <option value="dashed">虚线</option>
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-slate-400 font-bold">线宽</p>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    className="w-full text-xs p-1.5 rounded border bg-white"
                    value={type.weight ?? 1.5}
                    onChange={(e) => updateLinkType(index, { weight: Number(e.target.value) })}
                  />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 bg-slate-50 border-t flex gap-3">
        <button onClick={addLinkType} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl text-sm shadow-md">
          ➕ 新增类型
        </button>
        <button onClick={onClose} className="px-6 py-3 bg-white border font-bold rounded-xl text-sm">
          完成
        </button>
      </div>
    </div>
  </div>
  )
}

export default LinkTypeManager
