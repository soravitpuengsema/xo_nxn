import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { useState } from "react";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderReturnSquare(n,start) {
    const squarelist = [];
    for (var i=0 ; i<n ; i++){
      squarelist.push(<div>{this.renderSquare(i+start)}</div>)
      //console.log(i+start)
    }
    //console.log("===")
    return( 
      <div>{squarelist}</div>);
  }

  renderReturnRow(n) {
    const rowlist = [];
    var skip = 0;
    for (var i=0 ; i<n ; i++){
      skip = n*i
      rowlist.push(<div className="board-row">{this.renderReturnSquare(n,skip)}</div>)
    }
    return(
      <div>{rowlist}</div>
    );
  }

  render() {
    return (
      <div>
        <div>
          Hello
          <div>
            {this.renderReturnRow(4)}
          </div>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputn: 4,
      history: [
        {
          squares: Array(this.inputn).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'go to move #' + move :
        'go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const namen = ""

    const handleSubmit = (event) => {
      event.preventDefault();
      alert(`The name you entered was: ${namen}`)
    }

    return (
      <div className="game">
        <div className="game-board">
          <MyForm/>
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
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

ReactDOM.render(<Game />, document.getElementById("root"));

function CreateWinnerLines() {
  const winnerlines = [];
  var inputn = 5;
  var nskip = 0;
  //แนวนอน
  for (let k = 0 ; k < inputn ; k++) {
    nskip = k*inputn
    //console.log(nskip);
    const hlines = []
    for (let j = 0 ; j < inputn ; j++) {
      hlines.push(j+nskip);
    }
    winnerlines.push(hlines);
  }

  //แนวตั้ง
  for (let a = 0 ; a < inputn ; a++) {
    const vlines = [];
      for (let b = a ; b < (inputn*(inputn-1))+1+a ; b+=inputn) {
        vlines.push(b);
      }
    winnerlines.push(vlines);
  }

  //แนวเฉียงซ้ายไปขวา
  const ltor = [];
  for (let c = 0 ; c < (inputn*inputn) ; c+=inputn+1) {
    ltor.push(c);
  }
  winnerlines.push(ltor);

  //แนวเฉียงขวาไปซ้าย
  const rtol = [];
  for (let d = inputn-1 ; d < (inputn*(inputn-1))+1 ; d+=inputn-1) {
    rtol.push(d);
  }
  winnerlines.push(rtol);

  console.log(winnerlines);
  return (winnerlines);
}

function calculateWinner(squares) {
  var checkx = 0;
  var checko = 0;
  var inputn = 5;
  const lines = CreateWinnerLines();
  for (let i = 0 ; i < lines.length ; i++) {
    //const [a, b, c, d] = lines[i];
    const linestemp = lines[i];
    console.log(linestemp, "now");
      for (let j = 1 ; j < linestemp.length ; j++){
        //console.log("j",j);
        if (squares[linestemp[0]] && squares[linestemp[0]] === "X" && squares[linestemp[0]] === squares[linestemp[j]]){
          checkx += 1;
        }
        if (squares[linestemp[0]] && squares[linestemp[0]] === "O" && squares[linestemp[0]] === squares[linestemp[j]]){
          checko += 1;
        }
      }
      console.log("Check" , checkx , checko);
      if (checkx == inputn-1){
        return "X";
      }
      if (checko == inputn-1){
        return "O";
      }
    //if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
      //return squares[a];
    //}
  }
  return null;
}

function MyForm() {
  const [n, setName] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`n*n ${n}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>n for number:
        <input 
          type="number" 
          value={n}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <input type="submit" />
    </form>
  )
  }