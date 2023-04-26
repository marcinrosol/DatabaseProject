import { useEffect, useState } from 'react';
import { Container} from '@mui/material';
import { NavLink } from 'react-router-dom';
import * as React from 'react';
import LazyTable from '../components/LazyTable';
const config = require('../config.json');

//let urlInd = encodeURIComponent()

export default function CountriesPage() {
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

    const [countries, setCountries] = useState({
        "data": [
            {
                "category": "Aruba"
            },
        ]
    });

    const [valueIndCode, setValueIndCode] = React.useState('IC_TAX_PAYM');

    const [valueCat, setValueCat] = React.useState('Jobs');
    const [valueInd, setValueInd] = React.useState('Tax payments (number)');

    const [valueCountries, setValueCountries] = React.useState('Aruba');

    const handleChangeCat = (event) => {
        setValueCat(event.target.value);
    }
    const handleChangeInd = (event) => {
        setValueInd(event.target.value);

    }
    const handleChangeCountries = (event) => {
        setValueCountries(event.target.value);
    }


    useEffect(() => {

        fetch(`http://${config.server_host}:${config.server_port}/randomIndCat`)
            .then(res => res.json())
            .then(resJson => setRandomIndicatorCat(resJson));

        fetch(`http://${config.server_host}:${config.server_port}/indicatorsOnCat/${valueCat}`)
            .then(res => res.json())
            .then(resJson => setRandomIndicator(resJson));

        fetch(`http://${config.server_host}:${config.server_port}/countries`)
            .then(res => res.json())
            .then(resJson => setCountries(resJson));

            fetch(`http://${config.server_host}:${config.server_port}/indName2indCode/${urlInd}`)
            .then(res => res.json())
            .then(resJson => setValueIndCode(resJson));



    }, [valueCat, valueInd, valueCountries, valueIndCode]);


    let urlInd = encodeURIComponent(valueInd)

    console.log(valueCat)
    console.log(valueInd)
    console.log(valueCountries)
    console.log(valueIndCode)
    console.log(urlInd)


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
            headerName: 'Country',
            renderCell: (row) => <NavLink to={`/top5countries/:indicator${row.averages}`}>{row.average}</NavLink> // A NavLink component is used to create a link to the album page

        },
        {
            field: 'Indicator',
            headerName: 'Indicator',
            renderCell: (row) => <NavLink to={`/top5countries/:indicator${row.averages}`}>{row.average}</NavLink> // A NavLink component is used to create a link to the album page

        },
        {
            field: 'GPI Score',
            headerName: 'GPI Score',
            renderCell: (row) => <NavLink to={`/top5countries/:indicator${row.averages}`}>{row.average}</NavLink> // A NavLink component is used to create a link to the album page

        }
    ];

    return (
        <Container>
            <h1>This is the Country page</h1>
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
                    Select Country:
                </label>
                <p></p>
                <select value={valueCountries} onChange={handleChangeCountries}>
                    {countries.data.map((option) => (
                        <option key={option.countries} value={option.countries}>
                            {option.countries}
                        </option>
                    ))}
                </select>

                <p>Selected category: {valueCat}</p>
                <p>Selected indicator: {valueInd}</p>
                <p>Selected indicator Code: {valueIndCode}</p>
                <p>Selected Countries: {valueCountries}</p>
                <p>Encoded indicator: {urlInd}</p>




                <h1>List all countries (in the selected Country’s sub-region) that have average (years 2008-2016) higher values than the selected country’s average for a selected indicator</h1>
                

                <h1>All indicators from a specified indicator category for all countries where gpi score is less than average (the smaller the score - the more peaceful the country is)</h1>
                
            </div>
        </Container>
    );
};