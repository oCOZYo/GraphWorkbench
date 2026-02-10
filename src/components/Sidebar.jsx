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
    labelInputRef,
    handleImport,
    handleNeo4jImport,
  } = useGraphContext()

  return (
    <aside
      className={`bg-slate-50/90 border-r border-slate-100 flex flex-col shadow-xl z-20 overflow-hidden transition-all duration-300 ${
        isSidebarCollapsed ? 'w-12' : 'w-80'
      }`}
    >
      <div className={`bg-slate-50/90 ${isSidebarCollapsed ? 'p-2' : 'px-4 py-5'}`}>
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-start' : 'justify-between'}`}>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 text-sm font-bold shadow-sm hover:bg-slate-200"
            title={isSidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            ☰
          </button>
          {!isSidebarCollapsed && (
            <div className="text-right">
              <h1 className="text-lg font-black text-slate-800 tracking-tight">异构图建模工具</h1>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-bold">Workbench v3.3.1</p>
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isSidebarCollapsed ? 'px-2 pt-4 space-y-3' : 'px-6 mt-6 pb-5 space-y-6'
        }`}
      >
        <section>
          <h3
            className={`text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.1em] transition-all ${
              isSidebarCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            交互工具
          </h3>
          <div className="grid gap-2">
            <button
              onClick={() => {
                setIsQuickLinkMode(!isQuickLinkMode)
                setLinkSource(null)
              }}
              className={`w-full rounded-xl font-bold transition-all shadow-sm flex items-center hover:scale-[1.02] active:scale-[0.98] ${
                isSidebarCollapsed ? 'h-9 justify-center gap-0' : 'py-3 px-3 gap-3'
              } ${
                isQuickLinkMode ? 'bg-blue-600 text-white shadow-blue-100' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <span className="text-base">🖱️</span>
              <span className={`text-[11px] transition-all ${isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                连线模式: {isQuickLinkMode ? '开启' : '关闭'}
              </span>
            </button>
            <button
              onClick={aggregateNodes}
              className={`w-full rounded-xl font-bold transition-all shadow-sm flex items-center bg-indigo-50 text-indigo-600 border border-indigo-100 hover:scale-[1.02] active:scale-[0.98] ${
                isSidebarCollapsed ? 'h-9 justify-center gap-0' : 'py-3 px-3 gap-3'
              }`}
            >
              <span className="text-base">🔄</span>
              <span className={`text-[11px] transition-all ${isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                一键自动布局
              </span>
            </button>
            <button
              onClick={() => setAutoLayoutEnabled(!autoLayoutEnabled)}
              className={`w-full rounded-xl font-bold transition-all shadow-sm border flex items-center hover:scale-[1.02] active:scale-[0.98] ${
                isSidebarCollapsed ? 'h-9 justify-center gap-0' : 'py-3 px-3 gap-3'
              } ${
                autoLayoutEnabled
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-100'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <span className="text-base">🧲</span>
              <span className={`text-[11px] transition-all ${isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                自动布局: {autoLayoutEnabled ? '开启' : '关闭'}
              </span>
            </button>
          </div>
        </section>

        <section>
          <h3
            className={`text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.1em] transition-all ${
              isSidebarCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            模型定义
          </h3>
          <div className="grid gap-2">
            <button
              onClick={() => setShowNodeTypeManager(true)}
              className={`w-full rounded-xl font-bold transition-all shadow-sm flex items-center bg-slate-800 text-white hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] ${
                isSidebarCollapsed ? 'h-9 justify-center gap-0' : 'py-3 px-3 gap-3'
              }`}
            >
              <span className="text-base">🗂️</span>
              <span className={`text-[11px] transition-all ${isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                实体管理
              </span>
            </button>
            <button
              onClick={() => setShowTypeManager(true)}
              className={`w-full rounded-xl font-bold transition-all shadow-sm flex items-center bg-slate-800 text-white hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] ${
                isSidebarCollapsed ? 'h-9 justify-center gap-0' : 'py-3 px-3 gap-3'
              }`}
            >
              <span className="text-base">🔗</span>
              <span className={`text-[11px] transition-all ${isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                关系管理
              </span>
            </button>
            <button
              onClick={() => setShowColorPaletteManager(true)}
              className={`w-full rounded-xl font-bold transition-all shadow-sm flex items-center bg-slate-800 text-white hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] ${
                isSidebarCollapsed ? 'h-9 justify-center gap-0' : 'py-3 px-3 gap-3'
              }`}
            >
              <span className="text-base">🎨</span>
              <span className={`text-[11px] transition-all ${isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                色卡管理
              </span>
            </button>
          </div>
        </section>

        <section>
          <h3
            className={`text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.1em] transition-all ${
              isSidebarCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            导入导出
          </h3>
          <div className="grid gap-2">
            <button
              onClick={exportData}
              className={`w-full rounded-xl font-bold transition-all shadow-sm flex items-center bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] ${
                isSidebarCollapsed ? 'h-9 justify-center gap-0' : 'py-3 px-3 gap-3'
              }`}
            >
              <span className="text-base">💾</span>
              <span className={`text-[11px] transition-all ${isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                导出数据包
              </span>
            </button>
            <button
              onClick={exportNeo4j}
              className={`w-full rounded-xl font-bold transition-all shadow-sm flex items-center bg-emerald-50 text-emerald-700 border border-emerald-100 hover:scale-[1.02] active:scale-[0.98] ${
                isSidebarCollapsed ? 'h-9 justify-center gap-0' : 'py-3 px-3 gap-3'
              }`}
            >
              <span className="text-base">🧱</span>
              <span className={`text-[11px] transition-all ${isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                导出 Neo4j JSON
              </span>
            </button>
            <button
              onClick={() => fileInputRef.current.click()}
              className={`w-full rounded-xl font-bold transition-all shadow-sm flex items-center bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] ${
                isSidebarCollapsed ? 'h-9 justify-center gap-0' : 'py-3 px-3 gap-3'
              }`}
            >
              <span className="text-base">📂</span>
              <span className={`text-[11px] transition-all ${isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                导入数据包
              </span>
            </button>
            <button
              onClick={() => neo4jFileInputRef.current.click()}
              className={`w-full rounded-xl font-bold transition-all shadow-sm flex items-center bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] ${
                isSidebarCollapsed ? 'h-9 justify-center gap-0' : 'py-3 px-3 gap-3'
              }`}
            >
              <span className="text-base">📦</span>
              <span className={`text-[11px] transition-all ${isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                导入 Neo4j JSON
              </span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
            <input
              type="file"
              ref={neo4jFileInputRef}
              onChange={handleNeo4jImport}
              className="hidden"
              accept=".json"
            />
          </div>
        </section>

        {!isSidebarCollapsed && (
          <>
            <details className="group">
              <summary className="list-none cursor-pointer text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] flex items-center justify-between">
                <span>单保司视角</span>
                <span className="text-[11px] text-slate-300 group-open:rotate-180 transition">▾</span>
              </summary>
              <div className="space-y-2 mt-3">
                <button
                  onClick={() => {
                    const next = !singleInsurerMode
                    setSingleInsurerMode(next)
                    if (next && !activeInsurerId && insurerIds.length > 0) setActiveInsurerId(insurerIds[0])
                  }}
                  className={`w-full py-3 rounded-xl text-[11px] font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
                    singleInsurerMode ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {singleInsurerMode ? '单保司模式: 开启' : '单保司模式: 关闭'}
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
            </details>

            <section>
              <h3 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.1em]">录入实体</h3>
              <div className="space-y-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                <input
                  ref={labelInputRef}
                  className="w-full text-[11px] p-2.5 rounded-lg border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-slate-300"
                  placeholder="显示名称"
                  value={newNode.label}
                  onBlur={handleLabelBlur}
                  onChange={(e) => setNewNode({ ...newNode, label: e.target.value })}
                />
                <input
                  className="w-full text-[11px] p-2.5 rounded-lg border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-slate-300"
                  placeholder="ID (可选)"
                  value={newNode.id}
                  onChange={(e) => setNewNode({ ...newNode, id: e.target.value })}
                />
                <select
                  className="w-full text-[11px] p-2.5 rounded-lg border border-slate-100 bg-slate-50/30 focus:bg-white focus:border-slate-200 outline-none transition-all appearance-none cursor-pointer"
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
                  className="w-full bg-slate-900 text-white text-[11px] font-bold py-2.5 rounded-lg hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
                >
                  添加节点
                </button>
              </div>
            </section>

            <section className="pt-2 border-t border-slate-100">
              <div className="rounded-2xl bg-slate-50 border-slate-100 p-0 text-[11px] text-slate-500 space-y-2">
                <a
                  href="https://github.com/oCOZYo/GraphWorkbench"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center"
                  aria-label="GitHub: GraphWorkbench"
                >
                  <img
                    src="/GitHub_Lockup_Black_Clearspace.svg"
                    alt="GitHub"
                    className="h-8"
                  />
                </a>
                <p>欢迎提交 Issue / PR 或分享你的业务图谱实践。</p>
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-slate-600">Powered by</div>
                  <a
                    href="https://github.com/facebook/react"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-slate-700"
                  >
                    React
                  </a>
                  <a
                    href="https://github.com/vitejs/vite"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Vite
                  </a>
                  <a
                    href="https://github.com/d3/d3"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-slate-700"
                  >
                    D3.js
                  </a>
                  <a
                    href="https://github.com/tailwindlabs/tailwindcss"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Tailwind CSS
                  </a>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
