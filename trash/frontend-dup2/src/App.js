import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';


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
    if (this.state.usergame === undefined) {
      alert('Steam ID not found');
    }
  }

  insert_data = () => {
    console.log(this.state.steamid)
    fetch('http://localhost:4000/add_into_database?steamid=' + this.state.steamid)
    .then(response => response.json())
    .then(response => this.setState({usergames: response.data}))
    .catch(err => console.log(err))
    console.log(this.state.usergames[0])
    if (this.state.usergame === undefined) {
      alert('Steam ID not found');
    }
  }

  delete_data = () => {
    console.log(this.state.steamid)
    fetch('http://localhost:4000/delete_from_database?steamid=' + this.state.steamid)
    .then(response => response.json())
    .then(response => this.setState({usergames: response.data}))
    .catch(err => console.log(err))
    console.log(this.state.usergames[0])
    if (this.state.usergame === undefined) {
      alert('Steam ID not found');
    }
  }

  update_data = () => {
    console.log(this.state.steamid)
    fetch('http://localhost:4000/update_database?steamid=' + this.state.steamid)
    .then(response => response.json())
    .then(response => this.setState({usergames: response.data}))
    .catch(err => console.log(err))
    console.log(this.state.usergames[0])
    if (this.state.usergame === undefined) {
      alert('Steam ID not found');
    }
  }

  /*<button onClick={this.insert_data}>Add</button>
  <button onClick={this.delete_data}>Delete</button>
  <button onClick={this.update_data}>Update</button>*/
  render() {
    const {steamid} = this.state
    return (
      <Container className="App" maxwidth="sm">
        <img src="./logo.jpeg" alt="logo" id="logo_image"/>
        <div>
          <TextField id="search_field" label="Steam ID" variant="outlined"
          value={steamid}
          onChange={e => this.setState({steamid: e.target.value})} />
          <Button id="search_button" variant="contained" color="primary" onClick={this.game_data}>Search</Button>
        </div>
        {this.state.usergame !== undefined && this.state.usergames.map((Person, Index) =>
          <div>
            {Index === 0 && <div><p>UserName: {Person.UserName}</p></div>}
            <p>GameId: {Person.GameId} PlayTime: {Person.PlayTime}</p>
          </div>
        )}
      </Container>
    );
  }
}

export default App;
