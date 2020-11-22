import './App.css';
import {
  Card,
  CardContent,
  MenuItem,
  FormControl,
  Select
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

const App = () => {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(4);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(res => res.json())
    .then((data)=>{
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
    
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((res)=> res.json())
      .then((data)=>{
        const countries = data.map((country)=>({
            name: country.country,
            value: country.countryInfo.iso2
          }));

          const sortedData = sortData(data)
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      });
    };
    getCountriesData()
  }, []);

  const onCountryChange = async (e) =>{
    const countryCode = e.target.value;

    const url = countryCode === 'worldwide' ? "https://disease.sh/v3/covid-19/all" :
    `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(res => res.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
    
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
  };


  return (
    <div className="app">  
      <div className="app__left">
        <div className="app__header">
            <h1>COVID-19 TRACKER</h1>
            <FormControl className="app__dropdown">
              <Select  variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
                {
                  countries.map(country=>(
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>    
          </div>
          
        <div className="app__stats">

          <InfoBox
          isOrange
          active={casesType === "cases"}
          onClick={e => setCasesType('cases')}
          title="Cases" 
          cases={prettyPrintStat(countryInfo.todayCases)} 
          total={prettyPrintStat(countryInfo.cases)}
          />

          <InfoBox 
          active={casesType === "recovered"}
          onClick={e => setCasesType('recovered')}
          title="Recovered" 
          cases={prettyPrintStat(countryInfo.todayRecovered)} 
          total={prettyPrintStat(countryInfo.recovered)}
          />

          <InfoBox
          isRed
          active={casesType === "deaths"}
          onClick={e => setCasesType('deaths')}
          title="Deaths" 
          cases={prettyPrintStat(countryInfo.todayDeaths)} 
          total={prettyPrintStat(countryInfo.deaths)}
          />

        </div>


        <Map 
        casesType={casesType}
        countries={mapCountries}
        center={mapCenter}
        zoom={mapZoom}
        />

      </div>
      
      <Card className="app_right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData}/>
          <br/>
          <h3>Worldwide new {casesType}</h3>
          <br/>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
