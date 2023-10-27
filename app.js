const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const tasksRouter = require('./controllers/tasks')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')



mongoose.set('strictQuery', false)

logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB', error.message)
	})


app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/users', usersRouter)

if(process.env.NODE_ENV === 'test') {
	const testingRouter = require('./controllers/testingRouter')
	app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app