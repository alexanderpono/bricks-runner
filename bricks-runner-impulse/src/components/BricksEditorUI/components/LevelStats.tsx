import React from 'react';
import styles from '@src/components/BricksEditorUI/BricksEditorUI.scss';
import { ShellState, defaultLevelStats } from '@src/bricksEditor/BricksEditorController.types';
import { formatTime } from '@src/adapters/formatTime';
import { LevelStats as LevelStatsStruct } from '@src/bricksEditor/BricksEditorController.types';

interface LevelStatsProps {
    shellState: ShellState;
}
export const LevelStats: React.FC<LevelStatsProps> = ({ shellState }) => {
    const currentSumma: LevelStatsStruct = { ...defaultLevelStats };
    shellState.levelStats.forEach((level) => {
        currentSumma.coins += level.coins;
    });
    currentSumma.coins += shellState.coinsTaken;
    return (
        <>
            <article className={styles.statsCoins}>{currentSumma.coins}</article>
            <article className={styles.statsLevel}>
                {shellState.levelIndex + 1}/{shellState.levels.length}
            </article>
            <article className={styles.statsTime}>{formatTime(shellState.levelTime)}</article>
        </>
    );
};
