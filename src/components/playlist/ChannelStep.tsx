import styles from './ChannelStep.module.css';

export const ChannelStep = ({step, active, current, onToggle = ()=>{}} : {step: number, active: boolean, current: boolean, onToggle?: (val: boolean)=>void}) => {

    const handleStepToggle = ()=>{
        
        onToggle(!active);
    }

    return (
        <div className={styles.channelStep + ` ${active?styles.active:''} ${current?styles.current:''}`} onClick={handleStepToggle} data-step={step}>
        </div>
    )
}
