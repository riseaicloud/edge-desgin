import React from 'react'
import type { Preview } from '@storybook/react'
import '../src/styles.css'

/**
 * 主题工具栏此前是**摆设**：`globalTypes.theme` 定义了 light/dark 两项，但没有任何
 * decorator 把 `.dark` 打到 `<html>` 上 —— tokens preset 的暗色值全挂在 `.dark` 选择器下
 * （`darkMode: ['class']`），class 不加就永远是浅色。切换只改了 `backgrounds` 的画布底色，
 * 组件本身纹丝不动，看上去像"暗色没做"，实际是开关没接线。
 *
 * 组件去固定色要在**明暗两套下**逐个看，这个 decorator 是那件事的前提。
 */
const withTheme = (Story: React.ComponentType, context: { globals: { theme?: string } }) => {
  const dark = context.globals.theme === 'dark'

  // Storybook 每个 story 渲染在 iframe 里，直接改这个 iframe 的 documentElement。
  React.useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // 画布底色跟着走，否则暗色组件浮在白底上、对比关系是假的。
  return (
    <div className="bg-background text-foreground p-4">
      <Story />
    </div>
  )
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // backgrounds 交给 decorator 的 bg-background 统一管，避免"画布一套色、组件另一套色"
    backgrounds: { disable: true },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
}

export default preview
