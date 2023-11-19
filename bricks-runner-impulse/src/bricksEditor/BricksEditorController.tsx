import { BricksEditorUI } from '@src/components/BricksEditorUI';
import {
    RenderOptions,
    defaultGameState,
    defaultRenderOptions
} from '@src/components/GameFieldUI/Game.types';
import { GameController } from '@src/game/GameController';
import { FieldChars, defaultPoint2D } from '@src/game/GameField';
import { ALL_NODES } from '@src/game/GraphCalculator';
import { GraphFromField } from '@src/game/GraphFromField';
import { GraphFromFieldAdvancedV2 } from '@src/game/GraphFromFieldAdvancedV2';
import React from 'react';
import { render } from 'react-dom';
import { ManAni, SPRITE_HEIGHT, SPRITE_WIDTH } from '@src/ports/GR.types';
import { MapStorageService } from '@src/services/MapStrorageService';
import { GraphFromFieldAdvanced } from '@src/game/GraphFromFieldAdvanced';
import { GraphCalculatorV3 } from '@src/game/GraphCalculatorV3';
import { GraphCalculatorV5f } from '@src/game/GraphCalculatorV5f';
import { Inventory, LevelsApiAnswer, defaultInventory } from './BricksEditorController.types';

const TELEPORT_CONTROLS: RenderOptions = {
    ...defaultRenderOptions,
    map: true,
    path: false,
    showBtMap: true,
    showBtNodes: true,
    showBtEdges: true,
    showBtPath: true,
    showBtCost: true,
    showBtStartStop: true
};

const SIMPLE = new GraphFromField();
const ADVANCED = new GraphFromFieldAdvanced();
const ADVANCED_V2 = new GraphFromFieldAdvancedV2();
export class BricksEditorController extends GameController {
    options: RenderOptions = { ...TELEPORT_CONTROLS };
    curChar: string = FieldChars.wall;
    private mapStorage: MapStorageService = null;
    private isDevelopMope = false;
    private levelsAnswer: LevelsApiAnswer;
    private currentLevel = 0;
    private inventory: Inventory = { ...defaultInventory };

    constructor() {
        super(
            '',
            '',
            'target',
            { ...TELEPORT_CONTROLS },
            ADVANCED_V2,
            GraphCalculatorV3,
            // GraphCalculatorV5f,
            false,
            ALL_NODES,
            1440,
            760
        );
        this.mapStorage = new MapStorageService();
        this.graphBuilder = ADVANCED_V2;
        this.gameState = {
            ...defaultGameState,
            nodesChecked: this.options.nodes,
            linesChecked: this.options.lines,
            pathChecked: this.options.path,
            nodesCostChecked: this.options.nodesCost,
            nodesShortCost: this.options.nodesShortCost,
            mapChecked: this.options.map,
            showControls: true,
            pic: new Image(),
            goldScreenXY: { ...defaultPoint2D },
            manScreenXY: { ...defaultPoint2D },
            miniCounter: 0,
            manAni: ManAni.STAND,
            highlightCells: this.options.highlightCells,
            maxCalcStep: this.stepNo,
            showBtNodes: this.options.showBtNodes,
            showBtEdges: this.options.showBtEdges,
            showBtStartStop: this.options.showBtStartStop,
            showBtPath: this.options.showBtPath,
            showBtCost: this.options.showBtCost,
            showProgress: this.options.showProgress
        };
    }

    go = () => {
        const isInCache = this.mapStorage.isMapInCache();
        if (!isInCache) {
            this.map = this.mapStorage.getDefaultMap();
            this.mapStorage.cacheMap(this.map);
        } else {
            this.map = this.mapStorage.getMapFromCache();
        }
        this.calcField();
        this.renderUI();

        if (!this.isDevelopMope) {
            this.loadGame();
        }
    };

    onUIMounted() {
        super.onUIMounted();
        this.canvasRef.current.addEventListener('click', this.handleCanvasClick);
    }

    onUIUnmounted() {
        this.canvasRef.current.removeEventListener('click', this.handleCanvasClick);
    }

