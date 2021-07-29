import React, {useState} from 'react';

const Score = ({name, score}) => {
    return <>
        <div className="score-container">
            <p className="score-text">{name}</p>
            <p className="score-text">{score}</p>
        </div>
    </>
}
export default Score;