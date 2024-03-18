import { ManAni } from '@src/ports/GR/GR.types';
import { LevelMap, Point2D } from './LevelMap';
import { ALL_NODES, PathCalculator, SILENT } from '@src/path/PathCalculator';
import { GridFromMap } from '@src/path/GridFromMap';
import { Grid } from '@src/path/path.types';
import { Man } from './Man';

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
        manFieldXY: Point2D,
        private man: Man
    ) {
        this.miniCounter = 0;
        this.manFieldXY = { ...manFieldXY };
        this.nextManFieldXY = { ...manFieldXY };
        this.manAni = ManAni.STAND;
    }

    calculatePath = () => {
        let grid = this.gridBuilder.gridFromMap(this.levelMap);
        const mIndex = this.levelMap.coordToVertexIndex(this.manFieldXY);
        const dIndex = this.levelMap.coordToVertexIndex(this.man.manFieldXY);
        grid = this.pathCalculator.calculateGraph(
            grid,
            mIndex,
            dIndex,
            SILENT,
            ALL_NODES,
            this.levelMap
        );
        this.grid = grid;
    };
}
