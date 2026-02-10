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
    hiddenLinkTypes,
    toggleLinkTypeVisibility,
    commonColors,
  } = useGraphContext()
  const onClose = () => setShowTypeManager(false)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="flex flex-col w-full max-w-3xl max-h-[80vh] rounded-3xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex-none px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">关系类型配置</h2>
            <p className="text-sm text-gray-400 mt-1">管理关系类型、颜色与线型样式</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {linkTypeConfigs.map((type, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5 hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: type.color }}
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <input
                      className="block w-full text-[15px] font-black text-gray-900 border-0 border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-0 px-0 py-0.5 transition-colors bg-transparent placeholder-gray-400"
                      placeholder="关系类型名称"
                      value={type.name}
                      onChange={(e) => {
                        const old = type.name
                        const val = e.target.value
                        updateLinkType(index, { name: val })
                        renameLinkType(old, val)
                      }}
                    />
                    <p className="text-xs text-gray-400">关系标识与样式配置</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-1.5 flex items-center gap-1 border border-slate-100">
                    <button
                      onClick={() => toggleLinkTypeVisibility(type.name)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${hiddenLinkTypes[type.name]
                          ? 'bg-slate-200 text-slate-400'
                          : 'hover:bg-white text-blue-500 hover:shadow-sm'
                        }`}
                      title={hiddenLinkTypes[type.name] ? '显示所有此类边' : '隐藏所有此类边'}
                    >
                      {hiddenLinkTypes[type.name] ? '👁️‍🗨️' : '👁️'}
                    </button>
                    <button
                      onClick={() => deleteLinkType(index)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white transition-all text-gray-400 hover:text-red-500 hover:shadow-sm"
                      title="删除类型"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400">常用颜色</label>
                  <div className="flex flex-wrap gap-2">
                    {commonColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`h-6 w-6 rounded-full border-2 transition ${type.color === color ? 'border-gray-900' : 'border-white'
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

        <div className="flex-none px-8 py-6 border-t border-gray-100 bg-white flex justify-between items-center">
          <div className="text-[11px] text-gray-400 font-medium">名称修改后即时生效。</div>
          <div className="flex gap-4">
            <button
              onClick={addLinkType}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-gray-200 transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center gap-2"
            >
              <span>新增类型</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
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
