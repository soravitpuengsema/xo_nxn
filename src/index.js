import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
      squarelist.push(this.renderSquare(i+start))
      //console.log(i+start)
    }
    //console.log("===")
    return( 
      squarelist);
  }

  renderReturnRow(n) {
    const rowlist = [];
    var skip = 0;
    for (var i=0 ; i<n ; i++){
      skip = n*i
      rowlist.push(<div className="board-row">{this.renderReturnSquare(n,skip)}</div>)
    }
    return(
      rowlist
    );
  }

  render() {
    return (
      <div>
        {this.renderReturnRow(this.props.inputn)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      inputn: 3,
      history: [
        {
          squares: Array(9).fill(null)
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
    if (calculateWinner(squares,this.state.inputn) || squares[i]) {
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

  changeInput = event => {
    this.setState({inputn: event.target.value});
    console.log(this.state.inputn);
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  handleChange(event) {
      this.setState({inputn: parseInt(event.target.value),
      history:[{squares: Array(this.state.inputn*this.state.inputn).fill(null)}],
      stepNumber: 0,
      xIsNext: true});
}

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares,this.state.inputn);

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

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            inputn={this.state.inputn}
          />
        </div>
        <div className="game-info">
        <div>
            <input
            type="number"
            value={this.state.inputn}
            onChange={this.handleChange}
            />
        </div>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

function CreateWinnerLines(inputn) {
  const winnerlines = [];
  //var inputn = 5;
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

function calculateWinner(squares,inputn) {
  var checkx = 0;
  var checko = 0;
  //var inputn = 5;
  //var checkwinx = true;
  //var checkwino = true;
  const lines = CreateWinnerLines(inputn);
  for (let i = 0 ; i < lines.length ; i++) {
    //const [a, b, c, d] = lines[i];
    const linestemp = lines[i];
    console.log(linestemp, "now");
      for (let j = 1 ; j < linestemp.length ; j++){
        //console.log("j",j);
        if (squares[linestemp[0]] && squares[linestemp[0]] === "X" && squares[linestemp[0]] === squares[linestemp[j]]){
          checkx += 1;
          //pass
        } else {
          //checkwinx = false;
          checkx = 0;
          break;
        }
      }

      for (let k = 1 ; k < linestemp.length ; k++){
        //console.log("k",k);
        if (squares[linestemp[0]] && squares[linestemp[0]] === "O" && squares[linestemp[0]] === squares[linestemp[k]]){
          checko += 1;
          //pass
        } else {
          //checkwino = false;
          checko = 0;
          break;
        }
      }
      //console.log("Check" , checkwinx , checkwino);
      //if (checkwinx == true) {
        //return "X";
      //}
      //if (checkwino == true) {
        //return "O";
      //}
      if (checkx >= inputn-1){
        return "X";
      }
      if (checko >= inputn-1){
        return "O";
      }
    //if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
      //return squares[a];
    //}
  }
  return null;
}