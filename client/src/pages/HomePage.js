import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
const config = require('../config.json');

export default function HomePage() {
    // We use the setState hook to persist information across renders (such as the result of our API calls)
    const [randomIndicator, setRandomIndicator] = useState({});
    // TODO (TASK 13): add a state variable to store the app author (default to '')
    const [randomIndcatorCode, setRandomIndicatorCode] = useState({})
    const [averages, setAverages] = useState({});
    const [regions, setRegion] = useState(null);
    const [count, setCount] = useState(0);

    // The useEffect hook by default runs the provided callback after every render
    // The second (optional) argument, [], is the dependency array which signals
    // to the hook to only run the provided callback if the value of the dependency array
    // changes from the previous render. In this case, an empty array means the callback
    // will only run on the very first render.
    useEffect(() => {
        // Fetch request to get the song of the day. Fetch runs asynchronously.
        // The .then() method is called when the fetch request is complete
        // and proceeds to convert the result to a JSON which is finally placed in state.
        fetch(`http://${config.server_host}:${config.server_port}/random`)
            .then(res => res.json())
            .then(resJson => setRandomIndicator(resJson));
        document.title = `DatabaseProject`;
        // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store it in the state variable
        //fetch(`http://${config.server_host}:${config.server_port}/top5/BM_KLT_DINV_WD_GD_ZS/`)
        //    .then(res => res.json())
        //    .then(resJson => setAverages(resJson));
    }, [count]);


    // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
    // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
    const top5Regions = [
        {
            field: 'region',
            headerName: 'Region'
        },
        {
            field: 'AVG',
            headerName: 'Averages (2008-2016)'
        },
    ];

    const top5SubRegions = [
        {
            field: 'sub',
            headerName: 'SubRegion'
        },
        {
            field: 'AVG',
            headerName: 'Averages (2008-2016)'
        },
    ];

    const top5Countries = [
        {
            field: 'country',
            headerName: 'Country'
        },
        {
            field: 'AVG',
            headerName: 'Averages (2008-2016)'
        }
    ];

    return (
        <Container>
            <button onClick={() => setCount(count + 1)}>Generate Random Indicator</button>
            <h2>Randomly generated indicator is:&nbsp;
                {randomIndicator.indicator_name}
            </h2>
            <h1>Top 5 Regions</h1>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/top5/${randomIndicator.indicator_code}/`} columns={top5Regions} />
            <h1>Top 5 SubRegions</h1>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/top5subregion/${randomIndicator.indicator_code}/`} columns={top5SubRegions} />
            <h1>Top 5 Countries</h1>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/top5countries/${randomIndicator.indicator_code}/`} columns={top5Countries} />
        </Container>
    );
};