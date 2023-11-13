import React from 'react';
import { ManAni } from '@src/ports/GR.types';
import { GameController } from './GameController';
import { SupaFieldUI } from '@src/components/GameFieldUI/SupaFieldUI';
import { GRField } from '@src/ports/GRField';
import { GRGold } from '@src/ports/GRGold';
import { GRGraph } from '@src/ports/GRGraph';
import { GRSelect } from '@src/ports/GRSelect';
import { RenderOptions } from '@src/components/GameFieldUI/Game.types';
import { GREater } from '@src/ports/GREater';
import { Point2D } from './GameField';

export class SupaController extends GameController {
    getUI = () => (
        <SupaFieldUI
            field={this.gameField}
            emptyField={this.emptyField}
            graph={this.graph}
            id={this.target}
            title={this.title}
            canvasW={this.canvasW}
            canvasH={this.canvasH}
            ref={this.canvasRef}
            canvas={this.canvasRef.current}
            ctrl={this}
            gameState={this.gameState}
            picLoaded={this.picLoaded}
        />
    );
    doTrajectoryStep = () => {
        if (this.curPathPos >= this.graph.cheapestPath.length) {
            return;
        }
        const curEdgeIndex = this.graph.cheapestPath[this.curPathPos];
        const edge = this.graph.edges[curEdgeIndex];
        const v0xy = this.gameField.vertexIndexToCoords(edge.vertex0, this.gameField.getWidth());
        const v1xy = this.gameField.vertexIndexToCoords(edge.vertex1, this.gameField.getWidth());
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
            let manAni = ManAni.DOWN;
            this.patchState({ manAni });
        }
        if (direction === 'up' && v1xy.y > v0xy.y) {
            this.nextManVIndex = edge.vertex0;
            let manAni = ManAni.UP;
            this.patchState({ manAni });
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

    renderScene = () => {
        if (!this.picLoaded) {
            return;
        }

        const canvas = this.canvasRef.current;
        const gameState = this.gameState;
        const graph = this.graph;
        const field = this.gameField;

        if (canvas === null) {
            return;
        }
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.fillStyle = 'orange';
        context.strokeStyle = '#FF0000';
        context.lineWidth = 3;
        context.strokeRect(0, 0, canvas.width, canvas.height);

        if (canvas === null || context === null || graph === null) {
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
        GREater.create(
            context,
            gameState.manScreenXY,
            gameState.manAni,
            gameState.pic,
            gameState.miniCounter
        ).draw();
        gameState.highlightCells.forEach((point: Point2D) => {
            GRSelect.create(context, point, gameState.pic).draw();
        });
    };
}
