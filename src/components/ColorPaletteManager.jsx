import React, { useState } from 'react'
import { useGraphContext } from '../context/GraphContext.jsx'

const ColorPaletteManager = () => {
  const { commonColors, setCommonColors, setShowColorPaletteManager } = useGraphContext()
  const [newColorValue, setNewColorValue] = useState('')
  const onClose = () => setShowColorPaletteManager(false)

  const normalizeColor = (value) => {
    if (!value) return ''
    const trimmed = value.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('#')) return trimmed.toLowerCase()
    return `#${trimmed.toLowerCase()}`
  }

  const addCommonColor = () => {
    const normalized = normalizeColor(newColorValue)
    if (!normalized) return
    if (commonColors.includes(normalized)) {
      setNewColorValue('')
      return
    }
    setCommonColors([...commonColors, normalized])
    setNewColorValue('')
  }

  const removeCommonColor = (color) => {
    setCommonColors(commonColors.filter((c) => c !== color))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">色卡管理</h2>
            <p className="text-sm text-gray-500 mt-0.5">全局通用色卡资源，所有类型与实例共享。</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            {commonColors.map((color) => (
              <div key={color} className="relative">
                <button
                  type="button"
                  className="h-10 w-10 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: color }}
                  title={color}
                />
                <button
                  type="button"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-xs text-gray-500 shadow"
                  onClick={() => removeCommonColor(color)}
                  title="移除色块"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              className="h-9 w-32 rounded-lg border border-gray-200 bg-white px-2 text-sm font-mono text-gray-600"
              value={newColorValue}
              onChange={(e) => setNewColorValue(e.target.value)}
              placeholder="#RRGGBB"
            />
            <button
              type="button"
              onClick={addCommonColor}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              添加色卡
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end border-t border-gray-100 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  )
}

export default ColorPaletteManager
