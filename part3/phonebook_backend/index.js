const express = require('express')
const app = express()
const morgan = require('morgan')

const cors = require('cors')
app.use(cors())

require('dotenv').config()
const Entry = require('./models/entry')

app.use(express.static('build'))

app.use(express.json())
morgan.token('body', (req) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body)
	}
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next()
}

app.use(requestLogger)


/*let persons = [
	{ 
		'id': 1,
		'name': 'Arto Hellas', 
		'number': '040-123456'
	},
	{ 
		'id': 2,
		'name': 'Ada Lovelace', 
		'number': '39-44-5323523'
	},
	{ 
		'id': 3,
		'name': 'Dan Abramov', 
		'number': '12-43-234345'
	},
	{ 
		'id': 4,
		'name': 'Mary Poppendieck', 
		'number': '39-23-6423122'
	}
]*/

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
	Entry.find({}).then(persons => {
		response.json(persons)
	})
})

app.get('/api/persons/:id', (request, response) => {
	Entry.findById(request.params.id).then(entry => {
		response.json(entry)
	})
})

app.delete('/api/persons/:id', (request, response, next) => {
	Entry.findByIdAndRemove(request.params.id)
		.then(
			response.status(204).end()
		)
		.catch(error => next(error))
})

app.get('/info', (request, response) => {
	const n_persons = Entry.length
	
	const info_l1 = '<p>Phonebook has info for ' + n_persons + ' people</p>'
	const info_l2 = '<p>' + new Date() + '</p>'
	const info = info_l1 + info_l2
	response.send(info)
})

/*const generateId = () => {
	const id = Math.floor(Math.random() * 10000000)
	return id
}*/

app.post('/api/persons', (request, response, next) => {	
	const body = request.body

	if (body.name === undefined) {
		return response.status(400).json({
			error: 'name missing'
		})
	}
	if (body.number === undefined) {
		return response.status(400).json({
			error: 'number missing'
		})
	}
	console.log(Entry.find({}))
	if (Entry.find({ name: body.name }).length > 0) {	
		return response.status(400).json({
			error: 'name must be unique'
		})
	}
	const entry = new Entry ({
		name: body.name,
		number: body.number,		
	})
	
	entry.save()
		.then(savedEntry => { 
			response.json(savedEntry)
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const id_ = request.params.id
	const body = request.body
	const entry = {
		name: body.name,
		number: body.number,
		id: id_,
	}
	
	Entry.findByIdAndUpdate(request.params.id, entry, { new: true } )
		.then(updatedEntry => { 
			response.json(updatedEntry)
		})
		.catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}


	next(error)
}

app.use(errorHandler)
