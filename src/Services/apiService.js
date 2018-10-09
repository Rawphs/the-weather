class ApiService {
  constructor (baseUrl, id) {
    this.baseUrl = baseUrl;
    this.id      = id;
  }

  getUrl (target) {
    return `${this.baseUrl}/${target}?APPID=${this.id}&units=metric`;
  }

  async fetchForecastById (id) {
    const url      = this.getUrl('forecast');
    const response = await fetch(`${url}&id=${id}`);

    if (!response.ok) {
      return console.log('error fetching stuff');
    }

    return response.json();
  }

  async fetchForecastByCoords ({ coords }) {
    const url      = this.getUrl('forecast');
    const response = await fetch(`${url}&lat=${coords.latitude}&lon=${coords.longitude}`);

    if (!response.ok) {
      return console.log('error fetching stuff');
    }

    return response.json();
  }
}

export default new ApiService('https://api.openweathermap.org/data/2.5', process.env.REACT_APP_API_KEY);
