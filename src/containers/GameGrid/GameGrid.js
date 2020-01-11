import React, { useState, useEffect } from 'react';
import './GameGrid.css';
import GridTile from '../../components/GridTile/GridTile';

function GameGrid(props) {
    const [displayGrid, setDisplayGrid] = useState([]);

    useEffect(() => {
        let counter = -1;
        const flatGrid = props.grid.flat();
        // console.log(flatGrid)
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
        props.addHistory(props.createHistory(flatGrid));
    }, [ props.grid ]);

    return (
        <div id="game-grid">
            {displayGrid}
        </div>
    );
}

export default GameGrid;
