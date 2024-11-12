import React, { useState } from 'react';
import { Routes, useNavigate } from 'react-router-dom';
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import EffectRouter from '@/router/EffectRouter';
import Menu3D from '@/components/Menu3D';
import { router } from '@/router';

import styles from './style.module.less'
import Signature from '@/components/Signature';
import { MY_LINKS } from '@/constants';

/**
 * Home page
 * @returns
 */
export default function Home() {
    const navigator = useNavigate()
    const [activeRoute, setActiveRoute ] = useState('menu');

    const routers = [
        ...router.map((route) => ({
            name: route.id,
            component: route.component
        }))
    ]

    /**
     * click handle of github icon
     */
    const onGithubLogoIconClick = () => {
        const github = MY_LINKS.find(item => item.name === 'github')
        if (github) {
            window.open(github.url, '_blank')
        }
    }

    return (
        <div className={styles["mm-site-home"]}>
            {/* header */}
            <div className={styles['mm-site-home-header']}>
                {/* header left */}
                <div className={styles['mm-site-home-header-left']}>
                    <div className={styles['mm-site-home-header-avatar']}></div>
                    <Signature />
                </div>
                
                {/* header menu */}
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

                {/* header right */}
                <div className={styles['mm-site-home-header-right']}>
                    <GitHubLogoIcon width={'24px'} height={'24px'} onClick={onGithubLogoIconClick} />
                </div>
            </div>

            {/* content */}
            <div className={styles['mm-site-home-content']}>
                <EffectRouter
                    routers={routers}
                    activeRoute={activeRoute}
                />
            </div>
        </div>
    )
}
