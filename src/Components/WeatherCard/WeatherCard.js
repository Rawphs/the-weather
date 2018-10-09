import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardMedia, Typography, CardContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import icons from '../../Images';
import styles from './WeatherCard.styles';

class WeatherCard extends Component {
  static propTypes = {
    classes : PropTypes.object,
    forecast: PropTypes.arrayOf(PropTypes.shape({
      temp    : PropTypes.number,
      temp_max: PropTypes.number,
      temp_min: PropTypes.number,
      icon    : PropTypes.string,
      humidity: PropTypes.number,
      date    : PropTypes.object,
      wind    : PropTypes.object,
    }))
  };

  renderItem(label, value, unit = '') {
    return (
      <Typography component="p" variant="body2">
        <strong>{label}: </strong>{value} {unit}
      </Typography>
    );
  }

  getMinTemp () {
    return this.props.forecast.reduce((min, data) => data.temp < min ? data.temp : min, this.props.forecast[0].temp);
  }

  getMaxTemp () {
    return this.props.forecast.reduce((max, p) => p.temp > max ? p.temp : max, this.props.forecast[0].temp);
  }

  getAverageTemp () {
    return (this.props.forecast.reduce((prev, current) => (prev + current.temp), 0) / this.props.forecast.length).toFixed(1);
  }

  getWindDirection (deg) {
    if (deg < 45) {
      return 'NE'
    } else if (deg < 90) {
      return 'E'
    } else if (deg < 135) {
      return 'SE'
    } else if (deg < 225) {
      return 'SW'
    } else if (deg < 270) {
      return 'W'
    } else {
      return 'NW'
    }
  }

  render () {
    const { humidity, wind, icon, date } = this.props.forecast[0];

    return (
      <Card className={this.props.classes.card} raised>
        <CardContent>
          <CardMedia className={this.props.classes.media} image={icons[icon.slice(0, -1)]} />
          <Typography gutterBottom variant="h5" component="h2">
            {date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'numeric' })}
          </Typography>
          {this.renderItem('Average temperature', this.getAverageTemp(), 'ºC')}
          {this.renderItem('Min. temperature', this.getMinTemp(), 'ºC')}
          {this.renderItem('Max. temperature', this.getMaxTemp(), 'ºC')}
          {this.renderItem('Humidity', humidity, '%')}
          {this.renderItem('Wind speed', wind.speed, 'm/s')}
          {this.renderItem('Wind direction', this.getWindDirection(wind.deg))}
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(WeatherCard);
