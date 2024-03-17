import React from 'react';
import { render } from 'react-dom';
import { UI } from './components/UI';
import ImgSprite from '@src/components/UI/sprite.png';
import { level1 } from './ports/levels/level1';
import { Cell, DynamicObject, LevelMap, Point2D } from './game/LevelMap';
import { GRScene } from './ports/GR/GRScene';
import { Ani, Man } from './game/Man';
import { GridFromMap } from './path/GridFromMap';
import { ALL_NODES, PathCalculator, SILENT } from './path/PathCalculator';
import { Grid } from './path/path.types';
import { GRPath } from './ports/GR/GRPath';

export class GameController {
    picLoaded: boolean;
    level: string = '';
    levelMap: LevelMap = null;
    emptyLevel: LevelMap = null;
    pic: InstanceType<typeof Image> = new Image();
    man: Man;
    protected graphBuilder: GridFromMap = null;
    bestPathCalculator: PathCalculator = null;
    protected maxStepNo: number = ALL_NODES;
    protected grid: Grid = null;
    w: number = 0;
    manVIndex: number = 0;
    goldScreenXY: Point2D;
    private dObjects: DynamicObject[] = [];
    private gold: DynamicObject;

    constructor() {
        this.man = new Man();
        this.bestPathCalculator = new PathCalculator();
        this.graphBuilder = new GridFromMap();
    }

    run() {
        this.level = level1;
        this.levelMap = LevelMap.create().initFromText(this.level);
        this.w = this.levelMap.getWidth();

        render(<UI />, document.getElementById('game'));

        this.manVIndex = this.graphBuilder.getVertexIndex(this.level, 'M');
        this.man.onStart(this.levelMap.vertexIndexToCoords(this.manVIndex, this.w));

        this.loadPic().then(() => {
            this.picLoaded = true;
            this.calcField();
            this.renderScene();
        });

        document.getElementById('btRight').addEventListener('click', () => {
            this.stepRight();
        });
        document.getElementById('btLeft').addEventListener('click', () => {
            this.stepLeft();
        });
        document.getElementById('btDown').addEventListener('click', () => {
            this.stepDown();
        });
        document.getElementById('btUp').addEventListener('click', () => {
            this.stepUp();
        });
    }
    loadPic = () => {
        return new Promise((resolve) => {
            this.pic.src = ImgSprite;
            this.pic.onload = function () {
                resolve(true);
            };
        });
    };

    renderScene(): CanvasRenderingContext2D {
        const context = GRScene.create().render(
            this.picLoaded,
            this.levelMap,
            this.pic,
            this.man,
            this.dObjects
        );
        GRPath.create(context, this.levelMap, this.grid).draw();
        return context;
    }

    stepRight = () => {
        this.man.stepRight();
        this.tick();
    };

    stepLeft = () => {
        this.man.stepLeft();
        this.tick();
    };

    stepDown = () => {
        this.man.stepDown();
        this.tick();
    };

    stepUp = () => {
        this.man.stepUp();
        this.tick();
    };

    tick = () => {
        const manAnimationState = this.man.tick();
        if (manAnimationState === Ani.STOPPED) {
        } else {
            setTimeout(() => this.tick(), 100);
        }
        this.renderScene();
    };

    calculateBestPath = () => {
        let grid = this.graphBuilder.gridFromMap(this.levelMap);
        const mIndex = this.graphBuilder.getVertexIndex(this.level, 'M');
        const dIndex = this.graphBuilder.getVertexIndex(this.level, '$');
        grid = this.bestPathCalculator.calculateGraph(
            grid,
            mIndex,
            dIndex,
            SILENT,
            this.maxStepNo,
            this.levelMap
        );
        this.grid = grid;
    };

    initEmptyField = () => {
        const getEmptyMap = (s: string): string => {
            let s2 = s.replace('$', ' ');
            s2 = s2.replace('M', ' ');
            return s2;
        };
        const emptyMap = getEmptyMap(this.level);
        const field = LevelMap.create().initFromText(emptyMap);
        this.emptyLevel = field;
    };

    calcField() {
        this.initEmptyField();
        this.calculateBestPath();

        this.goldScreenXY = this.getGoldScreenXY();
        const getDynanicObjects = (field: LevelMap): DynamicObject[] => {
            const dynamicTypes = [Cell.gold, Cell.man, Cell.coin];
            const h = field.field.length;
            const w = field.field[0].length;
            const result: DynamicObject[] = [];
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const cell = field.field[y][x];
                    const pos = dynamicTypes.findIndex((type) => type === cell);
                    if (pos >= 0) {
                        result.push({ point: { x, y }, type: cell });
                    }
                }
            }
            return result;
        };

        this.dObjects = getDynanicObjects(this.levelMap);

        const gold = this.dObjects.find((dObject) => dObject.type === Cell.gold);
        if (typeof gold === 'object') {
            this.gold = gold;
        }
    }

    getGoldScreenXY = () => {
        const dIndex = this.graphBuilder.getVertexIndex(this.level, '$');
        return this.levelMap.vertexIndexToCoords(dIndex, this.w);
    };
}
