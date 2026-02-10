import React from 'react'
import { useGraphContext } from '../context/GraphContext.jsx'

const Sidebar = () => {
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isQuickLinkMode,
    setIsQuickLinkMode,
    setLinkSource,
    aggregateNodes,
    autoLayoutEnabled,
    setAutoLayoutEnabled,
    singleInsurerMode,
    setSingleInsurerMode,
    activeInsurerId,
    setActiveInsurerId,
    insurerIds,
    insurerNodes,
    visibilityMode,
    setVisibilityMode,
    setShowNodeTypeManager,
    setShowTypeManager,
    setShowColorPaletteManager,
    newNode,
    setNewNode,
    handleLabelBlur,
    handleNewNodeTypeChange,
    addNode,
    nodeTypeConfigs,
    exportData,
    exportNeo4j,
    fileInputRef,
    neo4jFileInputRef,
    handleImport,
    handleNeo4jImport,
  } = useGraphContext()

  return (
  <aside
    className={`bg-white border-r border-slate-200 flex flex-col shadow-xl z-20 overflow-hidden transition-all duration-300 ${
      isSidebarCollapsed ? 'w-12' : 'w-80'
    }`}
  >
    <div className={`border-b bg-slate-50/50 ${isSidebarCollapsed ? 'p-2' : 'p-6 text-center'}`}>
      <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isSidebarCollapsed && (
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">异构图建模 Pro</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Workbench v3.3.1</p>
          </div>
        )}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="w-8 h-8 rounded-lg bg-white border text-slate-600 text-xs font-bold shadow-sm"
          title={isSidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {isSidebarCollapsed ? '⟫' : '⟪'}
        </button>
      </div>
    </div>

    {!isSidebarCollapsed && (
      <div className="px-6 space-y-6 flex-1 pb-10 mt-6 overflow-y-auto">
        <section>
          <h3 className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-tighter">交互工具</h3>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => {
                setIsQuickLinkMode(!isQuickLinkMode)
                setLinkSource(null)
              }}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isQuickLinkMode ? 'bg-blue-600 text-white shadow-blue-100' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isQuickLinkMode ? '✨ 连线模式: 开启' : '🔗 连线模式: 关闭'}
            </button>
            <button
              onClick={aggregateNodes}
              className="w-full py-3 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
            >
              🧩 疏朗布局一键聚合
            </button>
            <button
              onClick={() => setAutoLayoutEnabled(!autoLayoutEnabled)}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-sm border ${
                autoLayoutEnabled
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              {autoLayoutEnabled ? '🧲 自动布局: 开启' : '🧭 自动布局: 关闭'}
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-tighter">单保司视角</h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                const next = !singleInsurerMode
                setSingleInsurerMode(next)
                if (next && !activeInsurerId && insurerIds.length > 0) setActiveInsurerId(insurerIds[0])
              }}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
                singleInsurerMode ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {singleInsurerMode ? '👁️ 单保司模式: 开启' : '👁️ 单保司模式: 关闭'}
            </button>
            <select
              className="w-full text-xs p-2.5 rounded-lg border bg-white"
              value={activeInsurerId}
              onChange={(e) => setActiveInsurerId(e.target.value)}
              disabled={!singleInsurerMode || insurerIds.length === 0}
            >
              <option value="">请选择保司</option>
              {insurerNodes.map((insurer) => (
                <option key={insurer.id} value={insurer.id}>
                  {insurer.label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={visibilityMode === 'hide'}
                onChange={(e) => setVisibilityMode(e.target.checked ? 'hide' : 'dim')}
                disabled={!singleInsurerMode}
              />
              <span>不可见节点隐藏（不参与布局）</span>
            </label>
            {insurerIds.length === 0 && <p className="text-[10px] text-slate-400">暂无保司节点，无法启用视角筛选。</p>}
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-tighter">模型定义</h3>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => setShowNodeTypeManager(true)}
              className="w-full py-3 rounded-xl text-xs font-bold bg-slate-800 text-white shadow-md"
            >
              🧩 实体类型配置
            </button>
            <button
              onClick={() => setShowTypeManager(true)}
              className="w-full py-3 rounded-xl text-xs font-bold bg-slate-800 text-white shadow-md"
            >
              🎨 关系配色与类型管理
            </button>
            <button
              onClick={() => setShowColorPaletteManager(true)}
              className="w-full py-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"
            >
              🧪 色卡管理
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-tighter">录入实体</h3>
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <input
              className="w-full text-xs p-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="显示名称"
              value={newNode.label}
              onBlur={handleLabelBlur}
              onChange={(e) => setNewNode({ ...newNode, label: e.target.value })}
            />
            <input
              className="w-full text-xs p-2.5 rounded-lg border bg-white"
              placeholder="ID"
              value={newNode.id}
              onChange={(e) => setNewNode({ ...newNode, id: e.target.value })}
            />
            <select
              className="w-full text-xs p-2.5 rounded-lg border bg-white"
              value={newNode.type}
              onChange={(e) => handleNewNodeTypeChange(e.target.value)}
            >
              {Object.entries(nodeTypeConfigs).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <button
              onClick={addNode}
              className="w-full bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg active:scale-95 transition-all"
            >
              添加节点
            </button>
          </div>
        </section>

        <section className="pt-4 border-t border-slate-100 grid grid-cols-1 gap-2">
          <button
            onClick={exportData}
            className="w-full bg-emerald-600 text-white text-xs font-bold py-3 rounded-xl shadow-lg shadow-emerald-100"
          >
            💾 导出数据包
          </button>
          <button
            onClick={exportNeo4j}
            className="w-full bg-emerald-50 text-emerald-700 text-xs font-bold py-3 rounded-xl border border-emerald-100"
          >
            🧱 导出 Neo4j JSON
          </button>
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full bg-slate-700 text-white text-xs font-bold py-3 rounded-xl"
          >
            📂 导入数据包
          </button>
          <button
            onClick={() => neo4jFileInputRef.current.click()}
            className="w-full bg-slate-50 text-slate-700 text-xs font-bold py-3 rounded-xl border border-slate-200"
          >
            📦 导入 Neo4j JSON
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
          <input
            type="file"
            ref={neo4jFileInputRef}
            onChange={handleNeo4jImport}
            className="hidden"
            accept=".json"
          />
        </section>
      </div>
    )}
  </aside>
  )
}

export default Sidebar
