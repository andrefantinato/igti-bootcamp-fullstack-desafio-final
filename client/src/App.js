import React, { useState, useEffect } from 'react';
import * as api from './services/Api';

export default function App() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const geTransactions = async () => {
            const trans = await api.getTrasactions('2020-07');
            setTransactions(trans);
        };

        geTransactions();
    }, []);

    return (
        <div className='container'>
            <div className='row center-align'>
                <h4>Bootcamp Full Stack - Desafio Final</h4>
                <h6>Controle Financeiro Pessoal</h6>
            </div>
            <div className='row center-align'>
                <div className='col s3'>a</div>
                <div className='col s3'>b</div>
                <div className='col s3'>n</div>
                <div className='col s3'>n</div>
            </div>
            <div className='row'>
                <div className='input-field col s12'>
                    <input id='filtro' type='text' className='validate' />
                    <label className='active' htmlFor='filtro'>
                        Pesquisar:
                    </label>
                </div>
            </div>
            <div className='row'>
                {transactions.map((t) => {
                    return <p>{t.description}</p>;
                })}
            </div>
            <div class='fixed-action-btn'>
                <button className='btn-floating btn-large red'>
                    <i className='large material-icons'>add</i>
                </button>
            </div>
        </div>
    );
}
