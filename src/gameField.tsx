import './app.css';
import { GraphCalculator, SILENT } from './game/GraphCalculator';
import { GraphFromField } from './game/GraphFromField';
import { RenderOptions, defaultRenderOptions } from './components/GameFieldUI';
import { GraphCalculatorV3 } from './game/GraphCalculatorV3';
import { GraphFromFieldV2 } from './game/GraphFromFieldV2';
import { GameController } from './game/GameController';

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
const LINES = { ...defaultRenderOptions, lines: true };
const LINES_COST = { ...defaultRenderOptions, lines: true, nodesCost: true };
const LINES_COST_PATH = { ...defaultRenderOptions, lines: true, nodesCost: true, path: true };
const MAP = { ...defaultRenderOptions, map: true };
const MAP_LINES = { ...defaultRenderOptions, map: true, lines: true };
const MAP_COST = { ...defaultRenderOptions, map: true, nodesCost: true };
const MAP_COST_PATH = { ...defaultRenderOptions, map: true, nodesCost: true, path: true };
const MAP_PATH = { ...defaultRenderOptions, map: true, path: true };
const SIMPLE = GraphFromField.getEdgeSimpleCost;
const ADVANCED = GraphFromField.getEdgeAdvancedCost;
const ADVANCED_V2 = GraphFromFieldV2.getEdgeAdvancedCost;

renderGameField('1. Обход препятствий', map1, 'map1', MAP, ADVANCED_V2, GraphCalculatorV3);

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

renderGameField('2. Выбор оптимального пути', map2, 'map2', MAP, ADVANCED_V2, GraphCalculatorV3);

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
    MAP,
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
    MAP,
    ADVANCED_V2,
    GraphCalculatorV3
);

function renderGameField(
    title: string,
    map: string,
    target: string,
    options: RenderOptions,
    calcCost,
    calculator: typeof GraphCalculator
) {
    new GameController(title, map, target, options, calcCost, calculator, SILENT).renderUI();
}
