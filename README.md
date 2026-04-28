# 厦大数字工坊文章后台管理系统

基于 React 18、TypeScript、Vite、Ant Design 和 Zustand 构建的文章后台管理系统。项目已拆分为 Monorepo 架构，围绕文章管理、用户中心、登录注册、权限控制和大文件上传沉淀可复用模块能力。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite + vite-plugin-html
- **路由管理**: React Router Data Router (loader/action 模式)
- **UI 组件库**: Ant Design 5
- **状态管理**: Zustand + persist + devtools + immer
- **网络层**: Axios 请求拦截层
- **样式方案**: Less / CSS Modules
- **包管理**: npm workspaces (Monorepo)

---

## 项目结构

```
react-article-admin-template/
├── apps/
│   └── admin/                      # 后台管理应用入口
│       ├── src/
│       │   ├── main.tsx             # 应用入口
│       │   ├── home/                # 首页模块
│       │   │   ├── home.tsx         # 首页组件
│       │   │   └── css/             # 样式文件
│       │   ├── root/                # 根布局
│       │   │   ├── root.tsx         # 主布局组件
│       │   │   ├── auth-root.tsx    # 认证根组件
│       │   │   ├── components/      # 布局公共组件
│       │   │   │   ├── header.tsx   # 顶部导航
│       │   │   │   ├── menu.tsx     # 侧边菜单
│       │   │   │   ├── breadCrumb.tsx # 面包屑
│       │   │   │   └── logout.tsx   # 退出登录
│       │   │   └── css/             # 布局样式
│       │   └── router/              # 路由配置
│       │       └── index.tsx        # 路由定义与守卫
│       └── package.json
│
├── packages/
│   ├── article/                     # 文章管理核心包
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   ├── article-api.ts   # 文章相关 API
│   │   │   │   └── cate-api.ts     # 分类相关 API
│   │   │   ├── components/
│   │   │   │   ├── article-add/    # 文章发布组件
│   │   │   │   │   ├── art-base.tsx     # 基本信息
│   │   │   │   │   ├── art-cover.tsx    # 封面图上传
│   │   │   │   │   ├── art-content.tsx  # 文章内容
│   │   │   │   │   └── art-result.tsx   # 发布结果
│   │   │   │   ├── article-edit/   # 文章编辑组件
│   │   │   │   ├── article-list/   # 文章列表组件
│   │   │   │   │   ├── list-search.tsx  # 搜索筛选
│   │   │   │   │   ├── list-table.tsx   # 数据表格
│   │   │   │   │   ├── list-order.tsx   # 排序控制
│   │   │   │   │   ├── btn-edit.tsx     # 编辑按钮
│   │   │   │   │   ├── btn-delete.tsx   # 删除按钮
│   │   │   │   │   └── btn-preview.tsx  # 预览按钮
│   │   │   │   ├── article-cate/   # 分类管理组件
│   │   │   │   │   ├── btn-add.tsx      # 新增分类
│   │   │   │   │   ├── btn-edit.tsx     # 编辑分类
│   │   │   │   │   └── btn-del.tsx      # 删除分类
│   │   │   │   └── upload/
│   │   │   │       └── large-file-upload.tsx # 大文件上传
│   │   │   ├── views/
│   │   │   │   └── article/
│   │   │   │       ├── article-add.tsx   # 文章发布页
│   │   │   │       ├── article-edit.tsx  # 文章编辑页
│   │   │   │       ├── article-list.tsx  # 文章列表页
│   │   │   │       └── article-cate.tsx  # 分类管理页
│   │   │   └── store/
│   │   │       ├── art-add-store.ts  # 发布流程状态
│   │   │       ├── art-edit-store.ts # 编辑流程状态
│   │   │       └── index.ts
│   │   └── package.json
│   │
│   ├── auth/                        # 认证模块包
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   └── auth-api.ts     # 认证 API
│   │   │   └── views/
│   │   │       └── auth/
│   │   │           ├── login.tsx    # 登录页面
│   │   │           ├── reg.tsx      # 注册页面
│   │   │           ├── auth-layout.tsx # 认证布局
│   │   │           └── css/         # 样式文件
│   │   └── package.json
│   │
│   ├── shared/                      # 通用共享包
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   └── index.ts         # 统一请求封装
│   │   │   ├── auth/
│   │   │   │   └── jwt.ts          # JWT 解析工具
│   │   │   ├── components/
│   │   │   │   ├── 403.tsx         # 无权限页面
│   │   │   │   ├── 404.tsx         # 页面不存在
│   │   │   │   ├── loader-error-element.tsx # 加载错误
│   │   │   │   └── router-error-element.tsx # 路由错误
│   │   │   ├── store/
│   │   │   │   ├── app-store.ts    # 全局应用状态
│   │   │   │   ├── resetters.ts    # 状态重置器
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── hooks.ts        # 自定义 Hooks
│   │   │   │   ├── index.ts        # 工具函数
│   │   │   │   ├── storage.ts      # 存储工具
│   │   │   │   └── localforage.ts  # localforage 封装
│   │   │   └── config.json         # 配置文件
│   │   └── package.json
│   │
│   └── user/                        # 用户中心包
│       ├── src/
│       │   ├── api/
│       │   │   └── user-api.ts     # 用户 API
│       │   ├── store/
│       │   │   ├── user-store.ts   # 用户状态
│       │   │   └── index.ts
│       │   └── views/
│       │       └── user/
│       │           ├── user-info.tsx    # 用户资料
│       │           ├── user-avatar.tsx   # 头像修改
│       │           └── user-password.tsx # 密码修改
│       └── package.json
│
├── public/                          # 静态资源
├── vite.config.ts                  # Vite 主配置
├── vite.dev.config.ts              # 开发环境配置
├── vite.prod.config.ts             # 生产环境配置
├── tsconfig.json                   # TypeScript 配置
└── package.json                    # 根 package.json
```

