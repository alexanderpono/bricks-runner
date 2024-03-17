import React from 'react';
import styles from './UI.scss';

interface UIProps {}

export const UI: React.FC<UIProps> = () => {
    return (
        <div className={styles.canvas}>
            <canvas id="canvas" height={400} width={800}></canvas>
            <div>
                <button id="btLeft">&lt;</button>
                <button id="btRight">&gt;</button>
                <button id="btDown">D</button>
                <button id="btUp">U</button>
            </div>
        </div>
    );
};
