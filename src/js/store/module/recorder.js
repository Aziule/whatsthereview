import store from '../'
import SpeechRecognition from '../../service/speech-recognition'
import * as actionsList from '../actions-list';

const speechRecognition = SpeechRecognition(window);

const getters = {
    isRecording: state => state.isRecording,
    isRecorderSupported: state => state.isSupported
}

const state = {
    isSupported: speechRecognition !== null,
    isAuthorised: false,
    isRecording: false
};

const actions = {
    [actionsList.START_RECORDING] ({ state }) {
        if (!state.isSupported) {
            throw new Error('The audio API is not active on your browser');
        }

        if (state.isRecording) {
            return;
        }

        state.isRecording = true;

        speechRecognition.start();

        speechRecognition.onend = function() {
            state.isRecording = false;
        };

        speechRecognition.onresult = function() {
            var transcript = event.results[0][0].transcript;
            store.dispatch(actionsList.ON_VOICE_RECORDED, transcript);
        };

        speechRecognition.onerror = function(e) {
            throw new Error('An error occured');
        };
    }
};

const module = {
    state,
    actions,
    getters
};

export default module;
