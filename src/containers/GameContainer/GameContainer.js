import React, { useState, useEffect } from 'react';
import GameGrid from '../GameGrid/GameGrid';
import GameMenu from '../../components/GameMenu/GameMenu';

function GameContainer() {
    const [gameRunning, setGameRunning] = useState(false);

    const gameToggle = () => {
        setGameRunning(!gameRunning);
    }

    return (
        <main>
            <GameGrid 
                running={gameRunning}
            />
            <GameMenu 
                toggle={gameToggle}
            />
        </main>
    );
}

export default GameContainer;

/*
    <GameMenu>
        <GenerationCounter />
        <History />
        <StartStop />
        <Reset />
    </GameMenu>
*/
