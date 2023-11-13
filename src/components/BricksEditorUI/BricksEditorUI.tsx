import React from 'react';
import { GameFieldController, GameState } from '@src/components/GameFieldUI/Game.types';
import { GameControls } from '@src/components/GameFieldUI/GameControls';

interface BricksEditorUI {
    id: string;
    title: string;
    canvasW?: number;
    canvasH?: number;
    ctrl: GameFieldController;
    gameState: GameState;
}
export const BricksEditorUI = React.forwardRef<HTMLCanvasElement, BricksEditorUI>(
    ({ id, title, canvasW, canvasH, ctrl, gameState }, canvasRef) => {
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
