import React from 'react';
import { GameFieldController, GameState } from '@src/components/GameFieldUI/Game.types';
import { GameControls } from '@src/components/GameFieldUI/GameControls';
import styles from './BricksEditorUI.scss';

interface BricksEditorUI {
    id: string;
    title: string;
    canvasW?: number;
    canvasH?: number;
    ctrl: GameFieldController;
    gameState: GameState;
}
export const BricksEditorUI = React.forwardRef<HTMLCanvasElement, BricksEditorUI>(
    ({ id, title, canvasW, canvasH, ctrl, gameState }, canvasRef) => {
        return (
            <div className={styles.editorUI}>
                <div className={styles.level}>
                    <GameControls
                        id={id}
                        title={title}
                        canvasW={canvasW}
                        canvasH={canvasH}
                        ref={canvasRef}
                        ctrl={ctrl}
                        gameState={gameState}
                    />
                </div>
                <div className={styles.editControls}>
                    <div>
                        <button className={styles.brick} onClick={ctrl.handleClickBtBrick}></button>
                        <button
                            className={styles.stairs}
                            onClick={ctrl.handleClickBtStairs}
                        ></button>
                        <button className={styles.gold} onClick={ctrl.handleClickBtGold}></button>
                        <button className={styles.space} onClick={ctrl.handleClickBtSpace}></button>
                    </div>
                    <div className={styles.wrapLoad}>
                        <input
                            type="file"
                            name="file"
                            className={styles.btLoad}
                            // onClick={ctrl.handleClickBtStairs}
                            onChange={ctrl.onUploadFileChange}
                        />
                    </div>
                    <button className={styles.save} onClick={ctrl.handleClickBtSaveAs}>
                        SAVE
                    </button>
                </div>
            </div>
        );
    }
);
