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
import ApexCharts from './PieCharts';
import FriendList from './FriendList';
import RecommendationList from './RecommendationList';

const styles = theme => ({
  root: {
    padding: '40px 20px',
    textAlign: 'center',
    background:'#cfcfd7',
    height: 200,
  },
  graph_list: {
    textAlign: 'center',
    height: 470,
    background:'#cfcfd7',
    overflowX: 'auto',
  },
  recom_list: {
    padding: '50px 10px',
    textAlign: 'center',
    height: 470,
    background: '#cfcfd7',
    overflowX: 'auto',
  }
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
    fetch('http://localhost:4000/update_user_database?steamid=' + this.state.steamid)
    .then(response => response.json())
    .then(response => this.setState({usergames: response.data}))
    .catch(err => console.log(err))
    //.then(response => this.update_game_database)
    .catch(err => console.log(err))
    if (this.state.usergames === undefined) {
      this.setState({invalidInput: true})
    } else {
      this.setState({invalidInput: false})
    }
  }

  // No longer needs because its emerged with update_user_database in backend calls
  // update_game_database = () => {
  //   console.log("I AM UPDATING GAMES!")
  //   fetch('http://localhost:4000/update_game_database?steamid=' + this.state.steamid)
  //   .catch(err => console.log(err))
  // }


  render() {
    const {steamid} = this.state
    const { classes } = this.props;
    this.game_num = ""
    this.play_time = ""
    this.worth = ""
    this.table = []
    this.donut = []
    this.friendlist = []
    this.avatar = ""
    this.username = ""
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

        //From resultss 4-8
        var limit_of_donuts = 5
        var j = 0
        for (j = 0; j < limit_of_donuts; j++){
          var number = parseInt(this.state.usergames[4+j]["0"]["COUNT(GameId)"])
          this.donut.push(number)
        }

        this.avatar = this.state.usergames[9]["0"]["avatar"]
        this.username = this.state.usergames[10]["0"]["UserName"]
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
              <div className="divider" />
              <Button id="update_button_2_detail" variant="contained" color="primary" onClick={this.update_user_database}>Update</Button>
            </div>
            <div id="avatar">
              <Typography component="p" variant="h6">
                {this.username}
              </Typography>
              <div className="divider"/>
              <Avatar alt="Photo" src={this.avatar} />
            </div>
            <div id="total_game">
              <Paper  className={classes.root}>
                <Typography variant="h6" component="h3">
                  Total Games:
                </Typography>
                <p></p>
                <Typography component="h5" variant="h3">
                  {this.game_num}
                </Typography>
              </Paper>
            </div>
            <div id="total_playtime">
            <Paper  className={classes.root}>
              <Typography variant="h6" component="h3">
                Total Playtime:
              </Typography>
              <p></p>
              <Typography component="h5" variant="h3">
                {this.play_time}
              </Typography>
            </Paper>
            </div>
            <div id="total_worth">
              <Paper  className={classes.root}>
                <Typography variant="h6" component="h3">
                  Total Worth:
                </Typography>
                <p></p>
                <Typography component="h5" variant="h3">
                  {this.worth}
                </Typography>
              </Paper>
            </div>
            <div id="PieChart" style={{textAlign:"center"}}>
              <Paper className={classes.graph_list}>
              <Typography variant="h6" component="h3">
                Number of Games by Play Time
                </Typography>
                <p></p>
              <ApexCharts data={this.donut}/>
              </Paper>
            </div>
            <div id="favorite_game">
              <Paper className={classes.graph_list}>
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
              </Paper>
            </div>
            <div id="FriendList" style={{textAlign:"center"}}>
              <Paper className={classes.graph_list}>
                <Typography variant="h6" component="h3">
                  Your Friends
                </Typography>
                <p></p>
                <div style={{'padding-right':30, 'padding-left':30}}>
                <FriendList />
                </div>
              </Paper>
            </div>
            <div id="Recommendation">
              <Paper className={classes.recom_list} id="recom_list">
                <Typography variant="h6" component="h3">
                  The Games Your Friends You like
                </Typography>
                <p></p>
                <div>
                  <RecommendationList />
                </div>
                <div className="divider"/>
                <div>
                  <RecommendationList />
                </div>
                <div className="divider"/>
                <div>
                  <RecommendationList />
                </div>
                <div className="divider"/>
                <div>
                  <RecommendationList />
                </div>
                <div className="divider"/>
                <div>
                  <RecommendationList />
                </div>
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
