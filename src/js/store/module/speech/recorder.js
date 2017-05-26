import * as actionsList from '../../actions-list';

const SpeechRecognition = window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition;

var recognition = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

const state = {
    isSupported: !!recognition,
    isRecording: false
};

const actions = {};

actions[actionsList.START_RECORDING] = () => {
    if (!state.isSupported) {
        throw new Error('The audio API is not active on your browser');
    }

    if (state.isRecording) {
        return;
    }

    state.isRecording = true;

    recognition.start();

    recognition.onend = function() {
        state.isRecording = false;
    };

    recognition.onresult = function() {
        var transcript = event.results[0][0].transcript;
    };

    recognition.onerror = function(e) {
        throw new Error('An error occured');
    };
};

const module = {
    state,
    actions
};

export default module;