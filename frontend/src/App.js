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
import Zoom from "@material-ui/core/Zoom";

//import PieChart from 'react-minimal-pie-chart';

import BarChart from 'react-bar-chart';
import ApexCharts from './PieCharts';
import FriendList from './FriendList';
import MediaCard from './RecommendationList';

const styles = theme => ({
  root: {
    padding: '40px 20px',

    height: 200,
  },
  graph_list: {
    padding: '20px 20px',
    height: 470,
    overflowX: 'auto',
  },
  friend_list: {
    padding: '20px 20px',
    height: 690,
    overflowX: 'auto',
  },
  recom_list: {
    padding: '20px 20px',
    height: 600,
    overflowX: 'auto',
  },
  top_game_list: {
    padding: '20px 20px',
    height: 650
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
    usergames: [],
    news:[],
    login:0,
    admin:'',
    toDelete:''
  }

  game_data = () => {
    fetch('http://localhost:4000/search?steamid=' + this.state.steamid)
    .then(response => response.json())
    .then(response => this.setState({usergames: response.data}))
    .catch(err => console.log(err))
  }

  get_news = () => {
    fetch('http://localhost:4000/show')
    .then(response => response.json())
    .then(response => this.setState({news: response.news_data}))
    .catch(err => console.log(err))
  }

  update_user_database = () => {
    fetch('http://localhost:4000/update_database?steamid=' + this.state.steamid)
    .then(response => console.log(response)).catch(err => console.log(err))
    // .then(response => this.setState({usergames: response.data}))

    //.then(response => this.update_game_database)
    // .catch(err => console.log(err))
    if (this.state.usergames === undefined) {
      this.setState({invalidInput: true})
    } else {
      this.setState({invalidInput: false})
    }
  }

  showlogin = () => {
    this.setState({login: 1})
  }

  adminDelete = () => {
    if (this.state.admin == 'TheGreatSteaminer') {
      fetch('http://localhost:4000/delete?steamid=' + this.state.toDelete)
      .then(response => response.json()).catch(err=>console.log(err))
      console.log("Deleted")
    }
    this.setState({admin: '', login: 0, toDelete: ''})
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
    this.friend = []
    this.popularGame = []
    this.newsGame = []
    this.dbGame = []
    if(this.state.news.length===0){
      this.get_news()
    }else{
      var i;
      for (i=0; i<6; i++){
        this.newsGame.push(this.state.news[i]["appid"])
      }
    }
    if(this.state.usergames.length!== 0){
      if (this.state.usergames[0] === undefined || this.state.usergames[0]['0'] === undefined) {
        return (
          <div className="App">
            <div id="not_found">
              <Typography component="h2" variant="h2" color="primary" gutterBottom>
                Your Steam ID is not in our database...
              </Typography>
            </div>
            <div id='not_found_detail'>
              <Typography component="h2" variant="h6" gutterBottom>
                Do You want to add it now?
              </Typography>
            </div>
            <div id="return_button">
              <Button variant="contained" color="primary" onClick={this.update_user_database}>Add</Button>
              <div className="divider" />
              <Button variant="contained" color="primary" onClick={this.game_data}>Search Again</Button>
              <div className="divider" />
              <Button variant="contained" color="primary" onClick={()=>this.setState({usergames: [], steamid: ''})}>Return</Button>
            </div>
          </div>
        )
      }
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

      this.avatar = this.state.usergames[9]["0"]["avatar"];
      this.username = this.state.usergames[10]["0"]["UserName"];
      this.friend = this.state.usergames[11];
      this.popularGame = this.state.usergames[12];
      console.log(this.state.usergames)
      var k = 0;
      for(k = 0; k < 6; k++){
        this.dbGame.push(this.state.usergames[13][k]["appid"])
      }

      return (

        <div className="main">
            <div id="logo_image_2">
              <img src="./logo.jpeg" alt="logo" id="logo_image_2_detail" onClick={()=>this.setState({usergames: [], steamid: ''})}/>

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
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  You've Bought
                </Typography>
                <Typography component="p" variant="h3">
                  {this.game_num}
                </Typography>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Games.
                </Typography>
              </Paper>
            </div>
            <div id="total_playtime">
            <Paper  className={classes.root}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                You've Spent
              </Typography>
              <Typography component="p" variant="h3">
                {this.play_time}
              </Typography>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Playing Games.
              </Typography>
            </Paper>
            </div>
            <div id="total_worth">
              <Paper  className={classes.root}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Now Your Account worth
                </Typography>
                <Typography component="p" variant="h3">
                  {this.worth}
                </Typography>
                <Typography color="textSecondary">
                  based on current price.
                </Typography>
              </Paper>
            </div>
            <div id="FriendList">
              <Paper className={classes.friend_list}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Your Friends
                </Typography>
                <p></p>
                <div style={{'padding-right':60, 'padding-left':60}}>
                <FriendList friend = {this.friend}/>
                </div>
              </Paper>
            </div>
            <div id="PieChart">
              <Paper className={classes.graph_list}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Number of Games By Play Time
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
                      <TableCell><Typography component="p" variant="h6" color="primary">Mostly Played</Typography></TableCell>
                      <TableCell align="right"><Typography component="p" variant="h6" color="primary">Time</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.table.map(row => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row"><Typography component="p" variant="h6">{row.name}</Typography></TableCell>
                        <TableCell align="right"><Typography component="p" variant="h6">{row.time}</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </div>

            <div className="Recommendation">
            <Zoom in={true}>
              <Paper className={classes.recom_list}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Most Popuar Among Friends:
                </Typography>
                <div  className="recom_list" style={{'padding-top': 40, 'text-align': 'center'}}>
                  <div style={{'padding-right': 20}}>
                    <MediaCard appid = {this.popularGame[0] === undefined ? '' : this.popularGame[0]["GameId"]}/>
                  </div>
                  <div style={{'padding-right': 20}}>
                    <MediaCard appid = {this.popularGame[1] === undefined ? '' : this.popularGame[1]["GameId"]}/>
                  </div>
                  <div>
                    <MediaCard appid = {this.popularGame[2] === undefined ? '' : this.popularGame[2]["GameId"]}/>
                  </div>
                  <div style={{'padding-right': 20, 'padding-top': 20}}>
                    <MediaCard appid = {this.popularGame[3] === undefined ? '' : this.popularGame[3]["GameId"]}/>
                  </div>
                  <div style={{'padding-right': 20, 'padding-top': 20}}>
                    <MediaCard appid = {this.popularGame[4] === undefined ? '' : this.popularGame[4]["GameId"]}/>
                  </div>
                  <div style={{'padding-top': 20}}>
                    <MediaCard appid = {this.popularGame[5] === undefined ? '' : this.popularGame[5]["GameId"]}/>
                  </div>
                </div>
              </Paper>
            </Zoom>
            </div>
            <div className="Recommendation">
            <Zoom in={true}>
              <Paper className={classes.recom_list}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Games We think You Would Like:
                </Typography>
                <div  className="recom_list" style={{'padding-top': 40, 'text-align': 'center'}}>
                  <div style={{'padding-right': 20}}>
                    <MediaCard appid = {this.dbGame[0] === undefined ? '' : this.dbGame[0]}/>
                  </div>
                  <div style={{'padding-right': 20}}>
                    <MediaCard appid = {this.dbGame[1] === undefined ? '' : this.dbGame[1]}/>
                  </div>
                  <div>
                    <MediaCard appid = {this.dbGame[2] === undefined ? '' : this.dbGame[2]}/>
                  </div>
                  <div style={{'padding-right': 20, 'padding-top': 20}}>
                    <MediaCard appid = {this.dbGame[3] === undefined ? '' : this.dbGame[3]}/>
                  </div>
                  <div style={{'padding-right': 20, 'padding-top': 20}}>
                    <MediaCard appid = {this.dbGame[4] === undefined ? '' : this.dbGame[4]}/>
                  </div>
                  <div style={{'padding-top': 20}}>
                    <MediaCard appid = {this.dbGame[5] === undefined ? '' : this.dbGame[5]}/>
                  </div>
                </div>
              </Paper>
            </Zoom>
            </div>
        </div>
      );
    }else{
      return (
        <div className="App">
          <div id="logo_image">
            <img src="./logo.jpeg" alt="logo" id="logo_image_detail" onClick={this.showlogin}/>
          </div>
          <div id="search_field">
            <TextField error={this.state.invalidInput} helperText={this.state.invalidInput ? 'Invalid Steam ID' : ''} label="Steam ID" variant="outlined" fullWidth
              value={steamid}
              onChange={e => this.setState({steamid: e.target.value})}
              />
          </div>
          <div id="search_button">
            <Button variant="contained" color="primary" onClick={this.game_data}>Search</Button>
          </div>
          {this.state.login==1 &&
            <div>
            <TextField label="secrete code" onChange={e => this.setState({admin: e.target.value})}/>
            <TextField label="steamid" onChange={e => this.setState({toDelete: e.target.value})}/>
            <Button variant="contained" color="gray" onClick={this.adminDelete}>Delete</Button>
            </div>
          }
          <div id="Top_Game">
            <Zoom in={true}>
              <Paper className={classes.top_game_list}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Trending Now
                </Typography>
                <div  className="recom_list" style={{'padding-top': 30, 'text-align': 'center'}}>
                  <div style={{'padding-right': 20}}>
                    <MediaCard appid = {this.newsGame[0] === undefined ? '' : this.newsGame[0]}/>
                  </div>
                  <div style={{'padding-right': 20}}>
                    <MediaCard appid = {this.newsGame[1] === undefined ? '' : this.newsGame[1]}/>
                  </div>
                  <div>
                    <MediaCard appid = {this.newsGame[2] === undefined ? '' : this.newsGame[2]}/>
                  </div>
                  <div style={{'padding-right': 20, 'padding-top': 20}}>
                    <MediaCard appid = {this.newsGame[3] === undefined ? '' : this.newsGame[3]}/>
                  </div>
                  <div style={{'padding-right': 20, 'padding-top': 20}}>
                    <MediaCard appid = {this.newsGame[4] === undefined ? '' : this.newsGame[4]}/>
                  </div>
                  <div style={{'padding-top': 20}}>
                    <MediaCard appid = {this.newsGame[5] === undefined ? '' : this.newsGame[5]}/>
                  </div>
                </div>
                <div style={{'text-align': 'center', 'padding-top': 30}}>
                  <Button variant="contained" color="primary" onClick={()=>this.setState({news: []})}>Change</Button>
                </div>
              </Paper>
            </Zoom>
          </div>
        </div>
      );
    }
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
