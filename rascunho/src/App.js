import logo from './logo.svg';
import './App.css';
import { useState } from 'react'

const Display = (props) => {
	return (
		<div>{props.counter}</div>
	)
}

const Button = (props) => (
	<button onClick={props.handleClick}>
		{props.text}
	</button>
)

const History = (props) => {
	if (props.allClicks.length === 0) {
		return (
			<div>
				the app is used by pressing the buttons
			</div>
		)  
	}  
	return (
		<div>
			button press history: {props.allClicks.join(' ')}
		</div>
	)
}

const App = () => {
	const [left, setLeft] = useState(0)
	const [right, setRight] = useState(0)
	const [allClicks, setAll] = useState([])

	const handleLeftClick = () => {    
		setAll(allClicks.concat('L'))
		setLeft(left + 1)
	}
	
    const handleRightClick = () => {
		setAll(allClicks.concat('R'))
		setRight(right + 1) 
	}
	
	const hello = (who) => () => {
		console.log('hello', who)
	}
	
	

	return (
		<div> 
			{left}
			<Button handleClick={handleLeftClick} text='left' />
			<Button handleClick={handleRightClick} text='right' />
			{right}
			<History allClicks={allClicks} />			
			<Button handleClick={hello('world')} text='world' />
			<Button handleClick={hello('react')} text='react' />
			<Button handleClick={hello('function')} text='function' />
		</div>
	)
}

export default App;
