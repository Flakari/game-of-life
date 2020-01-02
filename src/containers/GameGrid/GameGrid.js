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
            return (
                <GridTile
                    key={counter}
                    live={item.live}
                    active={item.active}
                />
            );
        }));
    }, [ grid ]);

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