import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function checkLine(line, squares) {
        const val = squares[line[0]];
        if (val == null) return false;
        for (const i of line.slice(1)) {
            if (squares[i] !== val) return false;
        }
        return true;
    }

/**
 * Calculate the winner of the given set of squares given a list of winning lines.
 * @param squares {[]} The grid of squares representing the game board (as a 1d array).
 * @param lines {Number[][]} The winning lines for the given board, a list of lists of numbers,
 * each list of numbers contained represents a win condition.
 * @returns {{winner: *, winningLine: Number[]} | null} If a win condition is met, an object containing winner and winning line is returned.
 * Otherwise returns null.
 */
function calculateWinState(squares, lines) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (checkLine(line, squares)) {
            return {
                winner: squares[line[0]],
                winningLine: line.slice()
            };
        }
    }
    return null;
}

function isGameDraw(squares) {
    for (const square of squares) {
        if (square == null) return false;
    }
    return true;
}


function Square(props) {
    return (
    <button
        className={ props.highlight ? "square highlight" : "square" }
        onClick={ props.onClick }
    >
        {props.value}
    </button>
    );
}


class Board extends React.Component {
    renderSquare(i) {
        let highlight = this.props.highlighted.indexOf(i) !== -1;
        return <Square
            highlight={ highlight }
            value={ this.props.squares[i] }
            onClick={ () => this.props.onClick(i) }
        />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            winningLines: [
                // Horizontal
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],

                // Vertical
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],

                // Diagonal
                [0, 4, 8],
                [6, 4, 2]
            ],
            xNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        if (calculateWinState(squares, this.state.winningLines) || squares[i]) return;

        const xNext = this.state.xNext;
        squares[i] = xNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xNext: !xNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
           stepNumber: step,
           xNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const draw = isGameDraw(current.squares);
        const winState = calculateWinState(current.squares, this.state.winningLines);

        let status;
        let highlightedSquares = []
        if (winState) {
            status = 'Winner: ' + winState.winner;
            highlightedSquares = winState.winningLine;
        } else {
            if (draw) {
                status = 'Draw';
                highlightedSquares = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            } else {
                status = 'Next player: ' + (this.state.xNext ? 'X' : 'O');
            }
        }

        const moves = history.map((step, move) => {
            const desc = 'Go to #' + move;
            return (
                <tr key={move}>
                    <td headers="move-number">
                        {move}
                    </td>
                    <td headers="state">
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </td>
                </tr>
            );
        });

        return (
        <div className="game">
            <h1 className="title">Tick-Tac-Toe</h1>
            <div className="game-container">
                <div className="game-board">
                    <Board
                        squares={ current.squares }
                        onClick={ (i) => this.handleClick(i) }
                        highlighted={ highlightedSquares }
                    />
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <table className="moves">
                        <thead>
                            <th id="move-number">Move no.</th>
                            <th id="state">State</th>
                        </thead>
                        <tbody>
                            {moves}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
