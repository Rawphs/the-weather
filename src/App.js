import {Grid, Typography} from '@material-ui/core';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AutosuggestInput from './Components/AutosuggestInput';
import WeatherCard from './Components/WeatherCard';
import apiService from './Services/apiService';
import styles from './App.styles';

class App extends Component {
  state = {
    forecast: null,
    city    : '',
    country : '',
  };

  /**
   * Fetches the forecast for given coordinates.
   *
   * @param {Object} coords
   * @returns {Promise<void>}
   */
  async fetchByCoords (coords) {
    if (coords) {
      const response = await apiService.fetchForecastByCoords({ coords });

      this.handleResponse(response);
    }
  }

  /**
   * Fetches the forecast for given city id.
   *
   * @param {number} id
   * @returns {Promise<void>}
   */
  async fetchById (id) {
    const response = await apiService.fetchForecastById(id);

    this.handleResponse(response);
  }

  /**
   * Gets current position, if possible, and perform fetch accordingly.
   */
  componentDidMount () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // If successful, uses coords
        ({ coords }) => this.fetchByCoords(coords),
        // otherwise falls back to Amsterdam's id
        () => this.fetchById(2759794),
      );
    }
    else {
      // Defaults to Amsterdam if geolocation is not available.
      this.fetchById(2759794).then();
    }
  }

  /**
   * Formats api response and set state.
   *
   * @param {Object} response
   */
  handleResponse (response) {
    if (response.error || response.cod !== '200') {
      return this.setState({ error: true });
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

    this.setState({ ...parsed, error: false });
  }

  /**
   * Renders city name and country, if available.
   *
   * @returns {*}
   */
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

  /**
   * Renders error message.
   *
   * @returns {*}
   */
  renderError () {
    if (!this.state.error) {
      return;
    }

    return (
      <Typography component="h4" variant="h4" align="center">
        Uh-oh... Something went wrong with your request.
      </Typography>
    );
  }

  /**
   * Renders forecast cards.
   *
   * @returns {*}
   */
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
        <AutosuggestInput onSelect={(id) => this.fetchById(id)} />
        {this.renderError()}
        {this.renderTitle()}
        {this.renderForecast()}
      </div>
    );
  }
}

export default withStyles(styles)(App);
