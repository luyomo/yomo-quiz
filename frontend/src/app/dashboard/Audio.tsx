import React, { useRef, useState } from 'react';

import { toFile } from "openai";
import OpenAI from "openai";

const AudioRecorder = () => {
  const [recordedUrl, setRecordedUrl] = useState('');
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        { audio: true }
      );
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          console.log("available data");
          console.log(e.data);
          chunks.current.push(e.data);
        }
      };
      mediaRecorder.current.onstop = async () => {
        const recordedBlob = new Blob( chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(recordedBlob);

        const audiofile = new File([recordedBlob], 'audiofile', { type: 'audio/webm' });
        const convertedAudio = await toFile(recordedBlob.stream(), 'audio.mp3');

        try {
          const openai = new OpenAI({ apiKey: "${KEY}", dangerouslyAllowBrowser: true});
          const transcription = await openai.audio.transcriptions.create({
              file: convertedAudio,
              model: 'whisper-1',
              response_format: 'text',
          });
          console.log(transcription);
        } catch(err) {
          console.log("Failed to convert to text from speech");
          console.log(err);
        }

        setRecordedUrl(url);
        chunks.current = [];
      };
      mediaRecorder.current.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };
  return (
    <div>
      <audio controls src={recordedUrl} />
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
};
export default AudioRecorder;
