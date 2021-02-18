import React, { useState, useEffect, useCallback } from 'react';
import GameGrid from '../GameGrid/GameGrid';
import GameMenu from '../../components/GameMenu/GameMenu';

const gridSize = [30, 46]

function GameContainer() {
    const [grid, setGrid] = useState([]);
    const [gameRunning, setGameRunning] = useState(true);
    const [clearBoard, setClearBoard] = useState(false);
    // const [history, setHistory] = useState([]);
    const [generations, setGenerations] = useState(1);

    /*const createHistory = (grid) => {
        const strGrid = grid.map(item => {
            return item.live ? 'T' : 'F';
        });
        // console.log(strGrid.join(''));

        let condensedStr = '';
        let currentLetter = strGrid[0];
        let charCount = 0;

        for (let letter of strGrid) {
            if (letter === currentLetter) {
                charCount++;
            } else {
                condensedStr += charCount > 1 ? `${charCount}${currentLetter}` : currentLetter;
                currentLetter = letter;
                charCount = 1;
            }
        }
        condensedStr += charCount > 1 ? `${charCount}${currentLetter}` : currentLetter;
        return condensedStr;
    }*/

    const checkAdjecentTiles = useCallback((row, column, grid) => {
        const [rowSize, columnSize] = gridSize;
        const adjecentArray = [];

        for (let i = row - 1; i <= row + 1; i++) {
            if (i < 0 || i > rowSize - 1) {
                continue;
            }

            for (let j = column - 1; j <= column + 1; j++) {
                if (j < 0 || j > columnSize - 1 || (i === row && j === column)) {
                    continue;
                }

                adjecentArray.push([i, j, grid[i][j]]);
            }
        }
        return [row, column, adjecentArray];
    }, []);

    const generateActiveTiles = useCallback(funcGrid => {
        const dead = 0, active = 1, live = 2;

        for (let row = 0; row < funcGrid.length; row++) {
            for (let tile = 0; tile < funcGrid[row].length; tile++) {
                if (funcGrid[row][tile] === live) {
                    const activeTiles = checkAdjecentTiles(row, tile, funcGrid);
                    for (let tile of activeTiles[2]) {
                        if (tile[2] === dead) {
                            funcGrid[tile[0]][tile[1]] = active;
                        }
                    }
                }
            }
        }
        return funcGrid
    }, [checkAdjecentTiles]);

    const advanceGame = useCallback(gameGrid => {
        const dead = 0, active = 1, live = 2;

        let tempGrid = JSON.parse(JSON.stringify(gameGrid));
        for (let i = 0; i < gameGrid.length; i++) {
            for (let j = 0; j < gameGrid[0].length; j++) {
                let aliveCount = 0;
                if (gameGrid[i][j] === active || gameGrid[i][j] === live) {
                    aliveCount = checkAdjecentTiles(i, j, gameGrid)[2].filter(item => item[2] === 2).length;

                    if (gameGrid[i][j] === live && (aliveCount < 2 || aliveCount > 3)) {
                        tempGrid[i][j] = active;
                    } else if (gameGrid[i][j] === active && aliveCount === 3) {
                        tempGrid[i][j] = live;
                    } else if (aliveCount === 0) {
                        tempGrid[i][j] = dead;
                    }
                }
            }
        }
        generateActiveTiles(tempGrid);
        setGrid(tempGrid);
    }, [checkAdjecentTiles, generateActiveTiles]);

    const createGrid = () => {
        const [rowSize, columnSize] = gridSize;
        const array = [];
        for (let i = 0; i < rowSize; i++) {
            array.push([]);
            for (let j = 0; j < columnSize; j++) {
                array[i].push(0);
            }
        }
        return array;
    }

    const buildNewGrid = useCallback(() => {
        // 0 = dead, 1 = active, 2 = alive
        let newGrid = createGrid();
        for (let row of newGrid) {
            for (let i = 0; i < row.length; i++) {
                if (Math.random() > 0.4) {
                    row[i] = 2;
                }
            }
        }
        newGrid = generateActiveTiles(newGrid);
        setGrid(newGrid);
    }, [generateActiveTiles]);

    const resetGame = () => {
        buildNewGrid();
        // setHistory([]);
        setGenerations(1);
        if (clearBoard) setClearBoard(false);
        if (!gameRunning) setGameRunning(true);
    }

    const clearGame = () => {
        setGrid(createGrid);
        if (gameRunning) setGameRunning(false);
        if (!clearBoard) setClearBoard(true);
        setGenerations('-');
    }

    const advanceGameTimer = useCallback(() => {
        setGrid(grid => advanceGame(grid));
        setGenerations(generations => generations + 1);
    }, [advanceGame]);

    useEffect(() => {
        let timer = null;
        if (gameRunning && !clearBoard) {
            timer = setInterval(advanceGameTimer, 75);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [gameRunning, clearBoard, advanceGameTimer]);

    const gameToggle = () => {
        if (clearBoard) resetGame();
        setGameRunning(!gameRunning);
    };

    /*const addToHistory = str => {
        const tempHistory = JSON.parse(JSON.stringify(history));
        if (str !== 'undefined') tempHistory.push(str);
        setHistory(tempHistory);
    }*/

    useEffect(() => {
        buildNewGrid();
    }, [buildNewGrid]);

    return (
        <main>
            <GameGrid
                grid={grid}
            />
            <GameMenu
                generations={generations}
                toggle={gameToggle}
                reset={resetGame}
                clear={clearGame}
                running={gameRunning}
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
