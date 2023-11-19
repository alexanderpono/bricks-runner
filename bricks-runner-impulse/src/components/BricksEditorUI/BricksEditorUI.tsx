import React from 'react';
import { GameFieldController, GameState } from '@src/components/GameFieldUI/Game.types';
import { GameControls } from '@src/components/GameFieldUI/GameControls';
import styles from './BricksEditorUI.scss';
import { ShellState } from '@src/bricksEditor/BricksEditorController.types';

interface BricksEditorUI {
    id: string;
    title: string;
    canvasW?: number;
    canvasH?: number;
    ctrl: GameFieldController;
    gameState: GameState;
    curPathPos: number;
    shellState: ShellState;
}
export const BricksEditorUI = React.forwardRef<HTMLCanvasElement, BricksEditorUI>(
    ({ id, title, canvasW, canvasH, ctrl, gameState, shellState }, canvasRef) => {
        return (
            <div className={styles.editorUI}>
                <div className={styles.red}>
                    <section className={styles.gameStats}>
                        <article className={styles.statsGold}>0</article>
                        <article className={styles.statsSteps}>{shellState.curPathPos}</article>
                        <article className={styles.statsLevel}>{shellState.levelIndex + 1}</article>
                    </section>
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
                        <label>
                            <input
                                type="checkbox"
                                name="develop"
                                checked={shellState.isDevelopMope}
                                onChange={ctrl.handleClickIsDevelopMode}
                            />
                            Режим разработки
                        </label>
                    </div>
                    {shellState.isDevelopMope && (
                        <>
                            <div>
                                <button
                                    className={styles.brick}
                                    onClick={ctrl.handleClickBtBrick}
                                ></button>
                                <button
                                    className={styles.stairs}
                                    onClick={ctrl.handleClickBtStairs}
                                ></button>
                                <button
                                    className={styles.gold}
                                    onClick={ctrl.handleClickBtGold}
                                ></button>
                                <button
                                    className={styles.space}
                                    onClick={ctrl.handleClickBtSpace}
                                ></button>
                            </div>
                            <div className={styles.wrapLoad}>
                                <input
                                    type="file"
                                    name="file"
                                    className={styles.btLoad}
                                    onChange={ctrl.onUploadFileChange}
                                />
                            </div>
                            <button className={styles.save} onClick={ctrl.handleClickBtSaveAs}>
                                SAVE
                            </button>
                        </>
                    )}
                    {!shellState.isDevelopMope && (
                        <button onClick={ctrl.onBtStartClick} className="appButton">
                            Поехали
                        </button>
                    )}

                    <div>Пройденный путь: {shellState.curPathPos}</div>
                </div>
            </div>
        );
    }
);
