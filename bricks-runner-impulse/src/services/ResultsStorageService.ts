import { LevelStats } from '@src/bricksEditor/BricksEditorController.types';
import saveas from 'file-saver';

export class ResultsStorageService {
    saveGameResults = (userName: string, stats: LevelStats[]) => {
        const fileText = `
userName: ${userName}
${stats
    .map((levelStats: LevelStats, index) => {
        return `level ${index + 1} steps:${levelStats.steps}`;
    })
    .join('\n')}
`;
        var blob = new Blob([fileText], { type: 'text/plain;charset=utf-8' });

        saveas(blob, 'results.txt');
    };
}
