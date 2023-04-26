const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

//from https://docs.google.com/document/d/103Unp99pLh_KdHMw6b777rKbdd9mN4wG9IikC3czjyY/edit

/************************
 * Home Page *
 ************************/


//Query 1: Generate a random indicator
app.get('/random', routes.random);
//Query 2: Based on generated indicator and average for years 2008-2016, list top 5 regions
app.get('/top5/:indicator', routes.top5);
//Query 3: Based on generated indicator and average for years 2008-2016, list top 5 sub-regions
app.get('/top5subregion/:indicator', routes.top5subregion);
//Query 4: Based on generated indicator and average for years 2008-2016, list top 5 countries
app.get('/top5countries/:indicator', routes.top5countries);


/************************
 * Regions  Page *
 ************************/

//Query 5: Generate a list of Indicator Categories
app.get('/randomIndCat', routes.randomIndCat);
//Query 6: Generate a list of Indicators based on a selected Category
app.get('/indicatorsOnCat/:category', routes.indicatorsOnCat);
//Query 7: Generate a list of Regions
app.get('/regions', routes.regions);
//Query 8: For a selected indicator and region, how the sub-regions are comparing on average 2008-2016
app.get('/compare/:indicator/:region', routes.compare);
//Query 9: For a selected indicator, how the continents/regions are comparing on average 2008- 2016.
app.get('/compareOnAvg/:indicator', routes.compareOnAvg);

//Query 9b: For a selected indicator name, return indicator code. 
app.get('/indName2indCode/:indicatorName', routes.indName2indCode);

/************************
 * Sub-Regions  Page *
 ************************/
//Query 10 (same as Query 5): Generate a list of Indicator Categories
//Query 11 (same as Query 6): Generate a list of Indicators based on a selected Category
//Query 12: Generate a list of Sub-Regions
app.get('/subregions', routes.subregions);
// Query 13: For a selected indicator and sub-region, how the countries are comparing on average 2008-2016
app.get('/compareOnAvgSub/:subregion/:indicator/', routes.compareOnAvgSub);
// Query 14: For a selected indicator, how the sub-regions are comparing on average 2008- 2016.
app.get('/compareSubs/:indicator/', routes.compareSubs);

/************************
 * Countries  Page *
 ************************/
// Query 15 (same as Query 5): Generate a list of Indicator Categories
// Query 16 (same as Query 6): Generate a list of Indicators based on a selected Category
// Query 17: Generate a list of Countries
app.get('/countries', routes.countries);
// Query 18: List all countries (in the selected Country’s sub-region) that have average (years 2008-2016) higher values than the selected country’s average for a selected indicator, sort from highest to lowest
app.get('/avgHigher/:country/:indicator', routes.avgHigher);
// Query 19: All indicators from a specified indicator category for all countries where gpi score is less than average (the smaller the score - the more peaceful the country is)..
app.get('/peaceful/:indicatorCat', routes.peaceful);

// HW CODE FOR REFERENCE
//app.get('/song/:song_id', routes.song);
//app.get('/album/:album_id', routes.album);
//app.get('/albums', routes.albums);
//app.get('/album_songs/:album_id', routes.album_songs);
//app.get('/top_songs', routes.top_songs);
//app.get('/top_albums', routes.top_albums);
//app.get('/search_songs', routes.search_songs);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;