const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
	content: {
		type: String,
		minLength: 1,
		required: true
	},
	status: Boolean,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
})

taskSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Task', taskSchema)