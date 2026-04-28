# 厦大数字工坊文章后台管理系统

基于 React 18、TypeScript、Vite、Ant Design 和 Zustand 构建的文章后台管理系统。项目已拆分为 Monorepo 架构，围绕文章管理、用户中心、登录注册、权限控制和大文件上传沉淀可复用模块能力。

## 技术栈

- React 18 + TypeScript
- Vite + vite-plugin-html
- React Router Data Router
- Ant Design 5
- Zustand + persist + devtools + immer
- Axios 请求拦截层
- Less / CSS Modules
- npm workspaces

## 项目结构

```text
apps/
  admin/                 # 后台管理应用入口、路由、根布局
packages/
  article/               # 文章、分类、发布、编辑、大文件上传
  auth/                  # 登录、注册、认证页面
  shared/                # 通用 API、鉴权、状态、组件、工具、资源
  user/                  # 用户资料、头像、密码修改
```

## 核心功能

- 登录注册：表单校验、JWT 登录态持久化、登录后跳转。
- 路由守卫：未登录拦截、过期 token 清理、无权限 403 页面。
- 权限控制：路由 `handle.permissions` 声明权限码，JWT 中的 `permissions`、`roles`、`scope` 自动匹配。
- 统一请求层：自动注入 `Authorization: Bearer <token>`，统一处理 401、403、超时和网络异常。
- 全局状态管理：使用 Zustand 管理 token、用户信息、侧边栏状态、文章草稿和编辑流程。
- 文章管理：文章列表、筛选、预览、删除、编辑、发布。
- 分类管理：新增、编辑、删除分类，并保护内置分类。
- 用户中心：用户资料、头像、密码维护。
- 大文件上传：Hash 秒传、分片上传、暂停继续、断点续传、合并提交。
- 统一构建：根目录统一执行 dev、build、lint。

## 项目亮点

- Monorepo 拆分清晰：应用层与业务包、通用包分离，降低模块耦合，方便多人协作。
- 鉴权链路完整：JWT 解析、状态持久化、路由守卫、请求拦截、401/403 处理形成闭环。
- Zustand 替代 Context：减少 Provider 嵌套和样板代码，通过 selector 精准订阅状态。
- 大文件上传体验完整：前端完成 Hash 校验、秒传、分片并发、断点记录和恢复上传。
- 首屏性能优化：通过路由懒加载、Vite 代码分割、WebP 资源替换和非首屏依赖延后加载，将 LCP 从约 3.7s 优化至约 2.4s，包体积资源优化约 28%。
- 业务流程可恢复：文章发布草稿使用持久化状态，刷新后可以继续编辑。
- 构建配置统一：TypeScript paths 与 Vite alias 对齐，跨模块引用更直观。

## 难点与解决方案

- 跨模块依赖治理：通过 `@admin`、`@article`、`@auth`、`@shared`、`@user` alias 固化边界，避免回到单体 `@/` 引用。
- 刷新时鉴权时序：React Router loader 可能先于组件守卫执行，因此在根路由 loader 和 Axios 拦截器中都加入 JWT 校验。
- token 过期处理：请求前判断 `exp`，响应后处理 401，统一清理 Zustand 状态并提示重新登录。
- 权限兼容性：新 JWT 支持权限字段，旧 token 没有权限字段时保持兼容，避免阻断已有业务。
- 大文件上传可靠性：使用 SHA-256 作为文件唯一标识，结合服务端已上传分片和本地 checkpoint 恢复上传。
- 表单草稿恢复：封面、内容、步骤状态通过 Zustand persist 写入 localforage，降低误刷新带来的数据丢失。

## 性能优化

- 路由级懒加载：登录、注册、首页、用户中心、文章发布、文章编辑、分类管理等页面均通过 React Router `lazy` 动态导入。
- Vite 代码分割：生产构建按 `vendor-router`、`vendor-state`、`vendor-storage`、`vendor-editor`、`vendor-utils` 等维度拆包，减少入口 JS 体积。
- 非首屏依赖延后：`react-quill`、`quill`、`localforage`、`dayjs` 从首屏 CDN 注入中移除，仅在对应业务路由加载。
- CDN 资源优化：保留 React、ReactDOM、Ant Design 外链，并使用 `preconnect` 与 `defer` 降低 HTML 解析阻塞。
- 图片资源优化：登录背景图和首页图从 JPG/PNG 转为 WebP，单资源体积从约 319KB/349KB 降至约 90KB/105KB。
- 构建分析：`rollup-plugin-visualizer` 生成 `stats.html`，用于持续观察依赖体积和分包效果。

## 运行方式

```bash
npm install
npm run dev
npm run build
npm run lint
```

开发地址：

```text
http://127.0.0.1:5173/
```

## 后端接口约定

大文件上传模块需要后端提供以下接口：

- `POST /my/upload/verify`：校验文件 Hash，返回是否已上传和已上传分片。
- `POST /my/upload/chunk`：上传单个分片。
- `POST /my/upload/merge`：合并分片并返回文件 URL。

JWT 建议携带以下任一权限字段：

```json
{
  "permissions": ["article:create", "article:list"],
  "roles": ["admin"],
  "scope": "article:create article:list"
}
```

## 测试记录

当前已完成以下本地验证：

- TypeScript 类型检查：通过 `npm run build` 覆盖。
- Vite 生产构建：通过 `npm run build` 覆盖。
- ESLint 静态检查：通过 `npm run lint` 覆盖。
- 路由访问检查：本地 dev server 下访问 `/login`、`/reg`、`/`、`/home`、`/user-avatar`、`/user-info`、`/user-pwd`、`/art-add`、`/art-cate`、`/art-list`、`/art-edit/1`、`/not-found-check`，均返回前端应用入口。
- 路由配置静态检查：覆盖登录、注册、首页、用户中心、文章新增、分类、列表、编辑、404、403。
- API 引用静态检查：覆盖认证、用户、文章、分类、大文件上传接口。
- 冗余代码检查：清理未引用静态资源、重复 CSS Module 产物、调试日志和临时 dev 日志。

受限于本地没有真实后端服务，登录、文章发布、分类增删改、用户资料修改和大文件上传的真实接口交互需要连接后端后进行端到端验证。
