import React, { useState, useEffect } from 'react';
import './GameGrid.css';
import GridTile from '../../components/GridTile/GridTile';

function GameGrid(props) {
    const [grid, setGrid] = useState([]);
    const [displayGrid, setDisplayGrid] = useState([]);

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
        console.log(newGrid);
        setGrid(newGrid);
    }, []);

    useEffect(() => {
        let counter = -1;
        const flatGrid = grid.flat();
        console.log(flatGrid)
        setDisplayGrid(flatGrid.map(item => {
            counter++;
            return (
                <GridTile
                    key={counter}
                    live={item.live}
                    active={item.active}
                />
            );
        }));
        console.log(createHistory(flatGrid));
    }, [ grid ]);

    const createHistory = (grid) => {
        const strGrid = grid.map(item => {
            return item.live ? 'T' : 'F';
        });
        console.log(strGrid.join(''));

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

    return (
        <div id="game-grid">
            {displayGrid}
        </div>
    );
}

export default GameGrid;
