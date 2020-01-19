import React from 'react';
import './GameMenu.css';

function GameMenu(props) {
    return (
        <div id="menu">
            <button onClick={props.toggle}>Test</button>
            <button onClick={props.reset}>Reset</button>
        </div>
    );
}

export default GameMenu;
