import React from 'react';
import { GameControls } from '@src/components/GameFieldUI/GameControls';
import styles from './BricksEditorUI.scss';
import { Render, ShellState } from '@src/bricksEditor/BricksEditorController.types';
import cn from 'classnames';
import { GameOverScreen } from './components/GameOverScreen';
import { GameLevelControls } from './components/GameLevelControls';
import { DevelopControls } from './components/DevelopControls';
import { LevelStats } from './components/LevelStats';
import { GameFieldController, GameState } from '../GameFieldUI/Game.types';

interface BricksEditorUIProps {
    id: string;
    title: string;
    canvasW?: number;
    canvasH?: number;
    ctrl: GameFieldController;
    gameState: GameState;
    curPathPos: number;
    shellState: ShellState;
}

export const BricksEditorUI = React.forwardRef<HTMLCanvasElement, BricksEditorUIProps>(
    ({ id, title, canvasW, canvasH, ctrl, gameState, shellState }, canvasRef) => {
        const ifRender = (checkFlag: Render) => Boolean(shellState.render & checkFlag);
        return (
            <>
                <section>
                    <h1>МОДИФИКАЦИЯ BRICKS RUNNER ДЛЯ КОНФЕРЕНЦИИ ИМПУЛЬС</h1>
                </section>
                <div className={styles.editorUI}>
                    <div
                        className={
                            (styles.screen,
                            cn({
                                [styles.hideGameScreen]: !ifRender(Render.gameScreen)
                            }))
                        }
                    >
                        <section className={styles.gameStats}>
                            {ifRender(Render.levelStats) && <LevelStats shellState={shellState} />}
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
                        {ifRender(Render.developControls) && (
                            <DevelopControls ctrl={ctrl} shellState={shellState} />
                        )}
                        {ifRender(Render.gameLevelControls) && (
                            <GameLevelControls ctrl={ctrl} shellState={shellState} />
                        )}
                        {ifRender(Render.gameOverScreen) && (
                            <GameOverScreen ctrl={ctrl} shellState={shellState} />
                        )}

                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    name="develop"
                                    checked={!shellState.isDevelopMope}
                                    onChange={ctrl.handleClickIsDevelopMode}
                                />
                                Режим {shellState.isDevelopMope ? 'разработки' : 'игры'}
                            </label>
                        </div>
                    </div>
                </div>
            </>
        );
    }
);
