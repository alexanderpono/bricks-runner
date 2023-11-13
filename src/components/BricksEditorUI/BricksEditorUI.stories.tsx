import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { BricksEditorUI } from './BricksEditorUI';
import { GameState, defaultGameState } from '../GameFieldUI/Game.types';
import { castPartialTo } from '@src/testFramework/castPartialTo';
import { BricksEditorControllerForChildren } from '@src/bricksEditor/bricksEditor.types';

export default {
    title: 'BricksEditorUI',
    decorators: [withKnobs]
};

export const Static = () => {
    const canvasRef = React.useRef(null);
    const gameState: GameState = { ...defaultGameState };
    const ctrl = castPartialTo<BricksEditorControllerForChildren>({
        onUIRender: () => {},
        onUIMounted: () => {}
    });
    return (
        <BricksEditorUI
            id={'id'}
            title={'title'}
            ref={canvasRef}
            ctrl={ctrl}
            gameState={gameState}
        />
    );
};
