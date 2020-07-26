const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const transactionModel = require('../models/TransactionModel');

exports.getMonths = async (req, res, next) => {
    const yearmonths = await transactionModel
        .find()
        .distinct('yearMonth', function (error, ids) {});

    res.status(200).send({
        yearmonths: yearmonths,
    });
};

exports.get = async (req, res, next) => {
    let { period } = req.params;

    if (!period) {
        res.status(200).send({
            messagem: 'Insira um período para continuar.',
        });
        return;
    }

    const transactions = await transactionModel.find({
        yearMonth: period,
    });

    res.status(200).send({
        transactions: transactions,
    });
};

exports.create = async (req, res, next) => {
    const { description, value, category, yearMonthDay, type } = req.body;

    const year = yearMonthDay.split('-')[0];
    const month = yearMonthDay.split('-')[1];
    const day = yearMonthDay.split('-')[2];

    const transactions = await transactionModel.create({
        description: description,
        value: value,
        category: category,
        year: year,
        month: month,
        day: day,
        yearMonth: `${year}-${month}`,
        yearMonthDay: yearMonthDay,
        type: type,
    });

    res.status(200).send({
        transaction: transactions,
    });
};

exports.update = async (req, res, next) => {
    const { id, description, value, category, yearMonthDay, type } = req.body;

    const year = yearMonthDay.split('-')[0];
    const month = yearMonthDay.split('-')[1];
    const day = yearMonthDay.split('-')[2];

    const transaction = await transactionModel.findOneAndUpdate(
        {
            _id: id,
        },
        {
            description: description,
            value: value,
            category: category,
            year: year,
            month: month,
            day: day,
            yearMonth: `${year}-${month}`,
            yearMonthDay: yearMonthDay,
            type: type,
        },
        { new: true }
    );

    res.status(200).send({
        transaction: transaction,
    });
};

exports.delete = async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        res.status(200).send({
            messagem: 'Insira um id para continuar.',
        });
        return;
    }

    const transactions = await transactionModel.deleteOne({
        _id: id,
    });

    res.status(200).send({
        deletedCount: transactions.deletedCount,
    });
};
