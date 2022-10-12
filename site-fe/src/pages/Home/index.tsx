import React, { useState } from 'react';
import { Routes, useNavigate } from 'react-router-dom';
import EffectRouter from '../../components/EffectRouter';
import Menu3D from '../../components/Menu3D';
import { router } from '../../router';

import './style.less'

export default function Home(props: any) {
    const [activeRoute, setActiveRoute ] = useState('menu');
    const navigator = useNavigate()

    const routers = [
        {
            name: 'menu',
            component: (
                <Menu3D
                    menus={router.map(({ id, title, type }) => ({
                        id,
                        title,
                        type
                    }))}
                    onMenuClick={(id) => {
                        setActiveRoute(id)
                        navigator(`/${id}`)
                    }}
                />
            )
        },
        ...router.map((route) => ({
            name: route.id,
            component: route.component
        }))
    ]

    return (
        <div className="mm-site-home">
            <EffectRouter
                routers={routers}
                activeRoute={activeRoute}
            />
        </div>
    )
}
