import React from 'react';
import { render } from 'react-dom';
import { ALL_NODES, GraphCalculator, SILENT } from './GraphCalculator';
import { GameState, RenderOptions, defaultGameState } from '@src/components/GameFieldUI/Game.types';
import { Cell, GameField, Point2D, defaultPoint2D } from './GameField';
import { ManAni, SPRITE_HEIGHT, SPRITE_WIDTH } from '@src/ports/GR.types';
import ImgSprite from '@src/components/GameFieldUI/sprite.png';
import { GraphFromField } from './GraphFromField';
import { AbstractGraph } from './Graph.types';
import { GRField } from '@src/ports/GRField';
import { GRGold } from '@src/ports/GRGold';
import { GRGraph } from '@src/ports/GRGraph';
import { GRMan } from '@src/ports/GRMan';
import { GRSelect } from '@src/ports/GRSelect';
import { GameControls } from '@src/components/GameFieldUI/GameControls';

export class GameController {
    protected gameState: GameState;
    protected picLoaded: boolean = false;
    protected emptyField: GameField = GameField.create();
    protected manFieldXY: Point2D = { ...defaultPoint2D };
    protected nextManFieldXY: Point2D = { ...defaultPoint2D };
    protected graph: AbstractGraph = null;
    protected gameField: GameField = null;
    protected canvasW = 720;
    protected canvasH = 320;
    protected canvasRef: React.RefObject<HTMLCanvasElement>;
    protected w: number = 0;

