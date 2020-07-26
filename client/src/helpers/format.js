/**
 * Referência ao objeto que formata números
 */
const numberFormat = Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function formatNumber(numberToBeFormatted) {
    return numberFormat.format(numberToBeFormatted);
}

function formatPercentage(numberToBeFormatted) {
    if (numberToBeFormatted) {
        return numberToBeFormatted.toFixed(2).replace('.', ',') + '%';
    }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    // return [year, month, day].join('-');
    return [year, month].join('-');
}

export { formatNumber, formatPercentage, formatDate };
