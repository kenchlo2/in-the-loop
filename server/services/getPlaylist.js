const googleMapsPlaceLatLong = require('./googleMapsPlaceLatLong');
const axios = require('axios');
const { youtubeApiKey, ticketmasterApiKey } = require('../config');

const getPlaylist = async ({ placeId }) => {
  try {
    // get the lat-long of the inputted zip code or city
    const coordinates = await googleMapsPlaceLatLong(placeId);

    // get the local concert events
    const config = {
      method: 'get',
      url: `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ticketmasterApiKey}&latlong=${coordinates.lat},${coordinates.lng}&radius=100&unit=miles&classificationId=KZFzniwnSyZfZ7v7nJ`,
    };
    const ticketmasterSearchResults = await axios(config)
      .then(response => ('_embedded' in response.data) ? response.data._embedded.events : []);
    const concerts = ticketmasterSearchResults.map(concert => {
      const { name, url, distance, dates, _embedded } = concert;
      return {
        title: name,
        url,
        distance,
        start: dates.start.localDate,
        venue: _embedded.venues[0].name
      };
    });
    concerts.splice(2);
    // console.log(JSON.stringify(concerts, null, 2));

    // get the youtube video search result for each concert
    const playlist = await Promise.all(
      concerts.map(async (concert) => {
        const { title, url, distance, start, venue } = concert;
        const titleScrubbed = title.replace(/\//g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^\w\s]/gi, '').replace(/\s/g, '+');
        const config = {
          method: 'get',
          url: `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&part=snippet&q="${titleScrubbed}"+concert&order=relevance&type=video&videoDefinition=high&videoEmbeddable=true&topicId=/m/04rlf`,
        };
        const youtubeSearchResults = await axios(config).then(response => response.data.items[0].id.videoId);
        const payload = {
          title,
          videoId: youtubeSearchResults,
          ticketsLink: url,
          distance,
          start,
          venue
        };
        return payload;
      })
    );
    // console.log(playlist);
    return playlist.filter(item => item !== undefined);
  } catch (e) {
    throw new Error(`getPlaylist: ERROR: ${e.message}`);
  }
};

module.exports = {
  getPlaylist
};
