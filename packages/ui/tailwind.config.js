/** @type {import('tailwindcss').Config} */
const presetModule = require('@riseaicloud/tokens/tailwind-preset')
// tokens 包是 ESM（package.json "type":"module"），require() 拿到的是命名空间对象，
// 真正的 preset 在 .default 上，需取出来 Tailwind 才能读到 theme。
const edgePreset = presetModule.default ?? presetModule

module.exports = {
  presets: [edgePreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
}
