# Edge Design System

> Edge 系产品的统一设计系统。`tokens` + `ui` 两层不含业务，任何项目可用；
> `components` + `hooks` 知道 Edge 的资源概念与 API 契约。

发布在公有 npm，安装无需 token。

## 包

| 包 | 内容 | 依赖 |
|---|---|---|
| [`@riseaicloud/tokens`](./packages/tokens) | 颜色 / 间距 / 字体 / 动效 token + Tailwind preset | 无（peer: tailwindcss） |
| [`@riseaicloud/ui`](./packages/ui) | 通用 UI 组件（只吃 props） | tokens |
| [`@riseaicloud/components`](./packages/components) | 业务组件（知道 Edge 概念，**不自己发请求**） | ui + tokens |
| [`@riseaicloud/hooks`](./packages/hooks) | 数据 hooks（知道 API 契约，**连接信息由使用者注入**）+ 通用 hooks | 无 |

归属判断见 [EXTRACTION_GUIDE.md](./EXTRACTION_GUIDE.md)。

## 消费

```bash
pnpm add @riseaicloud/tokens @riseaicloud/ui
```

```js
// tailwind.config.js
const edgePreset = require('@riseaicloud/tokens/tailwind-preset')

module.exports = {
  presets: [edgePreset],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@riseaicloud/ui/dist/**/*.{js,mjs}',   // ← 缺这条组件样式会静默丢失
  ],
}
```

**本包不自带样式表**，class 由消费方自己的 Tailwind 生成。漏配 `content` 通常*看起来*没事 ——
消费方自己也用到的 class 照样会生成，只有库独有的（`bg-card`、`hover:bg-primary/80`…）会缺失。
完整说明见 [docs/guide/installation](./docs/pages/guide/installation.mdx)。

## 开发

```bash
pnpm install
pnpm storybook      # 组件开发（6006）
pnpm docs:dev       # 文档站（3030）
pnpm build          # 构建所有包
```

> **改了 tokens 要重启 Storybook**：Tailwind preset 在启动时加载，不热重载。改完 token 后
> Storybook 里看到的仍是旧值 —— 视觉回归尤其要注意这点。

## 发布

Changesets 管版本，发布到公有 npmjs。

```bash
pnpm changeset          # 记录变更（每个 PR 都要带）
pnpm changeset version  # bump 版本 + 生成 CHANGELOG
```

**pre-1.0 手动发布**：Actions → Release → Run workflow。合并 PR 不会自动发版。
post-1.0 的自动化流程见 [`.github/workflows/release.yml`](./.github/workflows/release.yml) 注释。

## 技术栈

pnpm workspace · React + TypeScript + Tailwind · tsup · Storybook · Nextra · Changesets

## License

MIT
