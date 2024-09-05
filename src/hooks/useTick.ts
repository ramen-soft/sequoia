import { useEffect, useRef } from "react"

export const useTick = (onTick : ()=>void) => {
    const callbackRef = useRef(onTick)

    useEffect(()=>{
        callbackRef.current = onTick
    }, [onTick])

    useEffect(()=>{
        const handleEvent = (event : any) => {
            if(event.detail.type == 'semicorchea'){
                callbackRef.current();
            }
        };
        window.addEventListener('timerTick', handleEvent);

        return ()=>{
            window.removeEventListener('timerTick', handleEvent);
        }
    },[])
}