import React, { useState } from 'react';
import { Routes, useNavigate } from 'react-router-dom';
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import EffectRouter from '@/router/EffectRouter';
import Menu3D from '@/components/Menu3D';
import { router } from '@/router';

import styles from './style.module.less'
import Signature from '@/components/Signature';

export default function Home(props: any) {
    const navigator = useNavigate()
    const [activeRoute, setActiveRoute ] = useState('menu');

    const routers = [
        ...router.map((route) => ({
            name: route.id,
            component: route.component
        }))
    ]

    const onGithubLogoIconClick = () => {
        window.open('https://github.com/Mumujianguang')
    }

    return (
        <div className={styles["mm-site-home"]}>
            {/* header */}
            <div className={styles['mm-site-home-header']}>
                <div className={styles['mm-site-home-header-left']}>
                    <div className={styles['mm-site-home-header-avatar']}></div>
                    <Signature />
                </div>
                
                <Menu3D
                    menus={router.map(({ id, title, type, icon }) => ({
                        id,
                        title,
                        type,
                        icon
                    }))}
                    onMenuClick={(id) => {
                        setActiveRoute(id)
                        navigator(`/${id}`)
                    }}
                />

                <div className={styles['mm-site-home-header-right']}>
                    <GitHubLogoIcon width={'24px'} height={'24px'} onClick={onGithubLogoIconClick} />
                </div>
            </div>

            <div className={styles['mm-site-home-content']}>
                <EffectRouter
                    routers={routers}
                    activeRoute={activeRoute}
                />
            </div>
        </div>
    )
}
