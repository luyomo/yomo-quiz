

const SpeakEnglish = (inputText) => {
  const synth = window.speechSynthesis;

  if (synth.speaking) {
    console.error("already speaking");
    return;
  }
  const speakText = new SpeechSynthesisUtterance(inputText);
  //Speak end
  speakText.onend = e => {
    // body.style.background = "#141414";
  };

  //Speak error
  speakText.onerror = e => {
    console.error("Something went wrong...");
  };

  synth.speak(speakText);
};

const SpeakJapanese = (inputText) => {
  if ('speechSynthesis' in window) {
    const uttr = new SpeechSynthesisUtterance();
    
    uttr.text   = inputText;
    uttr.lang   = "ja-JP";
    uttr.rate   = 1;
    uttr.pitch  = 1;
    uttr.volume = 1;
    
    window.speechSynthesis.speak(uttr);
  }
};

const RandomInt = (maxInt) => {
  return Math.floor(Math.random() * maxInt);
}

export { SpeakEnglish, SpeakJapanese, RandomInt };
