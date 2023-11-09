import { BricksEditorUI } from '@src/components/BricksEditorUI';
import {
    GameState,
    RenderOptions,
    defaultGameState,
    defaultRenderOptions
} from '@src/components/GameFieldUI/Game.types';
import { GameController, calcManScreenPos } from '@src/game/GameController';
import { GameField, Point2D, defaultPoint2D } from '@src/game/GameField';
import { AbstractGraph } from '@src/game/Graph.types';
import { ALL_NODES, GraphCalculator, SILENT } from '@src/game/GraphCalculator';
import { GraphCalculatorV2 } from '@src/game/GraphCalculatorV2';
import { GraphCalculatorV3 } from '@src/game/GraphCalculatorV3';
import { GraphFromField } from '@src/game/GraphFromField';
import { GraphFromFieldAdvancedV2 } from '@src/game/GraphFromFieldAdvancedV2';
import React from 'react';
import { render } from 'react-dom';
import ImgSprite from '@src/components/GameFieldUI/sprite.png';
import { GRField } from '@src/ports/GRField';
import { GRGold } from '@src/ports/GRGold';
import { GRGraph } from '@src/ports/GRGraph';
import { GRMan } from '@src/ports/GRMan';
import { GRSelect } from '@src/ports/GRSelect';
import { ManAni } from '@src/ports/GR.types';

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
const map2 = `
▓ M              ▓
▓▓▓▓▓▓▓▓╡▓▓▓▓▓▓▓▓▓
▓       ╡        ▓
▓▓▓▓▓▓▓▓▓▓▓▓╡▓▓▓▓▓
▓           ╡    ▓
▓▓▓╡▓▓▓▓▓╡▓▓▓▓╡▓▓▓
▓  ╡     ╡   $╡  ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    `;

const SIMPLE = new GraphFromField();
const ADVANCED_V2 = new GraphFromFieldAdvancedV2();
export class BricksEditorController extends GameController {
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

    // protected title: string = 'title';
    protected map: string;
    protected target: string = 'target';
    options: RenderOptions = { ...TELEPORT_CONTROLS };
    protected graphBuilder: GraphFromField;
    protected calculator = GraphCalculator;
    // protected verbose: boolean,
    stepNo: number = ALL_NODES;

    maxMiniCounter = 9;
    curPathPos = 0;
    manVIndex: number;
    nextManVIndex: number;

    constructor() {
        super(
            'title',
            map2,
            'target',
            { ...TELEPORT_CONTROLS },
            ADVANCED_V2,
            GraphCalculatorV2,
            true,
            ALL_NODES
        );
        this.graphBuilder = ADVANCED_V2;
        // this.calculator = new GraphCalculatorV2();
        this.map = map2;
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
        // this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    onLoadPic = () => {
        this.picLoaded = true;

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
        const calc = new this.calculator();
        graph = calc.calculateGraph(graph, mIndex, dIndex, SILENT, this.stepNo, gameField);
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

        return Promise.resolve(true);
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
            />,
            document.getElementById('bricksEditor')
        );
    };

    // patchState = (mixin: Partial<GameState>) => (this.gameState = { ...this.gameState, ...mixin });
    // nodesClicked = () => {
    //     this.patchState({ nodesChecked: !this.gameState.nodesChecked });
    //     this.renderUI();
    //     this.renderScene();
    // };
    // linesClicked = () => {
    //     this.patchState({ linesChecked: !this.gameState.linesChecked });
    //     this.renderUI();
    //     this.renderScene();
    // };
    // pathClicked = () => {
    //     this.patchState({ pathChecked: !this.gameState.pathChecked });
    //     this.renderUI();
    //     this.renderScene();
    // };
    // nodesCostClicked = () => {
    //     this.patchState({ nodesCostChecked: !this.gameState.nodesCostChecked });
    //     this.renderUI();
    //     this.renderScene();
    // };
    // mapClicked = () => {
    //     this.gameState = { ...this.gameState, mapChecked: !this.gameState.mapChecked };
    //     this.renderUI();
    //     this.renderScene();
    // };

    // onBtStartClick = () => {};
    // onBtClearClick = () => {};
    // onMaxStepChange = (evt) => {};
    // onBtToStartClick = () => {};
    // onBtPrevClick = () => {};
    // onBtNextClick = () => {};
    // onBtNextJumpClick = () => {};
    // onBtToFinishClick = () => {};
    onUIRender = () => {
        console.log('BricksEditorController() onUIRender()');
        this.renderScene();
    };

    renderScene = () => {
        console.log('BricksEditorController this.picLoaded=', this.picLoaded);
        if (!this.picLoaded) {
            return;
        }

        console.log('GameFieldUI() this.canvasRef=', this.canvasRef);
        const canvas = this.canvasRef.current;

        console.log('GameFieldUI() canvas=', canvas);
        if (canvas === null) {
            return;
        }

        const context = canvas.getContext('2d') as CanvasRenderingContext2D;

        if (canvas === null || context === null || this.graph === null) {
            return;
        }

        context.fillStyle = 'orange';
        context.strokeStyle = '#FF0000';
        context.lineWidth = 3;
        context.strokeRect(0, 0, canvas.width, canvas.height);

        const options: RenderOptions = {
            nodes: this.gameState.nodesChecked,
            lines: this.gameState.linesChecked,
            path: this.gameState.pathChecked,
            nodesCost: this.gameState.nodesCostChecked,
            nodesShortCost: this.gameState.nodesShortCost,
            map: this.gameState.mapChecked,
            showBtMap: this.gameState.showBtMap,
            showBtNodes: this.gameState.showBtNodes,
            showBtEdges: this.gameState.showBtEdges,
            showBtStartStop: this.gameState.showBtStartStop,
            highlightCells: this.gameState.highlightCells,
            showBtPath: this.gameState.showBtPath,
            showBtCost: this.gameState.showBtCost,
            showProgress: this.gameState.showProgress,
            curVertexIndex: this.gameState.curVertexIndex
        };

        GRField.create(context, this.emptyField, this.gameState.pic, options).draw();
        GRGold.create(context, this.gameState.goldScreenXY, this.gameState.pic).draw();
        GRGraph.create(context, this.gameField, this.graph, options).draw();
        GRMan.create(
            context,
            this.gameState.manScreenXY,
            this.gameState.manTargetScreenXY,
            this.gameState.manAni,
            this.gameState.pic,
            this.gameState.miniCounter
        ).draw();
        this.gameState.highlightCells.forEach((point: Point2D) => {
            GRSelect.create(context, point, this.gameState.pic).draw();
        });
    };

    loadPic = () => {
        return new Promise((resolve) => {
            this.gameState.pic.src = ImgSprite;
            this.gameState.pic.onload = function () {
                resolve(true);
            };
        });
    };

    run = () => {
        this.renderUI();
    };

    static create(): BricksEditorController {
        return new BricksEditorController();
    }
}
