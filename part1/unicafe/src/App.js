import './App.css';

import { useState } from 'react'

const StatisticLine = (props) => {
	return (
		<tr>
			<td>{props.text}</td>
			<td>{props.value}{props.textafter}</td>
		</tr>
	)
}

const Statistics = (props) => {
	return(
		<div>
			<StatisticLine text='good ' value={props.good} />
			<StatisticLine text='bad ' value={props.neutral} />
			<StatisticLine text='neutral ' value={props.bad} />
			<StatisticLine text='all ' value={props.all_} />
			<StatisticLine text='average ' value={props.average} />
			<StatisticLine text='positive ' value={props.positive} textafter=' %' />
		</div>
	)
}

const Button = (props) => (
	<button onClick={props.handleClick}>
		{props.text}
	</button>
)

const App = () => {
	const [good, setGood] = useState(0)
	const [bad, setBad] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [all_, setAll] = useState(0)
	const [average, setAverage] = useState(0)
	const [positive, setPositive] = useState(0)

	const handleGoodClick = () => {
		setGood(good + 1)
		setAll(all_ + 1)
		setAverage(((good+1)-bad)/(all_+1))
		setPositive((good+1)/(all_+1)*100)
	}
	
	const handleNeutralClick = () => {
		setNeutral(neutral + 1) 
		setAll(all_ + 1)
		setAverage((good-bad)/(all_+1))
		setPositive(good/(all_+1)*100)
	}
	
    const handleBadClick = () => {
		setBad(bad + 1) 
		setAll(all_ + 1)
		setAverage((good-(bad+1))/(all_+1))
		setPositive(good/(all_+1)*100)
	}
	
	const lowerText = () => {
		if (all_ === 0) { 
			return (
				<div>
					<p>No feedback given</p>
				</div>
			)  
		}  
		return (
			<div>
				<Statistics good={good} neutral={neutral} bad={bad} all_={all_} average={average} positive={positive} />
			</div>
		)
	}
	
	return (
		<div> 
			<h1>give feedback</h1>
			<Button handleClick={handleGoodClick} text='good' />
			<Button handleClick={handleNeutralClick} text='neutral' />
			<Button handleClick={handleBadClick} text='bad' />
			<h1>statistics</h1>	
			{lowerText()}
		</div>
	)
}

export default App;

