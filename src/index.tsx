import React from 'react';
import { render } from 'react-dom';

interface Props {}

export const App: React.FC<Props> = ({}) => {
    return <div>App</div>;
};

render(<App />, document.getElementById('root'));
