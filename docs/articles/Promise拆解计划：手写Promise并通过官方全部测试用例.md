大家好，欢迎来到前端研习圈的今日分享。

## 前言
本系列上期带着大家一起拆解了 **Promises/A+** 规范。从```概念，术语，约束条例```等方面了解了规范

那么本期我们要做的就是从**规范到实现**，并且通过官方的所有测试用例。为了和原生的 Promise 有所区别，我们就把这一版实现命名为 ```_Promise```。完全形态已经上传到 **github**，需要的同学自取

***提示：_Promise 仅关注具体实现，不关注成员方法具体应该是私有还是公有等设计细节***
>源码地址 ->
>https://github.com/Mumujianguang/_promise

接下来我们就进入主题，首先我们大概整理一下 **todo list**
- 定义 Promise 的状态枚举
- 定义 Promise 的类结构
- 实现构造函数
- 实现 then 方法

## 结构设计
首先，我们先定义一个枚举对象，将 Promise 的三种状态定义出来
```js
const PromiseState = {
    pending: 'pending',
    fulfilled: 'fulfilled',
    rejected: 'rejected'
}
```

然后简单设计一下类结构，同时将 **state** 初始化为 **pending** 状态

```js
class _Promise {
    state = PromiseState.pending;

    value;   
    reason;

    fulfilledQueue = [];
    rejectedQueue = [];

    constructor(executor) {}

    resolve(value) {}

    reject(reason) {}

    then(onFulfilled, onRejected) {}
}
```
因为 then 可以调用多次，所以我们设计 ```fulfilledQueue``` 和 ```rejectedQueue``` 两个数组来分别存储 then 所注册的 **成功的回调** 和 **失败的回调**

为了后续方便内部调用，这里将 **resolve** 和 **reject** 两个方法也直接定义在类上

## 实现
有了基础结构，那么我们就可以开始着手实现各个方法了。先从 ```constructor``` 开始

### constructor
回顾一下 ```Promise``` 的用法，为了方便讲解，我们把在构造 ```Promise``` 实例时传入的函数单独提出来，它的学名叫 **executor**，接收 ```resolve``` 和 ```reject``` 两个参数
```js
const executor = (resolve, reject) => {}
const p = new Promise(executor)
```
看到这儿，相信大家应该都有 ```constructor``` 的实现思路了。

但需要注意一点，为了防止 **executor** 执行时内部报错，需要 **try catch** 处理一下，并且在 **catch** 的场景直接将 ```Promise``` ```reject``` 掉
```js
constructor(executor) {
    try {
        executor(
            (value) => this.resolve(value),
            (reason) => this.reject(reason)
        )
    } catch(e) {
        this.reject(e);
    }
}
```
以上就是 ```constructor``` 的实现逻辑，接下来我们顺着这个思路继续

### resolve & reject
在执行 **executor** 时，我们将 ```resolve``` 和 ```reject``` 作为参数传了进去，我们一起回顾一下它们的作用是什么
- 接收一个 **value/reason**
- 将 ```Promise``` 的状态修改为**成功/失败**
- 把 **value/reason** 作为 **成功/失败** 回调的参数并按照注册的顺序批量执行
- **状态**一旦改变就不能再被调用

功能点很清晰，那么我们就可以一条一条去实现它们，直接看代码吧
```js
resolve(value) {
    if (this.state !== PromiseState.pending) {
        return;
    }

    this.state = PromiseState.fulfilled;
    this.value = value;

    this.fulfilledQueue.forEach((onFulfilled) => onFulfilled(value))
}
```
```js
reject(reason) {
    if (this.state !== PromiseState.pending) {
        return;
    }

    this.state = PromiseState.rejected;
    this.reason = reason;

    this.rejectedQueue.forEach((onRejected) => onRejected(reason))
}
```
到这里，我们就完成了 ```resolve & reject``` 的实现了，还是比较简单对不对，那么接下来要上强度咯

### then
首先我们思考一下 ```then``` 的作用是什么，再同步回顾一下用法

```js
const p = new Promise(resolve => resolve('done'))
p.then(
  value => console.log(value),
  reason => console.log(reason),
)
```
```then``` 的功能其实很简单，就是单纯注册 **成功/失败** 的回调，但就是看似如此简单的方法，它的实现难度却是整个 ```Promise``` 中最高的。

但不要慌，我们今天的目标就是要搞懂它，翻过那座山(~~背后还是山~~)! 

结合上期规范中所讲，我们先简单概括两点

- ```then``` 返回的是一个```新的Promise```
- 接收 **onFulfilled** 和 **onRejected** 作为参数