    handleCanvasClick = (evt: MouseEvent) => {
        const x = evt.offsetX;
        const y = evt.offsetY;
        const cellX = Math.floor(x / SPRITE_WIDTH);
        const cellY = Math.floor(y / SPRITE_HEIGHT);
        const lines = this.map.trim().split('\n');
        const line = lines[cellY];
        const lineAr = line.split('');
        const curVal = lineAr[cellX];
        const newVal = curVal === this.curChar ? FieldChars.space : this.curChar;
        lineAr[cellX] = newVal;
        lines[cellY] = lineAr.join('');
        const newMap = lines.join('\n');
        this.map = newMap;

        this.calcField();
        this.renderScene();
        this.mapStorage.cacheMap(this.map);
    };

    renderUI = () => {
        render(
            <BricksEditorUI
                id={this.target}
                title={this.title}
                canvasW={this.canvasW}
                canvasH={this.canvasH}
                ref={this.canvasRef}
                ctrl={this}
                gameState={this.gameState}
                curPathPos={this.curPathPos}
                shellState={{
                    isDevelopMope: this.isDevelopMope,
                    curPathPos: this.curPathPos,
                    inventory: this.inventory
                }}
            />,
            document.getElementById('bricksEditor')
        );
    };

    handleClickBtBrick = () => {
        this.curChar = FieldChars.wall;
    };
    handleClickBtStairs = () => {
        this.curChar = FieldChars.stairs;
    };
    handleClickBtGold = () => {
        this.curChar = FieldChars.gold;
    };
    handleClickBtSpace = () => {
        this.curChar = FieldChars.space;
    };
    onUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let file: File | null = e.target.files ? e.target.files[0] : null;

        if (typeof file?.name !== 'string') {
            console.log('onUploadFileChange(): unrecognized data');
            return;
        }
        try {
            this.mapStorage.readMap(file).then((map: string) => {
                this.map = map;
                this.mapStorage.cacheMap(this.map);
                this.calcField();
                this.renderScene();
            });
        } catch (e) {
            console.error('onUploadFileChange() e=', e);
        }
        e.target.value = '';
    };

    handleClickBtSaveAs = () => {
        this.mapStorage.saveMap(this.map);
    };

    onUpdateCurPathPos = () => {
        this.renderUI();
    };

    loadLevels = (): Promise<LevelsApiAnswer> => {
        return this.mapStorage.loadLevels();
    };

    loadGame = () => {
        this.loadLevels().then((levelsAnswer: LevelsApiAnswer) => {
            console.log('levelsAnswer=', levelsAnswer);
            this.levelsAnswer = levelsAnswer;
            this.loadLevel(0).then((map) => {
                this.map = map.trim();
                this.inventory = { ...this.levelsAnswer.levels[0].inventory };
                console.log('this.inventory=', this.inventory);
                this.mapStorage.cacheMap(this.map);
                this.calcField();
                this.renderScene();
            });
        });
    };

    wait = (millisec: number): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, millisec);
        });
    };

    getMapForLevel = (levelLndex: number): Promise<string> => {
        const levelInfo = this.levelsAnswer.levels[levelLndex];
        return this.mapStorage.getMapFromHttpFile(`./data/${levelInfo.mapFile}`);
    };

    loading = false;
    loadLevel = async (levelLndex: number) => {
        this.loading = true;
        console.log('loadLevel() this.loading=', this.loading);
        const levelMap = await this.getMapForLevel(levelLndex);
        console.log('loadLevel() levelMap=', levelMap);
        this.loading = false;
        console.log('loadLevel() this.loading=', this.loading);
        return levelMap;
    };

    handleClickIsDevelopMode = () => {
        console.log('this.handleClickIsDevelopMode()');
        this.isDevelopMope = !this.isDevelopMope;
        if (!this.isDevelopMope) {
            this.patchState({
                showBtMap: false,
                showBtNodes: false,
                showBtEdges: false,
                showBtStartStop: false,
                showBtPath: false,
                showBtCost: false
            });
            this.loadGame();
        } else {
            this.patchState({
                showBtMap: true,
                showBtNodes: true,
                showBtEdges: true,
                showBtStartStop: true,
                showBtPath: true,
                showBtCost: true
            });
        }

        this.renderUI();
    };
}
