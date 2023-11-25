import React from 'react';
import styles from '@src/components/BricksEditorUI/BricksEditorUI.scss';
import { ShellState } from '@src/bricksEditor/BricksEditorController.types';
import { formatTime } from '@src/adapters/formatTime';

interface LevelStatsProps {
    shellState: ShellState;
}
export const LevelStats: React.FC<LevelStatsProps> = ({ shellState }) => {
    return (
        <>
            <article className={styles.statsCoins}>{shellState.coinsTaken}</article>
            <article className={styles.statsSteps}>{shellState.curPathPos}</article>
            <article className={styles.statsLevel}>{shellState.levelIndex + 1}</article>
            <article className={styles.statsTime}>{formatTime(shellState.levelTime)}</article>
        </>
    );
};
