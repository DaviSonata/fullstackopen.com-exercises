const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
morgan.token('body', (req, res) => {
	if (req.method === "POST") {
		return JSON.stringify(req.body)
	}
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
	if (person) {
		response.send(person)
	} else {
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
	const n_persons = persons.length
	
	const info_l1 = '<p>Phonebook has info for ' + n_persons + ' people</p>'
	const info_l2 = '<p>' + new Date() + '</p>'
	const info = info_l1 + info_l2
    response.send(info)
})

const generateId = () => {
	const id = Math.floor(Math.random() * 10000000)
	return id
}

app.post('/api/persons', (request, response) => {
	
	const body = request.body
	
	if (!body.name) {
		return response.status(400).json({
			error: 'name missing'
		})
	}
	if (!body.number) {
		return response.status(400).json({
			error: 'number missing'
		})
	}
	if (persons.filter(name => name === body.name).length > 0) {
		return response.status(400).json({
			error: 'name must be unique'
		})
	}
	const person = {
	
		id: generateId(),
		name: body.name,
		number: body.number,		
	}
	
	persons = persons.concat(person)
	
	console.log(person)
	response.send(person)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

