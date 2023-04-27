import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import * as React from 'react';
//import { Select } from 'react-select';

import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
const config = require('../config.json');

//let urlInd = encodeURIComponent()

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

    const [regions, setRegion] = useState({
        "data": [
            {
                "category": "Africa"
            },
        ]
    });

    const [valueIndCode, setValueIndCode] = React.useState('IC_TAX_PAYM');

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

        fetch(`http://${config.server_host}:${config.server_port}/indName2indCode/${urlInd}`)
            .then(res => res.json())
            .then(resJson => setValueIndCode(resJson));



    }, [valueCat, valueInd, valueRegion, valueIndCode]);


    let urlInd = encodeURIComponent(valueInd)

    console.log(valueCat)
    console.log(valueInd)
    console.log(valueRegion)
    console.log(valueIndCode)
    console.log(urlInd)


    //console.log(randomIndicatorCat.data[1])
    //console.log(randomIndicatorCat.data[2])


    // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
    // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
    const top5Regions = [
        {
            field: 'region',
            headerName: 'Region',
        },
        {
            field: 'Avg',
            headerName: 'Averages (2008-2016)',

        },
    ];

    const top5SubRegions = [
        {
            field: 'sub_region',
            headerName: 'Sub Region',
        },
        {
            field: 'Avg',
            headerName: 'Averages (2008-2016)',

        },
    ];

    //<p>Selected category: {valueCat}</p>
    //               <p>Selected indicator: {valueInd}</p>
    //              <p>Selected indicator Code: {valueIndCode}</p>
    //             <p>Selected Region: {valueRegion}</p>
    //            <p>Encoded indicator: {urlInd}</p>
    return (
        <Container>
            <h1>Region</h1>
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






                <h1>Top 5 SubRegions</h1>
                <LazyTable route={`http://${config.server_host}:${config.server_port}/compare/${urlInd}/${valueRegion}`} columns={top5SubRegions} onChange={handleChangeInd} />

                <h1>Top 5 Regions</h1>
                <LazyTable route={`http://${config.server_host}:${config.server_port}/compareOnAvg/${valueIndCode}`} columns={top5Regions} onChange={handleChangeInd} />






            </div>
        </Container>
    );
};