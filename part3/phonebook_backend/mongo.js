const mongoose = require('mongoose')

if (process.argv.length < 5 && process.argv.length > 3) {
	console.log('Please provide all the following arguments: node mongo.js <password> <person_name> <person_number>')
	process.exit(1)
}

const password = process.argv[2]
const entry_name = process.argv[3]
const entry_number = process.argv[4]

const url = `mongodb+srv://DaviSonata:${password}@cluster0.fwm8h.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const entrySchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 5) {

	mongoose
		.connect(url)
		.then(() => {
			console.log('connected')

			const entry = new Entry({
				name: entry_name,
				number: entry_number,
			})
			
			

			return entry.save()
		})
		.then(() => {
			console.log('added ' + entry_name + ' number ' + entry_number + ' to phonebook')
			return mongoose.connection.close()
		})
		.catch((err) => console.log(err))
} else {
	if (process.argv.length === 3) {
		mongoose
			.connect(url)
			.then(() => {
				console.log('phonebook:')
			})
			.then(Entry.find({}).then(result => {
				result.forEach(entry => {
					console.log(entry.name + ' ' + entry.number)
				})
				mongoose.connection.close()
			})
			)
			.catch((err) => console.log(err))
	} else {
		console.log('Please provide all the following arguments: node mongo.js <password> <person_name> <person_number> to add new entries or just: node mongo.js <password>')
		process.exit(1)
	}
}