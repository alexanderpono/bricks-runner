import React from 'react';
import styles from './UI.scss';

interface UIProps {}

export const UI: React.FC<UIProps> = () => {
    return (
        <div className={styles.ui}>
            <canvas id="canvas" height={400} width={800}></canvas>
            <div className={styles.playerControls}>
                <button id="btLeft">&lt;</button>
                <button id="btRight">&gt;</button>
                <button id="btDown">D</button>
                <button id="btUp">U</button>
            </div>
            <div className={styles.guardianControls}>
                <button id="btGLeft">&lt;</button>
                <button id="btGRight">&gt;</button>
                <button id="btGDown">D</button>
                <button id="btGUp">U</button>
            </div>
        </div>
    );
};
