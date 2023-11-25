import React from 'react';
import { GameFieldController } from '@src/components/GameFieldUI/Game.types';
import styles from '@src/components/BricksEditorUI/BricksEditorUI.scss';
import { formatTime } from '@src/adapters/formatTime';
import { ShellState } from '@src/bricksEditor/BricksEditorController.types';

interface GameOverScreenProps {
    ctrl: GameFieldController;
    shellState: ShellState;
}
export const GameOverScreen: React.FC<GameOverScreenProps> = ({ ctrl, shellState }) => {
    return (
        <section className={styles.gameOverScreen}>
            {shellState.levelStats.map((levelStats, index) => (
                <div key={index}>
                    <p>
                        level:{index + 1} steps:{levelStats.steps} coins:
                        {levelStats.coins} time:
                        {formatTime(levelStats.time)}
                    </p>
                </div>
            ))}
            <p>Введите свой логин в Telegram:</p>
            <p className={styles.tgLogin}>
                @<input type="text" name="userName" id="userName"></input>
            </p>
            <button className={styles.btGo} onClick={ctrl.onSendResultsClick}>
                <span>ОТПРАВИТЬ</span>
            </button>
        </section>
    );
};
