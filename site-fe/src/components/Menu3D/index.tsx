import React, { useState } from 'react';
import getDefaultMenus from './mock.data';
import './index.less';
import useRotateAnimation, { RotateStatus } from '../../hooks/useRotateStyle';

type Menu = {
    id: string
    type: string
    title: string
}

export type Menu3DProps = {
    menus?: Menu[]
}

/**
 * 3D 菜单组件
 * @param props
 * @returns
 */
export default function Menu3D(props: Menu3DProps) {
    const { menus = getDefaultMenus() } = props;

    const { rotateStyle, setRotateStatus } = useRotateAnimation()

    const itemRotateDeg = (360 / menus.length)

    return (
        <div 
            className="component-menu3d"
            onMouseEnter={() => setRotateStatus(RotateStatus.paused)}
            onMouseLeave={() => setRotateStatus(RotateStatus.running)}
        >
            <div
                className="component-menu3d-rotate"
                style={{
                    ...rotateStyle
                }}
            >{
                menus.map(({ id, type, title }, index) => {

                    return (
                        <div
                            key={id}
                            className="component-menu3d-menu"
                            style={{
                                transform: `rotateY(${itemRotateDeg * index}deg) translateZ(350px)`
                            }}
                        >
                            <div className="component-menu3d-menu-content">{title}</div>
                            <div className="component-menu3d-menu-line"></div>
                        </div>
                    )
                })
            }</div>
        </div>
    )
}
