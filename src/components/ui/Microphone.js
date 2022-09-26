import classes from "./Microphone.module.css";
import { BiMicrophoneOff, BiMicrophone, BiX } from "react-icons/bi";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect } from "react";

const Microphone = (props) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    props.transcriptText(transcript);
  }, [props, transcript]);

  useEffect(() => {
    resetTranscript();
  }, [props.resetText, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className={classes.buttonText}>
      <button
        className={listening ? classes.buttonActive : ""}
        onClick={(e) => {
          e.preventDefault();
          SpeechRecognition.startListening({ continuous: true });
        }}
      >
        <BiMicrophone />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          SpeechRecognition.stopListening();
        }}
      >
        <BiMicrophoneOff />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          resetTranscript();
        }}
      >
        <BiX />
      </button>
    </div>
  );
};

export default Microphone;
