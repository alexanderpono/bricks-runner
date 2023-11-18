import { GameFieldController } from '@src/components/GameFieldUI/Game.types';

export interface BricksEditorControllerForUI extends GameFieldController {
    handleClickBtBrick?: () => void;
    handleClickBtStairs?: () => void;
    handleClickBtGold?: () => void;
    handleClickBtSpace?: () => void;
    onUploadFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClickBtSaveAs?: () => void;
}
