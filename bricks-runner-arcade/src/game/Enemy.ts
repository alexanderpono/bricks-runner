import { ManAni } from '@src/ports/GR/GR.types';
import { LevelMap, Point2D } from './LevelMap';
import { ALL_NODES, PathCalculator, SILENT } from '@src/path/PathCalculator';
import { GridFromMap } from '@src/path/GridFromMap';
import { Grid } from '@src/path/path.types';

export class Enemy {
    manFieldXY: Point2D;
    nextManFieldXY: Point2D;
    miniCounter: number;
    manAni: ManAni;
    grid: Grid;

    constructor(
        private levelMap: LevelMap,
        private pathCalculator: PathCalculator,
        private gridBuilder: GridFromMap,
        manFieldXY: Point2D
    ) {
        this.miniCounter = 0;
        this.manFieldXY = { ...manFieldXY };
        this.nextManFieldXY = { ...manFieldXY };
        this.manAni = ManAni.STAND;
    }
}
