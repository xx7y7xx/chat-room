import React, { Component } from 'react';
import io from 'socket.io-client';
import moment from 'moment';
import Cookies from 'universal-cookie';

import logo from './logo.svg';
import './App.css';

const cookies = new Cookies();

let url = '127.0.0.1:3001';
if (process.env.NODE_ENV === 'production') {
  url = 'chat-server.yyssc.org:3001';
}
const socket = io(url);

socket.on('connect_error', (error) => {
  console.log('socket event connect_error', error);
});

socket.on('connect_timeout', (timeout) => {
  console.log('socket event connect_timeout', timeout);
});

/**
 * [createMessageObj description]
 * @param  {string} m message
 * @param  {string} n name
 * @return {[type]}   [description]
 */
const createMessageObj = (m, n) => ({
  m,
  t: new Date().getTime(),
  n,
});

/**
 * [timeFormater description]
 * @param  {number} ts e.g. 1505359605655
 * @return {[type]}    [description]
 */
const timeFormater = ts => moment(ts).format();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      messages: [],
    };
    this.username = cookies.get('username') || 'nobody';
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    socket.emit('last-messages', (messages) => {
      console.log('[socket.io-client] emit last-messages', messages);
      this.setState({
        messages,
      });
    })
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
    socket.emit('chat message', createMessageObj(this.state.value, this.username));
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
        <p className="App-intro">
          天朝拆迁队 [{this.username}]
        </p>
        <ul id="messages">
          {this.state.messages.map(
            (msgObj) => <li key={msgObj.t}>
              {`[${timeFormater(msgObj.t)}] ${msgObj.n}: ${msgObj.m}`}
            </li>
          )}
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
