import { createContext, ReactElement } from "react";
import Engine from '../lib/engine/engine';

interface SeqContextType{
    engine : typeof Engine
}

export const SeqContext = createContext<SeqContextType>({engine: Engine});

export const SeqContextProvider = ({children} : {children:ReactElement}) => {
    const engine = Engine;

    return (
        <SeqContext.Provider value={{engine}}>
            {children}
        </SeqContext.Provider>
    )
}