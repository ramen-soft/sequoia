import { useDraggable } from '@dnd-kit/core';
import styles from './PatternList.module.css'
export const PatternListItem = ({id, name, onClick} : {id: string, name: string, onClick: React.MouseEventHandler<HTMLDivElement> | undefined}) => {

    const {attributes, listeners, setNodeRef} = useDraggable({
        id: 'draggable',
        data: { id, name }
    });

    return (
        <div onClick={onClick} className={styles.patternlistitem} ref={setNodeRef}>
            <span className={StyleSheet.name} {...listeners} {...attributes}>
                {name}
            </span>
            <button>edit</button>
        </div>
    )
}
