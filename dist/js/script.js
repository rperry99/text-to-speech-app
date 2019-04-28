// Initialize speechSynth API
const synth = window.speechSynthesis;

// Grab all the DOM elements
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");

// Initialize voices array
let voices = [];
const getVoices = () => {
  voices = synth.getVoices();

  // Loop through voices and create option for each one
  voices.forEach(voice => {
    // Create an option element
    const option = document.createElement("option");

    // Fill the option with the voice and language
    option.textContent = voice.name + "(" + voice.lang + ")";

    // Set Needed option attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);

    // Append the option to the select
    voiceSelect.appendChild(option);
  });
};
getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak the words
const speak = () => {
  // Check if speaking
  if (synth.speaking) {
    console.error("Don't interrupt me, I am talking...");
    return;
  }
  // Make sure it's not an empty string
  if (textInput.value !== "") {
    // Add background wave animation
    body.style.background = "#141414 url(img/wave.gif)";
    body.style.backgroundRepeat = "repeat-x";
    body.style.backgroundSize = "100% 100%";

    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // Stop speaking
    speakText.onend = e => {
      console.log("I'm done talking now...");
      body.style.background = "#141414";
    };

    // Speaking error
    speakText.onerror = e => {
      console.error("Something went wrong");
    };

    // Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );

    // Loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Set rate and pitch
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    // Say the words
    synth.speak(speakText);
  }
};

/************ Event Listeners ************* */
// Text form submit
textForm.addEventListener("submit", e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Rate Value Change
rate.addEventListener("change", e => (rateValue.textContent = rate.value));

// Pitch Value Change
pitch.addEventListener("change", e => (pitchValue.textContent = pitch.value));

// Speak when the voice changes as well
voiceSelect.addEventListener("change", e => speak());
