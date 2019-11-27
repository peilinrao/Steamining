import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    steamid: '',
    usergames: []
  }

  game_data = () => {
    console.log(this.state.steamid)
    fetch('http://localhost:4000/search?steamid=' + this.state.steamid)
    .then(response => response.json())
    .then(response => this.setState({usergames: response.data}))
    .catch(err => console.log(err))
    console.log(this.state.usergames[0])
  }

  insert_data = () => {
    console.log(this.state.steamid)
    fetch('http://localhost:4000/add_into_database?steamid=' + this.state.steamid)
    .then(response => response.json())
    .then(response => this.setState({usergames: response.data}))
    .catch(err => console.log(err))
    console.log(this.state.usergames[0])
  }

  delete_data = () => {
    console.log(this.state.steamid)
    fetch('http://localhost:4000/delete_from_database?steamid=' + this.state.steamid)
    .then(response => response.json())
    .then(response => this.setState({usergames: response.data}))
    .catch(err => console.log(err))
    console.log(this.state.usergames[0])
  }

  update_data = () => {
    console.log(this.state.steamid)
    fetch('http://localhost:4000/update_database?steamid=' + this.state.steamid)
    .then(response => response.json())
    .then(response => this.setState({usergames: response.data}))
    .catch(err => console.log(err))
    console.log(this.state.usergames[0])
  }


  render() {
    const {steamid} = this.state
    return (
      <div className="App">
        SteamId: <input
        value={steamid}
        onChange={e => this.setState({steamid: e.target.value})} />
        <button onClick={this.game_data}>Search</button>
        <button onClick={this.insert_data}>Add</button>
        <button onClick={this.delete_data}>Delete</button>
        <button onClick={this.update_data}>Update</button>

        {this.state.usergames.map((Person, Index) =>
          <div>
            {Index === 0 && <div><p>UserName: {Person.UserName}</p></div>}
            <p>GameId: {Person.GameId} PlayTime: {Person.PlayTime}</p>
          </div>
        )}
      </div>
    );
  }
}

export default App;
