import React, { useState, useEffect } from 'react'
import './style.css'

const blockStates = {
    BLANK: -1,
    ZERO: 0,
    CROSS: 1
}
const players = {
    PLAYER1: 0,
    PLAYER2: 1
}

const getInitState = () => {
    const initState = {
        grid: [],
        player1: players.PLAYER1,
        player2: players.PLAYER2,
        gameOver: false,
    }
    const block = {
        id: 0,
        state: blockStates.BLANK,
    }
    for(let i=1; i<=9; i++) {
        block.id = i;
        initState.grid.push({ ...block })
    }
    return initState;
}

const Game = () => {

    const initGameState = {
        turn: players.PLAYER1
    }
    
    const [gameState, setGameState] = useState(initGameState)
    const [state, setState] = useState(getInitState())

    // runs when the grid changes 
    useEffect(() => {
        if(state.gameOver === false) {
            checkWinner()
        } 
    }, [state.grid])


    // resetting gameover status
    useEffect(() => {
        if(state.gameOver === true) {
            
            // reset grid for new game
            setState(prevState => ({
                ...prevState,
                gameOver: false,
            }))
            
            // reset to 1st turn of player 1
            setGameState({turn: players.PLAYER1});
        }
    }, [state.gameOver])

    // handler for click event 
    const handleClick = (id) => {
        
        const clickedBlock = state.grid.find(block => id === block.id);

        if(clickedBlock.state !== blockStates.BLANK) {
            // block is not blank
            return;
        }

        // only when the blank block is clicked
        const updatedGrid = state.grid.map(block => (
            (block.id === id) ? ({
                ...block,
                state: gameState.turn 
            })
            : block
        ))
        
        // update the grid 
        setState(prevState => ({
            ...prevState,
            grid: updatedGrid
        }))
        
        // change the turn of the players 
        setGameState((prevState) => ({
            ...prevState,
            turn: (prevState.turn === players.PLAYER1? players.PLAYER2: players.PLAYER1)
        }))
    } 

    const declareWinner = (winner) => {
    	
    	let msg = "";
    	
    	if(winner === -1) {
    	   msg = "Its a tie!"
    	} else if(winner === 1) {
    	   msg = "Player 1 Won!"
        } else {
           msg = "Player 2 Won!"
        }
        
        alert(msg);
        
        const resetGrid = state.grid.map(block => ({
            ...block,
            state: blockStates.BLANK
        }))

        setState(prevState => ({
            ...prevState,
            grid: resetGrid,
            gameOver: true
        }))
    }

    
    // for identifying the winner 
    
    const checkWinner = () => {
        const grid = state.grid;
        let winner = -1;

        // check the columns for match
        for(let i=0; i<3; i++) {
            let j = 3*i;
            if(grid[j].state !== blockStates.BLANK && 
            	grid[j].state === grid[j+1].state && 
                grid[j+1].state === grid[j+2].state) {
                winner = gameState.turn;
                declareWinner(winner);
                return;
            }
        }

        // check rows for the match 
        for(let j=0; j<3; j++) {
            if(grid[j].state !== blockStates.BLANK && 
            	grid[j].state === grid[j+3].state &&
                grid[j+3].state === grid[j+6].state) {
                winner = gameState.turn;
                declareWinner(winner);
                return;
            }
        }

        // check diagonal 1
        if(grid[0].state !== blockStates.BLANK && 
            grid[0].state === grid[4].state && 
            grid[4].state === grid[8].state) {
            winner = gameState.turn;
            declareWinner(winner);
            return;
        }
        
        
	// check diagonal 2 
        if(grid[2].state !== blockStates.BLANK && 
            grid[2].state === grid[4].state && 
            grid[4].state === grid[6].state) {
            winner = gameState.turn;
            declareWinner(winner);
            return;
        }

        // if no winner then check tie, continue if no tie  
        
        // check if it is a tie
        const tie = state.grid.every(block => block.state !== blockStates.BLANK);
        if(tie === true) {
           declareWinner(-1);
        }
    }


    return (
        <div className="main-container">
            <div className="player-container">
                <div className={`players ${gameState.turn === players.PLAYER1? 'active': ''}`}>
                    Player 1
                </div>
                <div className={`players ${gameState.turn === players.PLAYER2? 'active': ''}`}>
                    Player 2
                </div>
            </div>
            <div className="grid">
            {
                state.grid.map(block => (
                    <div 
                        key={ block.id }
                        className="block"
                        onClick={() => { handleClick(block.id) }}
                    >
                    {
                        (block.state != blockStates.BLANK) 
                        ? (block.state === 0) ? "o":"x" 
                        : ""
                    }
                    </div>
                ))
            }
            </div>
        </div>
    )
}

export default Game
