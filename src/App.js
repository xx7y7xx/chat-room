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
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
