async function handleFormSubmission(url, formData, callback) {
    try {
        await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(formData),
        }).then(response => response.json())
            .then(data => {
                callback(data);
            })
            .catch(error => console.error('ErrorTest:', error));
    } catch (error) {
        console.error('Error during form submission:', error);
        throw error;
    }
}

async function createOrder() {
    const equipsObj = document.getElementsByClassName('eqID')
    let equipsID = [];
    for(let i = 0; i < equipsObj.length; i++){
        equipsID.push(equipsObj[i].innerHTML);
    }

    const formData = {
        name: document.getElementById('name').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        equipsID,
        daterange: document.getElementById('daterange').value
    };

    try {
        await handleFormSubmission('/create-order', formData, updateAlert); // change
    } catch (error) {
        console.error('Error during order submission:', error);
    }
}
function updateAlert(data){
    const alert = document.getElementById('status');
    const button = document.getElementById('order');
    if(data.message === "Order successfully created<br>We will contact you soon"){
        alert.classList = 'alert alert-success mt-3';
        alert.innerHTML = "Order successfully created<br>We will contact you soon";
        button.disabled = true;
    } else if (data.message != null){
        alert.classList = 'alert alert-danger mt-3'
        alert.innerHTML = data.message;
        button.disabled = false
    }
    else{
        alert.classList = "";
        alert.innerHTML = "";
        button.disabled = false;
    }
}
function getDaysDifference() {
    const dates = document.getElementById('daterange').value.split(' - ');
    const oneDay = 24 * 60 * 60 * 1000;
    const startDateParts = dates[0].split('/');
    const endDateParts = dates[1].split('/');
    // Создаем объекты Date, передавая год, месяц и день в правильном порядке
    const start = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]);
    const end = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);
    return Math.round(Math.abs((start - end) / oneDay)) + 1;
}

function setTotal(){
    const pricesObject = document.getElementsByClassName('price')
    const quantity = document.getElementsByClassName('quantity')
    const totalDays = document.getElementById('totalDays')

    let totalPrice = 0;
    for(let i = 0; i < pricesObject.length; i++){
        totalPrice += parseInt(pricesObject[i].innerHTML) * quantity[i].innerHTML;
    }
    document.getElementById('totalPrice').innerHTML = totalPrice * getDaysDifference()
    totalDays.innerHTML = getDaysDifference();
}
function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}
function getCartItemsFromCookie() {
    const cartItemsString = getCookie('cartItems');
    return cartItemsString ? JSON.parse(cartItemsString) : [];
}
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function deleteEquipFromCookie(equipId) {
    let cartItems = getCartItemsFromCookie();
    cartItems = cartItems.filter(item => item !== equipId);
    setCookie('cartItems', JSON.stringify(cartItems), 7)
    window.location.reload();
}
function minus(obj){
    const current = obj.parentElement.children.item(1).innerHTML;
    if(current > 1){
        obj.parentElement.children.item(1).innerHTML -= 1;
        setTotal();
    }
}
function plus(obj, max){
    const current = obj.parentElement.children.item(1).innerHTML;
    if(current < max) {
        obj.parentElement.children.item(1).innerHTML = parseInt(obj.parentElement.children.item(1).innerHTML) + 1;
        setTotal();
    }
}


$('#daterange').daterangepicker({
    "autoApply": true,
    "maxSpan": {
        "days": 7
    },
    "locale": {
        "format": "DD/MM/YYYY",
        "separator": " - ",
        "applyLabel": "Apply",
        "cancelLabel": "Cancel",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": [
            "Su",
            "Mo",
            "Tu",
            "We",
            "Th",
            "Fr",
            "Sa"
        ],
        "monthNames": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        "firstDay": 1
    },
    "parentEl": "body",
    "startDate": "15/02/2024",
    "endDate": "15/02/2024",
    "opens": "left",
    "drops": "auto",
    "applyButtonClasses": "btn-outline-warning",
    "cancelClass": "btn-outline-danger"
}, function(start, end, label) {
    console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
});
setTotal();