const dropList = document.querySelectorAll(".drop-list select");
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button")


for (let i = 0; i < dropList.length; i++) {
    for (currency_code in country_code) {
        //по дефолту ставим USD и KZ
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "KZT" ? "selected" : "";
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // вставляем все коды валют в select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag)
    }

    dropList[i].addEventListener("change", e => {
        loadFlag(e.target);
    })
}


function loadFlag(element) {
    for (code in country_code) {
        if (code == element.value) {
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${country_code[code].toLowerCase()}.png`
        }
    }
}

window.addEventListener("load", () => {
    getExchangeRate();
});

getButton.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
})

function getExchangeRate() {
    const amount = document.querySelector(".amount input"),
    exchangeRateTxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value;
    if(amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = `Getting exchange rate...`;
    let url = `https://v6.exchangerate-api.com/v6/d448c9fd1163eac0743b6c79/latest/${fromCurrency.value}`;
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    }).catch(() => {
        exchangeRateTxt.innerText = 'Error occured';
    })
}