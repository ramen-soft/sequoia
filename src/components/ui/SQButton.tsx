import { PropsWithChildren } from 'react';
import styles from './SQButton.module.css';

type SQButtonVariants = "primary"|"secondary"|"warn"|"error"|"accent"|"pulse";

export const SQButton = ({
    children,
    variant="primary",
    onClick,
    disabled=false
} : PropsWithChildren<{
    variant?: SQButtonVariants,
    onClick: ()=>void,
    disabled?: boolean
}>) => {
    return (
        <div onClick={!disabled?onClick:()=>{}} className={`${styles['button']} ${styles[`button--${variant}`]} ${disabled && styles['button--disabled']}`}>
            {children}
        </div>
    )
}
