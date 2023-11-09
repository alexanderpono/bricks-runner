import { GameFieldController } from '@src/components/GameFieldUI/Game.types';

export interface BricksEditorControllerForChildren extends GameFieldController {
    onUIRender: () => void;
}
