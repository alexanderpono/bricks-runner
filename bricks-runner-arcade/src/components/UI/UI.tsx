import React from 'react';
import styles from './UI.scss';

interface UIProps {}

export const UI: React.FC<UIProps> = () => {
    return (
        <div className={styles.canvas}>
            <canvas height={200} width={400}></canvas>
        </div>
    );
};
