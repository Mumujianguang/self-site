大家好，我是 **木木剑光** , 今天我们分享一个比较冷门的需求场景的解决方案 - **动态public path**

## 什么是 public path

**public path** 是 webpack 配置中的一个概念（vite 中叫 base），它的作用是为了让开发者可以自定义 **web应用** 的访问**「路径前缀」**

假设现在我们有这样一个应用的访问路径
```
https://localhost:3000/prefix/app
```
那么应用的 baseUrl 则是 **/prefix/app**

在静态 **public path** 的场景下，我们只需要在构建工具中进行配置即可，这里用 vite 举例
```ts
export default defineConfig({
  base: '/prefix/app',
  ...
})
```

这样一来，在构建出的 js，css 等资源中都会用 **「绝对路径」** 的方式去加载

![](http://mmjg.site/imgs/1ce49c71-121e-40b3-8120-36c1398dda0a.webp)

如果存在异步加载的 **chunk**，也会用 **「绝对路径」** 进行加载，这里就不进行演示了

## 动态 public path
现在我们有这样一个需求，应用的 **baseUrl** 的前缀在部署上线后，可以通过配置进行修改，要求在不重新打包的情况下实现

也就是说我们的 **public path** 这项配置不能在「编译时」确定了

熟悉 webpack 的同学都知道，webpack 的运行时在 window 对象上暴露了 [__webpack_public_path\_\_](https://webpack.docschina.org/guides/public-path/) 来辅助开发者实现动态 **public path**

vite 也提供了实验性的选项 [experimental.renderBuiltUrl](https://cn.vitejs.dev/guide/build.html#advanced-base-options) 来做这件事儿

```ts
experimental: {
  renderBuiltUrl(filename, { hostType }) {
    if (hostType === 'js') {
      return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
    } else {
      return { relative: true }
    }
  },
},
```

但我们稍微实操一下就会发现，上述的功能特性只能实现在 js 中加载 css，js 时，使用动态 **public path**

而我们入口 html 中生成的 **「静态标签」**，构建工具是没有帮我们做处理的，因为这不同于上面的场景，只需要在加载资源前，动态拼接资源路径前缀即可，html 本身是 **静态** 的，没有在运行时执行逻辑的能力

### 方案1（动态标签）

因此对于 html 文件，要实现动态 **public path** 我们只能通过 **script** 标签，动态去生成 css，js 的资源标签

但这种方案明显的弊端就是会我们不能享受浏览器 **prefetch，preload** 等性能优化策略，一定程度上会增加 **「首屏加载时间（FCP）」**

### 方案2（SSR）
既然 html 中存在动态的部分，那么我们也可以选择上 **服务端渲染（SSR）** 来处理这个问题，让动态的「资源路径」在服务端拼接完成后，再返回给浏览器进行渲染

这个方案则需要更高一点的技术成本，需要结合整体的产品架构进行考虑，如果仅仅用于解决这个问题而选择 **SSR**，性价比其实蛮低的

## 兜底方案
如果上不了 **SSR**，那么我们就只能选择 **方案1** 进行兜底，但 **方案1** 目前市面上并没有现成的解决方案，也就是我们上面所说的「动态标签」

这个方案具体的思路如下：

- 构建工具打包完成后，通过插件对 **「入口html」** 文件进行二次处理
- 将 html 中的所有资源标签（link，script）剔除掉，转换为一段「初始化脚本」
- 通过「初始化脚本」动态生成 link，script 标签

为了演示这个方案，我写了一个 vite 插件实现了上述功能 [vite-plugin-html-public-path](https://www.npmjs.com/package/vite-plugin-html-public-path)

使用方式如下
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import htmlPublicPath from 'vite-plugin-html-public-path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    htmlPublicPath({
      // it will be injected to head of script tag
      initialPrefixScript: `
        const prefix = window.__PREFIX__ = "/customPrefix";
        return prefix;
      `
    })
  ],
})
```

插件中开放了一个 **initialPrefixScript** 配置，值是一段 js 脚本，用于动态获取 **public path** 并返回，同时这段脚本中也支持使用 **async/await** 来满足 **异步** 的需求场景

## 最后
有兴趣的同学可以试用一下，有任何与本期主题相关的问题欢迎讨论

vite 插件相关的问题可以反馈到 **github** 仓库
> https://github.com/MMJG-Team/vite-plugin-html-public-path

