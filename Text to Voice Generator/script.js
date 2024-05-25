let speech = new SpeechSynthesisUtterance(); // get the speech function

const btn = document.querySelector('.btn');

let voices = [];

let voiceSelect = document.querySelector("select")
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices(); // This gets all the voices that are provided
    speech.voice = voices[0];

    voices.forEach((voice, item) => (voiceSelect.options[item] = new Option(voice.name,item))); // add voice options in the select dropdown
}

voiceSelect.addEventListener("change",() => {
    speech.voice = voices[voiceSelect.value]; // on selecting the voice it will change the speech to the voice
})

btn.addEventListener("click",() => {
    speech.text = document.querySelector("#textarea").value;
    window.speechSynthesis.speak(speech); // using this we can convert the text to speech
})