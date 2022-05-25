import React from 'react'
import { useState } from 'react'

const Persons = (props) => {	
	const [persons, setPersons] = useState(props.persons)
	const [newFilter, setNewFilter] = useState('')
	const [filterPersons, setFilterPersons] = useState(props.persons)
	
	if (newFilter === '') {
		return persons.map(person => <li>{person.name} {person.number}</li>)
	}else{
		return ( 
			<p>
				{filterPersons.map(person => <li>{person.name} {person.number}</li>)}
			</p>
		)
	}
	
}
export default Persons