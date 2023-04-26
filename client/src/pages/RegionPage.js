import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import * as React from 'react';
//import { Select } from 'react-select';

import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
const config = require('../config.json');

export default function RegionPage() {
    // We use the setState hook to persist information across renders (such as the result of our API calls)

    const [randomIndicatorCat, setRandomIndicatorCat] = useState({
        "data": [
            {
                "category": "Jobs"
            },
        ]
    });

    const [randomIndicator, setRandomIndicator] = useState({
        "data": [
            {
                "category": "Tax payments (number)"
            },
        ]
    });
    // TODO (TASK 13): add a state variable to store the app author (default to '')
    const [averages, setAverages] = useState({});
    const [regions, setRegion] = useState({
        "data": [
            {
                "category": "Africa"
            },
        ]
    });

    const [valueCat, setValueCat] = React.useState('Jobs');
    const [valueInd, setValueInd] = React.useState('Tax payments (number)');
    const [valueRegion, setValueRegion] = React.useState('Africa');

    const handleChangeCat = (event) => {
        setValueCat(event.target.value);
    }
    const handleChangeInd = (event) => {
        setValueInd(event.target.value);
    }
    const handleChangeRegion = (event) => {
        setValueRegion(event.target.value);
    }
    // The useEffect hook by default runs the provided callback after every render
    // The second (optional) argument, [], is the dependency array which signals
    // to the hook to only run the provided callback if the value of the dependency array
    // changes from the previous render. In this case, an empty array means the callback
    // will only run on the very first render.
    useEffect(() => {

        fetch(`http://${config.server_host}:${config.server_port}/randomIndCat`)
            .then(res => res.json())
            .then(resJson => setRandomIndicatorCat(resJson));

        fetch(`http://${config.server_host}:${config.server_port}/indicatorsOnCat/${valueCat}`)
            .then(res => res.json())
            .then(resJson => setRandomIndicator(resJson));

        fetch(`http://${config.server_host}:${config.server_port}/regions`)
            .then(res => res.json())
            .then(resJson => setRegion(resJson));
    }, [valueCat, valueInd, valueRegion]);




    console.log(randomIndicatorCat)


    //console.log(randomIndicatorCat.data[1])
    //console.log(randomIndicatorCat.data[2])


    // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
    // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
    const top5Regions = [
        {
            field: 'Averages',
            headerName: 'Averages (2008-2016)',
            renderCell: (row) => <NavLink to={`/top5/:indicator${row.averages}`}>{row.average}</NavLink> // A NavLink component is used to create a link to the album page
        },
        {
            field: 'Region',
            headerName: 'Region',
            renderCell: (row) => <NavLink to={`/top5/:indicator${row.averages}`}>{row.average}</NavLink> // A NavLink component is used to create a link to the album page

        },
    ];

    const top5SubRegions = [
        {
            field: 'Averages',
            headerName: 'Averages (2008-2016)',
            renderCell: (row) => <NavLink to={`/top5subregion/:indicator${row.averages}`}>{row.average}</NavLink> // A NavLink component is used to create a link to the album page
        },
        {
            field: 'SubRegion',
            headerName: 'Averages (2008-2016)',
            renderCell: (row) => <NavLink to={`/top5subregion/:indicator${row.averages}`}>{row.average}</NavLink> // A NavLink component is used to create a link to the album page

        },
    ];

    const top5Countries = [
        {
            field: 'Averages',
            headerName: 'Averages (2008-2016)',
            renderCell: (row) => <NavLink to={`/top5countries/:indicator${row.averages}`}>{row.average}</NavLink> // A NavLink component is used to create a link to the album page
        },
        {
            field: 'Country',
            headerName: 'Averages (2008-2016)',
            renderCell: (row) => <NavLink to={`/top5countries/:indicator${row.averages}`}>{row.average}</NavLink> // A NavLink component is used to create a link to the album page

        },
    ];

    return (
        <Container>
            <h1>This is the Region page</h1>
            <div>
                <label>
                    Select Indicator Category:
                </label>
                <p></p>
                <select value={valueCat} onChange={handleChangeCat}>
                    {randomIndicatorCat.data.map((option) => (
                        <option key={option.category} value={option.category}>
                            {option.category}
                        </option>
                    ))}
                </select>
                <p></p>
                <label>
                    Select Indicator:
                </label>
                <p></p>
                <select value={valueInd} onChange={handleChangeInd}>
                    {randomIndicator.data.map((option) => (
                        <option key={option.indicator_name} value={option.indicator_name}>
                            {option.indicator_name}
                        </option>
                    ))}
                </select>
                <p></p>
                <label>
                    Select Region:
                </label>
                <p></p>
                <select value={valueRegion} onChange={handleChangeRegion}>
                    {regions.data.map((option) => (
                        <option key={option.region} value={option.region}>
                            {option.region}
                        </option>
                    ))}
                </select>

                <p>Selected category: {valueCat}</p>
                <p>Selected indicator: {valueInd}</p>
                <p>Selected Region: {valueRegion}</p>
                <h1>Top 5 Regions</h1>

                <h1>Top 5 SubRegions</h1>

            </div>
        </Container>
    );
};