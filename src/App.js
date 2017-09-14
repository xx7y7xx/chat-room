import React, { Component } from 'react';
import io from 'socket.io-client';
import moment from 'moment';
import Cookies from 'universal-cookie';
import Emojify from 'react-emojione';

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

const anonymousName = 'nobody';

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
      textBoxValue: '',
      messages: [],
      username: cookies.get('username') || anonymousName,
    };
    this.handleTextBoxChange = this.handleTextBoxChange.bind(this);
    this.handleSendBtnClick = this.handleSendBtnClick.bind(this);
    this.handleLogoutBtnClick = this.handleLogoutBtnClick.bind(this);
    this.handleLoginBtnClick = this.handleLoginBtnClick.bind(this);
    this.handleTextBoxKeyPress = this.handleTextBoxKeyPress.bind(this);
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
  handleTextBoxChange(event) {
    const { value } = event.target;
    this.setState({
      textBoxValue: value,
    });
  }
  handleSendBtnClick() {
    this.sendMessage();
  }
  handleTextBoxKeyPress(event) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
  handleLogoutBtnClick() {
    if (window.confirm('是否注销') === true) {
        cookies.remove('username');
        this.setState({
          username: anonymousName,
        });
    } else {
    }
  }
  handleLoginBtnClick() {
    const username = window.prompt('请随便输入一个用户名，比如“我是foo”');
    if (username) {
      cookies.set('username', username);
      this.setState({
        username,
      });
    }
  }
  sendMessage() {
    socket.emit('chat message', createMessageObj(this.state.textBoxValue, this.state.username));
    this.setState({
      textBoxValue: '',
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
          天朝拆迁队 [
            {this.state.username}
            {this.state.username !== anonymousName
              ? <button onClick={this.handleLogoutBtnClick}>注销</button>
              : <button onClick={this.handleLoginBtnClick}>登录</button>
            }
          ]
        </p>
        <ul id="messages">
          {this.state.messages.map(
            (msgObj) => <li key={msgObj.t}>
              {`[${timeFormater(msgObj.t)}] ${msgObj.n}: `}
              <Emojify
                style={{ backgroundImage: 'url("./emojione.sprites.png")', }}
              >{msgObj.m}</Emojify>
            </li>
          )}
        </ul>
        <div className="chat">
          <input
            id="m"
            autoComplete="off"
            value={this.state.textBoxValue}
            onChange={this.handleTextBoxChange}
            onKeyPress={this.handleTextBoxKeyPress}
          />
        <button onClick={this.handleSendBtnClick}>发送</button>
        </div>
      </div>
    );
  }
}

export default App;