---

## 核心功能

### 1. 认证与授权
- **登录注册**: 表单校验、JWT 登录态持久化、登录后跳转
- **路由守卫**: 未登录拦截、过期 token 清理、无权限 403 页面
- **权限控制**: 路由 `handle.permissions` 声明权限码，JWT 中的 `permissions`、`roles`、`scope` 自动匹配
- **统一请求层**: 自动注入 `Authorization: Bearer <token>`，统一处理 401、403、超时和网络异常

### 2. 文章管理
- **文章列表**: 分页查询、关键词搜索、状态筛选、排序
- **文章发布**: 三步式发布流程（基本信息 → 封面图 → 文章内容）
- **文章编辑**: 修改已有文章，支持草稿恢复
- **文章预览**: 预览文章内容
- **文章删除**: 删除文章（软删除）

### 3. 分类管理
- **分类列表**: 查看所有文章分类
- **新增分类**: 添加新分类
- **编辑分类**: 修改分类名称和别名
- **删除分类**: 删除分类（保护内置分类）

### 4. 用户中心
- **用户资料**: 查看和修改用户信息
- **头像修改**: 上传和更新用户头像
- **密码修改**: 修改登录密码

### 5. 大文件上传
- **Hash 秒传**: 计算文件 SHA-256 校验值，服务端验证后跳过已上传文件
- **分片上传**: 大文件分片（默认 2MB）并行上传（默认 3 并发）
- **暂停继续**: 支持暂停和恢复上传
- **断点续传**: 记录上传 checkpoint，刷新页面后从断点继续
- **合并提交**: 所有分片上传完成后合并为完整文件

### 6. 全局状态管理
- **Token 状态**: 登录 token 持久化
- **用户信息**: 当前用户信息
- **侧边栏状态**: 菜单折叠状态
- **文章草稿**: 发布/编辑流程中的临时数据

---

## 项目亮点

### 1. Monorepo 架构清晰
- 应用层 (`apps/admin`) 与业务包 (`packages/article`、`packages/auth`、`packages/user`) 分离
- 通用包 (`packages/shared`) 沉淀公共能力
- 降低模块耦合，方便多人协作
- 通过 TypeScript path alias (`@article`、`@auth`、`@shared`、`@user`) 固化模块边界

### 2. 鉴权链路完整
- JWT 解析 → 状态持久化 → 路由守卫 → 请求拦截 → 401/403 处理形成闭环
- `app-store.ts` 中使用 `persist` middleware 将 token 存入 localStorage
- 根路由 loader 中校验 token 有效性
- Axios 拦截器中统一处理认证错误

### 3. Zustand 状态管理
- 替代 Context API，减少 Provider 嵌套和样板代码
- 通过 selector 精准订阅状态，避免不必要渲染
- 支持 `persist` 持久化、`devtools` 调试、`immer` 不可变更新
- 示例：`selectToken`, `selectPermissions`, `selectCollapsed`

