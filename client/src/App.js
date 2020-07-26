import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import * as api from './services/Api';
import Action from './components/Action';
import * as format from './helpers/format';
import ModalTransaction from './components/ModalTransaction';

export default function App() {
    const fetchYearMonths = async () => {
        const yearmonths = await api.getYearMonths();
        return yearmonths;
    };

    const fetchTransactions = async (period) => {
        console.log(period);
        const trans = await api.getTrasactions(period);
        return trans;
    };

    // Indicador de modal visível/invisível
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedTransaction, setSelectedTransaction] = useState({});

    const [transactions, setTransactions] = useState([]);
    const [transactionsFiltered, setTransactionsFiltered] = useState(
        transactions
    );
    const [yearMonths, setYearMonths] = useState([]);
    const [period, setPeriod] = useState();
    const [totalLancamentos, setTotalLancamentos] = useState(0);
    const [totalReceitas, setTotalReceitas] = useState(0);
    const [totalDespesas, setTotalDespesas] = useState(0);
    const [saldo, setSaldo] = useState(0);

    useEffect(() => {
        // imitialize dropdown
        var elems = document.getElementById('sel');
        window.M.FormSelect.init(elems, {});

        const getYearMonths = async () => {
            const yearMonths = await fetchYearMonths();
            setYearMonths(yearMonths);
        };
        getYearMonths();

        var today = new Date();
        const p = format.formatDate(today);
        setPeriod(p);
    }, []);

    useEffect(() => {
        const getTransactions = async () => {
            const trans = await fetchTransactions(period);
            setTransactions(trans);
            setTransactionsFiltered(trans);
            handleStatistcs(trans);
        };

        getTransactions();
    }, [period]);

    const handleFetchClick = async () => {
        const trans = await fetchTransactions(period);
        setTransactions(trans);
        setTransactionsFiltered(trans);
        handleStatistcs(trans);
    };

    const handleStatistcs = async (trans) => {
        const total = trans.reduce((acc, curr) => {
            return ++acc;
        }, 0);

        const totalDespesas = trans.reduce((acc, { value, type }) => {
            if (type === '-') acc += value;
            return acc;
        }, 0);

        const totalReceitas = trans.reduce((acc, { value, type }) => {
            if (type === '+') acc += value;
            return acc;
        }, 0);

        setTotalLancamentos(total);
        setTotalDespesas(totalDespesas);
        setTotalReceitas(totalReceitas);
        setSaldo(totalReceitas - totalDespesas);
    };

    const handleArrowClick = (id, type) => {
        var currDate = period.split('-');

        if (type === 'keyboard_arrow_left') currDate[1]--;
        else if (type === 'keyboard_arrow_right') currDate[1]++;

        if (currDate[1] === 13) {
            currDate[1] = 1;
            currDate[0]++;
        } else if (currDate[1] === 0) {
            currDate[1] = 12;
            currDate[0]--;
        }

        const p = format.formatDate(`${currDate[0]}-${currDate[1]}-02`);
        setPeriod(p);
    };

    const handleFilter = (event) => {
        const trans = transactions.filter((t) =>
            t.description
                .toLowerCase()
                .includes(event.target.value.toLowerCase())
        );
        setTransactionsFiltered(trans);
        handleStatistcs(trans);
    };

    const handleSelect = (event) => {
        setPeriod(event.target.value);
    };

    const handleModalPersist = (item, type) => {
        setSelectedTransaction(item);
        setIsModalOpen(true);
    };

    const handleModal = () => {
        setSelectedTransaction({});
        setIsModalOpen(true);
    };

    const handlePersistData = async (id, formData) => {
        if (id) {
            formData.id = id;
            await api.updateTransaction(formData);
        } else {
            await api.createTransaction(formData);
        }

        setIsModalOpen(false);
        handleFetchClick();
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleDeleteClick = async (id, _) => {
        const deleted = await api.deleteTransaction(id);

        if (deleted >= 1) {
            handleFetchClick();
        }
    };

    return (
        <div className='container'>
            <div className='row center-align'>
                <h4>Bootcamp Full Stack - Desafio Final</h4>
                <h6>Controle Financeiro Pessoal</h6>
            </div>
            <div className='row center-align'>
                <div className='input-field col s4 right-align'>
                    <button className='btn success'>
                        <Action
                            onActionClick={handleArrowClick}
                            type='keyboard_arrow_left'
                        />
                    </button>
                </div>
                <div className='input-field col s4 center-align'>
                    <select
                        className='browser-default'
                        id='sel'
                        onChange={handleSelect}
                    >
                        <option>Selecione...</option>
                        {yearMonths.map((m) => {
                            return (
                                <option
                                    key={m}
                                    value={m}
                                    selected={m === period}
                                >
                                    {m}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className='input-field col s4 left-align'>
                    <button className='btn success'>
                        <Action
                            onActionClick={handleArrowClick}
                            type='keyboard_arrow_right'
                        />
                    </button>
                </div>
            </div>
            <div className='row center-align'>
                <div className='col s6 m3'>Lançamentos: {totalLancamentos}</div>
                <div className='col s6 m3'>
                    Receitas:
                    <b className='green-text'>
                        {format.formatNumber(totalReceitas)}
                    </b>
                </div>
                <div className='col s6 m3'>
                    Despesas:
                    <b className='red-text'>
                        {format.formatNumber(totalDespesas)}
                    </b>
                </div>
                <div className='col s6 m3'>
                    Saldo: {format.formatNumber(saldo)}
                </div>
            </div>
            <div className='row'>
                <div className='input-field col s12'>
                    <input
                        id='filtro'
                        type='text'
                        className='validate'
                        onChange={handleFilter}
                    />
                    <label className='active' htmlFor='filtro'>
                        Pesquisar:
                    </label>
                </div>
            </div>
            <div className='row'>
                <div className='col s12'>
                    <table>
                        <tbody>
                            {transactionsFiltered.map((t) => {
                                return (
                                    <tr
                                        className={
                                            t.type === '+'
                                                ? 'green-text'
                                                : 'red-text'
                                        }
                                        key={t._id}
                                    >
                                        <td>{t.day}</td>
                                        <td>
                                            <b>{t.category}</b> <br />
                                            <span>{t.description}</span>
                                        </td>
                                        <td>
                                            <b>
                                                {format.formatNumber(t.value)}
                                            </b>
                                        </td>
                                        <td className='right-align black-text darken-4'>
                                            <Action
                                                onActionClick={
                                                    handleModalPersist
                                                }
                                                id={t}
                                                type='edit'
                                            />
                                            <Action
                                                onActionClick={
                                                    handleDeleteClick
                                                }
                                                id={t._id}
                                                type='delete'
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='fixed-action-btn'>
                <button
                    className='btn-floating btn-large red'
                    onClick={handleModal}
                >
                    <i className='large material-icons'>add</i>
                </button>
            </div>
            {isModalOpen && (
                <ModalTransaction
                    onSave={handlePersistData}
                    onClose={handleClose}
                    selectedTransaction={selectedTransaction}
                />
            )}
        </div>
    );
}
