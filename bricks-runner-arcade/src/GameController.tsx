import React from 'react';
import { render } from 'react-dom';
import { UI } from './components/UI';
import ImgSprite from '@src/components/UI/sprite.png';
import { level1 } from './ports/levels/level1';
import { DynamicObject, LevelMap } from './game/LevelMap';
import { GRScene } from './ports/GR/GRScene';
import { Ani, Man } from './game/Man';
import { GridFromMap } from './path/GridFromMap';
import { PathCalculator } from './path/PathCalculator';
import { Enemy } from './game/Enemy';

export class GameController {
    picLoaded: boolean;
    levelMap: LevelMap = null;
    emptyLevel: LevelMap = null;
    pic: InstanceType<typeof Image> = new Image();
    man: Man;
    enemy: Enemy;
    private dObjects: DynamicObject[] = [];

    constructor() {}

    run() {
        this.levelMap = LevelMap.create().initFromText(level1);
        this.emptyLevel = this.initEmptyField(level1);
        this.dObjects = this.levelMap.getDynanicObjects();

        render(<UI />, document.getElementById('game'));

        this.man = new Man(
            this.levelMap,
            new PathCalculator(),
            new GridFromMap(),
            this.levelMap.charToCoords('M')
        );
        this.enemy = new Enemy(
            this.levelMap,
            new PathCalculator(),
            new GridFromMap(),
            this.levelMap.charToCoords('E'),
            this.man
        );
        this.enemy.calculatePath();

        this.loadPic().then(() => {
            this.picLoaded = true;
            this.renderScene();
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
            this.enemy.grid,
            this.enemy
        );
        return context;
    }

    stepRight = () => {
        this.man.stepRight();
        this.tick();
    };

    stepLeft = () => {
        this.man.stepLeft();
        this.tick();
    };

    stepDown = () => {
        this.man.stepDown();
        this.tick();
    };

    stepUp = () => {
        this.man.stepUp();
        this.tick();
    };

    tick = () => {
        const manAnimationState = this.man.tick();
        if (manAnimationState === Ani.STOPPED) {
        } else {
            setTimeout(() => this.tick(), 100);
        }
        this.enemy.calculatePath();
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
}
