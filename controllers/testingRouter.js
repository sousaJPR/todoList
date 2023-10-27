const testingRouter = require('express').Router()
const Task = require('../models/task')
const User = require('../models/users')

testingRouter.post('/reset', async (req, res) => {
	await Task.deleteMany({})
	await User.deleteMany({})

	res.status(204).end()
})

module.exports = testingRouter