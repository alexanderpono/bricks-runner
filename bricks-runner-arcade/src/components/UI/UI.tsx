import React from 'react';
import styles from './UI.scss';
import { IKeyboard } from '@src/ports/keyboard/Keyboard.types';
import cn from 'classnames';
import { UIState } from '@src/types/UIState';
import { Label } from '@src/components/Label';
import { GuardState } from '@src/types/GuardState';

interface Ctrl {
    nodesClicked: () => void;
    linesClicked: () => void;
    pathClicked: () => void;
    nodesCostClicked: () => void;
    mapClicked: () => void;
    guardRunClicked: () => void;
}
interface UIProps {
    kb: IKeyboard;
    uiState: UIState;
    ctrl: Ctrl;
    guardState: GuardState;
}

export const UI: React.FC<UIProps> = ({ kb, uiState, ctrl, guardState }) => {
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
            <div className={styles.uiOptions}>
                {Label(uiState.showNodes, ctrl.nodesClicked, `nodes`, 'Узлы')}
                {Label(uiState.showLines, ctrl.linesClicked, `lines`, 'Ребра')}
                {Label(uiState.showPath, ctrl.pathClicked, `path`, 'Путь')}
                {Label(uiState.showNodesCost, ctrl.nodesCostClicked, `nodesCost`, 'Стоимость')}
                {Label(uiState.showMap, ctrl.mapClicked, `map`, 'Карта')}
            </div>
            <div className={styles.guardCtrl2}>
                {Label(guardState.run, ctrl.guardRunClicked, `run`, 'Бежать')}
            </div>
        </div>
    );
};
