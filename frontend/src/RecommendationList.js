import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import Link from '@material-ui/core/Link';
import ButtonBase from '@material-ui/core/ButtonBase';

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
  const img = "https://steamcdn-a.akamaihd.net/steam/apps/"+ props.appid +"/header.jpg"
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
