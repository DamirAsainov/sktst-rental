const plusMinus = document.querySelector(".plus-minus");
const count = document.getElementById("count");
const addButton = document.getElementById('add-btn');
const removeButton = document.getElementById('remove-btn');
const basketButton = document.getElementById('basket-btn');



function plus(max){
    if(count.innerHTML < max){
        count.innerHTML = parseInt(count.innerHTML) + 1;
    }
}
function minus(){
    if(count.innerHTML > 1) {
        count.innerHTML = parseInt(count.innerHTML) - 1;
    }
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

function addToCart(productId) {
    let cartItems = getCartItems();
    if (!cartItems) {
        cartItems = [];
    }else if(cartItems.includes(productId)){
        changeBtn()
        return;
    }
    cartItems.push(productId);
    setCookie('cartItems', JSON.stringify(cartItems), 7);
    changeBtn();
}
function changeBtn(){
    let cartItems = getCartItems();
    if(cartItems.includes(document.getElementById('id').innerHTML)){
        addButton.style.display = 'none'
        removeButton.style.display = 'block';
        basketButton.style.display = 'block'
    }else {
        removeButton.style.display = 'none';
        addButton.style.display = 'block';
        basketButton.style.display = 'none'
    }
}
function deleteEquipFromCookie(equipId) {
    let cartItems = getCartItemsFromCookie();
    cartItems = cartItems.filter(item => item !== equipId);
    setCookie('cartItems', JSON.stringify(cartItems), 7)
    changeBtn()
}
function getCartItemsFromCookie() {
    const cartItemsString = getCookie('cartItems');
    return cartItemsString ? JSON.parse(cartItemsString) : [];
}
function getCartItems() {
    const cartItems = getCookie('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
}
function basketRedirect(){
    window.location.href = '/basket'
}
changeBtn()

