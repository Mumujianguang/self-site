import Intro from "@/pages/Intro";
import Doc from "../pages/Doc";
import Nav from "../pages/Nav";
import Notes from "../pages/Notes";
import Settings from "../pages/Settings";
import Tools from "../pages/Tools";
import { FileTextIcon, GearIcon, HomeIcon, MixIcon, ReaderIcon } from "@radix-ui/react-icons";

export const router = [
    {
        id: '',
        type: 'default',
        title: '首页',
        icon: HomeIcon,
        component: <Intro />
    },
    {
        id: 'doc',
        type: 'default',
        title: '简历',
        icon: FileTextIcon,
        component: <Doc />
    },
    {
        id: 'notes',
        type: 'default',
        title: 'Blog',
        icon: ReaderIcon,
        component: <Notes />
    },
    {
        id: 'tools',
        type: 'default',
        title: '工具箱',
        icon: MixIcon,
        component: <Tools />
    },
    {
        id: 'settings',
        type: 'default',
        icon: GearIcon,
        title: '设置',
        component: <Settings />
    }
]