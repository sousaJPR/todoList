const tasksRouter = require('express').Router()
const Task = require('../models/task')
const User = require('../models/users')
const jwt = require('jsonwebtoken')

tasksRouter.get('/', async (req, res) => {
	const tasks = await Task.find({}).populate('user', { username: 1, name: 1 })
	res.json(tasks)
})

tasksRouter.get('/:id', async (req, res) => {
	const task = await Task.findById(req.params.id)
	if (task) {
		res.json(task)
	} else {
		res.status(404).end()
	}
})

const getTokenFrom = request => {
	const authorization = request.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '')
	}
	return null
}

tasksRouter.post('/', async (req, res) => {
	const body = req.body
	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
	console.log('token:', decodedToken)
	if(!decodedToken.id) {
		return res.status(401).json({ error: 'invalid token' })
	}
	if(body.content.length < 1) {
		return res.status(401).json({ error: 'You need to write a task in order to save it' })
	}
	const user = await User.findById(decodedToken.id)
	const task = new Task ({
		content: body.content,
		status: false,
		user: user.id
	})
	const savedTask = await task.save()
	user.tasks = user.tasks.concat(savedTask._id)
	await user.save()
	res.status(201).json(savedTask)

})

tasksRouter.delete('/:id', async (req, res) => {
	try {
		const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
		await Task.findByIdAndRemove(req.params.id)
		const user = await User.findById(decodedToken.id)
		user.tasks = user.tasks.filter(taksId => taksId.toString() !== req.params.id)
		await user.save()
		res.status(204).end()
	} catch(error) {
		res.status(500).json({ error: 'Error deleting the task' })
	}
})

tasksRouter.delete('/', async (req, res) => {
	try {
		const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
		await Task.deleteMany({})
		const user = await User.findById(decodedToken.id)
		user.tasks = user.tasks.deleteMany({})
		await user.save()
		res.status(204).end()
	} catch(error) {
		res.status(500).json({ error: 'Error deleting all the tasks' })
	}
})

tasksRouter.put('/:id', (req, res, next) => {
	const body = req.body
	const task = {
		content: body.content,
		status: body.status
	}
	Task.findByIdAndUpdate(req.params.id, task, { new:true })
		.then(updatedTask => {
			res.json(updatedTask)
		})
		.catch(error => next(error))
})

module.exports = tasksRouter