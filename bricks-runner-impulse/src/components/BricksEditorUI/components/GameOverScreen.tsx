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
            <div className={styles.bg}></div>
            <div className={styles.content}>
                <div className={styles.win}>
                    <h1>ВАШИ РЕЗУЛЬТАТЫ:</h1>
                    {shellState.levelStats.map((levelStats, index) => (
                        <div key={index}>
                            <p>
                                УРОВЕНЬ {index + 1} &nbsp; ВРЕМЯ:
                                {formatTime(levelStats.time)} &nbsp; МОНЕТ:
                                {levelStats.coins}
                            </p>
                        </div>
                    ))}
                    <p className={styles.enterLogin}>Введите свой логин в Telegram:</p>
                    <p className={styles.tgLogin}>
                        @<input type="text" name="userName" id="userName"></input>
                    </p>
                    <button className={styles.appBut} onClick={ctrl.onSendResultsClick}>
                        <div>ОТПРАВИТЬ</div>
                    </button>
                </div>
            </div>
        </section>
    );
};
