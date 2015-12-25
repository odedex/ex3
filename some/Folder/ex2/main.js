function hideElement(elementID) {
    document.getElementById(elementID).style.display = 'none';
}

function showElement(elementID) {
    document.getElementById(elementID).style.display = 'block';
}

function clearElementValue (elementID) {
    document.getElementById(elementID).value = '';
}

function doLogin() {
    var uname = document.getElementById('uname-input').value;
    if (uname === document.getElementById('pword-input').value && uname === "admin") {
            if (document.getElementById('page2') === null) {
                buildProfilePage();
            }
            hideElement('page1');
            showElement('page2');
            clearElementValue('uname-input');
            clearElementValue('pword-input');
            return;
    }
    alert("bad login");
}

function doLogout() {
    hideElement('page2');
    showElement('page1');
    alert("you logged out successfully")
}

function doCalcPage() {
    if (document.getElementById('page3') === null) {
        buildCalcPage();
    }
    hideElement('page2');
    showElement('page3');
}

function buildLoginPage() {
    var curDiv = document.createElement('div');
    curDiv.id = 'page1';
    curDiv.className = 'contentPage';
    curDiv.style.display = 'block';

    var formElement = document.createElement('form');
    formElement.action = 'javascript:doLogin()';

    var inputsDiv = document.createElement('div');
    inputsDiv.innerHTML = '<div><span>Username: </span><input type="text" id="uname-input"></div>' +
                            '<div><span>Password: </span><input type="password" id="pword-input"></div>';
    formElement.appendChild(inputsDiv);

    var buttonDiv = document.createElement('div');
    buttonDiv.innerHTML = '<input id="loginButton" type="submit" value="Login" class="actionButton"/>';
    formElement.appendChild(buttonDiv);

    curDiv.appendChild(formElement);
    document.body.appendChild(curDiv);
}

function buildProfilePage() {
    var curDiv = document.createElement('div');
    curDiv.id = 'page2';
    curDiv.className = 'contentPage';
    curDiv.style.display = 'none';

    var textDiv = document.createElement('div');
    textDiv.id = 'profileText';
    textDiv.innerHTML = '<p>My name is Oded Abrams, I\'m a 3rd year student in Hebrew University.</p>' +
        '<p>I like playing video games, movies and tv shows. I also like getting 100s in the course </p>' +
        '<p>Internet Technologies.</p>' +
        '<p>This is my Ex2 page. There are many like it, but this one is mine.</p>';
    curDiv.appendChild(textDiv);

    var imagesDiv = document.createElement('div');
    imagesDiv.id = 'imagesDiv';
    curDiv.appendChild(imagesDiv);

    var buttonsDiv = document.createElement('div');
    buttonsDiv.innerHTML = '<input id="logoutButton" type="submit" value="Logout" class="actionButton" onclick="doLogout();" />' +
                            '<input id="calcButton2" type="submit" value="Calculator" class="actionButton" onclick="doCalcPage();" />';
    curDiv.appendChild(buttonsDiv);
    document.body.appendChild(curDiv);
}

var calcButtons = ['1','2','3','4','5','6','7','8','9','0','+','-','*','='];
var calculators = [];

function executeCalcFunc(leftOperand, operator, rightOperand){
    var leftOperandInt = parseInt(leftOperand);
    var rightOperandInt = parseInt(rightOperand);
    var returnVal;
    switch (operator) {
        case '+':
            returnVal = leftOperandInt + rightOperandInt;
            break;
        case '-':
            returnVal = leftOperandInt - rightOperandInt;
            break;
        case '*':
            returnVal = leftOperandInt * rightOperandInt;
            break;
        default:
            returnVal = leftOperandInt;
    }
    return returnVal;
}

function handleCalc(calcButton) {
    var idString = calcButton.id.toString();
    var calcID = parseInt(idString.substring(0,idString.indexOf('_')));
    var calcFunc = idString.substring(idString.indexOf('_') + 1,idString.length);
    document.getElementById(calcID.toString() + '_val').value = calculators[calcID].doCalc(calcFunc);
}

function Calc() {
    var calcID = calculators.length;
    var curValue = 0;
    var newValue = 0;
    var curFunc = undefined;
    this.doCalc = function (calcFunc) {
        if (calcFunc === '=') {
            if (typeof curFunc === 'undefined') {
                return curValue;
            }
            curValue = executeCalcFunc(curValue, curFunc, newValue);
            return curValue;
        }
        else if (isNaN(calcFunc)) {
            newValue = 0;
            curFunc = calcFunc;
            return newValue;
        }
        else {
            if (typeof curFunc === 'undefined') {
                curValue = (curValue * 10) + parseInt(calcFunc);
                return curValue;
            }
            newValue = (newValue * 10) + parseInt(calcFunc);
            return newValue;
        }
    };


    var curDiv = document.getElementById('page3');
    var calcDiv = document.createElement('div');

    calcDiv.id = 'calcDiv' + calcID.toString();
    calcDiv.className = 'calculator';
    calcDiv.innerHTML += '<textarea id="' + calcID.toString() +'_val" disabled></textarea>';

    var buttonsDiv = document.createElement('div');
    for (var i = 0 ; i < calcButtons.length ; i++) {
        buttonsDiv.innerHTML += '<input id="' + calcID.toString() + '_' + calcButtons[i] + '" type="button" value="'+calcButtons[i]+'" onclick="handleCalc(this);" />';
    }

    calcDiv.appendChild(buttonsDiv);
    curDiv.appendChild(calcDiv);

    return this;
}

function buildCalcPage() {
    var curDiv = document.createElement('div');
    curDiv.id = 'page3';
    curDiv.className = 'contentPage';
    curDiv.style.display = 'none';
    document.body.appendChild(curDiv);
    curDiv.innerHTML += '<input id="calcButton3" type="submit" value="Calculator" class="actionButton" onclick="calculators.push(new Calc());" />';
    calculators.push(new Calc());
}

function onLoad(){
    buildLoginPage();
}

document.onload(onLoad());