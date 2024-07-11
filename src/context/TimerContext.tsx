import { createContext, ReactElement, useContext, useEffect, useRef } from "react";
import { millisPerBeat } from "../lib/helpers/time-functions";
import { ProjectContext } from "./ProjectContext";

export const TimerContext = createContext<any>({startTimer: ()=>{}, stopTimer: ()=>{}})

export const TimerContextProvider = ({children} : {children:ReactElement}) => {

    const { project } = useContext(ProjectContext);

    const ms = useRef(millisPerBeat(project.bpm))
    const intervalRef = useRef<number|undefined>();
    const interval = useRef(1);
    const timerRef = useRef(0);

    let msq : number;
    let mso : number;
    let msm : number;
    let msf : number;

    let elapsed = 0;
    let elapsedFromStart = 0;

    const tick = (interval: number)=>{
        elapsed += interval;
        elapsedFromStart += interval;
        const event = new CustomEvent('timerMsec', {detail: elapsedFromStart});
        window.dispatchEvent(event);

        if(elapsed % msf == 0){
            const event = new CustomEvent('timerTick', {detail: { type: 'fusa', elapsed: elapsed} });
            window.dispatchEvent(event);
        }
        if(elapsed % msm == 0){
            const event = new CustomEvent('timerTick', {detail: { type: 'semicorchea', elapsed: elapsed} });
            window.dispatchEvent(event);
        }
        if(elapsed % mso == 0){
            //console.log('corchea', elapsed);
        }
        if(elapsed % msq == 0){ 
            // negras
            //elapsed = 0;
        }
    }


    const startTimer = () => {
        elapsed = 0;
        elapsedFromStart = 0;
        timerRef.current = 0;
        intervalRef.current = setInterval(()=>{
            timerRef.current += interval.current;
            tick(interval.current);
        }, interval.current)
    }

    const stopTimer = () => {
        clearInterval(intervalRef.current)
        timerRef.current = 0;
    }

    useEffect(()=>{
        ms.current = millisPerBeat(project.bpm)
    }, [project.bpm]);

    useEffect(()=>{
        msq = Math.floor(ms.current / 4);
        mso = Math.floor(ms.current / 8);
        msm = Math.floor(ms.current / 16);
        msf = Math.floor(ms.current / 32);
        interval.current = 1;
    }, [project])

    useEffect(()=>{
        msq = Math.floor(ms.current / 4);
        mso = Math.floor(ms.current / 8);
        msm = Math.floor(ms.current / 16);
        msf = Math.floor(ms.current / 32);
        startTimer();
        return() => clearInterval(intervalRef.current);
    }, []);

    return (
        <TimerContext.Provider value={{ startTimer, stopTimer }}>
            {children}
        </TimerContext.Provider>
    )
}