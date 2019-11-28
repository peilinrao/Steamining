import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Container, Row, Col } from 'reactstrap';


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
      this.setState({invalidInput: true})
    } else {
      this.setState({invalidInput: false})
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
      this.setState({invalidInput: true})
    } else {
      this.setState({invalidInput: false})
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
      this.setState({invalidInput: true})
    } else {
      this.setState({invalidInput: false})
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
      this.setState({invalidInput: true})
    } else {
      this.setState({invalidInput: false})
    }
  }

  /*<button onClick={this.insert_data}>Add</button>
  <button onClick={this.delete_data}>Delete</button>
  <button onClick={this.update_data}>Update</button>*/
  render() {
    const {steamid} = this.state
    if(this.state.usergame !== undefined){
      return (
        <Container>
          <Row>
            <Col>
              <img src="./logo.jpeg" alt="logo" id="logo_image_2"/>
            </Col>
            <Col>
              <TextField error={this.state.invalidInput} helperText={this.state.invalidInput ? 'Invalid Steam ID' : ''} id="search_field_2" label="Steam ID" variant="outlined" fullWidth
              value={steamid}
              onChange={e => this.setState({steamid: e.target.value})} />
            </Col>
            <Col>
              <Button id="search_button_2" variant="contained" color="primary" onClick={this.game_data}>Search</Button>
            </Col>
          </Row>
          <Row>
            <Col><p></p><p></p></Col>
          </Row>
        </Container>
      );
    }else{
      return (
        <Container className="App">
          <Row>
            <Col xs="4"></Col>
            <Col xs="7"><img src="./logo.jpeg" alt="logo" id="logo_image"/></Col>
            <Col xs></Col>
          </Row>
          <Row>
            <Col>
              <p></p>
              <p></p>
            </Col>
          </Row>
          <Row>
            <Col xs="10">
              <TextField error={this.state.invalidInput} helperText={this.state.invalidInput ? 'Invalid Steam ID' : ''} id="search_field" label="Steam ID" variant="outlined" fullWidth
              value={steamid}
              onChange={e => this.setState({steamid: e.target.value})} />
            </Col>
            <Col xs="1">
              <Button id="search_button" variant="contained" color="primary" onClick={this.game_data}>Search</Button>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default App;
