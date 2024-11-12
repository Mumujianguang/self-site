import { Text, Blockquote, Code, Separator, Heading, Badge, Tooltip, Avatar, Link } from '@radix-ui/themes'
import styles from './style.module.less'
import { useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import { MY_LINKS, MY_TECHNOLOGY_STACK } from '@/constants'
import useBeginShowing from '@/hooks/useBeginShowing'
import RS7_IMAGE from '@/assets/rs7.jpg'

const splitter = <Separator my="1" style={{ backgroundColor: 'transparent' }} />

export default function Intro() {
    const elementRef = useRef<HTMLDivElement | null>(null)

    const { beginShowing } = useBeginShowing()

    return (
        <div
            ref={elementRef}
            className={classnames([
                styles['intro'],
                !beginShowing && styles['hidden']
            ])}
        >
            <Text
                className={classnames([
                    styles['intro-main'],
                    styles['stage-1']
                ])}
            >
                <Blockquote>
                    <Heading as='h1'>
                        Hey! 👋 
                    </Heading>
                    {splitter}
                    <Text>
                        Here is MMJG「木木剑光」
                    </Text>
                </Blockquote>
                {splitter}
                <Code variant='outline' size={'3'}>{` INTJ · Front-End Developer · Ant Design Contributor`}</Code>
                {splitter}
                <Text size={'2'} align={'right'}>一个「爱捣腾技术.间歇性写作.拥抱开源贡献」的骑行爱好者</Text>
                
                <Separator my="5" size="4" />
                
                <Text size={'1'}>这里是我在浩瀚的互联网上的小基地，欢迎友友们来访～</Text>
                {splitter}
                <Text size={'1'}>
                    简单介绍一下自己，大二开始接触<Text color='indigo'>「前端」</Text>，
                    毕业后一直在<Text color='indigo'>「数据可视化」</Text>领域深耕，目前工作 5 年。
                    业余时间喜欢探索各种技术的实现原理，给多个知名开源项目贡献过 PR，比如 <Text color='indigo'>antd, rspack, ast-grep... </Text> 
                    偶尔也会输出一些<Text color='indigo'>「技术文章」</Text>，分享一些 最佳实践，源码分析 等等
                </Text>
                {splitter}
                <Text size={'1'}>
                    运动爱好是 <Text color='indigo'>骑行</Text>，成都天府绿道常驻选手，有一辆公路车
                    <Tooltip
                        content={
                            <img src={RS7_IMAGE} width={300} />
                        }
                    >
                        <Text color='indigo'>「XDS RS7」</Text>
                    </Tooltip>
                </Text>
                {splitter}
                <Text size={'1'}>可以在这些平台找到我 👉</Text>
                <Text size={'1'}>
                    {
                        MY_LINKS.map((item, index) => (
                            <Link
                                key={index}
                                href={item.url}
                                color='green'
                                highContrast
                                target='_blank'
                                style={{ color: 'var(--accent-a11)' }}
                            >
                                「 {item.name} 」
                            </Link>
                        ))
                    }
                </Text>

                <Separator my="4" size="4" />

                {/* tags of tech stack */}
                <div
                    className={classnames([
                        styles['intro-tech-stack'],
                        styles['stage-2']
                    ])}
                >{
                    MY_TECHNOLOGY_STACK.map((item, index) => (
                        <Badge
                            key={index}
                            variant='outline'
                            size={'2'}
                        >
                            {item}
                        </Badge>
                    ))
                }</div>
            </Text>  
        </div>
    )
}