先写出如下代码
```js
then(onFulfilled, onRejected) {
    const p2 = new _Promise((resolve, reject) => {
      // TODO
    })
    return p2;
}
```
现在 then 的整体框架有了，我们继续思考，由于 **onFulfilled** 和 **onRejected** 的返回值会决定 ```p2``` 的状态，那么在注册之前，我们肯定需要对这两个方法做一层```包装```，将新的Promise的 resolve 和 reject 的```执行权```与 **onFulfilled/onRejected** 的返回值关联起来，由返回值的具体情况决定

也就是说 ```then``` 的其余逻辑我们需要写在 **新Promise** 的 **executor** 中。同时还需要注意的是，在 **executor** 中我们就需要访问 ```p2```，但 p2 是在 **executor** 执行完毕之后才被赋的值，直接访问肯定会报错
```js
then(onFulfilled, onRejected) {
    const p2 = new _Promise((resolve, reject) => {
        console.log(p2) // Uncaught ReferenceError: Cannot access 'p2' before initialization
    })
    return p2;
}
```
> Uncaught ReferenceError: Cannot access 'p2' before initialization

如上代码所示，我们会得到一个与预期一致的报错，怎么规避呢？其实很容易解决，放到异步任务里面去执行不就好了吗，这里我们用 ```queueMicrotask``` 来实现
```js
then(onFulfilled, onRejected) {
  const p2 = new _Promise((resolve, reject) => {
    queueMicrotask(() => {
      console.log(p2) // _Promise {}
    })
  })
  return p2;
}
```
搞定，现在就能正常访问 ```p2``` 了

那么接下我们继续按照**规范**的约束条例给 ```then``` 的实现添砖加瓦，先梳理一下大致要做的事情

- 给 **onFulfilled** 和 **onRejected** 添加兼容逻辑（参考条例 **2.2.1** & **2.2.7.3** & **2.2.7.4**）
- 包装 **onFulfilled** 和 **onRejected**，它们的返回值将决定 ```p2``` 的 resolve 和 reject 如何执行。因此这里我们再抽象一层 **包装器** 函数(```wrapCallback```)出来，由这个函数来返回包装后的 **onFulfilled**（```resolveCallback```） 和 **onRejected**（```rejectCallback```）
- **判断**当前 ```Promise``` 的状态是否已经确定，是的话则直接调用```resolveCallback``` 或 ```rejectCallback```，否则将它们**注册**到各自的回调队列中

梳理完毕，就敲代码实现吧
```js
then(onFulfilled, onRejected) {
  const p2 = new _Promise((resolve, reject) => {
    queueMicrotask(() => {
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : () => resolve(this.value);
      onRejected = typeof onRejected === 'function' ? onRejected : () => reject(this.reason);

      const resolveCallback = this.wrapCallback(
        p2,
        onFulfilled,
        resolve,
        reject
      );
      const rejectCallback = this.wrapCallback(
        p2,
        onRejected,
        resolve,
        reject
      );

      if (this.state === PromiseState.fulfilled) {
          resolveCallback(this.value);
          return;
      }

      if (this.state === PromiseState.rejected) {
          rejectCallback(this.reason);
          return;
      }

      this.fulfilledQueue.push(
          resolveCallback
      )

      this.rejectedQueue.push(
          rejectCallback
      )
    })
  })

  return p2;
}
```

至此 ```then``` 方法我们就已经实现啦，完结撒花！最难的部分也不过如此...

等等，不太对劲，```then``` 是实现完了，但我们刚刚又引入了一层```包装器``` 还没实现呢，还得继续呀各位~

顺便提醒一下大家，还记得上期我们留的一个大坑吗，没错就是规范中的```约束条例2.3``` 所描述的 **Promise Resolution Procedure** 流程，但我们现在不是只剩下 ```wrapCallback``` 了吗，所以这个处理流程只能在 ```wrapCallback``` 中实现了，为了和规范保持一致，我们把 **Promise Resolution Procedure** 流程单独用一个方法来实现，就取名叫 ```resolutionProcedure``` 吧

这样一来 ```wrapCallback``` 的实现就异常简单了，但注意 ```then``` 的回调需要放在 **micro task** 中去执行，这里我们还是用 ```queueMicrotask``` 来实现；同时还是需要考虑回调内部执行报错的场景，所以加上 **try catch** 来捕获异常，并在异常的**case**，触发 ```reject```

基于上面的分析，我们就能敲出以下代码了
```js
wrapCallback(promise2, callback, resolve, reject) {
  return (arg) => queueMicrotask(() => {
    let x;

    try {
        x = callback(arg);
    } catch (error) {
        reject(error);
        return;
    }

    this.resolutionProcedure(promise2, x, resolve, reject)
  })
}
```
OK，现在 ```wrapCallback``` 实现完毕！

