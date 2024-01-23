const plusMinus = document.querySelector(".plus-minus");
const count = document.getElementById("count");

function plus(){
    count.innerHTML = parseInt(count.innerHTML) + 1;
}
function minus(){
    count.innerHTML = parseInt(count.innerHTML) - 1;
}