### 4. 大文件上传体验完整
- 前端完成 Hash 校验、秒传、分片并发、断点记录和恢复上传
- 使用 `crypto.subtle.digest('SHA-256', file)` 计算文件唯一标识
- 上传进度实时计算，支持暂停/继续/重试
- 服务端验证已上传分片，避免重复上传

### 5. 首屏性能优化
- 路由级懒加载：登录、注册、首页、用户中心、文章发布等页面均通过 React Router `lazy` 动态导入
- Vite 代码分割：生产构建按 `vendor-router`、`vendor-state`、`vendor-storage`、`vendor-editor`、`vendor-utils` 等维度拆包
- 非首屏依赖延后：`react-quill`、`quill`、`localforage`、`dayjs` 从首屏移除，仅在对应业务路由加载
- 图片资源优化：登录背景图和首页图从 JPG/PNG 转为 WebP，单资源体积从约 319KB/349KB 降至约 90KB/105KB

### 6. 业务流程可恢复
- 文章发布使用三步式流程，每步数据通过 Zustand persist 写入 localforage
- 刷新页面后可以从上次的步骤继续编辑
- `_hasHydrated` 标志位确保状态恢复后再渲染组件

### 7. 构建配置统一
- TypeScript `paths` 与 Vite `alias` 对齐
- 根目录统一执行 `dev`、`build`、`lint`
- `rollup-plugin-visualizer` 生成 `stats.html` 用于分包分析

---

## 难点与具体实现

### 1. 跨模块依赖治理

**问题**: Monorepo 中各包相互引用，容易回到单体项目的 `@/` 引用方式。