终于，我们来到了最后一个方法 ```resolutionProcedure```，还记得这个流程是做什么的吗，先抛开其他细节，此流程主要是为了处理 ```x``` 是一个 ```thenable``` 的场景，以支持第三方实现的 **类promise**，满足```互操作性```的要求。

好吧，纠正一下我之前的措辞，在整个 ```Promise``` 实现中 ```resolutionProcedure``` 才是最难的（手动狗头）

那么接下来我们还是根据规范 ```条例2.3``` 来梳理出需要实现的逻辑点

1. 因为这里面存在**自调用**，所以当 ```p2``` 与 ```x``` 是同一个对象时，为了防止死循环，需要直接退出后续处理并触发 ```reject```
2. 当 ```x``` 是一个 Promise 时，则直接将 ```resolve & reject``` 包装后注册到 ```x``` 上，由 ```x``` 的最终状态来决定 ```p2``` 的状态
3. 当 ```x``` 是一个普通对象或者方法时，如果 ```x``` 存在 ```then``` 方法，则将其视为 ```thenable```。注意，这里需要考虑 ```then``` 是一个 **getter** 的情况，也就是意味着在**访问** ```x.then``` 时也可能会报错，因此获取 then 的过程也需要 **try catch** 包裹一下，报错的情况直接触发 ```reject```。后续处理的目标和**第2点**一致，还是遵循 ```resolve``` 和 ```reject``` 只能触发一次的原则，需考虑 ```then``` 执行报错的场景，这里就不做赘述了
4. 以上条件均不满足时，则将 ```x``` 作为 ```value``` 触发 ```resolve```

接下来就是编码时间~

```js
resolutionProcedure(promise2, x, resolve, reject) {
    if (promise2 === x) {
        reject(new TypeError('promise2 === x'));
        return;
    }

    if (x instanceof _Promise) {
        x.then(
            (value) => this.resolutionProcedure(promise2, value, resolve, reject),
            (reason) => reject(reason)
        );
        return;
    }

    if (
        x !== null &&
        typeof x === 'object' ||
        typeof x === 'function'
    ) {
        let then;

        try {
            then = x.then;
        } catch (error) {
            reject(error);
            return;
        }

        if (typeof then === 'function') {
            let isCalledResolvePromise = false;
            let isCalledRejectPromise = false;
            const resolvePromise = (value) => {
                if (isCalledResolvePromise || isCalledResolvePromise) {
                    return;
                }

                isCalledResolvePromise = true;
                this.resolutionProcedure(promise2, value, resolve, reject)
            }
            const rejectPromise = (reason) => {
                if (isCalledRejectPromise || isCalledResolvePromise) {
                    return;
                }

                isCalledRejectPromise = true;
                reject(reason)
            }
            try {
                then.call(
                    x,
                    resolvePromise,
                    rejectPromise
                )
            } catch (error) {
                if (
                    !isCalledRejectPromise &&
                    !isCalledResolvePromise
                ) {
                    reject(error)
                }
            }
            return;
        }
    }

    resolve(x);
}
```

至此，我们的 ```_Promise``` 就全部编码完毕，那它能否像原生的 ```Promise``` 正常工作呢，赶紧去测试一下吧！

当然也不用大家去手写测试用例了，官网提供了一个 ```npm``` 包```promises-aplus-tests```
> github地址 -> https://github.com/promises-aplus/promises-tests

根据官方的文档描述，要执行测试用例我们还需要导出一个标准结构

![](http://mmjg.site/imgs/ace69cdb-d442-447c-a521-55f037429510.webp)

那么我们就按照要求导出如下对象
```js
module.exports = {
    resolved(value) {
        return new _Promise((resolve) => resolve(value))
    },
    rejected(reason) {
        return new _Promise((_, reject) => reject(reason))
    },
    deferred() {
        const ret = {};

        ret.promise = new _Promise((resolve, reject) => {
            ret.resolve = resolve;
            ret.reject = reject
        })

        return ret;
    }
}
```
值得一提的是，```deferred``` 是不是与 ```Promise.withResolvers``` 的功能如出一辙

回到正题，安装```promises-aplus-tests```后，我们根据官网文档的测试指南配置一下```测试指令```
```
// package.json
...
"scripts": {
  "test": "promises-aplus-tests ./core/Promise.cjs"
},
...
```

接下来就可以测试了，在控制台输入
```sh
pnpm run test
```

OK，872个用例全部通过

![](http://mmjg.site/imgs/68cd375f-4791-47e0-b86a-2b3d1347f387.webp)

## 写在最后
到这里 ```Promise拆解计划``` 终于完成，这个系列的阶段性目标也达成了，希望这个系列能真正帮助到大家，从此不再受 ```Promise``` 的毒打~

那么这期就到这里，如果觉得有用的话记得```点赞加关注```哦！

我们下期见！