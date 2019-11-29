import React, { Component } from 'react';
import './App.css';
import './main.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Container, Row, Col } from 'reactstrap';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
  root: {
    padding: '20px 20px',
    textAlign: 'center',
    height: 140,
    width: 300,
  },
});

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
    if (this.state.usergames === undefined) {
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
    if (this.state.usergames === undefined) {
      this.setState({invalidInput: true})
    } else {
      this.setState({invalidInput: false})
    }
  }

  // delete_data = () => {
  //   console.log(this.state.steamid)
  //   fetch('http://localhost:4000/delete_from_database?steamid=' + this.state.steamid)
  //   .then(response => response.json())
  //   .then(response => this.setState({usergames: response.data}))
  //   .catch(err => console.log(err))
  //   console.log(this.state.usergames[0])
  //   if (this.state.usergame === undefined) {
  //     this.setState({invalidInput: true})
  //   } else {
  //     this.setState({invalidInput: false})
  //   }
  // }
  //
  // update_data = () => {
  //   console.log(this.state.steamid)
  //   fetch('http://localhost:4000/update_database?steamid=' + this.state.steamid)
  //   .then(response => response.json())
  //   .then(response => this.setState({usergames: response.data}))
  //   .catch(err => console.log(err))
  //   console.log(this.state.usergames[0])
  //   if (this.state.usergame === undefined) {
  //     this.setState({invalidInput: true})
  //   } else {
  //     this.setState({invalidInput: false})
  //   }
  // }

  /*<button onClick={this.insert_data}>Add</button>
  <button onClick={this.delete_data}>Delete</button>
  <button onClick={this.update_data}>Update</button>*/
  render() {
    const {steamid} = this.state
    const { classes } = this.props;
    this.game_num = 0
    this.play_time = 0
    //this.state.usergame !== undefined
    if(true){
      console.log(this.state)

      if(this.state.usergames[0]!== undefined){
        console.log(this.state.usergames[0]["0"]["COUNT(GameId)"])
        this.game_num = parseFloat(this.state.usergames[0]["0"]["COUNT(GameId)"])
        console.log(this.state.usergames[1]["0"]["SUM(PlayTime)"])
        this.play_time = parseFloat(this.state.usergames[1]["0"]["SUM(PlayTime)"])/60.0
      }

      return (

        <div className="main">
            <div id="logo_image_2">
              <img src="./logo.jpeg" alt="logo" id="logo_image_2_detail"/>

            </div>
            <div id="search_field_2">
              <TextField error={this.state.invalidInput} helperText={this.state.invalidInput ? 'Invalid Steam ID' : ''} label="Steam ID" variant="outlined" fullWidth
              value={steamid}
              onChange={e => this.setState({steamid: e.target.value})} />
            </div>
            <div id="search_button_2" >
              <Button id="search_button_2_detail" variant="contained" color="primary" onClick={this.game_data}>Search</Button>
            </div>
            <div id="avatar">
              <Avatar alt="Photo" src="./pure.png" />
            </div>
            <div id="total_game">
              <Paper  className={classes.root}>
                <Typography variant="h6" component="h3">
                  Total Games:
                </Typography>
                <Typography component="p">
                  {this.game_num}
                </Typography>
              </Paper>
            </div>
            <div id="total_playtime">
            <Paper  className={classes.root}>
              <Typography variant="h6" component="h3">
                Total Playtime:
              </Typography>
              <Typography component="p">
                {this.play_time}
              </Typography>
            </Paper>
            </div>
            <div id="total_worth">
              <Paper  className={classes.root}>
                <Typography variant="h6" component="h3">
                  Total Worth:
                </Typography>
                <Typography component="p">

                </Typography>
              </Paper>
            </div>
        </div>
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

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
