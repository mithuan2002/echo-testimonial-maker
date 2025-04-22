
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Play, Pause, Video, Square } from "lucide-react";

interface VideoRecorderProps {
  onVideoRecorded: (blob: Blob) => void;
}

const VideoRecorder = ({ onVideoRecorded }: VideoRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const videoPlaybackRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up function to stop camera when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: true 
      });
      
      streamRef.current = stream;
      
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
      
      setCameraActive(true);
      
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };
  
  const deactivateCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    
    setCameraActive(false);
  };
  
  const startRecording = () => {
    if (!streamRef.current) return;
    
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;
    videoChunksRef.current = [];
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        videoChunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
      setVideoBlob(videoBlob);
      onVideoRecorded(videoBlob);
    };
    
    mediaRecorder.start();
    setIsRecording(true);
    
    // Start timer
    let seconds = 0;
    timerRef.current = setInterval(() => {
      seconds++;
      setRecordingTime(seconds);
    }, 1000);
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
  
  const playVideo = () => {
    if (videoBlob && videoPlaybackRef.current) {
      const videoUrl = URL.createObjectURL(videoBlob);
      videoPlaybackRef.current.src = videoUrl;
      videoPlaybackRef.current.play();
      setIsPlaying(true);
      
      videoPlaybackRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };
  
  const pauseVideo = () => {
    if (videoPlaybackRef.current) {
      videoPlaybackRef.current.pause();
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
      <h3 className="text-lg font-medium mb-4">Video Testimonial</h3>
      
      {!videoBlob ? (
        <div className="aspect-video bg-gray-100 rounded-md overflow-hidden mb-4 flex items-center justify-center">
          {cameraActive ? (
            <video 
              ref={videoPreviewRef} 
              className="w-full h-full object-cover"
              muted
              playsInline
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <Camera size={48} className="mb-2" />
              <span>Camera preview will appear here</span>
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-video bg-gray-100 rounded-md overflow-hidden mb-4">
          <video 
            ref={videoPlaybackRef} 
            className="w-full h-full object-cover"
            controls={false}
            playsInline
          />
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium">
          {isRecording ? (
            <span className="text-red-500 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              Recording: {formatTime(recordingTime)}
            </span>
          ) : videoBlob ? (
            <span className="text-green-600">Video recorded successfully</span>
          ) : (
            <span>{cameraActive ? "Camera ready" : "Activate camera to start"}</span>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {!cameraActive && !videoBlob && (
          <Button 
            onClick={activateCamera} 
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700"
          >
            <Camera size={16} /> Activate Camera
          </Button>
        )}
        
        {cameraActive && !isRecording && !videoBlob && (
          <>
            <Button 
              onClick={startRecording} 
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700"
            >
              <Video size={16} /> Start Recording
            </Button>
            
            <Button 
              onClick={deactivateCamera} 
              variant="secondary"
              className="flex items-center gap-2"
            >
              <CameraOff size={16} /> Turn Off Camera
            </Button>
          </>
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
        
        {videoBlob && !isRecording && (
          <>
            {!isPlaying ? (
              <Button 
                onClick={playVideo} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Play size={16} /> Play
              </Button>
            ) : (
              <Button 
                onClick={pauseVideo}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Pause size={16} /> Pause
              </Button>
            )}
            
            <Button 
              onClick={activateCamera} 
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Camera size={16} /> Record Again
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
