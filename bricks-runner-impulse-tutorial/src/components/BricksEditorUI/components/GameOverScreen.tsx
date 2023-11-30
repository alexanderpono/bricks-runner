import React from 'react';
import { GameFieldController } from '@src/components/GameFieldUI/Game.types';
import styles from '@src/components/BricksEditorUI/BricksEditorUI.scss';
import { formatTime } from '@src/adapters/formatTime';
import { ShellState } from '@src/bricksEditor/BricksEditorController.types';
import { calcSumma } from '@src/services/calcSumma';

interface GameOverScreenProps {
    ctrl: GameFieldController;
    shellState: ShellState;
}
export const GameOverScreen: React.FC<GameOverScreenProps> = ({ ctrl, shellState }) => {
    const currentSumma = calcSumma(shellState.levelStats);

    return (
        <section className={styles.gameOverScreen}>
            <div className={styles.bg}></div>
            <div className={styles.content}>
                <div className={styles.win}>
                    <h1>ВАШИ РЕЗУЛЬТАТЫ:</h1>
                    {shellState.levelStats.map((levelStats, index) => (
                        <div key={index}>
                            УРОВЕНЬ {index + 1} &nbsp; МОНЕТ:
                            {levelStats.coins} &nbsp; ВРЕМЯ:
                            {formatTime(levelStats.time)} <br />
                        </div>
                    ))}

                    <p>
                        ОБЩЕЕ КОЛИЧЕСТВО МОНЕТ: {currentSumma.coins} <br />
                        ОБЩЕЕ ВРЕМЯ РЕШЕНИЯ ЗАДАЧ: {formatTime(currentSumma.time)}
                    </p>

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
