import React, { FunctionComponent, MouseEvent, MouseEventHandler, useEffect, useState } from 'react';
import useRotateAnimation, { RotateDirection, RotateStatus } from '@/hooks/useRotateAnimation';
import useMouseDrag from '@/hooks/useMouseDrag';
import useEvent from '@/hooks/useEvent';

import styles from './style.module.less';
import { IconProps } from '@radix-ui/themes';
import classNames from 'classnames';
import useBeginShowing from '@/hooks/useBeginShowing';

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

    const { beginShowing } = useBeginShowing()
    const { xOffset, yOffset, onMouseDown } = useMouseDrag()
    const { rotateStyle, setRotateStatus, rotateController } = useRotateAnimation()

    const onMouseEnter = useEvent(() => setRotateStatus(RotateStatus.paused));
    const onMouseLeave = useEvent(() => setRotateStatus(RotateStatus.running));

    useEffect(() => {
        rotateController(RotateDirection.horizontal, { deg: xOffset * 0.2 })
    }, [xOffset, yOffset])

    return (
        <div 
            className={classNames([
                styles["component-menu3d"],
                !beginShowing && styles['hidden']
            ])}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown as unknown as MouseEventHandler<HTMLDivElement>}
        >
            <div
                className={styles["component-menu3d-rotate"]}
                style={{
                    ...rotateStyle
                }}
            >{
                menus.map(({ id, type, title, icon: Icon }, index) => {
                    return (
                        <div
                            key={id}
                            className={styles["component-menu3d-menu"]}
                            style={{
                                transform: `rotateY(${itemRotateDeg * index}deg) translateZ(200px)`
                            }}
                            onClick={() => onMenuClick(id)}
                        >
                            <div className={styles["component-menu3d-menu-content"]}>
                                <div className={styles['component-menu3d-menu-content-title']}>
                                    <Icon width={16} height={16} />
                                    <div>{title} </div>
                                </div>
                            </div>
                            <div className={styles["component-menu3d-menu-line"]}></div>
                        </div>
                    )
                })
            }</div>
        </div>
    )
}
