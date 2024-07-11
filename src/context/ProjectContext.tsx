import { createContext, ReactElement, useState } from "react";
import { Project } from "../models/models";

const initialState : Project = {
    title: 'dasds',
    bpm: 72,
    instruments: [],
    patterns: [
        {
            name: 'Pattern 01',
            steps: 16,
            channels: [
                {
                    instrument: "piano",
                    name: 'Channel 01',
                    notes: [],
                    type: "pad"
                }
            ]
        }
    ],
    tracks: [],
};

interface ProjectContextType{
    project: Project;
    title: string;
    setProject: React.Dispatch<React.SetStateAction<Project>>
}

export const ProjectContext = createContext<ProjectContextType>({project: initialState, title: '', setProject: ()=>{}});

export const ProjectContextProvider = ({children} : {children: ReactElement}) => {
    const [project, setProject] = useState<Project>(initialState);
    const { title } = project;
    return <ProjectContext.Provider value={{project, title, setProject}}>{children}</ProjectContext.Provider>
}