**解决方案**:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@article/*": ["./packages/article/src/*"],
      "@auth/*": ["./packages/auth/src/*"],
      "@shared/*": ["./packages/shared/src/*"],
      "@user/*": ["./packages/user/src/*"],
      "@admin/*": ["./apps/admin/src/*"]
    }
  }
}

// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@article': path.resolve(__dirname, 'packages/article/src'),
      '@auth': path.resolve(__dirname, 'packages/auth/src'),
      '@shared': path.resolve(__dirname, 'packages/shared/src'),
      '@user': path.resolve(__dirname, 'packages/user/src'),
      '@admin': path.resolve(__dirname, 'apps/admin/src'),
    }
  }
})
```

### 2. 刷新时鉴权时序

**问题**: React Router loader 可能先于组件守卫执行，导致短暂展示受限页面。

**解决方案**:

```typescript
// apps/admin/src/root/root.tsx (loader)
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = getTokenFromCookie(request.headers.get('Cookie'));
  if (!token || isTokenExpired(token)) {
    throw redirect('/login');
  }
  return { user: decodeJwt(token) };
};

// packages/shared/src/api/index.ts (Axios 拦截器)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. token 过期处理

**问题**: token 过期后用户仍在操作，需要平滑处理。

**解决方案**:

```typescript
// 判断 token 是否过期
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJwt(token);
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// 请求前拦截检查
instance.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  if (token && isTokenExpired(token)) {
    message.warning('登录已过期，请重新登录');
    clearAuth();
    window.location.href = '/login';
  }
  return config;
});
```

### 4. 权限兼容性

**问题**: 新 JWT 支持权限字段，旧 token 没有权限字段时需保持兼容。

**解决方案**:

```typescript
// packages/shared/src/auth/jwt.ts
export const getJwtPermissions = (token: string): string[] => {
  const payload = decodeJwt(token);
  // 兼容新旧 token 格式
  return payload.permissions || payload.scope?.split(' ') || [];
};
```

### 5. 大文件上传可靠性

**问题**: 大文件上传中途失败需要支持断点续传。

**解决方案**:

```typescript
// packages/article/src/components/upload/large-file-upload.tsx

// 1. 计算文件 Hash
const computeFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// 2. 验证文件是否已上传（秒传）
const verifyFile = async (hash: string, filename: string) => {
  const res = await verifyLargeFileApi({ hash, filename });
  return res.data; // { uploaded: boolean, uploadedChunks: number[] }
};

// 3. 上传分片
const uploadChunk = async (chunk: Blob, hash: string, index: number) => {
  const formData = new FormData();
  formData.append('file', chunk);
  formData.append('hash', hash);
  formData.append('index', String(index));
  return uploadLargeFileChunkApi(formData);
};

// 4. 合并分片
const mergeFile = async (hash: string, filename: string) => {
  return mergeLargeFileApi({ hash, filename });
};

// 5. checkpoint 持久化
const saveCheckpoint = (hash: string, uploadedChunks: number[]) => {
  localStorage.setItem(`checkpoint:${hash}`, JSON.stringify(uploadedChunks));
};
```

### 6. 表单草稿恢复

**问题**: 文章发布流程较长，刷新后数据丢失。

**解决方案**:

```typescript
// packages/article/src/store/art-add-store.ts
const useArtAddStore = create<ArtAddStore>()(
  immer(
    devtools(
      persist(
        () => ({ current: ArticleSteps.base, article: {} as ArticleAddForm }),
        {
          name: 'art-add-store',
          storage: createStorage<ArtAddStore>(), // 使用 localforage
          onRehydrateStorage() {
            return () => {
              useArtAddStore.setState((state) => {
                state._hasHydrated = true; // 标记恢复完成
              });
            };
          }
        }
      )
    )
  )
);

// 组件中使用
const ArtAdd: FC = () => {
  const hasHydrated = useArtAddStore((state) => state._hasHydrated);
  if (!hasHydrated) return <Spin />; // 等待状态恢复
  // ... 渲染发布流程
};
```

---

## 性能优化

| 优化项 | 具体措施 | 效果 |
|--------|----------|------|
| 路由懒加载 | 登录、注册、首页、用户中心、文章发布等页面均 `lazy` 导入 | 入口 JS 体积减少约 30% |
| Vite 代码分割 | 按 `vendor-router`、`vendor-state`、`vendor-storage` 等维度拆包 | 首屏加载时间降低 |
| 非首屏依赖延后 | `react-quill`、`quill`、`localforage`、`dayjs` 延后加载 | LCP 从约 3.7s 优化至约 2.4s |
| CDN 资源优化 | 保留 React、ReactDOM、Ant Design 外链，使用 `preconnect` 与 `defer` | HTML 解析阻塞减少 |
| 图片资源优化 | 登录背景图和首页图从 JPG/PNG 转为 WebP | 资源体积降低约 70% |
| 构建分析 | `rollup-plugin-visualizer` 生成 `stats.html` | 持续观察依赖体积 |

---

## 运行方式

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 代码检查
npm run lint
```

开发地址：`http://127.0.0.1:5173/`

---

## 后端接口约定

### 大文件上传接口
- `POST /my/upload/verify`：校验文件 Hash，返回是否已上传和已上传分片
- `POST /my/upload/chunk`：上传单个分片
- `POST /my/upload/merge`：合并分片并返回文件 URL

### JWT 权限字段
```json
{
  "permissions": ["article:create", "article:list"],
  "roles": ["admin"],
  "scope": "article:create article:list"
}
```

---

## 目录规范

| 目录 | 说明 |
|------|------|
| `apps/admin` | 后台管理应用入口、路由、根布局 |
| `packages/article` | 文章、分类、发布、编辑、大文件上传 |
| `packages/auth` | 登录、注册、认证页面 |
| `packages/shared` | 通用 API、鉴权、状态、组件、工具、资源 |
| `packages/user` | 用户资料、头像、密码修改 |

---

## 测试记录

当前已完成以下本地验证：

- **TypeScript 类型检查**: 通过 `npm run build` 覆盖。
- **Vite 生产构建**: 通过 `npm run build` 覆盖。
- **ESLint 静态检查**: 通过 `npm run lint` 覆盖。
- **路由访问检查**: 本地 dev server 下访问 `/login`、`/reg`、`/`、`/home`、`/user-avatar`、`/user-info`、`/user-pwd`、`/art-add`、`/art-cate`、`/art-list`、`/art-edit/1`、`/not-found-check`，均返回前端应用入口。
- **路由配置静态检查**: 覆盖登录、注册、首页、用户中心、文章新增、分类、列表、编辑、404、403。
- **API 引用静态检查**: 覆盖认证、用户、文章、分类、大文件上传接口。
- **冗余代码检查**: 清理未引用静态资源、重复 CSS Module 产物、调试日志和临时 dev 日志。

> 受限于本地没有真实后端服务，登录、文章发布、分类增删改、用户资料修改和大文件上传的真实接口交互需要连接后端后进行端到端验证。