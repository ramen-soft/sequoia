import { createContext, ReactElement, useCallback, useEffect, useRef } from "react";
import { millisPerBeat } from "../lib/helpers/time-functions";
import { useProjectStore } from "../states/ProjectState";

type TimerContextType = {
    startTimer: ()=>void,
    stopTimer: ()=>void
}

export const TimerContext = createContext<TimerContextType>({startTimer: ()=>{}, stopTimer: ()=>{}})

export const TimerContextProvider = ({children} : {children:ReactElement}) => {

    const project = useProjectStore()

    const ms = useRef(millisPerBeat(project.bpm))
    const intervalRef = useRef<number|undefined>();
    const interval = useRef(1);
    const timerRef = useRef(0);

    /*
    let msq : number;
    let mso : number;
    let msm : number;
    let msf : number;
    */
    const msq = useRef<number>(0)
    const mso = useRef<number>(0)
    const msm = useRef<number>(0)
    const msf = useRef<number>(0)

    const elapsed = useRef<number>(0)
    const elapsedFromStart = useRef<number>(0)

    /*
    let elapsed = 0;
    let elapsedFromStart = 0;
    */

    const tick = (interval: number)=>{
        elapsed.current += interval;
        elapsedFromStart.current += interval;
        const event = new CustomEvent('timerMsec', {detail: elapsedFromStart.current});
        window.dispatchEvent(event);

        if(elapsed.current % msf.current == 0){
            const event = new CustomEvent('timerTick', {detail: { type: 'fusa', elapsed: elapsed.current} });
            window.dispatchEvent(event);
        }
        if(elapsed.current % msm.current == 0){
            const event = new CustomEvent('timerTick', {detail: { type: 'semicorchea', elapsed: elapsed.current} });
            window.dispatchEvent(event);
        }
        if(elapsed.current % mso.current == 0){
            //console.log('corchea', elapsed);
        }
        if(elapsed.current % msq.current == 0){ 
            // negras
            //elapsed = 0;
        }
    }


    const startTimer = useCallback(() => {
        elapsed.current = 0;
        elapsedFromStart.current = 0;
        timerRef.current = 0;
        intervalRef.current = setInterval(()=>{
            timerRef.current += interval.current;
            tick(interval.current);
        }, interval.current)
    }, [])

    const stopTimer = () => {
        clearInterval(intervalRef.current)
        timerRef.current = 0;
    }

    useEffect(()=>{
        ms.current = millisPerBeat(project.bpm)
    }, [project.bpm]);

    useEffect(()=>{
        msq.current = Math.floor(ms.current / 4);
        mso.current = Math.floor(ms.current / 8);
        msm.current = Math.floor(ms.current / 16);
        msf.current = Math.floor(ms.current / 32);
        interval.current = 1;
    }, [project])

    useEffect(()=>{
        msq.current = Math.floor(ms.current / 4);
        mso.current = Math.floor(ms.current / 8);
        msm.current = Math.floor(ms.current / 16);
        msf.current = Math.floor(ms.current / 32);
        startTimer();
        return() => clearInterval(intervalRef.current);
    }, [startTimer]);

    return (
        <TimerContext.Provider value={{ startTimer, stopTimer }}>
            {children}
        </TimerContext.Provider>
    )
}