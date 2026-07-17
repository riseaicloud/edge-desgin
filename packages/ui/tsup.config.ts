import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  treeshake: true,
  minify: process.env.NODE_ENV === 'production',
  cssInlining: true,
  // 整包声明为 client component。
  //
  // 库里几乎每个组件都用 hooks 或 Radix，在 React Server Component 下被 import 会直接
  // 报错。源码里 30 个组件写了 "use client"，但产物 dist/index.mjs 里一个都不剩 ——
  // 打包会把模块级指令全部丢掉，那 30 个指令等于一直是失效的。现在没暴露，只是因为
  // 消费方的页面本身都是 client、边界向下传递而已。
  //
  // 注意不能用 tsup 的 `banner` 选项：`treeshake: true` 会让 rollup 接手后处理，而
  // rollup 明确忽略模块级指令（构建日志里的 "Module level directives cause errors
  // when bundled ... was ignored"）。所以只能在构建完成后写回产物。
  //
  // 代价：纯展示组件也进不了 Server Component。想按组件区分，得改成 per-component
  // entry + splitting，那是另一件事。
  async onSuccess() {
    const { readFile, writeFile } = await import('node:fs/promises')
    for (const file of ['dist/index.mjs', 'dist/index.js']) {
      const code = await readFile(file, 'utf8')
      if (!code.startsWith('"use client"')) {
        await writeFile(file, `"use client";\n${code}`)
      }
    }
  },
})
