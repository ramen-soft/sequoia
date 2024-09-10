import { PropsWithChildren, ReactElement, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { Rnd } from "react-rnd";
import styles from './DDialog.module.css';

const reactDraggableRemoveActive = () => {
    document.querySelectorAll('.react-draggable')?.forEach(rd=>rd.classList.remove('active'));
}

export type Size = {
    width: number;
    height: number;
}

interface IDialogProps{
    title: string;
    modal ?: boolean;
    size ?: Size;
    titleBarTools ?: ReactElement;
    onDialogClose ?: {():void};
}

export const DDialog = ({title, modal = false, titleBarTools, onDialogClose = ()=>{}, size, children = undefined} : PropsWithChildren<IDialogProps>) => {
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

    useEffect(()=>setCurrentAsActive(), []);

    return (
        <>
        { modal && <div className={styles['modal-backdrop']}></div> }
      <Rnd
        ref={dialogRef}
        onClick={setCurrentAsActive}
        onDrag={setCurrentAsActive}
        bounds="window"
        default={{ x: window.innerWidth/2-200, y: window.innerHeight/2, width: size?.width||'auto', height: size?.height||'auto' }}
        dragHandleClassName={styles['dialog-title']}
        enableResizing={false}
      >
        <div className={styles.ddialog}>
            <div className={styles['dialog-title']}>
                <span className={styles['dialog-title-text']}>{title}</span>
                <div className={styles['dialog-title-tools']}>
                    {titleBarTools}
                </div>
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