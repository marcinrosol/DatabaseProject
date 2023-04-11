const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));


// SQL query-1: GET /top5/:indicator
// For a given indicator, taken average over 2008-2016, find five countries which rank on top
const top5 = async function (req, res) {

  const indicator = req.params.indicator;
  connection.query(`
                      SELECT c.name_long,
                        (s.2008 + s.2009 + s.2010 + s.2011 + s.2012 + s.2013 + s.2014 + s.2015 + s.2016) / 9 AS average
                      FROM Statistics s
                        JOIN Countries c ON s.country_code = c.name_3_char
                        JOIN Indicators i ON i.indicator_code = s.indicator_code
                      WHERE i.indicator_code = "${indicator}"
                      ORDER BY average DESC
                      LIMIT 5;`
                      , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// SQL query-2: GET /cont_trend/:indicator
// For a selected indicator, how the continents are trending through 2008- 2016.
const cont_trend = async function (req, res) {

  const indicator = req.params.indicator;
  connection.query(`
                      SELECT region,
                        AVG(s.2008),
                        AVG(s.2009),
                        AVG(s.2010),
                        AVG(s.2011),
                        AVG(s.2012),
                        AVG(s.2013),
                        AVG(s.2014),
                        AVG(s.2015),
                        AVG(s.2016)
                      FROM Countries c
                        JOIN Statistics s
                          ON c.name_3_char = s.country_code
                        JOIN Regions r
                          ON c.sub_region = r.sub_region
                        JOIN Indicators i
                          ON i.indicator_code = s.indicator_code
                        WHERE s.indicator_code = "${indicator}"
                        GROUP BY region;`
                        , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// SQL query-3: GET /cont_trend/:indicator
// For a selected indicator and a selected region, how the sub-regions compare (calculate average for years 2008-2016).

const higher_values = async function (req, res) {

  const indicator = req.params.indicator;
  const region = req.params.region;

  connection.query(`
                    SELECT c.sub_region,
                      (s.2008 + s.2009 + s.2010 + s.2011 + s.2012 + s.2013 + s.2014
                      + s.2015 + s.2016) / 9 AS average
                    FROM Statistics s
                      JOIN Countries c ON s.country_code = c.name_3_char
                      JOIN Indicators i ON i.indicator_code = s.indicator_code
                      JOIN Regions r ON r.sub_region = c.sub_region
                    WHERE i.indicator_code = "${indicator}"
                    AND r.region = "${region}"
                    GROUP BY c.sub_region
                    ORDER BY average DESC
                    LIMIT 5;`
                    , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// SQL query-4: GET /averages/:indicator/:region
// For a selected indicator and a selected region, how the countries compare (calculate average for years 2008-2016) and list only top 5 countries.
const averages = async function (req, res) {

  const indicator = req.params.indicator;
  const region = req.params.region;

  connection.query(`
                    SELECT c.name_long,
                      (s.2008 + s.2009 + s.2010 + s.2011 + s.2012 + s.2013 + s.2014 + s.2015 + s.2016) / 9 AS average
                    FROM Statistics s
                      JOIN Countries c ON s.country_code = c.name_3_char
                      JOIN Indicators i ON i.indicator_code = s.indicator_code
                      JOIN Regions r ON r.sub_region = c.sub_region
                    WHERE i.indicator_code = "${indicator}"
                    AND r.region = "${region}"
                    ORDER BY average DESC
                    LIMIT 5;`
                    , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const higherCountries = async function (req, res) {

  const indicator = req.params.indicator;
  const country = req.params.country;

  connection.query(`
                    SELECT c.name_long, (s.2008 + s.2009 + s.2010 + s.2011 + s.2012 + s.2013 + s.2014
                    + s.2015 + s.2016)/9 AS average
                    FROM Statistics s
                    JOIN Countries c
                      ON s.country_code = c.name_3_char
                    WHERE s.indicator_code = "${indicator}"
                    AND c.sub_region =
                      (SELECT c.sub_region FROM Countries c WHERE c.name_long = "${country}")
                    AND (s.2008 + s.2009 + s.2010 + s.2011 + s.2012 + s.2013 + s.2014
                    + s.2015 + s.2016)/9
                    >
                    (SELECT (s.2008 + s.2009 + s.2010 + s.2011 + s.2012 + s.2013 + s.2014
                    + s.2015 + s.2016)/9 AS avg
                      FROM Statistics s JOIN Countries c
                      ON s.country_code = c.name_3_char
                      JOIN Indicators i ON i.indicator_code = s.indicator_code
                      WHERE s.indicator_code = "${indicator}"
                    AND c.name_long = "${country}")
                    ORDER BY s.2016 DESC;`
                                    , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const higherCountriesPerYear = async function (req, res) {

  const indicator = req.params.indicator;
  const year = req.params.year;
  const country = req.params.country;

  connection.query(`
                      SELECT c.name_long, (s.${year})
                      FROM Statistics s
                        JOIN Countries c
                         ON s.country_code = c.name_3_char
                      WHERE s.indicator_code = "${indicator}"
                      AND c.sub_region =
                          (SELECT c.sub_region FROM Countries c WHERE c.name_long = "${country}")
                      AND s.${year}
                        >
                        (SELECT s.${year}
                        FROM Statistics s JOIN Countries c
                        ON s.country_code = c.name_3_char
                        JOIN Indicators i ON i.indicator_code = s.indicator_code
                        WHERE s.indicator_code = "${indicator}"
                      AND c.name_long = "${country}")
                      ORDER BY s.${year}
                      DESC;
                      `
                    , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


/******************
 * HOMEWORK CODE LEFT BELOW TO REFERENCE AS EXAMPLES *
 ******************/



/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function (req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = 'Marcin Rosol';
  const pennKey = 'marcinr';

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
    res.send(`Created by ${pennKey}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
  }
}

// Route 2: GET /random
const random = async function (req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json({
        song_id: data[0].song_id, title: data[0].title
      });
    }
  });
}

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/

// Route 3: GET /song/:song_id
const song = async function (req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Most of the code is already written for you, you just need to fill in the query
  const song_id = req.params.song_id;
  connection.query(`
                    SELECT *
                    FROM Songs
                    WHERE song_id =  '${song_id}';
                    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 4: GET /album/:album_id
const album = async function (req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  //res.json({}); // replace this with your implementation
  const album_id = req.params.album_id;
  connection.query(`
                    SELECT *
                    FROM Albums
                    WHERE album_id =  '${album_id}';
                    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 5: GET /albums
const albums = async function (req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
  //res.json([]); // replace this with your implementation
  connection.query(`
                    SELECT *
                    FROM Albums
                    ORDER BY release_date DESC;
                    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 6: GET /album_songs/:album_id
const album_songs = async function (req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  //res.json([]); // replace this with your implementation
  const album_id = req.params.album_id;
  connection.query(`
                    SELECT S.song_id, S.title, S.number, S.duration, S.plays
                    FROM Songs S JOIN Albums ON S.album_id = Albums.album_id
                    WHERE Albums.album_id = '${album_id}'
                    ORDER BY number;
                    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });


}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_songs
const top_songs = async function (req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const explicit = req.query.explicit === 'true' ? 1 : 0;
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
    //res.json([]); // replace this with your implementation
    connection.query(`SELECT S.song_id, S.title AS title, S.album_id, A.title AS album, S.plays
    FROM Songs S JOIN Albums A ON S.album_id = A.album_id
    ORDER BY S.plays DESC;`
                        , (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });

  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    //res.json([]); // replace this with your implementation
    //console.log(pageSize)
    //console.log(page)
    connection.query(`SELECT S.song_id, S.title AS title, S.album_id, A.title AS album, S.plays FROM Songs S JOIN Albums A ON S.album_id = A.album_id
    ORDER BY S.plays DESC
    LIMIT ${pageSize} OFFSET ${pageSize * (page - 1)};`
                      , (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

// Route 8: GET /top_albums
const top_albums = async function (req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
  //res.json([]); // replace this with your implementation
  const page = req.query.page;

  const pageSize = req.query.page_size ?? 10;

  if (!page) {

    connection.query(`
                        SELECT A.album_id, A.title AS title, SUM(S.plays) AS plays
                        FROM Songs S JOIN Albums A on S.album_id = A.album_id
                        GROUP BY A.album_id
                        ORDER BY plays DESC;
                    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });

  } else {

    connection.query(`
                      SELECT A.album_id, A.title AS title, SUM(S.plays) AS plays
                      FROM Songs S JOIN Albums A on S.album_id = A.album_id
                      GROUP BY A.album_id
                      ORDER BY plays DESC
                      LIMIT ${pageSize} OFFSET ${pageSize * (page - 1)}
                      ;
                    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

// Route 9: GET /search_albums
const search_songs = async function (req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest

  const title = req.query.title ?? "_";

  const durationLow = req.query.duration_low ?? 60;
  const durationHigh = req.query.duration_high ?? 660;
  const playsLow = req.query.plays_low ?? 0;
  const playsHigh = req.query.plays_high ?? 1100000000;
  const danceabilityLow = req.query.danceability_low ?? 0;
  const danceabilityHigh = req.query.danceability_high ?? 1;
  const energyLow = req.query.energy_low ?? 0;
  const energyHigh = req.query.energy_high ?? 1;
  const valenceLow = req.query.valence_low ?? 0;
  const valenceHigh = req.query.valence_high ?? 1;
  const explicit = req.query.explicit === 'true' ? 1 : 0;


  connection.query(`
                      SELECT *
                      FROM Songs
                      WHERE title LIKE '%${title}%'
                      AND duration >= ${durationLow} AND duration <= ${durationHigh}
                      AND plays >= ${playsLow} AND plays <= ${playsHigh}
                      AND danceability >= ${danceabilityLow} AND danceability <= ${danceabilityHigh}
                      AND energy >= ${energyLow} AND energy <= ${energyHigh}
                      AND valence >= ${valenceLow} AND valence <=${valenceHigh}
                      AND explicit <= ${explicit}
                      ORDER BY title;
                    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

module.exports = {
  author,
  random,
  song,
  album,
  albums,
  album_songs,
  top_songs,
  top_albums,
  search_songs,
}
