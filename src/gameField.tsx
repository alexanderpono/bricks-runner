import './app.css';
import { ALL_NODES, GraphCalculator, SILENT } from './game/GraphCalculator';
import { GraphFromField } from './game/GraphFromField';
import { GraphCalculatorV3 } from './game/GraphCalculatorV3';
import { GraphFromFieldAdvancedV2 } from './game/GraphFromFieldAdvancedV2';
import { GameController } from './game/GameController';
import { GraphCalculatorV4 } from './game/GraphCalculatorV4';
import { GraphCalculatorV5f } from './game/GraphCalculatorV5f';
import { RenderOptions, defaultRenderOptions } from './components/GameFieldUI/Game.types';
import { SupaController } from './game/SupaController';
import { GraphFromFieldTeleport } from './game/GraphFromFieldTeleport';

console.log('gameField!');

const map1 = `
▓ M              ▓
▓▓▓▓▓▓▓▓╡▓▓▓▓▓▓▓▓▓
▓       ╡        ▓
▓▓▓▓▓▓▓▓▓▓▓▓╡▓▓▓▓▓
▓           ╡    ▓
▓▓▓╡▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓  ╡         $   ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
`;
const SIMPLE = new GraphFromField();
const ADVANCED_V2 = new GraphFromFieldAdvancedV2();
const TELEPORT_CONTROLS: RenderOptions = {
    ...defaultRenderOptions,
    map: true,
    path: false,
    showBtMap: true,
    showBtNodes: true,
    showBtEdges: true,
    showBtPath: true,
    showBtCost: true,
    showBtStartStop: true
};
const SUPAPLEX_CONTROLS: RenderOptions = {
    ...defaultRenderOptions,
    path: false,
    showBtMap: true,
    showBtNodes: true,
    showBtEdges: true,
    showBtPath: true,
    showBtCost: true,
    showBtStartStop: true
};

renderGameField(
    '1. Обход препятствий',
    map1,
    'map1',
    TELEPORT_CONTROLS,
    ADVANCED_V2,
    GraphCalculatorV3
);

const map2 = `
▓ M              ▓
▓▓▓▓▓▓▓▓╡▓▓▓▓▓▓▓▓▓
▓       ╡        ▓
▓▓▓▓▓▓▓▓▓▓▓▓╡▓▓▓▓▓
▓           ╡    ▓
▓▓▓╡▓▓▓▓▓╡▓▓▓▓╡▓▓▓
▓  ╡     ╡   $╡  ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    `;

renderGameField(
    '2. Выбор оптимального пути',
    map2,
    'map2',
    TELEPORT_CONTROLS,
    ADVANCED_V2,
    GraphCalculatorV3
);

const map3 = `
▓ M              ▓
▓▓▓▓ ▓▓▓╡▓▓▓▓▓▓▓▓▓
▓       ╡        ▓
▓▓▓▓▓▓▓▓▓▓▓▓╡▓▓▓▓▓
▓           ╡    ▓
▓▓▓╡▓▓▓▓▓╡▓▓▓▓╡▓▓▓
▓  ╡     ╡   $╡  ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    `;
renderGameField(
    '3. Задача: персонаж должен падать в отверстие в полу',
    map3,
    'map3',
    TELEPORT_CONTROLS,
    ADVANCED_V2,
    GraphCalculatorV3
);

const map4 = `
▓     $          ▓
▓▓▓▓ ▓▓▓╡▓▓▓▓▓▓▓▓▓
▓ M     ╡        ▓
▓▓▓▓▓▓▓▓▓▓▓▓╡▓▓▓▓▓
▓           ╡    ▓
▓▓▓╡▓▓▓▓▓╡▓▓▓▓╡▓▓▓
▓  ╡     ╡    ╡  ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    `;
renderGameField(
    '4. Персонаж не должен подниматься вверх по воздуху',
    map4,
    'map4',
    TELEPORT_CONTROLS,
    ADVANCED_V2,
    GraphCalculatorV3
);

function renderGameField(
    title: string,
    map: string,
    target: string,
    options: RenderOptions,
    graphBuilder: GraphFromField,
    calculator: typeof GraphCalculator,
    stepNo: number = ALL_NODES
) {
    new GameController(
        title,
        map,
        target,
        options,
        graphBuilder,
        calculator,
        SILENT,
        stepNo
    ).renderUI();
}

const map12 = `
▓ M         1    ▓
▓▓▓▓▓▓▓▓╡▓▓▓▓▓▓▓▓▓
▓       ╡        ▓
▓▓▓▓▓▓▓▓▓▓▓▓╡▓▓▓▓▓
▓           ╡    ▓
▓▓▓╡▓▓▓▓▓╡▓▓▓▓╡▓▓▓
▓  ╡     ╡   $╡ 1▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    `;

renderGameField(
    '5. Телепортация',
    map12,
    'teleport_4',
    TELEPORT_CONTROLS,
    new GraphFromFieldTeleport(),
    GraphCalculatorV4,
    ALL_NODES
);

const map5 = `
▓                 
                  
    M             
                  
                  
                  
            $     
                 ▓
`;
renderSupaField(
    '6. Еще игра',
    map5,
    'game2',
    SUPAPLEX_CONTROLS,
    SIMPLE,
    GraphCalculatorV5f,
    ALL_NODES
);

function renderSupaField(
    title: string,
    map: string,
    target: string,
    options: RenderOptions,
    calcCost,
    calculator: typeof GraphCalculator,
    stepNo: number = ALL_NODES
) {
    new SupaController(
        title,
        map,
        target,
        options,
        calcCost,
        calculator,
        SILENT,
        stepNo
    ).renderUI();
}
