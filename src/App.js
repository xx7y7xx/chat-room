import React, { Component } from 'react';
import io from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

const socket = io('127.0.0.1:3001');

socket.on('connect_error', (error) => {
  console.log('socket event connect_error', error)
});

socket.on('connect_timeout', (timeout) => {
  console.log('socket event connect_timeout', timeout)
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      messages: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    socket.on('chat message', msg => {
      const messages = [ ...this.state.messages ];
      messages.push(msg);
      this.setState({
        messages,
      })
    });
  }
  handleChange(event) {
    const { value } = event.target;
    this.setState({
      value,
    });
  }
  handleClick() {
    socket.emit('chat message', this.state.value);
    this.setState({
      value: '',
    });
  }
  render() {
    return (
      <div className="App">
        <div className="App-header" style={{ display: 'none' }}>
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro" style={{ display: 'none' }}>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ul id="messages">
          {
            this.state.messages.map((message, i) => <li key={i}>{message}</li>)
          }
        </ul>
        <div className="chat">
          <input
            id="m"
            autoComplete="off"
            value={this.state.value}
            onChange={this.handleChange}
          />
        <button onClick={this.handleClick}>发送</button>
        </div>
      </div>
    );
  }
}

export default App;
