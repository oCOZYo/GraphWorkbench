import React, { useState } from 'react'
import { useGraphContext } from '../context/GraphContext.jsx'

const NodeTypeManager = () => {
  const {
    nodeTypeConfigs,
    nodeTypeUsage,
    createNodeType,
    updateNodeType,
    deleteNodeType,
    renameNodeType,
    setShowNodeTypeManager,
    commonColors,
  } = useGraphContext()
  const [typeNameEdits, setTypeNameEdits] = useState({})
  const [keywordInputs, setKeywordInputs] = useState({})
  const onClose = () => setShowNodeTypeManager(false)

  const normalizeTypeKey = (value) => (value || '').trim()
  const getTypeEditValue = (typeKey) => typeNameEdits[typeKey] ?? typeKey
  const clearTypeEdit = (typeKey) =>
    setTypeNameEdits((prev) => {
      const next = { ...prev }
      delete next[typeKey]
      return next
    })

  const handleTypeInputChange = (typeKey, value) => {
    setTypeNameEdits((prev) => ({
      ...prev,
      [typeKey]: value,
    }))
  }

  const commitTypeRename = (typeKey) => {
    const candidate = normalizeTypeKey(getTypeEditValue(typeKey))
    if (!candidate) return
    if (candidate === typeKey) {
      clearTypeEdit(typeKey)
      return
    }
    if (renameNodeType(typeKey, candidate)) {
      clearTypeEdit(typeKey)
    }
  }

  const handleKeywordsChange = (typeKey, rawValue) => {
    const nextKeywords = Array.from(
      new Set(
        rawValue
          .split(',')
          .map((keyword) => keyword.trim())
          .filter(Boolean),
      ),
    )
    updateNodeType(typeKey, { keywords: nextKeywords })
  }

  const handleKeywordInputChange = (typeKey, value) => {
    setKeywordInputs((prev) => ({ ...prev, [typeKey]: value }))
  }

  const addKeywordsForType = (typeKey) => {
    const rawValue = keywordInputs[typeKey] || ''
    if (!rawValue.trim()) return
    const nextKeywords = Array.from(
      new Set(
        rawValue
          .split(',')
          .map((keyword) => keyword.trim())
          .filter(Boolean)
          .concat(nodeTypeConfigs[typeKey]?.keywords || []),
      ),
    )
    updateNodeType(typeKey, { keywords: nextKeywords })
    setKeywordInputs((prev) => ({ ...prev, [typeKey]: '' }))
  }

  const removeKeywordForType = (typeKey, keyword) => {
    const nextKeywords = (nodeTypeConfigs[typeKey]?.keywords || []).filter((k) => k !== keyword)
    updateNodeType(typeKey, { keywords: nextKeywords })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="flex flex-col w-full max-w-4xl max-h-[85vh] rounded-xl bg-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex-none px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">实体类型配置</h2>
            <p className="text-sm text-gray-500 mt-0.5">管理图谱实体类型定义、样式与自动识别规则</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {Object.entries(nodeTypeConfigs).map(([key, config]) => {
              const keywordsValue = (config.keywords || []).join(', ')
              return (
                <div key={key} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col gap-4 hover:shadow-md transition-shadow">
                  {/* Top Row: Identity */}
                  <div className="flex items-start gap-3">
                    {/* Color Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: config.color }}
                      />
                    </div>
                    
                    {/* Main Label & Key */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <input
                        className="block w-full text-sm font-bold text-gray-900 border-0 border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-0 px-0 py-0.5 transition-colors bg-transparent placeholder-gray-400"
                        placeholder="类型显示名称"
                        value={config.label}
                        onChange={(e) => updateNodeType(key, { label: e.target.value })}
                      />
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-mono text-gray-400 font-medium">ID:</span>
                        <input
                          className="font-mono text-gray-600 font-medium bg-transparent border-none p-0 focus:ring-0 w-full hover:text-blue-600 cursor-text"
                          value={getTypeEditValue(key)}
                          onChange={(e) => handleTypeInputChange(key, e.target.value)}
                          onBlur={() => commitTypeRename(key)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              commitTypeRename(key)
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Icon & Delete */}
                    <div className="bg-gray-50 rounded-lg p-1 flex items-center gap-1 border border-gray-100">
                         <input
                          className="w-8 text-center bg-transparent border-none p-0 text-lg focus:ring-0"
                          value={config.icon}
                          onChange={(e) => updateNodeType(key, { icon: e.target.value })}
                        />
                         <div className="w-px h-6 bg-gray-200"></div>
                         <button
                          onClick={() => deleteNodeType(key)}
                          disabled={!!nodeTypeUsage[key]}
                          className={`w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors ${
                              nodeTypeUsage[key] ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500'
                          }`}
                          title={nodeTypeUsage[key] ? '该类型已有节点，无法删除' : '删除类型'}
                        >
                          🗑️
                        </button>
                    </div>
                  </div>

                  {/* Color Picker */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400">常用颜色</label>
                    <div className="flex flex-wrap gap-2">
                      {commonColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`h-6 w-6 rounded-full border-2 transition ${
                            config.color === color ? 'border-gray-900' : 'border-white'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => updateNodeType(key, { color })}
                          title={color}
                        />
                      ))}
                      <input
                        className="h-6 w-20 rounded-full border border-gray-200 bg-white px-2 text-[10px] font-mono text-gray-600"
                        value={config.color}
                        onChange={(e) => updateNodeType(key, { color: e.target.value })}
                        placeholder="#RRGGBB"
                      />
                    </div>
                  </div>

                  {/* Keywords Area */}
                  <div className="relative space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400">自动匹配关键词</label>
                    <div className="flex flex-wrap gap-2">
                      {(config.keywords || []).map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600"
                        >
                          {keyword}
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => removeKeywordForType(key, keyword)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-600"
                        placeholder="输入关键词，逗号分隔"
                        value={keywordInputs[key] || ''}
                        onChange={(e) => handleKeywordInputChange(key, e.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault()
                            addKeywordsForType(key)
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addKeywordsForType(key)}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        添加
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      className="w-full text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-2 resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
                      placeholder="批量编辑（逗号分隔）"
                      value={keywordsValue}
                      onChange={(e) => handleKeywordsChange(key, e.target.value)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none px-6 py-4 border-t border-gray-100 bg-white flex justify-between items-center">
            <div className="text-xs text-gray-400">
                修改 ID 后按回车保存。
            </div>
            <div className="flex gap-3">
                 <button
                    onClick={createNodeType}
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

export default NodeTypeManager
