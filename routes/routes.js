const express = require('express');
const service = require('../services/transactionService');
const transactionRouter = express.Router();

transactionRouter.get('/', service.get);
transactionRouter.get('/:period', service.get);
transactionRouter.post('/', service.create);
transactionRouter.put('/', service.update);
transactionRouter.delete('/:id', service.delete);

module.exports = transactionRouter;
