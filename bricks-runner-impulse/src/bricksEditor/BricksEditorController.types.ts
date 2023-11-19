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
    inventory: Inventory;
    levelIndex: number;
}

export interface InventoryItem {
    enabled: boolean;
    count: number;
}

const defaultInventoryItem: InventoryItem = {
    enabled: false,
    count: 0
};

export interface Inventory {
    bricks: InventoryItem;
    stairs: InventoryItem;
}

export const defaultInventory: Inventory = {
    bricks: { ...defaultInventoryItem },
    stairs: { ...defaultInventoryItem }
};

export interface LevelInfo {
    mapFile: string;
    inventory: Inventory;
}

export interface LevelsApiAnswer {
    levels: LevelInfo[];
}
