import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',

  }
}));

function renderRow(props) {
  const { index, style, data } = props;
  console.log(data['friend'][0].Avatar);
  return (
    <>
      <ListItem alignItems="flex-start" style={style}>
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={data['friend'][index].Avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={data['friend'][index].UserName}
          secondary={data['friend'][index].SteamId64} />
      </ListItem>

    </>
  );
}

renderRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

export default function FriendList(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FixedSizeList height={570} itemSize={57} itemCount={props.friend.length} itemData={{friend: props.friend}}>
        {renderRow}
      </FixedSizeList>
    </div>
  );
}
