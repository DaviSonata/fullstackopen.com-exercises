import React from 'react'
import { useState } from 'react'

const Filter = (props) => {	
	const [newFilter, setNewFilter] = useState('')
	const [filterPersons, setFilterPersons] = useState(props.persons)

	const handleFilterChange = (event) => {
		let filterText = event.target.value
		setNewFilter(filterText)
		setFilterPersons(props.persons.filter(
			person => person.name.toLowerCase().includes(filterText.toLowerCase())
		))
	}

	return (
		<div>
			<li>filter show with <input 
				value={newFilter} 
				onChange={handleFilterChange} 
			/></li>
		</div>
	)
}

export default Filter