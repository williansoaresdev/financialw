/**
    Main engine roles
*/

/* === Constants and variables === */

var currentMonthAsNumber = 0;
var currentMonthAsPos = -1;
var currentMonthAsString = '';
var htmlErrorMsg = "<div class='alert alert-danger'><img src='./error_icon.png' /><br />&nbsp;<br />{msg}</div>";
var htmlDataView = "<div><div><b>Entradas</b></div><hr /><div id='incomings'></div><hr /><div><b>Saídas</b></div><hr /><div id='withdrawals'></div><hr /></div>";
var jsonData = {"months":[]};
var keepLogging = true;
var months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

/* === Logging methods === */

function loggingError(msgError) {
    if (!keepLogging)
        return false;

    console.error(msgError);
    return true;    
}

function loggingInfo(msg) {
    if (!keepLogging)
        return false;

    console.log(msg);
    return true;
}

function showError(msgError) {
    setContentBody(htmlErrorMsg.replace('{msg}',msgError));
    loggingError(msgError);
}

/* === Storage methods === */

/* === Financial methods === */

function createNewMonthData(month) {
    jsonData.months.push({
        "month": month,
        "incomings": [],
        "withdrawals": []
    });

    return (jsonData.months.length - 1);
}

function findMonthPos(month) {
    l = jsonData.months.length;

    if (l == 0) return -1;

    for (p = 0; p < l; p++) {
        if (jsonData.months[p].month == month)
            return p;
    }
    return -1;
}

function getCurrentMonth() {
    try {
        let d = new Date();
        mI = d.getMonth();
        m = (mI + 1).toString();
        y = d.getFullYear().toString();
    
        if (m.length == 1)
            m = '0'.concat(m);
    
        mStr = y.concat(m);
    
        currentMonthAsNumber = parseInt(mStr);
        currentMonthAsString = months[mI] + ' ' + y.toString();
    
        loggingInfo('Current month: '.concat(currentMonthAsNumber) + ' ('+currentMonthAsString+')');
        return true;    
    } catch(e) {
        return false;
    }
}

function loadMonthData(month) {
    currentMonthAsPos = findMonthPos(month);
    if (currentMonthAsPos < 0)
        currentMonthAsPos = createNewMonthData(month);

    if (currentMonthAsPos >= 0) {
        setContentBody(htmlDataView);
    }

    loggingInfo('loadMonthData='+currentMonthAsPos);
    return (currentMonthAsPos >= 0);
}

/* === DOM methods === */

function setContentBody(htmlBody) {
    $("#body-content").html(htmlBody);
}

function setTitle(title) {
    $("#head-title").html(title);
}

/* === Document events === */

$(document).ready(function(){
    loggingInfo('Initializating...');

    if (getCurrentMonth()) {
        setTitle(currentMonthAsString);
        if (loadMonthData(currentMonthAsNumber)) {
            loggingInfo('Ready.');
        } else
            showError('Não encontrar os dados do mês de trabalho.');    

        return;
    }

    showError('Não consegui carregar o mês de trabalho.');
});