import React from 'react';
import { GameFieldController, GameState } from '@src/components/GameFieldUI/Game.types';
import { GameControls } from '@src/components/GameFieldUI/GameControls';
import styles from './BricksEditorUI.scss';
import { InventoryItem, ShellState } from '@src/bricksEditor/BricksEditorController.types';
import cn from 'classnames';
import { Cell } from '@src/game/GameField';
import { formatTime } from '@src/adapters/formatTime';

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
            <>
                <section>
                    <h1>МОДИФИКАЦИЯ BRICKS RUNNER ДЛЯ КОНФЕРЕНЦИИ ИМПУЛЬС</h1>
                </section>
                <div className={styles.editorUI}>
                    <div className={styles.screen}>
                        <section className={styles.gameStats}>
                            <article className={styles.statsCoins}>{shellState.coinsTaken}</article>
                            <article className={styles.statsSteps}>{shellState.curPathPos}</article>
                            <article className={styles.statsLevel}>
                                {shellState.levelIndex + 1}
                            </article>
                            <article className={styles.statsTime}>
                                {formatTime(shellState.levelTime)}
                            </article>
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
                        {shellState.isDevelopMope && (
                            <section className={styles.develop}>
                                <div className={styles.editInventory}>
                                    <button
                                        className={cn(styles.brick, {
                                            [styles.cur]: shellState.curChar === Cell.wall
                                        })}
                                        onClick={ctrl.handleClickBtBrick}
                                    ></button>
                                    <button
                                        className={cn(styles.stairs, {
                                            [styles.cur]: shellState.curChar === Cell.stairs
                                        })}
                                        onClick={ctrl.handleClickBtStairs}
                                    ></button>
                                    <button
                                        className={cn(styles.gold, {
                                            [styles.cur]: shellState.curChar === Cell.gold
                                        })}
                                        onClick={ctrl.handleClickBtGold}
                                    ></button>
                                    <button
                                        className={cn(styles.space, {
                                            [styles.cur]: shellState.curChar === Cell.space
                                        })}
                                        onClick={ctrl.handleClickBtSpace}
                                    ></button>
                                    <button
                                        className={cn(styles.coin, {
                                            [styles.cur]: shellState.curChar === Cell.coin
                                        })}
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
                                    СОХРАНИТЬ УРОВЕНЬ
                                </button>
                            </section>
                        )}
                        {!shellState.isDevelopMope && (
                            <>
                                <div className={styles.tip}>
                                    1. Отредактируйте уровень при помощи инвентаря, чтобы собрать
                                    больше монет:
                                </div>
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
                                                        [styles.cur]:
                                                            item.char === shellState.curChar
                                                    })}
                                                >
                                                    <span className={item.name}></span>
                                                    <span className={styles.count}>
                                                        {item.count}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </section>
                                </div>
                                <div className={styles.tip}>2. Нажмите на кнопку:</div>
                                <button onClick={ctrl.onBtStartClick} className={styles.btGo}>
                                    <span>ПОЕХАЛИ</span>
                                </button>
                                {shellState.isGameOver && (
                                    <article>
                                        {shellState.levelStats.map((levelStats, index) => (
                                            <div key={index}>
                                                <p>
                                                    level:{index + 1} steps:{levelStats.steps}{' '}
                                                    coins:
                                                    {levelStats.coins} time:
                                                    {formatTime(levelStats.time)}
                                                </p>
                                            </div>
                                        ))}
                                        <p>Введите свой ник в Telegram:</p>@
                                        <input type="text" name="userName" id="userName"></input>
                                        <button onClick={ctrl.onSendResultsClick}>Отправить</button>
                                    </article>
                                )}
                            </>
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
