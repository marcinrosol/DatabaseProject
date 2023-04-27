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
                "category": "Health"
            },
        ]
    });

    const [randomIndicator, setRandomIndicator] = useState({
        "data": [
            {
                "category": "Maternal mortality ratio (modeled estimate, per 100,000 live births)"
            },
        ]
    });

    const [subRegions, setSubRegion] = useState({
        "data": [
            {
                "category": "Australia and New Zealand"
            },
        ]
    });

    const [valueIndCode, setValueIndCode] = React.useState('IC_TAX_PAYM');

    const [valueCat, setValueCat] = React.useState('Health');
    const [valueInd, setValueInd] = React.useState('Maternal mortality ratio (modeled estimate, per 100,000 live births)');

    const [valueSubRegion, setValueSubRegion] = React.useState('Australia and New Zealand');

    const handleChangeCat = (event) => {
        setValueCat(event.target.value);
    }
    const handleChangeInd = (event) => {
        setValueInd(event.target.value);

    }
    const handleChangeSubRegion = (event) => {
        setValueSubRegion(event.target.value);
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

        fetch(`http://${config.server_host}:${config.server_port}/subregions`)
            .then(res => res.json())
            .then(resJson => setSubRegion(resJson));

        fetch(`http://${config.server_host}:${config.server_port}/indName2indCode/${urlInd}`)
            .then(res => res.json())
            .then(resJson => setValueIndCode(resJson));



    }, [valueCat, valueInd, valueSubRegion, valueIndCode]);


    let urlInd = encodeURIComponent(valueInd)

    console.log(valueCat)
    console.log(valueInd)
    console.log(valueSubRegion)
    console.log(valueIndCode)
    console.log(urlInd)


    //console.log(randomIndicatorCat.data[1])
    //console.log(randomIndicatorCat.data[2])


    // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
    // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
    const CountriesToAverage = [
        {
            field: 'name_long',
            headerName: 'Country',
        },
        {
            field: 'Avg',
            headerName: 'Averages (2008-2016)',

        },
    ];

    const SubRegionCompare = [
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
    //            <p>Selected indicator: {valueInd}</p>
    //            <p>Selected indicator Code: {valueIndCode}</p>
    //            <p>Selected SubRegion: {valueSubRegion}</p>
    //            <p>Encoded indicator: {urlInd}</p>


    return (
        <Container>
            <h1>This is the Sub Region page</h1>
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
                    Select SubRegion:
                </label>
                <p></p>
                <select value={valueSubRegion} onChange={handleChangeSubRegion}>
                    {subRegions.data.map((option) => (
                        <option key={option.sub_region} value={option.sub_region}>
                            {option.sub_region}
                        </option>
                    ))}
                </select>







                <h1>Top Countries per Sub Region</h1>
                <LazyTable route={`http://${config.server_host}:${config.server_port}/compareOnAvgSub/${valueSubRegion}/${urlInd}`} columns={CountriesToAverage} onChange={handleChangeInd} />

                <h1>Top Sub Regions</h1>
                <LazyTable route={`http://${config.server_host}:${config.server_port}/compareSubs/${urlInd}`} columns={SubRegionCompare} onChange={handleChangeCat} />






            </div>
        </Container>
    );
};