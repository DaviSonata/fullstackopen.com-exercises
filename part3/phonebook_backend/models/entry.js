const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
	.then(   
		console.log('connected to MongoDB')
	)
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})
const entrySchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: [3, 'Name must be at least 3 characters long'],
		required: [true, 'Name required'],
	},
	number: {
		type: String,
		minLength: [8, 'Number too short'],
		required: [true, 'Number required'],
		validate: {
			validator: function(v) {
				return /\d{2,}\-\d{1,}/.test(v)
			},
			message: props => `${props.value} is not a valid phone number!`
		}
		
	},
})

entrySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('entry', entrySchema)