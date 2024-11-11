import Intro from "@/pages/Intro";
import Doc from "../pages/Doc";
import Notes from "../pages/Notes";
import Sport from "../pages/Sport";
import Tools from "../pages/Tools";
import { FileTextIcon, HomeIcon, MixIcon, ReaderIcon, SunIcon } from "@radix-ui/react-icons";

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
        id: 'sport',
        type: 'default',
        icon: SunIcon,
        title: '运动数据',
        component: <Sport />
    }
]