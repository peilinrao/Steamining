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

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

//import PieChart from 'react-minimal-pie-chart';

import BarChart from 'react-bar-chart';
import PieChart from './pieChart';

const styles = theme => ({
  root: {
    padding: '20px 20px',
    textAlign: 'center',
    height: 140,
    width: 300,
  },
});

function createData(name, time) {
  return { name, time };
}

const rows = [
  createData('game1', 100),
  createData('game2', 50),
  createData('game3', 20),
  createData('game4', 10),
  createData('game5', 5),
];

const data = [
  {text: '0-20', value: 200},
  {text: '20-40', value: 400},
  {text: '40-60', value: 400},
  {text: '60+', value: 200},
];

const margin = {top: 20, right: 20, bottom: 30, left: 40};

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

  update_user_database = () => {
    console.log(this.state.steamid)
    fetch('http://localhost:4000/update_user_database?steamid=' + this.state.steamid)
    .then(response => response.json())
    .then(response => this.setState({usergames: response.data}))
    .then(response => this.update_game_database)
    .catch(err => console.log(err))
    console.log(this.state.usergames[0])
    if (this.state.usergames === undefined) {
      this.setState({invalidInput: true})
    } else {
      this.setState({invalidInput: false})
    }
  }

  update_game_database = () => {
    fetch('http://localhost:4000/update_game_database?steamid=' + this.state.steamid)
    .catch(err => console.log(err))
    console.log(this.state.steamid)
  }


  render() {
    const {steamid} = this.state
    const { classes } = this.props;
    this.game_num = ""
    this.play_time = ""
    this.worth = ""
    this.table = []
    if(true){
      console.log(this.state)
      if(this.state.usergames.length !== 0){
        this.game_num = (parseFloat(this.state.usergames[0]["0"]["COUNT(GameId)"])).toString()
        this.play_time = (parseFloat(this.state.usergames[1]["0"]["SUM(PlayTime)"])/60.0).toFixed(2).toString()+"h"
        this.worth = "$"+(parseFloat(this.state.usergames[2]["0"]["SUM(G.price)"])/100.0).toFixed(2).toString()
        var i;
        for (i = 0; i < this.state.usergames[3].length; i++) {
          var myname = this.state.usergames[3][i]["name"]
          var myplaytime =  (parseFloat(this.state.usergames[3][i]["PlayTime"])/60).toFixed(2) + "h"

          this.table.push(createData(myname, myplaytime))
        }

        console.log(this.table)
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
            <div id="update_button_2" >
              <Button id="update_button_2_detail" variant="contained" color="primary" onClick={this.update_user_database}>Update</Button>
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
                  {this.worth}
                </Typography>
              </Paper>
            </div>
            <p></p>
            <div id="favorite_game">
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Mostly Played</TableCell>
                    <TableCell align="right">Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.table.map(row => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">{row.name}</TableCell>
                      <TableCell align="right">{row.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div id="PieChart">
              <PieChart />
            </div>
            <div id="BarChart">
                <BarChart ylabel='Quantity'
                  width={300}
                  height={350}
                  margin={margin}
                  data={data}/>
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
