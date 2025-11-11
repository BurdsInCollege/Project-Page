const calcActive = document.getElementById("calcActive");

function appendToDisplay(input){
    calcActive.value += input;
}

function clearDisplay(){
    calcActive.value = "";
}

function calculate(){
    try{
        calcActive.value = eval(calcActive.value);
    }
    catch{
        calcActive.value = "Error";
    }
}

