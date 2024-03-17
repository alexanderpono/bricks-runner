import React from 'react';
import { render } from 'react-dom';
import { UI } from './components/UI';
import ImgSprite from '@src/components/UI/sprite.png';
import { level1 } from './ports/levels/level1';
import { LevelMap } from './game/LevelMap';
import { GRScene } from './ports/GR/GRScene';
import { Ani, Man } from './game/Man';

export class GameController {
    picLoaded: boolean;
    levelMap: LevelMap = null;
    pic: InstanceType<typeof Image> = new Image();
    man: Man;

    constructor() {
        this.man = new Man();
    }

    run() {
        this.levelMap = LevelMap.create().initFromText(level1);

        render(<UI />, document.getElementById('game'));
        this.man.onStart();

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
        return GRScene.create().render(this.picLoaded, this.levelMap, this.pic, this.man);
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
        this.renderScene();
    };
}
