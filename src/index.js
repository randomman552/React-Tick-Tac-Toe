import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function checkLine(line, squares) {
        let val = squares[line[0]];
        for (const i of line.slice(1)) {
            if (squares[i] !== val) return false;
        }
        return true;
    }

function calculateWinner(squares) {
        const lines = [
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
        ];

        for (const line of lines) {
            if (checkLine(line, squares)) {
                return squares[line[0]];
            }
        }
        return null;
    }


function Square(props) {
    return (
    <button
        className="square"
        onClick={ props.onClick }
    >
        {props.value}
    </button>
    );
}


class Board extends React.Component {
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
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
            xNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = this.state.history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) return;

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
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xNext ? 'X' : 'O');
        }

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={ current.squares }
                    onClick={ (i) => this.handleClick(i) }
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
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
