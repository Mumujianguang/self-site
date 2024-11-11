import { $ } from "execa";
import picocolors from "picocolors";

(async () => {
    const res = await $('ssh root@47.109.37.194')
    console.log(res)
})()
