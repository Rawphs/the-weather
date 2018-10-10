class ApiService {
  constructor (baseUrl, id) {
    this.baseUrl = baseUrl;
    this.id      = id;
  }

  getUrl (target) {
    return `${this.baseUrl}/${target}?APPID=${this.id}&units=metric`;
  }

  async fetchForecastById (id) {
    try {
      const url      = this.getUrl('forecast');
      const response = await fetch(`${url}&id=${id}`);

      if (!response.ok) {
        throw new Error(`Error fetching forecast. ID: ${id}`);
      }

      return response.json();
    } catch (error) {
      return { error };
    }
  }

  async fetchForecastByCoords ({ coords }) {
    try {
      const url      = this.getUrl('forecast');
      const response = await fetch(`${url}&lat=${coords.latitude}&lon=${coords.longitude}`);

      if (!response.ok) {
        throw new Error(`Error fetching forecast. Coords: ${coords}`);
      }

      return response.json();
    } catch (error) {
      return { error };
    }
  }
}

export default new ApiService(process.env.REACT_APP_API_URL, process.env.REACT_APP_API_KEY);
