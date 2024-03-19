import { ManAni } from '@src/ports/GR/GR.types';
import { LevelMap, Point2D } from './LevelMap';
import { PathCalculator } from '@src/path/PathCalculator';
import { GridFromMap } from '@src/path/GridFromMap';
import { Grid } from '@src/path/path.types';
import { IKeyboard } from '@src/ports/keyboard/Keyboard.types';

interface MainController {
    runTick: () => void;
}

export enum Ani {
    RUNNING = 'RUNNING',
    STOPPED = 'STOPPED'
}
export enum Scenario {
    FIRST_PRESS = 'FIRST_PRESS',
    CONTINUE_MOVEMENT = 'CONTINUE_MOVEMENT'
}

export class Man {
    manFieldXY: Point2D;
    nextManFieldXY: Point2D;
    miniCounter: number;
    manAni: ManAni;
    grid: Grid;
    state: Ani;

    constructor(
        private levelMap: LevelMap,
        private pathCalculator: PathCalculator,
        private gridBuilder: GridFromMap,
        manFieldXY: Point2D,
        private kb: IKeyboard,
        private main: MainController
    ) {
        this.miniCounter = 0;
        this.manFieldXY = { ...manFieldXY };
        this.nextManFieldXY = { ...manFieldXY };
        this.manAni = ManAni.STAND;
        this.state = Ani.STOPPED;
    }

    stepRight = (scenario: Scenario) => {
        if (this.state === Ani.RUNNING && scenario === Scenario.FIRST_PRESS) {
            return;
        }
        this.miniCounter = 0;
        this.nextManFieldXY = { x: this.manFieldXY.x + 1, y: this.manFieldXY.y };
        this.manAni = ManAni.RIGHT;
    };

    stepLeft = (scenario: Scenario) => {
        if (this.state === Ani.RUNNING && scenario === Scenario.FIRST_PRESS) {
            return;
        }
        this.miniCounter = 0;
        this.nextManFieldXY = { x: this.manFieldXY.x - 1, y: this.manFieldXY.y };
        this.manAni = ManAni.LEFT;
    };

    stepDown = (scenario: Scenario) => {
        if (this.state === Ani.RUNNING && scenario === Scenario.FIRST_PRESS) {
            return;
        }
        this.miniCounter = 0;
        this.nextManFieldXY = { x: this.manFieldXY.x, y: this.manFieldXY.y + 1 };
        this.manAni = ManAni.STAIRS;
    };

    stepUp = (scenario: Scenario) => {
        if (this.state === Ani.RUNNING && scenario === Scenario.FIRST_PRESS) {
            return;
        }
        this.miniCounter = 0;
        this.nextManFieldXY = { x: this.manFieldXY.x, y: this.manFieldXY.y - 1 };
        this.manAni = ManAni.STAIRS;
    };

    tick = (): Ani => {
        if ((this.miniCounter + 1) % 10 === 0) {
            this.manFieldXY = { ...this.nextManFieldXY };
            if (this.isKeypressed()) {
                this.onKeyEvent(Scenario.CONTINUE_MOVEMENT);
                this.main.runTick();
                return this.state;
            }
            this.manAni = ManAni.STAND;
            this.state = Ani.STOPPED;
            return this.state;
        } else {
            const miniCounter = this.miniCounter + 1;
            this.miniCounter = miniCounter;
            this.state = Ani.RUNNING;
            return this.state;
        }
    };

    onKeyEvent = (scenario: Scenario) => {
        if (this.kb.isUpPressed) {
            this.stepUp(scenario);
        }
        if (this.kb.isDownPressed) {
            this.stepDown(scenario);
        }
        if (this.kb.isRightPressed) {
            this.stepRight(scenario);
        }
        if (this.kb.isLeftPressed) {
            this.stepLeft(scenario);
        }
    };

    isKeypressed = () =>
        this.kb.isUpPressed ||
        this.kb.isDownPressed ||
        this.kb.isRightPressed ||
        this.kb.isLeftPressed;
}
