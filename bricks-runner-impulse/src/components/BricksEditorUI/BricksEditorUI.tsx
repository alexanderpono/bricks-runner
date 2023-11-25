import React from 'react';
import { GameFieldController, GameState } from '@src/components/GameFieldUI/Game.types';
import { GameControls } from '@src/components/GameFieldUI/GameControls';
import styles from './BricksEditorUI.scss';
import { InventoryItem, ShellState } from '@src/bricksEditor/BricksEditorController.types';
import cn from 'classnames';

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
                <div>
                    <section className={styles.gameStats}>
                        <article className={styles.statsCoins}>{shellState.coinsTaken}</article>
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
                                checked={!shellState.isDevelopMope}
                                onChange={ctrl.handleClickIsDevelopMode}
                            />
                            Режим {shellState.isDevelopMope ? 'разработки' : 'игры'}
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
                                <button
                                    className={styles.coin}
                                    onClick={ctrl.handleClickBtCoin}
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
                        <>
                            <div className={styles.inventory}>
                                {shellState.inventory.map((item: InventoryItem) => {
                                    return (
                                        <div key={item.name}>
                                            <input
                                                type="radio"
                                                id={item.name}
                                                name="category"
                                                value={item.char}
                                                onChange={ctrl.handleSelectInventoryItem}
                                            />
                                        </div>
                                    );
                                })}
                                <section className={styles.categories}>
                                    {shellState.inventory.map((item: InventoryItem) => {
                                        return (
                                            <label
                                                key={item.name}
                                                htmlFor={item.name}
                                                id={`${item.name}-label`}
                                                className={cn({
                                                    [styles.cur]: item.char === shellState.curChar
                                                })}
                                            >
                                                <span className={item.name}></span>
                                                {item.count}
                                            </label>
                                        );
                                    })}
                                </section>
                            </div>
                            <button onClick={ctrl.onBtStartClick} className="appButton">
                                Поехали
                            </button>
                            {shellState.isGameOver && (
                                <article>
                                    {shellState.levelStats.map((levelStats, index) => (
                                        <div key={index}>
                                            <p>steps={levelStats.steps}</p>
                                        </div>
                                    ))}
                                    <p>Введите ваше имя:</p>
                                    <input type="text" name="userName" id="userName"></input>
                                    <button onClick={ctrl.onSendResultsClick}>Отправить</button>
                                </article>
                            )}
                        </>
                    )}

                    <div>Пройденный путь: {shellState.curPathPos}</div>
                </div>
            </div>
        );
    }
);
