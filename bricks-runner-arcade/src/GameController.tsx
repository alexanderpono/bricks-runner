import React from 'react';
import { render } from 'react-dom';
import { UI } from './components/UI';
import ImgSprite from '@src/components/UI/sprite.png';
import { level1 } from './ports/levels/level1';
import { DynamicObject, LevelMap } from './game/LevelMap';
import { GRScene } from './ports/GR/GRScene';
import { Ani, Man, Scenario } from './game/Man';
import { GridFromMap } from './path/GridFromMap';
import { PathCalculator } from './path/PathCalculator';
import { Eater } from './game/Eater';
import { Keyboard } from './ports/keyboard';

export class GameController {
    picLoaded: boolean;
    levelMap: LevelMap = null;
    emptyLevel: LevelMap = null;
    pic: InstanceType<typeof Image> = new Image();
    man: Man;
    guard: Eater;
    private dObjects: DynamicObject[] = [];
    private isRunningTick: boolean = false;
    private kb: Keyboard = null;

    constructor() {}

    run() {
        this.levelMap = LevelMap.create().initFromText(level1);
        this.emptyLevel = this.initEmptyField(level1);
        this.dObjects = this.levelMap.getDynanicObjects();
        this.kb = new Keyboard(this);
        this.kb.listen();
        this.renderUI();

        this.man = new Man(
            this.levelMap,
            new PathCalculator(),
            new GridFromMap(),
            this.levelMap.charToCoords('M'),
            this.kb,
            this
        );
        this.guard = new Eater(
            this.levelMap,
            new PathCalculator(),
            new GridFromMap(),
            this.levelMap.charToCoords('E'),
            this.man
        );

        this.loadPic().then(() => {
            this.picLoaded = true;
            const guardState = this.guard.think();
            this.renderScene();
            if (guardState === Ani.RUNNING) {
                this.runTick();
            }
        });

        document.getElementById('btRight').addEventListener('click', () => {
            this.stepRight();
        });
        document.getElementById('btLeft').addEventListener('click', () => {
            this.stepLeft();
        });
        document.getElementById('btDown').addEventListener('click', () => {
            this.stepDown();
        });
        document.getElementById('btUp').addEventListener('click', () => {
            this.stepUp();
        });

        document.getElementById('btGRight').addEventListener('click', () => {
            this.gstepRight();
        });
        document.getElementById('btGLeft').addEventListener('click', () => {
            this.gstepLeft();
        });
        document.getElementById('btGDown').addEventListener('click', () => {
            this.gstepDown();
        });
        document.getElementById('btGUp').addEventListener('click', () => {
            this.gstepUp();
        });
    }
    loadPic = () => {
        return new Promise((resolve) => {
            this.pic.src = ImgSprite;
            this.pic.onload = function () {
                resolve(true);
            };
        });
    };

    renderScene(): CanvasRenderingContext2D {
        const context = GRScene.create().render(
            this.picLoaded,
            this.levelMap,
            this.pic,
            this.man,
            this.dObjects,
            this.guard.grid,
            this.guard
        );
        return context;
    }

    stepRight = () => {
        this.man.stepRight(Scenario.FIRST_PRESS);
        this.runTick();
    };

    stepLeft = () => {
        this.man.stepLeft(Scenario.FIRST_PRESS);
        this.runTick();
    };

    stepDown = () => {
        this.man.stepDown(Scenario.FIRST_PRESS);
        this.runTick();
    };

    stepUp = () => {
        this.man.stepUp(Scenario.FIRST_PRESS);
        this.runTick();
    };

    gstepRight = () => {
        this.guard.stepRight();
        this.runTick();
    };

    gstepLeft = () => {
        this.guard.stepLeft();
        this.runTick();
    };

    gstepDown = () => {
        this.guard.stepDown();
        this.runTick();
    };

    gstepUp = () => {
        this.guard.stepUp();
        this.runTick();
    };

    runTick = () => {
        if (this.isRunningTick) {
            return;
        }
        this.doTick();
    };

    doTick = () => {
        const manAnimationState = this.man.tick();
        const guardAnimationState = this.guard.tick();
        if (manAnimationState !== Ani.STOPPED || guardAnimationState !== Ani.STOPPED) {
            this.isRunningTick = true;
            setTimeout(() => this.doTick(), 100);
        } else {
            this.isRunningTick = false;
        }
        this.renderScene();
    };

    initEmptyField = (level: string): LevelMap => {
        const getEmptyMap = (s: string): string => {
            let s2 = s.replace('$', ' ');
            s2 = s2.replace('M', ' ');
            return s2;
        };
        const emptyMap = getEmptyMap(level);
        return LevelMap.create().initFromText(emptyMap);
    };

    renderUI = () => {
        render(<UI kb={this.kb} />, document.getElementById('game'));
    };
    onKeyEvent = () => {
        this.man.onKeyEvent(Scenario.FIRST_PRESS);
        this.renderUI();
        this.runTick();
    };
}
