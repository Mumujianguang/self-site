import React, { FunctionComponent, useEffect } from 'react';
import useRotateAnimation, { RotateDirection, RotateStatus } from '@/hooks/useRotateAnimation';
import useMouseDrag from '@/hooks/useMouseDrag';
import useEvent from '@/hooks/useEvent';

import './style.less';
import { IconProps } from '@radix-ui/themes';

type Menu = {
    id: string
    type: string
    title: string
    icon: FunctionComponent<IconProps>
}

export type Menu3DProps = {
    menus: Menu[],
    onMenuClick?: (menu: string) => void
}

/**
 * 3D 菜单组件
 * @param props
 * @returns
 */
export default function Menu3D(props: Menu3DProps) {
    const { menus, onMenuClick = () => {} } = props;
    const itemRotateDeg = (360 / menus.length);

    const { xOffset, yOffset, onMouseDown } = useMouseDrag()
    const { rotateStyle, setRotateStatus, rotateController } = useRotateAnimation()

    const onMouseEnter = useEvent(() => setRotateStatus(RotateStatus.paused));
    const onMouseLeave = useEvent(() => setRotateStatus(RotateStatus.running));

    useEffect(() => {
        rotateController(RotateDirection.horizontal, { deg: xOffset * 0.2 })
    }, [xOffset, yOffset])

    return (
        <div 
            className="component-menu3d"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
        >
            <div
                className="component-menu3d-rotate"
                style={{
                    ...rotateStyle
                }}
            >{
                menus.map(({ id, type, title, icon: Icon }, index) => {
                    return (
                        <div
                            key={id}
                            className="component-menu3d-menu"
                            style={{
                                transform: `rotateY(${itemRotateDeg * index}deg) translateZ(200px)`
                            }}
                            onClick={() => onMenuClick(id)}
                        >
                            <div className="component-menu3d-menu-content">
                                <div className='component-menu3d-menu-content-title'>
                                    <Icon width={16} height={16} />
                                    <div>{title} </div>
                                </div>
                            </div>
                            <div className="component-menu3d-menu-line"></div>
                        </div>
                    )
                })
            }</div>
        </div>
    )
}
