import React from 'react';
import styles from './UI.scss';
import { IKeyboard } from '@src/ports/keyboard/Keyboard.types';
import cn from 'classnames';

interface UIProps {
    kb: IKeyboard;
}

export const UI: React.FC<UIProps> = ({ kb }) => {
    return (
        <div className={styles.ui}>
            <canvas id="canvas" height={400} width={800}></canvas>
            <div className={styles.playerControls}>
                <button id="btLeft" className={cn({ pressed: kb.isLeftPressed })}>
                    &lt;
                </button>
                <button id="btRight" className={cn({ pressed: kb.isRightPressed })}>
                    &gt;
                </button>
                <button id="btDown" className={cn({ pressed: kb.isDownPressed })}>
                    D
                </button>
                <button id="btUp" className={cn({ pressed: kb.isUpPressed })}>
                    U
                </button>
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
