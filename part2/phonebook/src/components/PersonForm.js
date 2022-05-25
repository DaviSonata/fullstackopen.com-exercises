import React from 'react'
import { useState } from 'react'

const PersonForm = (props) => {	
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
		
	const addPerson = (event) => {
		event.preventDefault()
		const personObject = {
			name: newName,
			number: newNumber,
		}
		const personsEqual = props.persons.filter(person => personObject.name === person.name) 
		if (personsEqual.length === 0) {
			props.persons = props.persons.concat(personObject)
			setNewName('')
			setNewNumber('')
		}else{
			alert(newName + ' is already added to phonebook')
		}
		console.log(props.persons.map(person => person.name))
    }
	
	const handleNameChange = (event) => {
		setNewName(event.target.value)
	}
	
	const handleNumberChange = (event) => {
		setNewNumber(event.target.value)
	}
	
	return(
		<form onSubmit={addPerson}>
			<div>
				<li>name: <input 
					value={newName} 
					onChange={handleNameChange} 
				/></li>
				<li>number: <input 
					value={newNumber} 
					onChange={handleNumberChange} 
				/></li>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
	
}

export default PersonForm