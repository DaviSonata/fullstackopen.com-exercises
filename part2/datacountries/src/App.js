import logo from './logo.svg';
import './App.css';

import { useState, useEffect } from 'react'
import axios from 'axios'

const Search = (props) => {
	return (
		<div>
			find countries 
			<input value={props.find} onChange={props.handleFindChange} />
		</div>
	)
}

const Result = (props) => {
	if (props.foundCountries.length <= 10) {
		if (props.foundCountries.length > 1) {
			return (
				<div>
					{props.foundCountries.map(country => 
						<li	key={country.id}>
							{country.name.common} 
							<button onClick={() => props.changeFind(country.name.common)}>
								show
							</button>
						</li>
					)}
				</div>
			)
		} else {
			if (props.foundCountries.length === 1) {				
				let country = props.foundCountries[0]
				let languages = Object.values(country.languages)
				
				const APIkey = props.APIkeys.filter(key => key.server === 'openweathermap')
				console.log(APIkey)
				console.log(props.APIkeys)
				const urlgeo = 'http://api.openweathermap.org/geo/1.0/direct?q=' + country.capital[0] + '&limit=1&appid=' + APIkey[0].key
				
				axios
					.get(urlgeo)
					.then(response => {
						let urlcit = 'https://api.openweathermap.org/data/2.5/weather?lat=' + response.data[0].lat + '&lon=' + response.data[0].lon + '&appid=' + APIkey[0].key
						axios
							.get(urlcit)
							.then(response2 => {
								props.setWeather(response2.data)
								props.setIcon('http://openweathermap.org/img/wn/' + props.weather.weather[0].icon + '@2x.png')
								props.setLoading(false)
							})
					})

				if (props.isLoading) {
					return <div>Loading first city...</div>
				}
				
				return ( 
					<div>
						<h1>{country.name.common}</h1>
						<p>capital {country.capital[0]}</p>
						<p>area {country.area}</p>
						<h3><b>languages:</b></h3>
						<ul>
							{languages.map(lang => <li key={lang.id}>{lang}</li>)} 
						</ul>
						<img src={country.flags.png} /> 
						<h2><b>Weather in {country.capital[0]}</b></h2>
						<p>temperature {Math.round(props.weather.main.temp*100 - 27315)/100} Celsius</p>
						<img src={props.icon} />
						<p>wind {props.weather.wind.speed} m/s</p>
						
					</div>
				)
			}
		}
	} else {
		return (
			<div>
				Too many matches, specify another filter
			</div>
		)
	}
}


const App = () => {
	const [countries, setCountries] = useState([])
	const [foundCountry, setFoundCountry] = useState([])
	const [find, setFind] = useState([])
	const [foundCountries, setFoundCountries] = useState([])
	const [weather, setWeather] = useState([])
	const [isLoading, setLoading] = useState(true)	
	const [icon, setIcon] = useState([])
	const [APIkeys, setAPIkeys] = useState([])
	
	const hook = () => {
		axios
			.get('https://restcountries.com/v3.1/all')
			.then(response => {
				setCountries(response.data)
			})
	}
	useEffect(hook, [])
	
	const hook2 = () => {
		axios
			.get('http://localhost:3007/keys')
			.then(response => {
				setAPIkeys(response.data)
			})
	}
	useEffect(hook2, [])
	
	const changeFind = ( found ) => {
		setFind(found)
		setFoundCountries(countries.filter(
				country => country.name.common.toLowerCase().includes(found.toLowerCase())
			)
		)
	}
	 
	const handleFindChange = (event) => {
		let found = event.target.value
		changeFind(found)
	}
	
	return (
		<div>
			<Search 
				find = {find}
				handleFindChange = {handleFindChange}
			/>
			<Result 
				foundCountries = {foundCountries}
				changeFind = {changeFind}
				weather = {weather}
				setWeather = {setWeather}
				isLoading = {isLoading}
				setLoading = {setLoading}
				icon = {icon}
				setIcon = {setIcon}
				APIkeys = {APIkeys}
			/>
		</div>
	)
}

export default App;
