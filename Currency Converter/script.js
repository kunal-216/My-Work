const BASE_URL = "https://2024-03-06.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector("#select-from");
const toCurr = document.querySelector("#select-to");
const msg = document.querySelector(".msg");

for(select of dropdowns){
    for(currCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name === "from" && currCode === "USD"){
            newOption.selected = "selected";
        }
        else if(select.name === "to" && currCode === "INR"){
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) =>{
        updateFlag(evt.target);
    })
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};


btn.addEventListener("click", (evt) => {
    evt.preventDefault(); // using this we can prevent all the different things happening to our website like refreshing, changed url
    updateExhangeRate();
})

const updateExhangeRate = async () => {
    let amount = document.querySelector("#amount");
    let amtVal = amount.value;
    if(amtVal < 0){
        amtVal = 0;
        alert("Please enter a valid number");
    }

    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();

    const fromCurrval = fromCurr.value.toLowerCase();
    const toCurrval = toCurr.value.toLowerCase();
    let conversionRate = data[fromCurrval][toCurrval];
    
    let finalAmount = amtVal*conversionRate;

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
}

// Jb first time hamara document load hoga tb bhi conversion rate chal jaaye for the default value = 1

window.addEventListener("load", () => {
    updateExhangeRate();
})