大家好，我是木木剑光，本期分享一个 **「列表元素」** 载入动画的实现思路

## 前言

随着前端技术的不断发展以及 **设计元素** 不断的多元化，我们现在日常看到网页中已经有了非常多的 **交互动画** ，目的是为了增加用户的 **视觉反馈**，进而提升使用体验

而现代前端的各种 **组件库** 层出不穷，我们在工作开发中为了节省开发时间，往往会选择现成的库，很少会涉及到需要手动 **造轮子** 的场景（当然排除某些在 基建组 工作的同学），长此以往，大家可能就会发现，自己逐渐变成了一个搬运工，**「搬砖」** 一词也是由此而来。

如果你有兴趣想要了解一些有趣的功能背后的实现原理，欢迎跟我一起来探索吧！

## 列表动画

**「列表元素」** 的载入动画其实是非常常见的需求，因为它能有效提高页面对用户的视觉反馈，让我们的页面动起来。下面就进入本期的正题，如何实现列表元素的加载动画？

从技术的角度上来说，我们无非要确定就是两点

- 如何知道 列表元素 有没有出现在页面的 **可视区域** 内
- 当 列表元素 *进入/离开* 可视区域 时，怎么让 元素 以动画的方式 *进场/离场*

### IntersectionObserver

首先我们看第一点，要知道 **目标元素** 是否在页面可视区域内，其实可以转换为判断 **目标元素** 与整个文档是否有交集，即是看 目标元素 与文档的 **交叉率**

- 如果 **交叉率** 为 0 则说明目标元素不可见
- 如果 **交叉率** 大于 0 但小于 1 则说明目标元素部分可见
- 如果 **交叉率** 为 1 则说明目标元素完全可见

而这恰好就是原生API - **IntersectionObserver** 提供的能力。我们简单看一下它的用法
```js
const intersectionObserver = new IntersectionObserver((entries) => {
  // intersectionRatio 则是我们上面提到的交叉率
  if (entries[0].intersectionRatio <= 0) return;
  // 目标元素进入视口
  console.log("load target");
});
// 开始监听
intersectionObserver.observe(document.querySelector(".target"));
```

简单来说，**IntersectionObserver** 本质上是一个构造器，它接收一个 **回调函数** 和 **options** 来创建 观察者实例。

下面是 **options** 具体的结构以及实例上的方法
#### options结构
| key    |  value   |  描述  |
| --- | --- | --- |
|  root   |  Element \| null   |  边界盒   |
|  rootMargin   |  string   |  边界盒margin值   |
|  thresholds   |  number[]   |  监听阈值列表，每到达一个列表中的值都会触发回调   |

#### 实例方法
| api    |  描述   |
| --- | --- |
|  observe   |  开始监听一个目标元素   |
|  takeRecords   |  返回所有观察目标   |
|  unobserve   |  停止监听特定目标元素   |
|  disconnect   |  停止监听目标   |

<u></u>

有兴趣的同学可以详细阅读 **IntersectionObserver** 的MDN文档，这里就不再过多介绍它的配置以及方法了
> https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver


### 小试牛刀

那么接下来我们就来试验一下，这里我用 **React** 来演示，为了方便后续使用，我们基于 **IntersectionObserver** 封装一个自定义hook -「useIntersectionOb」，传入目标元素，就可以返回 **目标元素** 是否进入 **可视区域** 的状态

```ts
// useIntersectionOb.ts
import { RefObject, useEffect, useState } from "react"

export default function useIntersectionOb(target: RefObject<HTMLElement | null>) {
    const [state, setState] = useState({
        visible: false,
        intersectionRatio: 0,
    })

    useEffect(() => {
        if (!target?.current) {
            return () => {}
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                setState({
                    visible: entry.isIntersecting,
                    intersectionRatio: entry.intersectionRatio,
                })
            })
        }, {
            rootMargin: '0px',
            thresholds: [0.5],
        })

        observer.observe(target.current)
        return () => target.current && observer.unobserve(target.current)
    }, [])

    return state
}
```

现在 **列表动画** 的核心部分 - 观察目标元素是否可见已经实现好了。

下面我们来看一下 **动画** 部分如何实现。

假设这里以 **行** 为单位来做动画，视口以外的 **行元素** 默认隐藏，当进入视口时，通过控制 opacity，transform 等样式配合 transition 进行过度来实现载入效果

![](https://files.mdnice.com/user/56690/2908be4a-b9eb-4d02-bf75-38395ad35174.png)

那么我们用 **装饰器模式** 设计一个动画组件 -「EntryAnimationBox」来组合上述功能

- 包裹一层默认隐藏的 DOM 元素
- 用 **useIntersectionOb** 观察这一层 DOM 是否在可视区域内
- 当 DOM 进入可视区域，添加类名 **visible** 来负责实现动画

```jsx
import useIntersectionOb from "@/hooks/useIntersectionOb"
import classNames from "classnames"
import { useMemo, useRef } from "react"
import styles from  './style.module.less'

interface Props {
    children?: JSX.Element[] | JSX.Element
}

export default function EntryAnimationBox(props: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const { visible } = useIntersectionOb(ref)

    const cssClassNames = useMemo(() => {
        return classNames([
            visible && styles['visible'],
            styles['entry-animation-box']
        ])
    }, [visible])

    return (
        <div
            ref={ref}
            className={cssClassNames}
        >
            {props.children}
        </div>
    )
}
```

```css
.entry-animation-box {
    opacity: 0;
    transform: translateX(100px);
    transition: all 0.3s ease-in-out;

    &.visible {
        opacity: 1;
        transform: translateX(0);
    }
}
```

有了这个组件，我们就可以把它用到任何列表的行元素上来实现 **载入效果** 了！

下面我们就写一个 **列表组件** 来演示一下，只需要使用上面实现的 **EntryAnimationBox** 组件将 列表项 包裹起来即可

```jsx
export default function Notes() {
    const store = useNotesStore()

    useEffect(() => {
        store.fetchNotes()
    }, [])

    return (
        <div className={styles['notes']}>
            <Grid className={styles['notes-content']} columns="1" gap="5">{
                store.notes.map((note, index) => (
                    <EntryAnimationBox key={index} >
                        <div className={styles['notes-content-item']} onClick={() => store.setActiveNote(note)}>
                            <div className={styles['notes-content-item-title']}>「 {note.title} 」</div>
                            <div className={styles['notes-content-item-summary']}>{note.summary ?? note.content}</div>
                        </div>                     
                    </EntryAnimationBox>
                ))
            }</Grid>
        </div>
    )
}
```

这就是加上载入动画后的效果，是不是很简单！

![](https://files.mdnice.com/user/56690/c80e6640-63da-4714-8553-82e41b0a80ad.gif)

## 最后

从这个动画的实现思路大家应该都能体会到，往往看似复杂的效果背后，其实都是通过一项一项简单技术堆砌而成，重点在于我们有没有去探索的意愿，俗话说 **“有志者事竟成”** ，很多东西其实就摆那里，我们要做的就仅仅是坚定的走过去而已！

这里是木木剑光，我们下期见～

