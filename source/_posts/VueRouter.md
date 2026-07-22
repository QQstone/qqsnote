---
title: Vue Router
date: 2025-08-12 11:14:17
tags:
- vuejs
---

<!-- interview-supplement-start -->
## 面试补充（2026-07-22）

> 本节为后续补充，用于资深软件工程师基础面试复习；原文章此前只有标题信息。

### Router 负责客户端导航，不负责服务端授权

Vue Router 将 URL 映射为组件树，并协调导航、历史记录、守卫和滚动等客户端行为。它能改善单页应用的页面组织和访问体验，但不能建立安全边界：

- 隐藏菜单、拒绝进入页面和不注册某条路由，只能减少客户端入口。
- 用户仍可绕过页面直接调用 API，服务端必须根据可信身份再次执行认证、授权和资源范围检查。
- 路由 `meta` 是前端约定的数据，不是不可篡改的权限声明。

面试中应先把“认证是谁”“授权能做什么”“前端路由是否可见”三个问题分开。

### Hash 与 HTML5 History

`createWebHashHistory()` 使用 URL 的 `#` 之后部分。fragment 不会作为 HTTP 请求路径发送给服务器，因此静态服务器通常不需要额外回退规则，但 URL 不够自然，也不适合依赖服务端理解完整路径的场景。

`createWebHistory()` 使用浏览器 History API，URL 更接近普通多页站点。直接访问或刷新 `/devices/42` 时，浏览器会向服务器请求这个路径，因此部署必须配置 SPA fallback：未知的前端路由返回入口 HTML；真实静态资源、API、下载文件和健康检查路径不能被错误重写为入口页面。

选择哪种模式不是 Vue 性能问题，而是 URL、部署环境、服务端配置和兼容性的取舍。

### 路由记录、参数、嵌套与懒加载

一条路由记录通常包含 `path`、`component`、`children`、`name`、`meta` 和 props 映射。需要注意：

- 动态参数 `/devices/:id` 表示同一类页面的不同资源，不应为每台设备注册一条静态路由。
- 嵌套路由描述 URL 与 UI 的嵌套关系，父组件需要提供 `<RouterView>` 作为子路由出口。
- 路由组件使用动态 `import()` 可以按页面拆包，但拆得过细会增加请求和调度开销，应结合访问路径和产物分析决定。
- 优先通过 `props` 将参数传给页面组件，可减少组件对全局 `route` 对象的耦合，便于复用和测试。
- 参数来自 URL，始终是外部输入。即使 TypeScript 给它声明了类型，也仍要校验格式和业务范围。

### 导航守卫的职责分层

守卫适合完成导航决策，而不适合塞入所有页面业务：

- 全局守卫处理登录态初始化、通用权限入口、租户或空间切换等跨页面规则。
- 路由独享守卫处理少数路由特有的进入条件。
- 组件内或 Composition API 守卫处理未保存编辑、当前资源切换和组件上下文相关行为。

守卫应返回导航结果或 Promise。Vue Router 4 中通常不再混用旧式 `next()` 回调，以免一次导航中重复调用或遗漏调用。不要为了面试机械背完整执行顺序；更重要的是能解释每类逻辑属于全局、路由还是组件，以及异常和取消如何收敛。

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/devices/:id',
      component: () => import('./views/DeviceDetail.vue'),
      meta: { requiresAuth: true }
    },
    { path: '/login', component: () => import('./views/LoginView.vue') }
  ]
})

router.beforeEach((to) => {
  const signedIn = Boolean(localStorage.getItem('access_token'))
  if (to.meta.requiresAuth && !signedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})
```

这里使用 `localStorage` 只是为了突出守卫返回值，并不是完整的安全令牌存储方案。真实系统还需考虑 XSS、Cookie 属性、令牌刷新、退出失效和服务端会话策略。无论前端如何保存状态，设备 API 都必须在服务端重新鉴权。

### 登录、角色与动态路由

常见流程是：应用启动后恢复登录态，获取当前用户的能力集合，再生成菜单或通过 `router.addRoute()` 注册可访问页面。这个方案可以减少无权限页面暴露并支持插件式模块，但要处理：

- 刷新页面时，首次路由匹配可能早于权限路由加载，需要一个明确的初始化屏障。
- 退出登录或切换租户时要移除旧动态路由、缓存页面和领域状态，避免身份串线。
- 不要直接把后端返回的组件路径交给任意动态导入；应通过受控映射表把权限标识映射到本地组件。
- 菜单、路由和按钮最好消费同一份能力模型，减少三套条件逐渐不一致。

即使这些步骤全部正确，前端仍只完成体验层控制。服务端授权才决定用户能否读取某台设备、下发某类命令或查看某个空间的数据。

### 组件复用、请求竞态与缓存

从 `/devices/1` 导航到 `/devices/2` 时，路由记录和组件类型没有变化，Vue Router 可能复用同一组件实例，`mounted` 不会再次执行。页面应监听参数或使用 `onBeforeRouteUpdate()` 重新加载资源。

```ts
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const device = ref<unknown>()
let controller: AbortController | undefined

watch(
  () => String(route.params.id),
  async (id) => {
    controller?.abort()
    controller = new AbortController()

    const response = await fetch(`/api/devices/${id}`, {
      signal: controller.signal
    })
    device.value = await response.json()
  },
  { immediate: true }
)

onBeforeUnmount(() => controller?.abort())
```

真实代码还要区分主动取消和网络错误，并在写入状态前确认请求仍对应当前资源。若不能取消底层请求，可使用递增请求编号忽略迟到结果。

`KeepAlive` 缓存的是组件实例，不是 HTTP 响应缓存。缓存路由页后需要考虑：数据何时失效、订阅在 `activated`/`deactivated` 时如何暂停恢复、缓存上限和退出登录时怎样清理。用 `:key="$route.fullPath"` 强制每个 URL 生成实例虽然简单，却可能扩大缓存并掩盖状态所有权问题。

导航也可能被守卫取消、重定向或判定为重复。调用 `router.push()` 后若业务需要区分结果，应等待返回的 Promise，并用 Vue Router 提供的 navigation failure API 判断，而不是假设 URL 一定已经改变。

### 常见追问与回答边界

**History 模式刷新为什么出现 404？**

客户端导航时由 Router 接管 URL；刷新时是服务器直接收到深层路径。服务器若没有对应文件或 SPA fallback 就返回 404。修复时要排除 API 和静态资源路径，不能把所有 404 都改成 HTML 200。

**路由守卫能否防止越权？**

不能。它只能控制当前客户端应用如何导航。攻击者可以修改前端状态或直接请求 API，服务端必须执行授权。

**为什么换了路由参数却没有重新请求？**

相同路由记录通常复用组件实例，依赖 `mounted` 的加载逻辑不会重跑。应监听目标参数或使用路由更新守卫，并处理旧请求的取消或失效。

**动态路由是否等于动态权限？**

不等于。动态路由是客户端页面注册机制；权限模型来自可信后端，真正的资源和操作授权仍由服务端实施。

<!-- interview-supplement-end -->
