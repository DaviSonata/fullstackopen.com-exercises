import './App.css';
import { useState } from 'react'

const Display = (props) => {
	return (
		<div>
			<p>{props.text}</p>
			<p>has {props.votes} votes</p>
		</div>
	)
}

const Button = (props) => (
	<button onClick={props.handleClick}>
		{props.text}
	</button>
)

const App = () => {
	const [anecdotes, setAnecdotes] = useState([
		['If it hurts, do it more often',0],
		['Adding manpower to a late software project makes it later!',0],
		['The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',0],
		['Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',0],
		['Premature optimization is the root of all evil.',0],
		['Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',0],
		['Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients',0]
	])
   
	const [selected, setSelected] = useState(0)
	const [flag, setFlag] = useState(0)
	const [most_id, setMost_id] = useState(0)
	const [most, setMost] = useState(0)
  
	const update = () => {
		if (flag === 1){
			setFlag(0)
		}else{
			setFlag(1)
		}
	}
  
	const handleNextClick = () => {
		setSelected(Math.floor(Math.random()*anecdotes.length))
		update()
	}
	
	const handleVoteClick = () => {
		anecdotes[selected][1]++
		setAnecdotes(anecdotes)
		if (anecdotes[selected][1] > most){
			setMost_id(selected)
			setMost(anecdotes[selected][1])
		}
		update()
	}

	return (
		<div>
			<h1>Anecdote of the day</h1>
		    <Display text={anecdotes[selected][0]} votes={anecdotes[selected][1]} flag={flag} />
			<Button handleClick={handleVoteClick} text='vote' />
			<Button handleClick={handleNextClick} text='next anecdote' />
			<h1>Anecdote with most votes</h1>
			<Display text={anecdotes[most_id][0]} votes={anecdotes[most_id][1]} flag={flag} />
		</div>
	)
}

export default App