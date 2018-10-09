import {Grid, Typography} from '@material-ui/core';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AutosuggestInput from './Components/AutosuggestInput';
import WeatherCard from './Components/WeatherCard';
import apiService from './Services/apiService';

const styles = () => ({
  root    : {
    height  : 250,
    flexGrow: 1,
  },
  forecast: {
    marginTop   : 20,
    marginBottom: 40,
    width       : '100%',
  },
});

class App extends Component {
  state = {
    forecast: null,
    city    : '',
    country : '',
  };

  async getPositionSuccess (coords) {
    if (coords) {
      const response = await apiService.fetchForecastByCoords({ coords });

      this.handleResponse(response);
    }
  }

  componentDidMount () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({coords}) => this.getPositionSuccess(coords),
        () => this.onSelect('2759794')
      );
    }
    else {
      console.log('Geolocation is not supported for this Browser/OS.');
    }
  }

  handleResponse (response) {
    if (response.cod !== '200') {
      return;
    }

    let parsed = {
      city: response.city.name,
      country: response.city.country,
    };

    parsed.forecast = response.list.reduce((prev, current) => {
      const currentDate = new Date(current.dt_txt);
      const date        = currentDate.getDate();

      if (!prev[date]) {
        prev[date] = [];
      }

      prev[date].push({
        icon: current.weather[0].icon,
        ...current.main,
        wind: current.wind,
        time: `${currentDate.getHours()}h`,
        date: currentDate,
      });

      return prev;
    }, {});

    this.setState({ ...parsed });
  }

  async onSelect (id) {
    const response = await apiService.fetchForecastById(id);

    this.handleResponse(response);
  }

  renderTitle() {
    if (!this.state.city) {
      return;
    }

    return (
      <Typography component="h2" variant="h2" align="center">
        {this.state.city}, {this.state.country}
      </Typography>
    );
  }

  renderForecast () {
    const { forecast } = this.state;

    if (!forecast) {
      return;
    }

    return (
      <Grid container spacing={16} className={this.props.classes.forecast} justify="center">
        {Object.keys(forecast).map(date => {
          return (
            <Grid item key={`card-${date}`}>
              <WeatherCard forecast={forecast[date]} />
            </Grid>
          );
        })}
      </Grid>
    );
  }

  render () {
    return (
      <div>
        <AutosuggestInput onSelect={id => this.onSelect(id)} />
        {this.renderTitle()}
        {this.renderForecast()}
      </div>
    );
  }
}

export default withStyles(styles)(App);
