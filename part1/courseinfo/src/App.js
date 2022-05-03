const Header = (props) => {
	return (
		<div>
			<h1>{props.head}</h1>
		</div> 
	)
}

const Part = (props) => {
	return (
		<p>
			{props.part} {props.ex}
		</p>
	)
} 

const Content = (props) => {
	return (
		<div>
			<Part part={props.part1} ex={props.ex1} />
			<Part part={props.part2} ex={props.ex2} />
			<Part part={props.part3} ex={props.ex3} />
		</div>
	)
} 

const Total = (props) => {
	return (
		<div>
			<p>Number of exercises {props.ex1 + props.ex2 + props.ex3}</p>
		</div>
	)
} 

const App = () => {
	const course = {
		name: 'Half Stack application development',
		parts: [
			{
				name: 'Fundamentals of React',
				exercises: 10
			},	
			{
				name: 'Using props to pass data',
				exercises: 7
			},
			{
				name: 'State of a component',
				exercises: 14
			}
		]
	} 
  
	return (
		<div>
			<Header head = {course.name} />
			<Content part1 = {course.parts[0].name} part2 = {course.parts[1].name} part3 = {course.parts[2].name} ex1 = {course.parts[0].exercises} ex2 = {course.parts[1].exercises} ex3 = {course.parts[2].exercises} />
			<Total ex1 = {course.parts[0].exercises} ex2 = {course.parts[1].exercises} ex3 = {course.parts[2].exercises}/>
		</div>
	)
}

export default App
