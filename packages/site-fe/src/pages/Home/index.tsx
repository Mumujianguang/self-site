import React, { useState } from "react";
import { Routes, useNavigate } from "react-router-dom";
import { GitHubLogoIcon, Component1Icon } from "@radix-ui/react-icons";
import EffectRouter from "@/router/EffectRouter";
import Menu3D from "@/components/Menu3D";
import { router } from "@/router";

import styles from "./style.module.less";
import Signature from "@/components/Signature";
import { MY_LINKS, UI_COMPONENTS } from "@/constants";
import { Tooltip } from "@radix-ui/themes";

/**
 * Home page
 * @returns
 */
export default function Home() {
    const navigator = useNavigate();
    const [activeRoute, setActiveRoute] = useState("menu");

    const routers = [
        ...router.map((route) => ({
            name: route.id,
            component: route.component,
        })),
    ];

    /**
     * click handle of github icon
     */
    const onGithubLogoIconClick = () => {
        const github = MY_LINKS.find((item) => item.name === "Github");
        if (github) {
            window.open(github.url, "_blank");
        }
    };

    const onComponent1IconClick = () => {
        window.open(UI_COMPONENTS.url, "_blank");
    };

    return (
        <div className={styles["mm-site-home"]}>
            {/* header */}
            <div className={styles["mm-site-home-header"]}>
                {/* header left */}
                <div className={styles["mm-site-home-header-left"]}>
                    <div className={styles["mm-site-home-header-avatar"]}></div>
                    <Signature />
                </div>

                {/* header menu */}
                <Menu3D
                    menus={router.map(({ id, title, type, icon }) => ({
                        id,
                        title,
                        type,
                        icon,
                    }))}
                    onMenuClick={(id) => {
                        setActiveRoute(id);
                        navigator(`/${id}`);
                    }}
                />

                {/* header right */}
                <div className={styles["mm-site-home-header-right"]}>
                    <Tooltip content="@mmjg/ui-components">
                        <Component1Icon
                            width={"24px"}
                            height={"24px"}
                            onClick={onComponent1IconClick}
                        />
                    </Tooltip>

                    <Tooltip content="github">
                        <GitHubLogoIcon
                            width={"24px"}
                            height={"24px"}
                            onClick={onGithubLogoIconClick}
                        />
                    </Tooltip>
                </div>
            </div>

            {/* content */}
            <div className={styles["mm-site-home-content"]}>
                <EffectRouter routers={routers} activeRoute={activeRoute} />
            </div>
        </div>
    );
}
