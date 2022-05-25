import React from 'react'


const Part = ({ part }) => {
	return (
		<li>{part.name} {part.exercises}</li>
	)
}

const Course = ({ course }) => {
	const exercises_count = course.parts.map(part => part.exercises)
	const exerc_sum = exercises_count.reduce(
		(p, c) => p + c, 0
	)
	
	return (
		<div>
			<h2>{course.name}</h2>
			{course.parts.map(part =>
				<Part key={part.id} part={part} />
			)}
			<li><b>total of {exerc_sum} exercises</b></li>
		</div>
	)
}

export default Course