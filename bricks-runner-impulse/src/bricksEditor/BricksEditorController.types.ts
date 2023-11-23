import { GameFieldController } from '@src/components/GameFieldUI/Game.types';
import { Cell, Point2D } from '@src/game/GameField';

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
    levelStats: LevelStats[];
    isGameOver: boolean;
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

export interface DynamicObject {
    point: Point2D;
    type: Cell;
}

export interface LevelStats {
    steps: number;
}
