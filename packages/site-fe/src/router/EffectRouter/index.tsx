import { ReactComponentElement, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import './style.less'

export enum ActiveAnimation {
    scale = 'scale'
}

interface EffectRouterProps {
    routers: {
        name: string,
        component: ReactComponentElement<any>
    }[]
    activeRoute: string,
    activeAnimation?: ActiveAnimation
}

/**
 * 特效路由
 * @param props
 * @returns 
 */
export default function EffectRouter(props: EffectRouterProps) {
    const { routers, activeRoute, activeAnimation = ActiveAnimation.scale } = props;

    const location = useLocation();

    console.log(location);

    return (
        <div className='component-effectrouter'>
            <TransitionGroup>
                <CSSTransition
                    key={location.pathname}
                    timeout={1000}
                    classNames="page"
                >
                    <Routes
                        location={location}
                    >{
                        routers.map((route, index) => (
                            <Route
                                key={index}
                                path={`/${route.name}`}
                                element={
                                    <div
                                        key={index}
                                        className={`component-effectrouter-route ${route.name === activeRoute ? `${activeAnimation} active` : ''}`}
                                    >{
                                        route.component
                                    }</div>
                                }
                            ></Route>
                        ))
                    }</Routes>
                </CSSTransition>
            </TransitionGroup>
        </div>
    );  
}