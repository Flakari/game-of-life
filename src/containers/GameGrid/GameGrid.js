import React, { useState, useEffect } from 'react';
import './GameGrid.css';
import GridTile from '../../components/GridTile/GridTile';

function GameGrid() {
    const [grid, setGrid] = useState([]);
    const [displayGrid, setDisplayGrid] = useState([]);

    useEffect(() => {
        createGrid();
    }, []);

    useEffect(() => {
        let counter = -1;
        const flatGrid = grid.flat();
        setDisplayGrid(flatGrid.map(item => {
            counter++;
            if (Math.random() > 0.4) {
                item.live = true;
            }
            return (
                <GridTile
                    key={counter}
                    live={item.live}
                    active={item.active}
                />
            );
        }));
        console.log(createHistory(grid.flat()));
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

    const createGrid = () => {
        const array = [];

        for(let i = 0; i < 30; i++) {
            array.push([]);
            for(let j = 0; j < 46; j++) {
                array[i].push({live: false, active: false});
            }
        }

        setGrid(array);
    }

    return (
        <div id="game-grid">
            {displayGrid}
        </div>
    );
}

export default GameGrid;
