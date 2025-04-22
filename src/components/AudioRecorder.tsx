
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Play, Pause, Square } from "lucide-react";

interface AudioRecorderProps {
  onAudioRecorded: (blob: Blob) => void;
}

const AudioRecorder = ({ onAudioRecorded }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        onAudioRecorded(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
      }
    }
  };
  
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">Audio Testimonial</h3>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium">
          {isRecording ? (
            <span className="text-red-500 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              Recording: {formatTime(recordingTime)}
            </span>
          ) : audioBlob ? (
            <span className="text-green-600">Audio recorded successfully</span>
          ) : (
            <span>Click to start recording</span>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {!isRecording && !audioBlob && (
          <Button 
            onClick={startRecording} 
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700"
          >
            <Mic size={16} /> Start Recording
          </Button>
        )}
        
        {isRecording && (
          <Button 
            onClick={stopRecording} 
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Square size={16} /> Stop Recording
          </Button>
        )}
        
        {audioBlob && !isRecording && (
          <>
            {!isPlaying ? (
              <Button 
                onClick={playAudio} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Play size={16} /> Play
              </Button>
            ) : (
              <Button 
                onClick={pauseAudio}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Pause size={16} /> Pause
              </Button>
            )}
            
            <Button 
              onClick={startRecording} 
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Mic size={16} /> Record Again
            </Button>
          </>
        )}
      </div>
      
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default AudioRecorder;
