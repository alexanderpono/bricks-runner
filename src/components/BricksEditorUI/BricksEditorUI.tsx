import React from 'react';
import { GameState } from '@src/components/GameFieldUI/Game.types';
import { BricksEditorControllerForChildren } from '@src/bricksEditor/bricksEditor.types';
import { GameControls } from '@src/components/GameFieldUI/GameControls';

interface BricksEditorUI {
    id: string;
    title: string;
    canvasW?: number;
    canvasH?: number;
    ctrl: BricksEditorControllerForChildren;
    gameState: GameState;
}
export const BricksEditorUI = React.forwardRef<HTMLCanvasElement, BricksEditorUI>(
    ({ id, title, canvasW, canvasH, ctrl, gameState }, canvasRef) => {
        React.useLayoutEffect(() => {
            ctrl.onUIRender();
        }, []);

        return (
            <div>
                BricksEditorUI
                <GameControls
                    id={id}
                    title={title}
                    canvasW={canvasW}
                    canvasH={canvasH}
                    ref={canvasRef}
                    ctrl={ctrl}
                    gameState={gameState}
                />
            </div>
        );
    }
);
