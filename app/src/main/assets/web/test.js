function increment(){
    const counterElement = document.getElementById("game:counter");
    let currentValue = parseInt(counterElement.innerText);
    counterElement.innerText = currentValue + 1;
}