import { MouseEventHandler, PropsWithChildren, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { Rnd } from "react-rnd";
import styles from './DDialog.module.css';

const reactDraggableRemoveActive = () => {
    document.querySelectorAll('.react-draggable')?.forEach(rd=>rd.classList.remove('active'));
}

interface IDialogProps{
    title: string;
    modal ?: boolean;
    onDialogClose ?: {():void};
}

export const DDialog = ({title, modal = false, onDialogClose = ()=>{}, children = undefined} : PropsWithChildren<IDialogProps>) => {
    const dialogRef = useRef<Rnd>(null);

    const handleClose = (e: React.MouseEvent<HTMLElement>) =>{
        e.preventDefault();
        e.stopPropagation();
        onDialogClose();
    }

    const setCurrentAsActive = () => {
        if(dialogRef.current){
            const {current} = dialogRef.current.resizableElement;
            if(current){
                reactDraggableRemoveActive();
                current.classList.add('active');
            }
        }
    }

    return (
        <>
        { modal && <div className={styles['modal-backdrop']}></div> }
      <Rnd
        ref={dialogRef}
        onClick={setCurrentAsActive}
        onDrag={setCurrentAsActive}
        bounds="window"
        default={{ x: window.innerWidth/2-200, y: window.innerHeight/2-300, width: 400, height: 300 }}
        dragHandleClassName={styles['dialog-title']}
        enableResizing={false}
      >
        <div className={styles.ddialog}>
            <div className={styles['dialog-title']}>
                <span className={styles['dialog-title-text']}>{title}</span>
                <button onClick={handleClose} className={styles['dialog-title-icon']}><FaTimes /></button>
            </div>
            <div className={styles['dialog-body']}>
                {children}
            </div>
        </div>
      </Rnd>
      </>
    );
}