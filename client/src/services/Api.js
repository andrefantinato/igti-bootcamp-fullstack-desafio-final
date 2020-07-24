import axios from 'axios';

const API_URL = 'http://localhost:3001/api/transaction/';

async function getTrasactions(period) {
    const res = await axios.get(`${API_URL}${period}`);

    return res.data.transactions;
}

export { getTrasactions };
