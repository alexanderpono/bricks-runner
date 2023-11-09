import { BricksEditorController } from './bricksEditor/BricksEditorController';

console.log('bricksEditor!');

const ctrl = BricksEditorController.create();
ctrl.loadPic()
    .then(() => {
        console.log('on loadPic');
        return ctrl.onLoadPic();
    })
    .then(() => {
        console.log('after on loadPic');
        ctrl.renderUI();
    });
