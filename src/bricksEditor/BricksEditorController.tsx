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
    options: RenderOptions = { ...TELEPORT_CONTROLS };

    constructor() {
        super(
            'title',
            map2,
            'target',
            { ...TELEPORT_CONTROLS },
            ADVANCED_V2,
            GraphCalculatorV2,
            false,
            ALL_NODES
        );
        this.graphBuilder = ADVANCED_V2;
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
}
