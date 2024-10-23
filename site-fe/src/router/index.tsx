import Intro from "@/pages/Intro";
import Doc from "../pages/Doc";
import Nav from "../pages/Nav";
import Notes from "../pages/Notes";
import Settings from "../pages/Settings";
import Tools from "../pages/Tools";

export const router = [
    {
        id: '',
        type: 'default',
        title: '首页',
        component: <Intro />
    },
    {
        id: 'doc',
        type: 'default',
        title: '文档',
        component: <Doc />
    },
    {
        id: 'notes',
        type: 'default',
        title: '笔记',
        component: <Notes />
    },
    {
        id: 'nav',
        type: 'default',
        title: '导航',
        component: <Nav />
    },
    {
        id: 'tools',
        type: 'default',
        title: '工具箱',
        component: <Tools />
    },
    {
        id: 'settings',
        type: 'default',
        title: '设置',
        component: <Settings />
    }
]