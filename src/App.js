import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import web3 from './web3.js';
import lottery from './lottery';
import web3 from './web3';

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     manager: ''
  //   }
  // }

  state = {
    manager: '',
    players: [],
    balance: '',
    value: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({
      manager,
      players,
      balance
    });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!'});

  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'Winner has been picked'});
  };  

  render() {

    // console.log('web3:', web3.version);
    // web3.eth.getAccounts()
    //   .then(acc => console.log('acc', acc));

    console.log('this.state', this.state);

    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <div>
        <p>This contract has the following players</p>
        <ul>
          {this.state.players.map((player, i) => {
            return <li key={i}>{player}</li>
          })}
        </ul> 
        </div>
        <p>They are competing to win {web3.utils.fromWei(this.state.balance, 'ether')}</p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input onChange={event => this.setState({ value: event.target.value })} />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <p>{this.state.message}</p>

      </div>
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <h1 className="App-title">Welcome to React</h1>
      //   </header>
      //   <p className="App-intro">
      //     To get started, edit <code>src/App.js</code> and save to reload.
      //   </p>
      // </div>
    );
  }
}

export default App;
