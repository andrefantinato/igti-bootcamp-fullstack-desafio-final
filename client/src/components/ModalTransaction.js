import React, { useState, useEffect } from 'react';

/**
 * Utilização de 'react-modal'
 */
import Modal from 'react-modal';

/**
 * Exigido pelo componente Modal
 */
Modal.setAppElement('#root');

/**
 * Componente ModalTransaction
 */
export default function ModalTransaction({
    onSave,
    onClose,
    selectedTransaction,
}) {
    /**
     * Desestruturando selectedTransaction
     */
    const {
        _id,
        description,
        category,
        yearMonthDay,
        value,
        type,
    } = selectedTransaction;

    const [newDescription, setDescription] = useState(description);
    const [newCategory, setCategory] = useState(category);
    const [newyearMonthDay, setyearMonthDay] = useState(yearMonthDay);
    const [newValue, setValue] = useState(value);
    const [newType, setType] = useState(type);

    /**
     * Evento para monitorar a tecla Esc, através de keydown
     */
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        // Eliminando evento
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    /**
     * Cercando a tecla "Esc"
     * e fechando a modal caso
     * seja digitada
     */
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onClose(null);
        }
    };

    const handleCategory = (event) => {
        setCategory(event.target.value);
    };
    const handleDescription = (event) => {
        setDescription(event.target.value);
    };
    const handleValue = (event) => {
        setValue(event.target.value);
    };
    const handleType = (event) => {
        setType(event.target.value);
    };
    const handleyearMonthDay = (event) => {
        setyearMonthDay(event.target.value);
    };

    /**
     * Função para lidar com o envio
     * de dados do formulário. Devemos
     * prevenir o envio e tratar manualmente
     */
    const handleFormSubmit = (event) => {
        event.preventDefault();

        const formData = {
            category: newCategory,
            description: newDescription,
            value: newValue,
            yearMonthDay: newyearMonthDay,
            type: newType,
        };
        onSave(_id, formData);
    };

    /**
     * Lidando com o fechamento da modal
     */
    const handleModalClose = () => {
        onClose(null);
    };

    /**
     * JSX
     */
    return (
        <div>
            <Modal
                style={{
                    content: {
                        position: 'absolute',
                        top: '50px',
                        left: '150px',
                        right: '150px',
                        bottom: '50px',
                    },
                }}
                isOpen={true}
            >
                <div style={styles.flexRow}>
                    <span style={styles.title}>Lançamento</span>
                    <button
                        className='waves-effect waves-lights btn red dark-4'
                        onClick={handleModalClose}
                    >
                        X
                    </button>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <p>
                        <label>
                            <input
                                name='tipo'
                                type='radio'
                                value='+'
                                checked={newType === '+'}
                                onChange={handleType}
                            />
                            <span>Receita</span>
                        </label>
                        <label>
                            <input
                                name='tipo'
                                type='radio'
                                value='-'
                                checked={newType === '-'}
                                onChange={handleType}
                            />
                            <span>Despesa</span>
                        </label>
                    </p>
                    <div className='input-field'>
                        <input
                            id='inputCategory'
                            type='text'
                            value={newCategory}
                            onChange={handleCategory}
                        />
                        <label className='active' htmlFor='inputCategory'>
                            Categoria:
                        </label>
                    </div>

                    <div className='input-field'>
                        <input
                            id='inputDescription'
                            type='text'
                            value={newDescription}
                            onChange={handleDescription}
                        />
                        <label className='active' htmlFor='inputDescription'>
                            Descrição:
                        </label>
                    </div>

                    <div className='input-field'>
                        <input
                            id='inputDate'
                            type='date'
                            value={newyearMonthDay}
                            onChange={handleyearMonthDay}
                        />
                        <label className='active' htmlFor='inputDate'>
                            Data:
                        </label>
                    </div>

                    <div className='input-field'>
                        <input
                            id='inputValue'
                            type='number'
                            value={newValue}
                            onChange={handleValue}
                        />
                        <label className='active' htmlFor='inputValue'>
                            Valor:
                        </label>
                    </div>

                    <div style={styles.flexRow}>
                        <button className='waves-effect waves-light btn'>
                            Salvar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

const styles = {
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '40px',
    },

    title: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
    },

    errorMessage: {
        color: 'red',
        fontWeight: 'bold',
    },
};
