import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
const useStyles = makeStyles({
  card: {
    width: 460,
    height: 215
  },
  media: {
    height: 215,
  },
});


export default function MediaCard(props) {
  const classes = useStyles();
  var img = "https://steamcdn-a.akamaihd.net/steam/apps/"+ props.appid +"/header.jpg"
  if (img === "https://steamcdn-a.akamaihd.net/steam/apps//header.jpg"){
    img = "./placeholder.png"
  }
  const link = "https://store.steampowered.com/app/" + props.appid

  return (
      <Card className={classes.card} onClick={()=> window.open(link)}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={img}
          />
        </CardActionArea>
      </Card>
  );
}
