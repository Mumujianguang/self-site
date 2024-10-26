import { useEffect, useState } from "react";

export default function useBeginShowing() {
    const [beginShowing, setBeginShowing] = useState(false)
    
    useEffect(() => {
        setBeginShowing(true)
    }, [])

    return { beginShowing }
}