    constructor(
        protected title: string,
        protected map: string,
        protected target: string,
        options: RenderOptions,
        protected graphBuilder: GraphFromField,
        protected calculator: typeof GraphCalculator,
        protected verbose: boolean,
        protected maxStepNo: number = ALL_NODES
    ) {
        this.gameState = {
            ...defaultGameState,
            nodesChecked: options.nodes,
            linesChecked: options.lines,
            pathChecked: options.path,
            nodesCostChecked: options.nodesCost,
            nodesShortCost: options.nodesShortCost,
            mapChecked: options.map,
            showControls: true,
            pic: new Image(),
            goldScreenXY: { ...defaultPoint2D },
            manScreenXY: { ...defaultPoint2D },
            miniCounter: 0,
            manAni: ManAni.STAND,
            highlightCells: options.highlightCells,
            maxCalcStep: this.maxStepNo,
            showBtNodes: options.showBtNodes,
            showBtEdges: options.showBtEdges,
            showBtStartStop: options.showBtStartStop,
            showBtPath: options.showBtPath,
            showBtCost: options.showBtCost,
            showProgress: options.showProgress
        };
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    go = () => {
        this.renderUI();
    };

    calcField = () => {
        const getEmptyMap = (s: string): string => {
            let s2 = s.replace('$', ' ');
            s2 = s2.replace('M', ' ');
            return s2;
        };
        const emptyMap = getEmptyMap(this.map);
        const field = GameField.create().initFromText(emptyMap);
        this.emptyField = field;

        const gameField = GameField.create().initFromText(this.map);
        let graph = this.graphBuilder.graphFromField(gameField);
        const mIndex = this.graphBuilder.getVertexIndex(this.map, 'M');
        const dIndex = this.graphBuilder.getVertexIndex(this.map, '$');
        graph = new this.calculator().calculateGraph(
            graph,
            mIndex,
            dIndex,
            SILENT,
            this.maxStepNo,
            gameField
        );
        this.w = gameField.getWidth();
        const goldScreenXY = gameField.vertexIndexToCoords(dIndex, this.w);
        const manFieldXY = gameField.vertexIndexToCoords(mIndex, this.w);
        const manScreenXY = calcManScreenPos(
            manFieldXY,
            this.nextManFieldXY,
            this.gameState.miniCounter
        );

        this.graph = graph;
        this.gameField = gameField;
        this.manFieldXY = manFieldXY;
        this.gameState = {
            ...this.gameState,
            manScreenXY,
            goldScreenXY,
            curVertexIndex: graph.curVertexIndex
        };

        this.manVIndex = mIndex;
        this.nextManVIndex = mIndex;
        this.curPathPos = 0;
    };

    onUIMounted() {
        this.loadPic().then(() => {
            this.picLoaded = true;

            this.calcField();
            this.renderScene();
        });
    }
    onUIUnmounted() {}

    renderScene = () => {
        if (!this.picLoaded) {
            console.log('GameFieldUI() !picLoaded');
            return;
        }

        const canvas = this.canvasRef.current;
        const gameState = this.gameState;
        const graph = this.graph;
        const field = this.gameField;

        if (canvas === null) {
            console.log('GameFieldUI() canvas === null');
            return;
        }
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.fillStyle = 'orange';
        context.strokeStyle = '#FF0000';
        context.lineWidth = 3;
        context.strokeRect(0, 0, canvas.width, canvas.height);

        if (canvas === null || context === null || graph === null) {
            console.log('GameFieldUI() graph === null');
            return;
        }

        const options: RenderOptions = {
            nodes: gameState.nodesChecked,
            lines: gameState.linesChecked,
            path: gameState.pathChecked,
            nodesCost: gameState.nodesCostChecked,
            nodesShortCost: gameState.nodesShortCost,
            map: gameState.mapChecked,
            showBtMap: gameState.showBtMap,
            showBtNodes: gameState.showBtNodes,
            showBtEdges: gameState.showBtEdges,
            showBtStartStop: gameState.showBtStartStop,
            highlightCells: gameState.highlightCells,
            showBtPath: gameState.showBtPath,
            showBtCost: gameState.showBtCost,
            showProgress: gameState.showProgress,
            curVertexIndex: gameState.curVertexIndex
        };

        GRField.create(context, this.emptyField, gameState.pic, options).draw();
        GRGold.create(context, gameState.goldScreenXY, gameState.pic).draw();
        GRGraph.create(context, field, graph, options).draw();
        GRMan.create(
            context,
            gameState.manScreenXY,
            gameState.manTargetScreenXY,
            gameState.manAni,
            gameState.pic,
            gameState.miniCounter
        ).draw();
        gameState.highlightCells.forEach((point: Point2D) => {
            GRSelect.create(context, point, gameState.pic).draw();
        });
    };

    renderUI = () => {
        render(this.getUI(), document.getElementById(this.target));
    };

    getUI = () => (
        <GameControls
            id={this.target}
            title={this.title}
            canvasW={this.canvasW}
            canvasH={this.canvasH}
            ref={this.canvasRef}
            ctrl={this}
            gameState={this.gameState}
        />
    );

    loadPic = () => {
        return new Promise((resolve) => {
            this.gameState.pic.src = ImgSprite;
            this.gameState.pic.onload = function () {
                resolve(true);
            };
        });
    };

    patchState = (mixin: Partial<GameState>) => (this.gameState = { ...this.gameState, ...mixin });
    nodesClicked = () => {
        this.patchState({ nodesChecked: !this.gameState.nodesChecked });
        this.renderUI();
        this.renderScene();
    };
    linesClicked = () => {
        this.patchState({ linesChecked: !this.gameState.linesChecked });
        this.renderUI();
        this.renderScene();
    };
    pathClicked = () => {
        this.patchState({ pathChecked: !this.gameState.pathChecked });
        this.renderUI();
        this.renderScene();
    };
    nodesCostClicked = () => {
        this.patchState({ nodesCostChecked: !this.gameState.nodesCostChecked });
        this.renderUI();
        this.renderScene();
    };
    mapClicked = () => {
        this.gameState = { ...this.gameState, mapChecked: !this.gameState.mapChecked };
        this.renderUI();
        this.renderScene();
    };
    onBtStartClick = () => {
        this.patchState({ manAni: ManAni.RIGHT });
        this.doTrajectoryStep();
        this.nextManFieldXY = this.gameField.vertexIndexToCoords(this.nextManVIndex, this.w);
        this.tick();
    };
    onBtClearClick = () => {
        this.stepNo = 0;
        this.maxMiniCounter = 9;
        const mIndex = this.graphBuilder.getVertexIndex(this.map, 'M');
        this.manVIndex = mIndex;
        this.nextManVIndex = mIndex;
        this.curPathPos = 0;

        this.doTrajectoryStep();
        this.manFieldXY = this.gameField.vertexIndexToCoords(mIndex, this.w);
        this.nextManFieldXY = this.gameField.vertexIndexToCoords(this.nextManVIndex, this.w);
        const miniCounter = 0;
        const manScreenXY = calcManScreenPos(this.manFieldXY, this.nextManFieldXY, miniCounter);

        this.patchState({ miniCounter, manAni: ManAni.STAND, manScreenXY });
        this.renderUI();
        this.renderScene();
    };

    stepNo = 0;
    maxMiniCounter = 9;
    curPathPos = 0;
    manVIndex: number;
    nextManVIndex: number;
    tick = () => {
        this.verbose &&
            console.log(
                'tick() this.miniCounter=',
                this.gameState.miniCounter,
                this.curPathPos,
                this.stepNo,
                this.manVIndex,
                this.nextManVIndex,
                this.gameState.manAni
            );
        if ((this.gameState.miniCounter + 1) % 10 === 0) {
            if (this.curPathPos < this.graph.cheapestPath.length) {
                this.curPathPos++;
                this.stepNo++;
            }
            this.manVIndex = this.nextManVIndex;
            this.doTrajectoryStep();
            this.manFieldXY = this.gameField.vertexIndexToCoords(this.manVIndex, this.w);
            this.nextManFieldXY = this.gameField.vertexIndexToCoords(this.nextManVIndex, this.w);

            const miniCounter = this.gameState.miniCounter + 1;
            const manScreenXY = calcManScreenPos(this.manFieldXY, this.nextManFieldXY, miniCounter);
            let manTargetScreenXY: Point2D = { ...defaultPoint2D };
            if (this.gameState.manAni === ManAni.TELEPORT) {
                manTargetScreenXY = {
                    x: this.nextManFieldXY.x * SPRITE_WIDTH,
                    y: this.nextManFieldXY.y * SPRITE_HEIGHT
                };
            }
            this.patchState({ manScreenXY, miniCounter, manTargetScreenXY });
            this.renderScene();
        } else {
            const miniCounter = this.gameState.miniCounter + 1;
            let manScreenXY = calcManScreenPos(this.manFieldXY, this.nextManFieldXY, miniCounter);
            let manTargetScreenXY: Point2D = { ...defaultPoint2D };
            if (this.gameState.manAni === ManAni.TELEPORT) {
                manScreenXY = {
                    x: this.manFieldXY.x * SPRITE_WIDTH,
                    y: this.manFieldXY.y * SPRITE_HEIGHT
                };
                manTargetScreenXY = {
                    x: this.nextManFieldXY.x * SPRITE_WIDTH,
                    y: this.nextManFieldXY.y * SPRITE_HEIGHT
                };
            }
            this.patchState({ manScreenXY, miniCounter, manTargetScreenXY });
            this.renderScene();
        }
        if (this.stepNo < this.graph.cheapestPath.length) {
            setTimeout(() => this.tick(), 25);
        } else {
            this.patchState({ manAni: ManAni.STAND });
            this.renderScene();
        }
    };

    doTrajectoryStep = () => {
        if (this.curPathPos >= this.graph.cheapestPath.length) {
            return;
        }
        const curEdgeIndex = this.graph.cheapestPath[this.curPathPos];
        const edge = this.graph.edges[curEdgeIndex];
        const v0xy = this.gameField.vertexIndexToCoords(edge.vertex0, this.gameField.getWidth());
        const v1xy = this.gameField.vertexIndexToCoords(edge.vertex1, this.gameField.getWidth());
        const v0Cell = this.gameField.coordsToCell(v0xy);
        const v1Cell = this.gameField.coordsToCell(v1xy);
        const edgeOrientation = v0xy.y === v1xy.y ? 'hor' : 'vert';
        let direction = '';
        if (edgeOrientation === 'hor' && v1xy.x > v0xy.x && this.manVIndex === edge.vertex0) {
            direction = 'right';
        }
        if (edgeOrientation === 'hor' && v1xy.x > v0xy.x && this.manVIndex === edge.vertex1) {
            direction = 'left';
        }
        if (edgeOrientation === 'vert' && v1xy.y > v0xy.y && this.manVIndex === edge.vertex0) {
            direction = 'down';
        }
        if (edgeOrientation === 'vert' && v1xy.y > v0xy.y && this.manVIndex === edge.vertex1) {
            direction = 'up';
        }
        this.verbose && console.log(`doTrajectoryStep() edge=`, edge, direction);
        this.verbose && console.log(`doTrajectoryStep() v1xy=`, v1xy, v0xy);

        if (direction === 'right') {
            this.nextManVIndex = edge.vertex1;
            this.patchState({ manAni: ManAni.RIGHT });
        }
        if (direction === 'up' && v1xy.y > v0xy.y) {
            this.nextManVIndex = edge.vertex0;
            this.patchState({ manAni: ManAni.STAIRS });
        }
        if (direction === 'left' && v1xy.x > v0xy.x) {
            this.nextManVIndex = edge.vertex0;
            this.patchState({ manAni: ManAni.LEFT });
        }
        if (direction === 'down' && v1xy.y > v0xy.y) {
            this.nextManVIndex = edge.vertex1;
            const cell1 = this.gameField.field[v0xy.y][v0xy.x];
            const cell2 = this.gameField.field[v1xy.y][v1xy.x];
            let manAni = ManAni.STAND;
            if (cell1 === Cell.stairs || cell2 === Cell.stairs) {
                manAni = ManAni.STAIRS;
            }
            this.patchState({ manAni });
        }

        if (v0Cell === Cell.teleport && v1Cell === Cell.teleport) {
            this.patchState({ manAni: ManAni.TELEPORT });
        }
        this.verbose &&
            console.log(
                `doTrajectoryStep() this.manVIndex="${this.manVIndex}"`,
                this.curPathPos,
                this.graph.cheapestPath.length,
                edgeOrientation,
                direction
            );
    };

    onMaxStepChange = (evt) => {
        console.log(evt.target.value);
        const maxStep = parseInt(evt.target.value);
        this.recalcGraph(maxStep);
        this.renderUI();
    };

    recalcGraph = (maxStep: number) => {
        this.patchState({ maxCalcStep: maxStep });
        let graph = this.graphBuilder.graphFromField(this.gameField);
        const mIndex = this.graphBuilder.getVertexIndex(this.map, 'M');
        const dIndex = this.graphBuilder.getVertexIndex(this.map, '$');
        graph = new this.calculator().calculateGraph(
            graph,
            mIndex,
            dIndex,
            SILENT,
            maxStep,
            this.gameField
        );

        this.graph = graph;
        this.gameState = {
            ...this.gameState,
            curVertexIndex: graph.curVertexIndex
        };
    };

    onBtToStartClick = () => {
        const maxStep = 1;
        this.recalcGraph(maxStep);
        this.renderUI();
    };
    onBtPrevClick = () => {
        const maxStep = this.gameState.maxCalcStep > 1 ? this.gameState.maxCalcStep - 1 : 1;
        this.recalcGraph(maxStep);
        this.renderUI();
    };
    onBtNextClick = () => {
        const maxStep =
            this.gameState.maxCalcStep < ALL_NODES ? this.gameState.maxCalcStep + 1 : ALL_NODES;
        this.recalcGraph(maxStep);
        this.renderUI();
    };
    onBtNextJumpClick = () => {
        const maxStep =
            this.gameState.maxCalcStep + 10 < ALL_NODES
                ? this.gameState.maxCalcStep + 10
                : ALL_NODES;
        this.recalcGraph(maxStep);
        this.renderUI();
    };
    onBtToFinishClick = () => {
        const maxStep = ALL_NODES;
        this.recalcGraph(maxStep);
        this.renderUI();
    };
}

export function calcManScreenPos(
    manFieldXY: Point2D,
    nextManFieldXY: Point2D,
    miniCounter: number
) {
    const deltaX = nextManFieldXY.x - manFieldXY.x;
    const deltaY = nextManFieldXY.y - manFieldXY.y;
    const manScreenXY = {
        x: (manFieldXY.x + (deltaX / 10) * (miniCounter % 10)) * SPRITE_WIDTH,
        y: (manFieldXY.y + (deltaY / 10) * (miniCounter % 10)) * SPRITE_HEIGHT
    };
    return manScreenXY;
}
