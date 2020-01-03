import React from 'react';
import './GameMenu.css';

function GameMenu(props) {
    return (
        <div id="menu">
            <button onClick={props.toggle}>Test</button>
        </div>
    );
}

export default GameMenu;
