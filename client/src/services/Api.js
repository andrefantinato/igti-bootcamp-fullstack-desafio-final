import axios from 'axios';

const API_URL =
    'http://andrefantinato-desafio-igti.herokuapp.com/api/transaction/';

async function getYearMonths() {
    const res = await axios.get(`${API_URL}/months`);
    return res.data.yearmonths;
}

async function getTrasactions(period) {
    const res = await axios.get(`${API_URL}${period}`);

    return res.data.transactions;
}

async function createTransaction(transaction) {
    const response = await axios.post(API_URL, transaction);
    return response.data.transaction;
}

async function updateTransaction(transaction) {
    const response = await axios.put(API_URL, transaction);
    return response.data.transaction;
}

async function deleteTransaction(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data.deletedCount;
}

export {
    getYearMonths,
    getTrasactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
};
