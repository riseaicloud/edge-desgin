/**
 * 视觉回归（B1）—— test-runner 遍历全部 story 截图，与 __image_snapshots__/{theme}
 * 基线比对。封板态即基线：此后任何改动跑一遍即知视觉影响面。
 *
 * 用法（Storybook dev 需在 6006 运行）：
 *   pnpm vr                  # 浅色全量（首跑自动生成基线）
 *   VR_THEME=dark pnpm vr    # 暗色通道（往 <html> 加 .dark 后截图）
 *   pnpm vr -- -u            # 有意的视觉变更后更新基线
 *
 * 跳过名单：monaco 系（CDN 异步加载不定帧）、DateRangePicker（trigger 含当前
 * 日期，跨天必漂）。这些靠交互断言/人工验，不进像素基线。
 *
 * 注意：必须是 CJS .js —— Jest 30 环境里加载 .ts 配置会踩 require(ESM) 限制。
 */
const { toMatchImageSnapshot } = require('jest-image-snapshot')

const VR_SKIP = /code-editor|yaml-edit-dialog|date-range-picker/

module.exports = {
  setup() {
    expect.extend({ toMatchImageSnapshot })
  },
  async postVisit(page, context) {
    if (VR_SKIP.test(context.id)) return

    const theme = process.env.VR_THEME === 'dark' ? 'dark' : 'light'
    if (theme === 'dark') {
      await page.evaluate(() => document.documentElement.classList.add('dark'))
      await page.waitForTimeout(200)
    }

    const image = await page.screenshot({ fullPage: false })
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: `${process.cwd()}/__image_snapshots__/${theme}`,
      customSnapshotIdentifier: context.id,
      failureThreshold: 0.01,
      failureThresholdType: 'percent',
    })
  },
}
