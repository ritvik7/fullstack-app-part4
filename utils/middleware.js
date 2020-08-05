const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
  logger.error(error)
  if (error.name === 'ValidationError') {
    return response.status(400).send({error: error.message})
  } else if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.message === 'resource not found') {
    return response.status(404).send({error: error.message})
  } else if (error.message === 'likes not found') {
    return response.status(400).send({error: error.message})
  } else if(error.message === 'ShortCreds') {
    return response.status(400).send({error: 'username and password should be 3 or more characters long'})
  } else if(error.message === 'InvalidCreds') {
    return response.status(400).send({error: 'username or password missing'})
  } else if(error.message === 'UserNotAuthorized' || ['SyntaxError','JsonWebTokenError'].indexOf(error.name) !== -1) {
    return response.status(401).send({error: 'authorization failed'})
  }

  next(error)
}

const reqLogger = (request, response, next) => {
  logger.info('METHOD: ', request.method)
  logger.info('PATH: ', request.path)
  logger.info('BODY: ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).json('unknown endpoint')
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    request.token = authorization.substr(7)
  }
  next()
} 

module.exports = {reqLogger, unknownEndpoint, errorHandler, tokenExtractor}


