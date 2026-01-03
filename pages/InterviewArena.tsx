
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * UTILITY FUNCTIONS FOR AUDIO ENCODING/DECODING
 */
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const InterviewArena: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [status, setStatus] = useState('Standby');
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    try {
      // Create a fresh GoogleGenAI instance per guidelines to ensure correct API key usage
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Output context for playback (24kHz is model output rate)
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioCtxRef.current = outputAudioContext;
      
      // Input context for microphone (16kHz is standard input rate)
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      setIsLive(true);
      setStatus('Initializing AI...');

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          // Use Modality.AUDIO from @google/genai
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are a senior tech recruiter for an industry placement screening. Ask one question at a time and wait for the student to answer. Be encouraging.'
        },
        callbacks: {
          onopen: () => {
            setStatus('Live: Recruiter is Listening');
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmData = new Uint8Array(int16.buffer);
              const base64 = encode(pcmData);
              
              // Handle session promise to avoid race conditions
              sessionPromise.then(session => {
                session.sendRealtimeInput({ 
                  media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
                });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message) => {
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString && audioCtxRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtxRef.current.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                audioCtxRef.current,
                24000,
                1
              );
              
              const source = audioCtxRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioCtxRef.current.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setIsLive(false);
            setStatus('Standby');
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            setStatus('Error occurred');
          }
        }
      });

    } catch (err) {
      console.error(err);
      alert('Microphone access required for Interview Arena.');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-[#0F172A] rounded-[3rem] p-16 text-white text-center flex flex-col items-center justify-center space-y-10 shadow-2xl relative overflow-hidden min-h-[500px]">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48"></div>
         
         <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl transition-all duration-500 ${isLive ? 'bg-red-500 animate-pulse' : 'bg-indigo-500/20'}`}>
            {isLive ? '🎙️' : '🎯'}
         </div>

         <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-black">Interview Simulation Hub</h3>
            <div className="bg-white/10 border border-white/10 py-1 px-4 rounded-full inline-block mb-2">
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Live API Pro</span>
            </div>
            <p className="text-slate-400 max-w-lg mx-auto font-medium">
              {isLive ? 'Live Simulation in Progress. Speak clearly to the recruiter.' : 'Experience a technical mock interview powered by Gemini Live API. Speak naturally to the AI.'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-ping' : 'bg-slate-500'}`}></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{status}</span>
            </div>
         </div>

         <div className="flex gap-4 relative z-10">
            {!isLive ? (
              <button onClick={startSession} className="bg-indigo-600 px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30">Start Mock Interview</button>
            ) : (
              <button onClick={() => window.location.reload()} className="bg-red-600 px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl">End Simulation</button>
            )}
         </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-lg font-black text-slate-900 tracking-widest uppercase">Simulation Insights</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Live Feedback Engine</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                <p className={`text-2xl font-black ${isLive ? 'text-blue-600' : 'text-slate-400'}`}>{isLive ? 'ACTIVE' : 'READY'}</p>
             </div>
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Interface</p>
                <p className="text-2xl font-black text-slate-400 uppercase">Native Audio</p>
             </div>
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Latency</p>
                <p className="text-2xl font-black text-emerald-600 uppercase">Optimized</p>
             </div>
          </div>
          <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
            <p className="text-xs font-bold text-indigo-700 leading-relaxed">
              <strong>Professional Tip:</strong> When using the Live Arena, treat the AI like a human recruiter. Use pauses effectively and clarify your thoughts if you feel you are getting off-track. The system analyzes conversational flow and technical keyword density.
            </p>
          </div>
      </div>
    </div>
  );
};

export default InterviewArena;
