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

//SQL query-1 from https://docs.google.com/document/d/1IwCgyqc3q7HdSDo4W9LJtLB0X4wm363c5cJ1fG_pHd8/edit
app.get('/top5/:indicator', routes.top5);

//SQL query-2
app.get('/cont_trend/:indicator', routes.cont_trend);

//SQL query-3
app.get('/random', routes.random);

//SQL query-4
app.get('/random', routes.random);


app.get('/song/:song_id', routes.song);
app.get('/album/:album_id', routes.album);
app.get('/albums', routes.albums);
app.get('/album_songs/:album_id', routes.album_songs);
app.get('/top_songs', routes.top_songs);
app.get('/top_albums', routes.top_albums);
app.get('/search_songs', routes.search_songs);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
