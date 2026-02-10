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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="flex flex-col w-full max-w-3xl max-h-[80vh] rounded-xl bg-white shadow-2xl overflow-hidden">
        <div className="flex-none px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">关系类型配置</h2>
            <p className="text-sm text-gray-500 mt-0.5">管理关系类型、颜色与线型样式</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linkTypeConfigs.map((type, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: type.color }}
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <input
                      className="block w-full text-sm font-bold text-gray-900 border-0 border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-0 px-0 py-0.5 transition-colors bg-transparent placeholder-gray-400"
                      placeholder="关系类型名称"
                      value={type.name}
                      onChange={(e) => {
                        const old = type.name
                        const val = e.target.value
                        updateLinkType(index, { name: val })
                        renameLinkType(old, val)
                      }}
                    />
                    <p className="text-xs text-gray-400">用于图谱连线标签与样式配置</p>
                  </div>
                  <button
                    onClick={() => deleteLinkType(index)}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-500"
                    title="删除类型"
                  >
                    ❌
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400">常用颜色</label>
                  <div className="flex flex-wrap gap-2">
                    {commonColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`h-6 w-6 rounded-full border-2 transition ${
                          type.color === color ? 'border-gray-900' : 'border-white'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateLinkType(index, { color })}
                        title={color}
                      />
                    ))}
                    <input
                      className="h-6 w-20 rounded-full border border-gray-200 bg-white px-2 text-[10px] font-mono text-gray-600"
                      value={type.color}
                      onChange={(e) => updateLinkType(index, { color: e.target.value })}
                      placeholder="#RRGGBB"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">线型</label>
                    <select
                      className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-white"
                      value={type.style || 'solid'}
                      onChange={(e) => updateLinkType(index, { style: e.target.value })}
                    >
                      <option value="solid">实线</option>
                      <option value="dashed">虚线</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">线宽</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.5"
                      className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-white"
                      value={type.weight ?? 1.5}
                      onChange={(e) => updateLinkType(index, { weight: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-none px-6 py-4 border-t border-gray-100 bg-white flex justify-between items-center">
          <div className="text-xs text-gray-400">名称修改后即时生效。</div>
          <div className="flex gap-3">
            <button
              onClick={addLinkType}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <span>➕</span>
              <span>新增类型</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              完成
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LinkTypeManager
