import React, { useState } from 'react';
import GameGrid from '../GameGrid/GameGrid';
import GameMenu from '../../components/GameMenu/GameMenu';

function GameContainer() {
    const [gameRunning, setGameRunning] = useState(false);
    const [gameStart, setGameStart] = useState(true);

    const gameToggle = () => {
        setGameRunning(!gameRunning);
    };

    const startToggle = () => {
        setGameStart(!gameStart);
    };

    return (
        <main>
            <GameGrid 
                running={gameRunning}
                start={gameStart}
                toggle={startToggle}
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
