import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

//import LazyTable from '../components/LazyTable';
//import SongCard from '../components/SongCard';
const config = require('../config.json');

export default function HomePage() {
    // We use the setState hook to persist information across renders (such as the result of our API calls)
    const [indicatorCategory, setIndicatorCategory] = useState({});
    // TODO (TASK 13): add a state variable to store the app author (default to '')
    const [indicator, setIndicator] = useState({});
    const [region, setRegion] = useState(null);

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
            .then(resJson => setIndicatorCategory(resJson));

        // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store it in the state variable
        fetch(`http://${config.server_host}:${config.server_port}/averages/:indicator/:region`)
            .then(res => res.json())
            .then(resJson => setAverages(resJson));
    }, []);


    // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
    // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
    const top5Regions = [
        {
            field: 'Averages',
            headerName: 'Averages (2008-2016)',
            renderCell: (row) => <NavLink to={`/averages/:indicator/:region${row.averages}`}>{row.average}</NavLink> // A NavLink component is used to create a link to the album page
        },
        {
            field: 'Region',
            headerName: 'Region',
            renderCell: (row) => <NavLink to={`/averages/:indicator/:region${row.averages}`}>{row.average}</NavLink> // A NavLink component is used to create a link to the album page

        },
    ];

    const top5SubRegions = [
        {
            field: 'Averages',
            headerName: 'Averages (2008-2016)',
            renderCell: (row) => <NavLink to={`/averages/:indicator/:region${row.averages}`}>{row.average}</NavLink> // A NavLink component is used to create a link to the album page
        },
        {
            field: 'SubRegion',
            headerName: 'Averages (2008-2016)',
            renderCell: (row) => <NavLink to={`/averages/:indicator/:region${row.averages}`}>{row.average}</NavLink> // A NavLink component is used to create a link to the album page

        },
    ];


    return (
        <Container>
            {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
            {randomIndicator && <SongCard random={randomIndicator} handleClose={() => setRandomIndicator(null)} />}
            <h2>Generate Random Indicator:&nbsp;
                <Link onClick={() => setRandomIndicator()}>{randomIndicator}</Link>
            </h2>
            <Divider />
            <h2>Sub Regions</h2>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/cont_trend/:indicator`} columns={top5SubRegions} defaultPageSize={5} rowsPerPageOptions={[5,10]} />
            <Divider />
            {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
            <h2>Regions </h2>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/top5/:indicator`} columns={top5Regions} />
            <Divider />
            {/* TODO (TASK 17): add a paragraph (<p>text</p>) that displays the value of your author state variable from TASK 13 */}
        </Container>
    );
};