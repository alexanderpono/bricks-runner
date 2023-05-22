import React from 'react';
import { Label } from '../Label';
import './style.css';

interface AppControllerForUI {
    onBtStartClick: () => void;
    onBtClearClick: () => void;
    pathClicked: () => void;
}

interface AppUIProps {
    ctrl: AppControllerForUI;
    title: string;
    onMount: () => void;
    pathChecked: boolean;
}

export const AppUI: React.FC<AppUIProps> = ({ ctrl, title, onMount, pathChecked }) => {
    React.useEffect(() => {
        onMount();
    }, []);

    const id = 'AppUI';
    return (
        <div>
            <h3>{title}</h3>
            <canvas height="320" width="720" id="AppUI-canvas" key="3"></canvas>
            <div>
                <button onClick={ctrl.onBtStartClick} className="appButton" key="1">
                    Start
                </button>
                <button onClick={ctrl.onBtClearClick} className="appButton" key="2">
                    Clear
                </button>
                {Label(pathChecked, ctrl.pathClicked, `${id}-path`, 'Траектория')}
            </div>
        </div>
    );
};
