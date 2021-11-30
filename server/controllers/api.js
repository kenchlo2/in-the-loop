const { getLocationSearchResults } = require('../services/getLocationSearchResults');
const { getPlaylist } = require('../services/getPlaylist');

const sendPotentialLocations = async (req, res, next) => {
	const { searchQuery } = req.body;
	try {
		const searchResults = await getLocationSearchResults(searchQuery);
		res.status(200).json(searchResults);
	} catch(e) {
    next({
      log: 'api.sendPotentialLocations: ERROR: ' + JSON.stringify(e),
      message: { e }
    });
	}
};

const sendPlaylist = async (req, res, next) => {
	try {
		const playlist = await getPlaylist(req.body);
		res.status(200).json(playlist);
	} catch (e) {
    next({
      log: 'api.sendPlaylist: ERROR: ' + JSON.stringify(e),
      message: { e }
    });
	}
};

module.exports = {
  sendPlaylist,
  sendPotentialLocations
};
