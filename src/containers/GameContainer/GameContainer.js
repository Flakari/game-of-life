import React, { useState, useEffect } from 'react';
import GameGrid from '../GameGrid/GameGrid';
import GameMenu from '../../components/GameMenu/GameMenu';

function GameContainer() {
    const [grid, setGrid] = useState([]);
    const [gameRunning, setGameRunning] = useState(false);
    const [gameStart, setGameStart] = useState(true);
    const [history, setHistory] = useState([]);
    const [generations, setGenerations] = useState(0);

    useEffect(() => {
        let newGrid = createGrid();
        for (let row of newGrid) {
            row = row.map(item => {
                if (Math.random() > 0.4) {
                    item.live = true;
                    item.active = true;
                }
                return item;
            });
        }
        newGrid = generateActiveTiles(newGrid);
        // console.log(newGrid);
        setGrid(newGrid);
    }, []);

    const createHistory = (grid) => {
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
    }

    const advanceGame = gameGrid => {
        let tempGrid = JSON.parse(JSON.stringify(gameGrid));
        for (let i = 0; i < gameGrid.length; i++) {
            for (let j = 0; j < gameGrid[0].length; j++) {
                let aliveCount = 0;
                if (gameGrid[i][j].active) {
                    aliveCount = checkAdjecentTiles(i, j, gameGrid)[2].filter(item => item[2].live).length;

                    if (gameGrid[i][j].live && (aliveCount < 2 || aliveCount > 3)) {
                        tempGrid[i][j].live = false;
                    } else if (!gameGrid[i][j].live && aliveCount === 3) {
                        tempGrid[i][j].live = true;
                    } else if (aliveCount === 0) {
                        tempGrid[i][j].active = false;
                    }
                }
            }
        }
        generateActiveTiles(tempGrid);
        setGrid(tempGrid);
    };

    const generateActiveTiles = funcGrid => {
        for (let row = 0; row < funcGrid.length; row++) {
            for (let tile = 0; tile < funcGrid[row].length; tile++) {
                if (funcGrid[row][tile].live) {
                    const activeTiles = checkAdjecentTiles(row, tile, funcGrid);
                    for (let tile of activeTiles[2]) {
                        if (!tile.active) {
                            funcGrid[tile[0]][tile[1]].active = true;
                        }
                    }
                }
            }
        }
        return funcGrid
    };

    const checkAdjecentTiles = (row, tile, grid) => {
        // Clockwise Order: [Right, Bottom Right, Bottom, Bottom Left, Left, Top Left, Top, Top Right]
        const range = [
            [row, tile + 1], [row + 1, tile + 1], [row + 1, tile], [row + 1, tile - 1], [row, tile - 1], 
            [row - 1, tile -1], [row - 1, tile], [row - 1, tile + 1]
        ];
        if (row === 0) {
            if (tile === 0) {
                //check everything to right and bottom of tile
                return [row, tile, range.slice(0, 3).map(item => {
                    return [item[0], item[1], grid[item[0]][item[1]]];
                })];
            } else if (tile === grid[0].length - 1) {
                //check everything to left and bottom of tile
                return [row, tile, range.slice(2, 5).map(item => {
                    return [item[0], item[1], grid[item[0]][item[1]]];
                })];
            } else {
                //check everything except for top of tile
                return [row, tile, range.slice(0, 5).map(item => {
                    return [item[0], item[1], grid[item[0]][item[1]]];
                })];
            } 
        } else if (row === grid.length - 1) {
            if (tile === 0) {
                //check everything to right and top of tile
                return [row, tile, [...range.slice(6), range[0]].map(item => {
                    return [item[0], item[1], grid[item[0]][item[1]]];
                })];
            } else if (tile === grid[0].length - 1) {
                //check everything to left and top of tile
                return [row, tile, range.slice(4, 7).map(item => {
                    return [item[0], item[1], grid[item[0]][item[1]]];
                })];
            } else {
                //check everything except for bottom
                return [row, tile, [...range.slice(4), range[0]].map(item => {
                    return [item[0], item[1], grid[item[0]][item[1]]];
                })];
            } 
        } else {
            if (tile === 0) {
                //check everything but left tiles
                return [row, tile, [...range.slice(6), ...range.slice(0, 3)].map(item => {
                    return [item[0], item[1], grid[item[0]][item[1]]];
                })];
            } else if (tile === grid[0].length - 1) {
                //check everything but right tiles
                return [row, tile, range.slice(2, 7).map(item => {
                    return [item[0], item[1],grid[item[0]][item[1]]];
                })];
            } else {
                //check all tiles
                return [row, tile, range.map(item => {
                    return [item[0], item[1], grid[item[0]][item[1]]];
                })];
            } 
        }
    };

    const createGrid = () => {
        const array = [];
        for(let i = 0; i < 30; i++) {
            array.push([]);
            for(let j = 0; j < 46; j++) {
                array[i].push({live: false, active: false});
            }
        }
        return array;
    }
   
    const advanceGameTimer = () => {
        setGrid(grid => advanceGame(grid));
        setGenerations(generations => generations + 1);
    }

    useEffect(() => {
        let timer = null;
        if (!gameRunning) {
            timer = setInterval(advanceGameTimer, 250);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [gameRunning]);

    const gameToggle = () => {
        setGameRunning(!gameRunning);
    };

    const startToggle = () => {
        setGameStart(!gameStart);
    };

    const addToHistory = str => {
        const tempHistory = JSON.parse(JSON.stringify(history));
        if (str !== 'undefined') tempHistory.push(str);
        setHistory(tempHistory);
    }

    return (
        <main>
            <GameGrid 
                grid={grid}
                running={gameRunning}
                start={gameStart}
                toggle={startToggle}
                history={history}
                addHistory={addToHistory}
                createHistory={createHistory}
            />
            <GameMenu 
                toggle={gameToggle}
            />
            <p>{generations}</p>
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
