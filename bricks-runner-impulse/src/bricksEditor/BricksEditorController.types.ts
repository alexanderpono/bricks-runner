import { GameFieldController } from '@src/components/GameFieldUI/Game.types';

export interface BricksEditorControllerForUI extends GameFieldController {
    handleClickBtBrick?: () => void;
    handleClickBtStairs?: () => void;
    handleClickBtGold?: () => void;
    handleClickBtSpace?: () => void;
    onUploadFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClickBtSaveAs?: () => void;
}

export interface ShellState {
    isDevelopMope: boolean;
    curPathPos: number;
    inventory: InventoryItem[];
    levelIndex: number;
    curChar: string;
}

export interface InventoryItem {
    name: string;
    count: number;
    char: string;
}

const defaultInventoryItem: InventoryItem = {
    name: '',
    count: 0,
    char: ''
};

export interface LevelInfo {
    mapFile: string;
    inventory: InventoryItem[];
}

export interface LevelsApiAnswer {
    levels: LevelInfo[];
}
