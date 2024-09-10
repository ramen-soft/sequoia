import { PatternDefinition } from "../../../../models/models";
import { useProjectStore } from "../../../../states/ProjectState"
import { SQButton } from "../../../ui/SQButton";
import { PatternListItem } from "./PatternListItem";
import styles from './PatternList.module.css'

import {v4 as uuid} from 'uuid'

export const PatternList = () => {

    const project = useProjectStore();

    const handleAddPatternClick = ()=>{
        const pat : PatternDefinition = {
            id: uuid(),
            name: `Pattern ${(project.patterns.length+1).toString().padStart(2, '0')}`,
            channels: [
                {
                    id: uuid(),
                    instrument: project.instruments[0],
                    name: 'Channel 01',
                    checkpoints: [],
                    type: "pad"
                }
            ],
            steps: 16
        }
        project.addPattern(pat)
    }

    return (
        <div className={styles['pattern-list']}>
            <ul>
            { project.patterns.map((pattern) => (
                <li key={pattern.id}>
                    <PatternListItem id={pattern.id} onClick={()=>project.setActivePattern(pattern.id)} name={pattern.name} />
                </li>
            ))}

            <PatternListItem id="blabla" onClick={()=>{}} name="pozi"></PatternListItem>

            </ul>

            <div className={styles['pattern-list-footer']}>
                <SQButton onClick={handleAddPatternClick}>+ Pattern</SQButton>
            </div>
        </div>
    )
}
