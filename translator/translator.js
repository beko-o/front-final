const fromText = document.querySelector('.from_text');
toText = document.querySelector(".to_text");
exchangeIcon = document.querySelector(".exchange");
selectTag = document.querySelectorAll('select');
translateBtn = document.getElementById('button');
icons = document.querySelectorAll(".row i");
loginButton = document.getElementById("loginButton");

selectTag.forEach((tag, id) => {
    for(const country_code in countries) {
        let selected;

        if(id == 0 && country_code == "en-GB") {
            selected = "selected";
        } else if (id == 1 && country_code == "hi-IN") {
            selected = "selected";
        }
        // console.log(countries[country_code])
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option)
    }
});

exchangeIcon.addEventListener('click', () => {
    let tempText = fromText.value;
    let tempLang = selectTag[0].value;
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value = tempText;
    selectTag[1].value = tempLang;
})

translateBtn.addEventListener("click", () => {
    let text = fromText.value,
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;
    if (!text) return;
    toText.setAttribute("placeholder", "Translating...")

    // Используем Promise для обработки асинхронного запроса
    new Promise((resolve, reject) => {
        let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    }).then(data => {
        console.log(data);
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation");
    }).catch(err => {
        console.error(err);
        toText.setAttribute("placeholder", "Translation error");
    });
})

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if (target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value)
            } else {
                navigator.clipboard.writeText(toText.value)
            }
        } else {
            let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
})