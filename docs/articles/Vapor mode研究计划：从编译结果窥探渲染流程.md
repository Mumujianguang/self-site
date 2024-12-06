大家好，我是 **木木剑光**，欢迎来到「Vapor mode 研究计划专栏」

在上期「[Vapor mode研究计划：又回到 vue1.0 版本无虚拟DOM的细粒度绑定，是进步还是倒退？](https://juejin.cn/post/7348464590160707636) 」的分享中我们回顾了 Vue 的整个迭代过程，从最初的「细粒度」绑定，到引入「虚拟DOM」的原因，再到现在的「Vapor mode」出现的**必然性**，一一进行了简要分析，错过的同学可以先传送回去补一下～

经过前面的铺垫，相信大家对 **Vapor mode** 都有了基本的了解，但可能还是不够具象，因为日常开发过程中使用 Vue 技术栈的同学对「虚拟DOM」的版本有着实打实的**体验**，但对 **Vapor mode** 还只在理论阶段

那么接下来，我们进入本期的主题，从 **Vapor mode** 的「编译产物」入手来了解一下「无虚拟DOM」的版本究竟是如何工作的

## 插值表达式如何渲染和更新

我们首先来到 [Vapor mode 的演练场](https://vapor-repl.netlify.app/)

![](http://mmjg.site/imgs/c91806c0-aec9-421d-97f1-5e1bec4e5d18.webp)

从最简单的模版 **插值表达式** 开始
- 定义一个 **msg** 的响应式变量
- 在模版中使用

```html
<script setup lang="ts">
import { ref } from 'vue'
const msg = ref('Hello World!')
</script>
<template>
  <h1>{{ msg }}</h1>
</template>
```

我们接下来着重看编译结果中的 **render** 函数

```ts
import { renderEffect, setText, template } from 'vue/vapor';
const t0 = template("<h1></h1>")
function render(_ctx) {
  const n0 = t0()
  renderEffect(() => setText(n0, _ctx.msg))
  return n0
}
```

在 **render** 函数中用到了 **vapor** 模块中的 3 个方法，根据命名和使用方式我们大概可以猜测
- `template`：用于创建 **DOM** 元素
- `renderEffect`：收集一个副作用函数，依赖的「响应式」状态变化时重新执行，功能类似 **watchEffect**
- `setText`：更新 **DOM** 元素的内容

也就是如下 **流程:**

![](http://mmjg.site/imgs/422b1723-00d2-4b94-934a-43b43cf44c5d.webp)

但事实是不是和我们推断的一致呢，接下来我们到 **vapor** 模块的源码中去求证一下

### template
**template** 方法的实现在 `packages/runtime-vapor/src/dom/template.ts` 中

![](http://mmjg.site/imgs/480c68e5-1dca-4a75-a779-cd858b2eff43.webp)

上图中我们可以看到 **template** 的实现其实非常简单：

- `入参:` 接收一个 **html** 字符串
- `node变量:` 用于缓存首次创建 **DOM** 后的结果
- `create函数:` 基于传入 **html** 字符串生成 **DOM** 元素并返回
- `返回值:` 返回一个函数用于获取 **DOM** 元素的 **clone** 版本

到这里我们就可以对 **template** 方法下结论了

它的作用很简单，就是将 **html字符串** 转为 **真实的DOM元素** 并缓存起来，最终返回一个「getter」来获取 DOM 的副本

这里返回副本也很好理解，目的是为了防止外部对 **原始DOM** 进行修改，保证每次调用「getter」返回结果的 **一致性**

### setText
接下来我们来看与更新 **DOM** 相关的 **setText** 方法，它的实现在 `packages/runtime-vapor/src/dom/prop.ts` 文件中

![](http://mmjg.site/imgs/b805fa6f-f524-40b1-96e6-52e3137d382b.webp)

**setText** 方法的实现也同样很简单，流程大致是这样的：

- 预处理传入的 **values**，通过 **toDisplayString** 方法将其转为可展示的字符串
- 通过 **recordPropMetadata** 方法获取上次的 **渲染值**
- 新旧值进行对比，值不同则更新 **DOM** 元素

「**toDisplayString**」方法实现如下，核心就是兼容处理 **values** 中的 **非字符串** 类型，会将引用类型（数组，对象）序列化为可展示的字符串

![](http://mmjg.site/imgs/dfdab582-a9ac-40d6-b5c2-0bc67790b24d.webp)

「**recordPropMetadata**」方法实现如下

![](http://mmjg.site/imgs/7f61f090-5d40-4498-b801-c3f3694f0aa9.webp)

通过阅读上面的代码我们可以知道，**DOM** 元素上次渲染值被存储在元素的 **$$metadata** 属性上，其实从元素内容中也能取到内容值，这里为什么需要单独再存在一个属性上，大家可以思考一下

### renderEffect
接下来我们来看「响应式」的部分是如何实现的，也就是上面说到的 **renderEffect** 方法

由于源码篇幅过大并且涉及到很多前置概念，大家直接阅读可能会一头雾水，我们先浅析一下响应式中「依赖收集」的实现方案

这里用类似的 **watchEffect** 来举例，大家都知道，在 **Vue3** 中所谓「响应式数据」其实是 **Proxy** 代理后的数据，通过 **Proxy** 提供的 **get，set** 两个陷阱函数来实现对「数据访问」和「数据修改」行为的追踪，这样就能悄无声息的对「依赖」进行 **收集** 与 **通知** 了

那么 **依赖** 又是什么呢，这个概念对很多初学的同学来说可能有点 **抽象**，因为大家对「依赖」从来没有过 **具象** 的体会

下面我用 **watchEffect** 的一个小例子来说明「依赖」的 **实体** 到底是什么

```ts
const msg = ref('Hello World!')
// 这就是依赖
const dep = () => {
  console.log(msg.value)
}
watchEffect(dep);
```

在上面的 demo 中对 **msg** 来说，**dep** 函数就是它的依赖，依赖收集的过程大致如下

当 **dep** 函数首次被运行时，访问 **msg.value** 会触发 **msg** 的「getter」，进而将 **dep** 函数收集起来。这里有的同学可能会疑惑，在 **msg** 的「getter」中是如何获取到 **dep** 的呢

```js
export let activeEffects = [];
function watchEffect(dep) {
  activeEffects.push(dep)
  dep()
  activeEffects.pop()
}
watchEffect(() => {
  const current = activeEffects.at(-1)
})
```

其实很简单，通过上面的示例相信大家已经理解了，只需要在 **watchEffect** 中，在执行 **dep** 之前将它推入到一个 **栈** 中存储起来，当 **dep** 执行完之后再将其出栈，这样能实现在 **dep** 函数的「执行上下文」中，任何逻辑都能访问到当前正在执行的 **dep** 了

![](http://mmjg.site/imgs/688de88e-a2d6-40b1-9ee7-5a53038a2cac.webp)

同时也能够解释，为什么在 **dep** 函数中，我们在 **异步逻辑** 中修改「响应式数据」无法得到预期的结果，因为 **Vue** 在实现上仅支持对 **同步逻辑** 的「依赖收集」。这里可能有同学会说，把 **watchEffect** 变成一个异步函数，**await dep()** 不能实现对 **异步逻辑** 的「依赖收集」了吗

事实上这样是可行的，但由于 **await** 的传染性，仍然需要「开发者」配合才能实现，某种程度上会提升「开发者」的 **心智负担**，因为这不是 **Vue** 单纯通过框架上的处理就能实现的 **特性**。并且一旦开放了这个口子，可能会出现很多未知的场景，这对框架来说也是一种挑战

## 总结
通过上面的分析，详细大家对 **vapor mode** 运行时中 **插值表达式** 的「工作机制」都有一定的认知了。我们再总结一下

包含 **插值表达式** 的元素会在 **render** 函数中被编译成 3 部分

- 由 **template** 返回获取 **DOM** 元素的函数
- 在 **renderEffect** 中调用 **setText** 方法来更新元素插值
- 返回 **DOM** 元素渲染视图

以上就是本期的全部内容，下期我们继续解锁更多 **vapor mode** 的实现细节，如果觉得这种分析模式有帮助，可以点个赞支持一下

这里是 **木木剑光**，我们下期见～