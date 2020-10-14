import React from 'react';
import ReactDOM from 'react-dom'
import './index.css'

  function Square(props) {
    return (
      <button className={props.highlight ? 'square-highlight square':'square'} onClick={props.onClick}>
        {props.value}
      </button>
    )
  }
class Board extends React.Component {

  renderSquare(i) {
    const highlight = this.props.highlight;
      return <Square key={i} value={this.props.squares[i]} onClick={() =>this.props.onClick(i)} highlight={highlight && highlight.includes(i) }/>;
    }
  
    render() {
      const sizeBoard = 3;
      let squares = [];
      for (let i = 0; i<sizeBoard; i++) {
        let boardRow = [];
        for (let j = 0; j<sizeBoard; j++) {
          boardRow.push(this.renderSquare(i*sizeBoard + j));
        }
      squares.push(<div key={i} className="board-row">{boardRow}</div>);
      }
      return (
        <div>
          {squares}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history:[{
          squares:Array(9).fill(null),
          indexMove:null,
        }],
        stepNumber: 0,
        xIsNext:true,
        sortAscending: true,
      }
    }
    handleSort() {
      this.setState({
        sortAscending: !this.state.sortAscending,
      })
    }
    handleClick(i) {
      const history = this.state.history.slice(0,this.state.stepNumber+1);
      const current = history[history.length-1];
      const squares = current.squares.slice();
      if(calculateWinner(squares).winner || squares[i]){
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history:history.concat([{
          squares: squares,
          indexMove:i
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }
    jumpTo(step){
      this.setState({
        stepNumber:step,
        xIsNext:(step%2)===0,
      })
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const squares = current.squares.slice();
      const winner = calculateWinner(current.squares);
      const winnerName = winner.winner;
      let move = history.map((step, move) => {
        const col = step.indexMove%3 + 1;
        const row = Math.floor(step.indexMove/3 + 1);
        const desc = move?'Go to move #' + move + ` at (${col},${row})`:'Go to game start';
        return (
          <li key={move}>
            <button className={move === this.state.stepNumber?'current-selected-item':''} onClick={()=>this.jumpTo(move)}>{desc}</button>
          </li>
        )
      })
      const sortAscending = this.state.sortAscending;
      if (!sortAscending) {
        move.reverse();
      }
      let status;
      if (winnerName) {
        status = 'Winner: ' + winnerName;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      if(!squares.includes(null)){
        status = 'No one wins ! Draw';
      }
      const sortType = sortAscending ? 'descending' : 'ascending';
      return (
        <div className="game">
          <div className="game-board">
            <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlight={winner.highlight}/>
          </div>
          <div className="game-info">
            <div className="game-status">{status}</div>
            <button className="toggle-button" onClick={() => this.handleSort()}>{sortType}</button>
            <ol>{move}</ol>
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
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a],
          highlight: lines[i],
        };
          
      }
    }
    return {
      winner : null,
    };
  }