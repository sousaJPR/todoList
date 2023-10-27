const usersRouter = require('express').Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('tasks', { content: 1, status: 1 })
	response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
	const user = await User.findById(request.params.id)
	if (user) {
		response.json(user)
	} else {
		response.status(400).json({ error: `id ${request.params.id} not found` })
	}
})

usersRouter.post('/', async (request, response) => {
	const { username, name, password } = request.body
	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)
	const duplicatedUsername = await User.find({ username })
	console.log('req: ', request.body)
	console.log('duplicated: ', duplicatedUsername)
	if (duplicatedUsername.length > 0) {
		response.status(400).json({ error: 'Ups! This username already exists' })
	} else if (password.length < 3) {
		response.status(400).json({ error: 'Your password should have at least 3 characters' })
	} else {
		const user = new User ({
			username,
			name,
			passwordHash
		})
		const savedUser = await user.save()
		response.status(201).json(savedUser)

	}

})

module.exports = usersRouter