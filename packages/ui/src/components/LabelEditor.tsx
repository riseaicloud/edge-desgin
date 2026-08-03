import { useState, useEffect } from "react"
import { Button } from "./button"
import { Input } from "./input"
import { X } from "lucide-react"

export interface KeyValue {
  key: string
  value: string
}

export interface LabelEditorProps {
  /** 当前键值对列表 */
  value: KeyValue[]
  /** 值变化时的回调 */
  onChange: (value: KeyValue[]) => void
  /** 初始值（用于检测是否有变化） */
  initialValue?: KeyValue[]
  /** 是否禁用 */
  disabled?: boolean
  /** 占位符文本 */
  placeholderKey?: string
  placeholderValue?: string
  /** 空状态提示 */
  emptyText?: string
  /** 添加按钮文本 */
  addButtonText?: string
  /** 是否显示变化检测 */
  showChangeDetection?: boolean
  /** 最大高度（用于滚动） */
  maxHeight?: string
}

/**
 * LabelEditor - 键值对编辑器
 *
 * 通用的键值对编辑组件，适用于 Labels、Annotations 等场景。
 *
 * @example
 * ```tsx
 * const [labels, setLabels] = useState<KeyValue[]>([
 *   { key: 'app', value: 'my-app' }
 * ])
 *
 * <LabelEditor
 *   value={labels}
 *   onChange={setLabels}
 *   initialValue={labels}
 * />
 * ```
 */
export function LabelEditor({
  value,
  onChange,
  initialValue,
  disabled = false,
  placeholderKey = "键",
  placeholderValue = "值",
  emptyText = "暂无标签",
  addButtonText = "添加",
  showChangeDetection = false,
  maxHeight = "15rem",
}: LabelEditorProps) {
  const [newItem, setNewItem] = useState<KeyValue>({ key: '', value: '' })
  const [originalLabels, setOriginalLabels] = useState<KeyValue[]>(initialValue || value)

  // 当 initialValue 变化时更新原始值
  useEffect(() => {
    if (initialValue) {
      setOriginalLabels(initialValue)
    }
  }, [initialValue])

  const handleAdd = () => {
    if (newItem.key && newItem.value) {
      onChange([...value, { ...newItem }])
      setNewItem({ key: '', value: '' })
    }
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyChange = (index: number, key: string) => {
    const newLabels = [...value]
    newLabels[index].key = key
    onChange(newLabels)
  }

  const handleValueChange = (index: number, newValue: string) => {
    const newLabels = [...value]
    newLabels[index].value = newValue
    onChange(newLabels)
  }

  // 检测是否有变化
  const hasChanges = () => {
    if (value.length !== originalLabels.length) {
      return true
    }

    const valueMap = new Map(value.map(item => [item.key, item.value]))
    const originalMap = new Map(originalLabels.map(item => [item.key, item.value]))

    if (valueMap.size !== originalMap.size) {
      return true
    }

    for (const [key, val] of Array.from(valueMap)) {
      if (originalMap.get(key) !== val) {
        return true
      }
    }

    return false
  }

  return (
    <div className="space-y-4">
      {/* 键值对列表 */}
      <div className="border rounded">
        {/* 表头 */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted border-b text-sm font-medium text-foreground">
          <div>{placeholderKey}</div>
          <div>{placeholderValue}</div>
        </div>

        {/* 内容 */}
        {value.length === 0 ? (
          <div className="text-muted-foreground text-sm py-8 text-center">
            {emptyText}
          </div>
        ) : (
          <div className="overflow-y-auto" style={{ maxHeight }}>
            {value.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 p-3 border-b last:border-b-0 items-center">
                <Input
                  value={item.key}
                  onChange={(e) => handleKeyChange(index, e.target.value)}
                  placeholder={placeholderKey}
                  disabled={disabled}
                  className="h-8 text-sm"
                />
                <div className="flex gap-2">
                  <Input
                    value={item.value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    placeholder={placeholderValue}
                    disabled={disabled}
                    className="h-8 text-sm flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive border-input"
                    onClick={() => handleRemove(index)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 添加新项 */}
      <div className="border-2 border-dashed border-input rounded p-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            value={newItem.key}
            onChange={(e) => setNewItem(prev => ({ ...prev, key: e.target.value }))}
            placeholder={`新${placeholderKey}`}
            disabled={disabled}
            className="text-sm"
          />
          <div className="flex gap-2">
            <Input
              value={newItem.value}
              onChange={(e) => setNewItem(prev => ({ ...prev, value: e.target.value }))}
              placeholder={`新${placeholderValue}`}
              disabled={disabled}
              className="text-sm flex-1"
            />
            <Button
              onClick={handleAdd}
              disabled={!newItem.key || !newItem.value || disabled}
              size="sm"
              className="h-8 px-3 text-sm"
            >
              {addButtonText}
            </Button>
          </div>
        </div>
      </div>

      {/* 变化检测提示 */}
      {showChangeDetection && hasChanges() && (
        <div className="text-sm text-primary">
          有未保存的更改
        </div>
      )}
    </div>
  )
}

export default LabelEditor
