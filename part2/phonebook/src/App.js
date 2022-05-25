import './App.css';
import './index.css';
import axios from 'axios'

import { useState, useEffect } from 'react'
import phonebook from './services/persons'

const PersonForm = (props) => {	
	return(
		<form onSubmit={props.addPerson}>
			<div>
				<li>name: <input 
					value={props.newName} 
					onChange={props.handleNameChange} 
				/></li>
				<li>number: <input 
					value={props.newNumber} 
					onChange={props.handleNumberChange} 
				/></li>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}

const Filter = (props) => {	
	return (
		<div>
			<li>filter show with <input 
				value={props.newFilter} 
				onChange={props.handleFilterChange} 
			/></li>
		</div>
	)
}

const Button = ( props ) => {
	return <button onClick={props.click}>{props.text}</button>
}

const Persons = (props) => {	
	if (props.newFilter === '') {
		return (
			<ul>
				{props.persons.map(person => <li>
						{person.name} {person.number} 
						<Button click={() => props.deletePerson(person.id)} text="delete" />
				</li>)}
			</ul>
		)
	}else{
		return ( 
			<ul>
				{props.filterPersons.map(person => <li>
					{person.name} {person.number} 
					<Button click={() => props.deletePerson(person.id)} text="delete" />
				</li>)}
			</ul>
		) 
	}	
}

const Notification = ({ message, flag }) => {
	if (message === null) {
		return null
	}
	if (flag === 'good'){
		console.log('good')
		return (
			<div className='goodmsg'>
				{message}
			</div>
		)
	}else{
		if (flag === 'bad'){
			console.log('bad')
			return (
				<div className='badmsg'>
					{message}
				</div>
			)
		}else{
			return null
		}
	}
}

const App = () => {
	const [persons, setPersons] = useState([]) 
	
	const [newFilter, setNewFilter] = useState('')
	const [filterPersons, setFilterPersons] = useState(persons)
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [flag, setFlag] = useState('')
	const [message, setMessage] = useState('')
	
	const hook = () => {
		phonebook
			.getAll()
			.then(response => {
				setPersons(response)
			})
	}
	useEffect(hook, [])
	
	const handleNameChange = (event) => {
		setNewName(event.target.value)
	}
	
	const handleNumberChange = (event) => {
		setNewNumber(event.target.value)
	}
	
	const handleFilterChange = (event) => {
		let filterText = event.target.value
		setNewFilter(filterText)
		setFilterPersons(persons.filter(
			person => person.name.toLowerCase().includes(filterText.toLowerCase())
		))
	}	
	
	const addPerson = (event) => {
		event.preventDefault()
		const personObject = {
			name: newName,
			number: newNumber,
		}
		const personsEqual = persons.filter(person => personObject.name === person.name) 
		if (personsEqual.length === 0) {
			phonebook
				.create(personObject)
				.then(response => {
					setPersons(persons.concat(response))
					setNewName('')
					setNewNumber('')
					setMessage('Added ' + response.name)
					setFlag('good')
					setTimeout(() => {
						setMessage(null)
						setFlag(null)
					}, 5000)
				})
		}else{
			if(window.confirm(newName + " is already added to phonebook, replace the old number with a new one?")){
				const changedPerson = { ...personsEqual[0], number: newNumber }
				phonebook
					.update(changedPerson.id, changedPerson)
					.then(response => {
						setPersons(persons.map(person => person.id !== changedPerson.id ? person : changedPerson))
						setNewName('')
						setNewNumber('')
						setMessage('Changed ' + response.name + '\'s number')
						setFlag('good')
						setTimeout(() => {
							setMessage(null)
							setFlag(null)
						}, 5000)
					})
					.catch(error => {
						setPersons(persons.filter(person => person.id !== changedPerson.id))
						setNewName('')
						setNewNumber('')
						setMessage('Information of ' + personsEqual[0].name + " has already been removed from server")
						setFlag('bad')
						setTimeout(() => {
							setMessage(null)
							setFlag(null)
						}, 5000)
					})
			}else{
				alert(newName + ' is already added to phonebook')
			}
		}
		console.log(persons.map(person => person.name))
    }
	
	const deletePerson = (id) => {
		const selectedPerson = persons.filter(person => person.id === id)
		console.log(selectedPerson)
		console.log(selectedPerson[0].name)
		if (window.confirm("Delete " + selectedPerson[0].name + "?")){
			phonebook
				.remove(selectedPerson[0].id)
				.then(response => {
					setPersons(persons.filter(person => person.id !== selectedPerson[0].id))
					setNewName('')
					setNewNumber('')
					setMessage('Removed ' + selectedPerson[0].name)
					setFlag('bad')
					setTimeout(() => {
						setMessage(null)
						setFlag(null)
					}, 5000)
				})
				.catch(error => {
					setMessage('Information of ' + selectedPerson[0].name + " has already been removed from server")
					setFlag('bad')
					setTimeout(() => {
						setMessage(null)
						setFlag(null)
					}, 5000)
				})
		}else{
			alert(selectedPerson[0].name + ' was not deleted from phonebook')
		}
	}
	
	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={message} flag={flag} />
			<Filter 
				newFilter = {newFilter}
				handleFilterChange = {handleFilterChange}
			/>
			<h3>add a new</h3>
			<PersonForm 
				addPerson={addPerson} 
				newName={newName} 
				newNumber={newNumber}
				handleNameChange={handleNameChange}
				handleNumberChange={handleNumberChange}
			/>
			<h3>Numbers</h3>
			<Persons 
				newFilter = {newFilter}
				persons = {persons}
				filterPersons = {filterPersons}
				deletePerson = {deletePerson}
			/>
		</div>
	)
}

export default App