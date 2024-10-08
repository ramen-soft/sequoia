import { SyntheticEvent } from "react"
import { instrumentRegistry } from "../../../../lib/engine/registry"
import { ChannelDefinition } from "../../../../models/models"
import styles from './Channel.module.css'

export const ChannelHead = ({channel, onInstrumentChange, onPianoRollClick = ()=>{}} : {channel : ChannelDefinition, onPianoRollClick : React.MouseEventHandler, onInstrumentChange ?: (channel : ChannelDefinition, instrumentId: string) => void}) => {

    const handleInstrumentChange = (e : SyntheticEvent<HTMLSelectElement>) => {
        const target = e.currentTarget;
        const sIndex = target.selectedIndex;
        const val = target.options[sIndex].value

        onInstrumentChange&&onInstrumentChange(channel, val);
    }

    return (
        <li className={styles['channel-head']}>
            <button className={styles['pr-button']} onClick={onPianoRollClick} />
            <select onChange={handleInstrumentChange} value={channel.instrument}>
                {Object.values(instrumentRegistry).map((entry)=><option value={entry.id} key={entry.id}>{entry.name}</option>)}
            </select>
        </li>
    )
}
