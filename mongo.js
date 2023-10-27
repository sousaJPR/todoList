require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.TEST_MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
	content: {
		type: String,
		minLength: 5,
		required: true
	},
	important: Boolean
})

noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Note = mongoose.model('Note', noteSchema)

/* const note = new Note({
	content: 'CSS is Hard',
	important: true
})

note.save().then(result => {
	console.log('note saved', result)
	mongoose.connection.close()
}) */

Note.find({})
	.then(result => {
		result.forEach(note => {
			console.log(note)
		})
		mongoose.connection.close()
	})