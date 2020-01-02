import React, { useState, useEffect } from 'react';
import GameGrid from '../GameGrid/GameGrid';

function GameContainer() {
    const [gameRunning, setGameRunning] = useState(false);

    return (
        <main>
            <GameGrid 
                running={gameRunning}
            />
        </main>
    );
}

export default GameContainer;

/*
    <GameMenu>
        <GenerationCounter />
        <StartStop />
        <Reset />
    </GameMenu>
*/