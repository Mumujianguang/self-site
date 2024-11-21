大家好，欢迎来到前端研习圈的今日分享。上期跟大家浅析了为什么要了解 ```Promises/A+``` 规范

![](https://files.mdnice.com/user/56690/92ba6c8f-7b13-4424-8149-e383579c0bc6.png)

今天我们就来拆解一下 ```Promises/A+```，从规范入手，重塑对 ```Promise``` 的理解, 接下来直接进入正题~

## 什么是 Promise
首先，我们看一下```规范```中如何定义 ```Promise``` 

![](https://files.mdnice.com/user/56690/22f964cb-f63b-4923-8d79-7929147e8379.png)

可以看到，规范中对 Promise 的描述是```一个异步操作的最终结果```。我们可以通过 ```then``` 方法注册回调来接收它的最终的 ```value``` 或者失败的 ```reason```。

这也是为什么在很多有关 Promise 的介绍中把它称为 ```状态机``` 的原因。由此可见，规范也并非处处都是晦涩难懂的黑话，定义还是非常简洁明了的。

## 开放的标准
同时 ```A+``` 规范还是很开放的一套标准,在前言中，有这样一段描述

![](https://files.mdnice.com/user/56690/a6701abc-dd56-4c2b-a375-cf2b088a5f9d.png)

规范并没有约束 ```创建``` 一个 Promise 的方式，也没有限制将一个 Promise 的状态修改为 ```成功``` 或者 ```失败``` 的方式，而是选择聚焦于提供一个可互用的 ```then``` 方法。

如何理解这个 ```可互用``` 呢，其实也很简单，假设有两个基于 ```Promises/A+``` 实现 ```A``` 和 ```B```，针对 ```A``` 创建的 promise 的 then 处理逻辑，放在 ```B``` 上也同样适用，这也就意味着，这套规范会为 ```then``` 增加很多约束条件，以实现 ```可互用```。

实际上也确实如此，```A+``` 中大部分的条例其实都是在规定 ```then``` 方法应该如何实现

## 约定俗成的术语
在进入 ```A+``` 的为 ```Promise``` 制定的需求列表之前，我们先了解一下其中的 ```术语```

![](https://files.mdnice.com/user/56690/52c2e6aa-cc1e-4896-8d77-8f88a747ff40.png)

关于 ```promise``` 和 ```thenable``` 的描述大家可能会有点疑惑，为什么都是一个具备 ```then``` 方法的```对象```（函数本质上也是对象），却要叫两个名字？ 其实很好解释，```promise``` 是官方实现的叫法，而 ```thenable``` 是非官方实现的统称（社区实现的叫法）

```value```, ```reason```, ```exception``` 规范中说得很明确，这里就不做多余的阐述了

## 状态的处理细则
规范中规定了一个 promise 的状态必须为 ```pending```，```fulfilled```,```rejected``` 三者之一

![](https://files.mdnice.com/user/56690/402b36f6-4974-4a35-9b45-281dfe36e779.png)

处在 ```pending``` 时, 可以变为 ```fulfilled```,```rejected``` 两者之一

变为 ```fulfilled``` 时，状态不能再改变，同时必须产出 ```value```，且 ```value``` 也不能被改变

变为 ```rejected``` 时，状态不能再改变，同时必须产出 ```reason```，且 ```reason``` 也不能被改变

说简单一点，promise 的状态只能被改变一次，要么成功要么失败, 有点不成功便成仁的味道了。

## then 方法
关于 ```then``` 描述中, 规定了它需要接收两个参数

![](https://files.mdnice.com/user/56690/8f327561-1a30-4f05-97e4-b7be3e3fc8b5.png)

这里```onFulfilled``` 和 ```onRejected``` 也就是我们日常说的 成功的回调 和 失败的回调

### 约束条例
```onFulfilled``` 和 ```onRejected``` 不是函数的场景将直接被忽略
![](https://files.mdnice.com/user/56690/39a52c63-5a15-4199-bd7b-18c08e5cc027.png)

---

当 ```onFulfilled``` 是一个函数，它必须在 promise 变为 ```fulfilled``` 后调用，同时把 ```value``` 作为参数，且只能调用一次
![](https://files.mdnice.com/user/56690/442d9a21-460d-46ba-a869-8932a35202f9.png)

---

当 ```onRejected``` 是一个函数，它必须在 promise 变为 ```rejected``` 后调用，同时把 ```reason``` 作为参数，且只能调用一次
![](https://files.mdnice.com/user/56690/efc5d677-ad2b-482f-ac36-d394db618daa.png)

---

```onFulfilled``` 和 ```onRejected``` 必须在平台代码的执行上下文结束之后调用。

![](https://files.mdnice.com/user/56690/75a3b293-8d5b-41fc-b830-ae558f892323.png)

这句话怎么理解呢，假设在 ```executor``` 中同步执行了 ```resolve``` 或 ```reject```，成功/失败的回调也必须等同步逻辑全部执行完后，才能执行。这也就是为什么 ```onFulfilled``` 和 ```onRejected``` 会被放置在 ```micro task``` 中执行，而不是立即执行的原因
```js
const p = new Promise((resolve, reject) => {
  resolve(3)
  console.log(1)
})
console.log(2)
p.then((value) => {
  console.log(value)
})
// 输出 1 2 3
```

---

```onFulfilled``` 和 ```onRejected``` 必须作为普通函数调用，也就是说不考虑内部 this 的指向
![](https://files.mdnice.com/user/56690/6b15811a-1c48-40f1-bbe3-a529d9c782d1.png)

---

当 ```then``` 在同一个 promise 上被调用多次，所注册的回调需要在 promise 变为 ```fulfilled``` 或 ```rejected``` 后，按照注册的顺序执行
![](https://files.mdnice.com/user/56690/c04776c4-47a1-4bac-a586-7f98f8e6c477.png)

---

```then``` 方法的返回值，必须是一个新的 promise```（promise2）```，这也就是 promise 能够被 ```链式调用``` 的原因

![](https://files.mdnice.com/user/56690/e2ebc781-9fed-44fc-b9d9-28facd4a60ef.png)

```onFulfilled``` 和 ```onRejected``` 的返回值 ```x```，需要交给一个名为 ```Promise Resolution Procedure``` 的流程去处理，主要是考虑 ```x``` 还是一个 promise 的场景，因此需要设计一个```递归```流程来处理，这个流程的条例在下文会讲

```onFulfilled``` 和 ```onRejected``` 如果执行报错，抛出异常 ```e```，那么 新返回的```promise2``` 的状态将变为 ```rejected```

当 promise1 状态变为 ```fulfilled``` 且 ```onFulfilled``` 不是一个函数时，promise2 将以相同的 ```value``` 变为 ```fulfilled```

当 promise1 状态变为 ```rejected``` 且 ```onRejected``` 不是一个函数时，promise2 将以相同的 ```reason``` 变为 ```rejected```

### Promise Resolution Procedure
最后就是上文中提及的 ```Promise Resolution Procedure``` 流程，这是一个抽象出来的概念并非某个具体实现。它会接收一个两个参数，一个 ```promise``` 和一个 ```x```

![](https://files.mdnice.com/user/56690/d5a3158c-bf70-4c0b-be92-a0e6c2155e29.png)

这里规范中提到，当 ```x``` 是一个 ```thenable``` 时, 会尝试让 ```promise``` 使用 ```x``` 最终的状态

看个例子吧
![](https://files.mdnice.com/user/56690/c972ecdf-61cb-42cd-876c-65442c11fca1.png)

结合例子就不难发现，这样做的意义是保证 ```then``` 方法返回的 ```p2``` 的状态是由 ```p1``` 的 ```onFulfilled``` 或 ```onRejected``` 的返回值的状态决定的。

接下来我们来看整体流程的条例

当```promise``` 和 ```x``` 的引用是同一个对象，则将 promise 置为 ```rejected``` 并抛出 ```TypeError``` 作为失败的 ```reason```

![](https://files.mdnice.com/user/56690/9fac873d-a234-4e1e-a565-f71c6c2ed84d.png)

也就是如下场景
![](https://files.mdnice.com/user/56690/97b621a8-08ce-448e-a0ca-95c89368424d.png)

---

当 ```x``` 是一个 ```promise```，则会根据其状态做不同的处理

![](https://files.mdnice.com/user/56690/95a60a9f-ac9c-480d-86b9-730690415a7d.png)

如果 ```x``` 处于 ```pending```，那么 ```promise``` 需要等 ```x``` 成功或失败后再同步其状态；如果 ```x``` 已经成功或失败，那么 ```promise``` 则直接同步其状态

---

当 ```x``` 是一个普通对象或者函数时，这部分场景是 ```A+``` 中最复杂的部分，考虑到单纯用文字描述可能会很抽象，这部分将放置在下期的 ```源码实现篇``` 中着重拆解
![](https://files.mdnice.com/user/56690/86334cad-250f-4850-ad38-0089119b59ed.png)

有能力的同学可以尝试直接原文

---

当 ```x``` 既不是一个普通对象也不是函数时，```promise``` 和 ```x``` 都将直接被置位 ```fulfilled```
![](https://files.mdnice.com/user/56690/7d85ac4e-389e-4be1-b8da-647acce7d229.png)

---

以上就是 ```Promises/A+``` 规范中全部条例了

## 结尾
[-> Promises/A+ 原文](https://promisesaplus.com/)

经过对规范的拆解后，相信大家对 ```promise``` 的认识又有了不小的提升。不过还保留了一个大坑等着下期来补```（条例2.3.3）```。下期我们将从 ```规范 -> 实现``` 来切实的感受 promise 的工作流程

最后希望大家每天进步一点点，我们下期见~

