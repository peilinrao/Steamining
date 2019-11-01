import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    steamid: '11111111111111111',
    usergames: []
  }

  game_data = () => {
    console.log(this.state.steamid)
    fetch('http://localhost:4000/show?steamid=' + this.state.steamid)
    .then(response => response.json())
    .then(response => this.setState({usergames: response.data}))
    .catch(err => console.log(err))
    console.log(this.state.usergames[0])
  }
  
  render() {
    const {steamid} = this.state
    return (
      <div className="App">
        <input 
        value={steamid}
        onChange={e => this.setState({steamid: e.target.value})} />
        <button onClick={this.game_data}>Search</button>
        
        {this.state.usergames.map((Person, Index) => 
          <div>
            <p>SteamId64: {Person.SteamId64}</p>
            <p>UserName: {Person.UserName}</p>
            <p>GameId: {Person.GameId}</p>
            <p>PlayTime: {Person.PlayTime}</p>
          </div>
        )}
      </div>
    );
  }
}

export default App;
