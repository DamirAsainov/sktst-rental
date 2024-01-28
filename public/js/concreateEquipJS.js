const plusMinus = document.querySelector(".plus-minus");
const count = document.getElementById("count");

function plus(max){
    if(count.innerHTML != max){
        count.innerHTML = parseInt(count.innerHTML) + 1;
    }
}
function minus(){
    if(count.innerHTML !== '0') {
        count.innerHTML = parseInt(count.innerHTML) - 1;
    }
}