import React from 'react';
import './GridTile.css';

function GridTile(props) { 
    return (
        <div className={props.live ? 'tile live' : props.active && !props.live ? 'tile active' : 'tile'} />
    ) 
};

export default GridTile;
