const router = require('express').Router();
const controllers = require('../controllers/api');

router.post('/location-search', controllers.sendPotentialLocations);

router.post('/playlist', controllers.sendPlaylist);

module.exports = router;
