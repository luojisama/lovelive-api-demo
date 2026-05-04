# LoveLive 聚合 API · 演示前端

[`lovelive-api`](../lovelive-api) 的在线演示与测试页面，部署到 Vercel。

- 框架：Next.js 16 (App Router) + React 19 + Tailwind 4
- 主题：next-themes 暗色/亮色切换
- 上游：`http://llapi.shiro.team`，通过 `/api/v1/*` 反向代理（解决 JSON、图片、CORS 与 mixed content）

## 本地开发

```bash
pnpm install
pnpm dev
```

打开 <http://localhost:3000>。

页面结构很简单：左侧是接口列表，右侧是参数表单和响应展示。   
所有参数都能自定义输入：今日生日支持选时区，活动支持起止日期/团体/类型/来源，歌曲支持关键字/团体/演唱者/发售日，随机卡面支持 SIF/SIF2、角色名和稀有度。

## 反向代理是怎么工作的

上游 API 是 HTTP，没有设 CORS 头。如果浏览器直接 fetch，会有两个问题：

1. **Mixed content**：Vercel 强制 HTTPS，HTTPS 站点不能 fetch HTTP 资源。
2. **CORS**：跨域请求会被拦截。

所以加了一个 Next.js Edge Function 在 `app/api/v1/[...path]/route.ts` 做反向代理：

```text
浏览器 ──HTTPS──> Vercel /api/v1/characters ──HTTP──> llapi.shiro.team/v1/characters
```

代理会保留图片二进制响应，并把 JSON 里的 `http://llapi.shiro.team/v1/*` 链接重写为同源 `/api/v1/*`。这样音乐封面 `coverUrl` 和封面代理图不会在 HTTPS 页面里被 mixed content 拦截。

如果以后上游换域名，改一下环境变量就行：

```bash
LOVELIVE_API_BASE=https://your-domain.example
```

## 部署到 Vercel

直接在 Vercel 控制台导入这个仓库，框架会自动识别为 Next.js，无需额外配置。

可选环境变量：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `LOVELIVE_API_BASE` | `http://llapi.shiro.team` | 上游 API 地址 |

## 目录结构

```text
lovelive-api-demo/
├── app/
│   ├── api/v1/[...path]/route.ts   # 反向代理（Edge runtime）
│   ├── layout.tsx
│   ├── page.tsx                    # 主页
│   └── globals.css
├── components/
│   ├── Playground.tsx              # 主组件，左右两栏
│   ├── EndpointForm.tsx            # 数据驱动的参数表单
│   ├── ResultPanel.tsx             # 响应展示（卡片 / 原始 JSON 切换）
│   ├── Cards.tsx                   # 角色 / 活动 / 歌曲 / 卡面 卡片
│   ├── JsonView.tsx                # JSON 高亮
│   └── ThemeToggle.tsx
├── lib/
│   ├── endpoints.ts                # 接口元数据（驱动表单生成）
│   └── types.ts
└── package.json
```
