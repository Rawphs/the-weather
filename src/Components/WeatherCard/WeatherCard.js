import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardMedia, Typography, CardContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import icons from '../../Images';
import styles from './WeatherCard.styles';

class WeatherCard extends Component {
  static propTypes = {
    classes : PropTypes.object,
    temp    : PropTypes.number,
    temp_max: PropTypes.number,
    temp_min: PropTypes.number,
    icon    : PropTypes.string,
    humidity: PropTypes.number,
    date    : PropTypes.object,
  };

  render () {
    return (
      <Card className={this.props.classes.card} raised>
        <CardContent>
          <CardMedia className={this.props.classes.media} image={icons[this.props.icon.slice(0, -1)]} />
          <Typography gutterBottom variant="h5" component="h2">
            {this.props.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'numeric' })}
          </Typography>
          <Typography component="p" variant="body2">
            <strong>Average temperature: </strong>{this.props.temp} ºC
          </Typography>
          <Typography component="p" variant="body2">
            <strong>Min: </strong>{this.props.temp_min} ºC / <strong>Max: </strong>{this.props.temp_max} ºC
          </Typography>
          <Typography component="p" variant="body2">
            <strong>Humidity: </strong>{this.props.humidity} %
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(WeatherCard);
