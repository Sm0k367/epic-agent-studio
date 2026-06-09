'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Image, Music, Video, Send, Loader2, Github, Users, Zap } from 'lucide-react';
import Link from 'next/link';

type GenerationType = 'text' | 'image' | 'audio' | 'video';

type StudioResult = {
  type: GenerationType | 'error';
  title?: string;
  content?: string;
  url?: string;
  prompt?: string;
  note?: string;
  description?: string;
};

type Template = {
  id: string;
  name: string;
  type: GenerationType;
  prompt: string;
  description: string;
};

type PlaylistItem = {
  id: number;
  title: string;
  url: string;
  type: 'audio' | 'video';
  prompt?: string;
};

export function AgentStudio() {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<GenerationType>('text');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<StudioResult | null>(null);
  const [history, setHistory] = useState<StudioResult[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationFrameRef = React.useRef<number | null>(null);

  useEffect(() => {
    fetch('/templates.json')
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(console.error);
  }, []);

  // Auto-play after generation for audio
  useEffect(() => {
    if (result && (result.type === 'audio' || result.type === 'video') && result.url && audioRef.current) {
      audioRef.current.src = result.url;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [result]);

  // Waveform visualizer for audio
  const drawWaveform = (audioElement: HTMLAudioElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !audioElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = 80;

    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const audioContext = new AudioCtx();
    const source = audioContext.createMediaElementSource(audioElement);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

        ctx.fillStyle = `rgb(168, 85, 247)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 4, barHeight);

        x += barWidth + 2;
      }
    };

    animate();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        const newItem: PlaylistItem = {
          id: Date.now() + Math.random(),
          title: file.name,
          url,
          type: file.type.startsWith('audio') ? 'audio' : 'video',
          prompt: 'User uploaded media',
        };
        setPlaylist(prev => [...prev, newItem]);
        if (playlist.length === 0) setCurrentTrackIndex(0);
      }
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setResult(null);

    try {
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      const generatedResult = {
        type,
        ...data.result,
        prompt,
      };

      setResult(generatedResult);
      setHistory(prev => [generatedResult, ...prev].slice(0, 5));

      // Add to playlist for audio/video
      if ((type === 'audio' || type === 'video') && generatedResult.url) {
        setPlaylist(prev => [...prev, { ...generatedResult, id: Date.now() }]);
        setCurrentTrackIndex(playlist.length);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Check your API keys on the deployment platform.';
      setResult({
        type: 'error',
        title: 'Generation Error',
        content: message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generationTypes = [
    { id: 'text' as GenerationType, label: 'Text', icon: Sparkles, color: 'purple' },
    { id: 'image' as GenerationType, label: 'Image', icon: Image, color: 'pink' },
    { id: 'audio' as GenerationType, label: 'Audio', icon: Music, color: 'violet' },
    { id: 'video' as GenerationType, label: 'Video', icon: Video, color: 'rose' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter">Epic Agent Studio</h1>
              <p className="text-xs text-zinc-500 -mt-1">Epic Tech AI · Multimodal · Live</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#generate" className="hover:text-purple-400 transition-colors">Generate</a>
            <a href="#history" className="hover:text-purple-400 transition-colors">History</a>
            <div className="px-5 py-2 rounded-full bg-white/5 text-xs font-mono border border-white/10">
              v1.0 • LIVE
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero */}
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span className="text-xs uppercase tracking-[2px] font-mono text-emerald-400">LIVE AGENT HUB • RAILWAY</span>
          </div>
          
          <h2 className="text-7xl font-bold tracking-tighter mb-6 leading-none bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
            Epic Agent<br />Studio
          </h2>
          <p className="max-w-md mx-auto text-xl text-zinc-400 mb-8">
            One prompt → text, image, audio, video. Real backends. Your private workspace.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs uppercase tracking-widest text-zinc-500 mb-12">
            <div className="px-4 py-1 border border-white/10 rounded-full">Groq</div>
            <div className="px-4 py-1 border border-white/10 rounded-full">Pixio</div>
            <div className="px-4 py-1 border border-white/10 rounded-full">Hugging Face</div>
          </div>

          <div id="generate" className="max-w-2xl mx-auto">
            <div className="glass rounded-3xl p-2">
              <div className="flex gap-2 mb-4 px-2">
                {generationTypes.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setType(t.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl transition-all ${
                        type === t.id 
                          ? 'bg-white text-black shadow-xl scale-105' 
                          : 'hover:bg-white/10 text-zinc-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="px-6 pb-6">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to generate... (e.g. cyberpunk samurai with neon dragons)"
                  className="w-full h-28 bg-transparent border border-white/10 focus:border-purple-500 rounded-2xl p-5 text-lg placeholder:text-zinc-500 resize-none focus:outline-none"
                />
                
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="generate-btn w-full h-16 rounded-2xl text-xl font-semibold flex items-center justify-center gap-3 disabled:opacity-50 mt-4 text-white shadow-2xl"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Generating on Railway...
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      GENERATE {type.toUpperCase()} NOW
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Result Area */}
        {result && (
          <div className="max-w-4xl mx-auto px-6 pb-20">
            <div className="glass rounded-3xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="uppercase text-xs tracking-widest text-purple-400 mb-1">RESULT • {result.type}</div>
                  <h3 className="text-3xl font-semibold">{result.title}</h3>
                </div>
                <button 
                  onClick={() => setResult(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {result.type === 'text' && (
                <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap bg-black/40 p-8 rounded-2xl border border-white/10">
                  {result.content}
                </pre>
              )}

              {result.type === 'image' && result.url && (
                <img 
                  src={result.url} 
                  alt={result.prompt}
                  className="rounded-2xl w-full shadow-2xl border border-white/10"
                />
              )}

              {/* Enhanced Media Player with Drag & Drop, Playlist, Waveform, Auto-play */}
              {(result?.type === 'audio' || result?.type === 'video' || playlist.length > 0) && (
                <div className="bg-zinc-900 rounded-3xl p-8 border border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="uppercase text-xs tracking-widest text-purple-400 mb-1">MEDIA PLAYER + PLAYLIST</div>
                      <h3 className="text-2xl font-semibold">
                        {playlist.length > 0 
                          ? playlist[currentTrackIndex]?.title || 'Now Playing' 
                          : result?.title || 'Drop media here'}
                      </h3>
                    </div>
                    
                    <div className="flex gap-3">
                      <label className="cursor-pointer px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-2xl text-sm flex items-center gap-2 transition-all active:scale-95">
                        <input
                          type="file"
                          accept=".mp3,.mp4,audio/*,video/*"
                          multiple
                          onChange={(e) => handleFiles(e.target.files)}
                          className="hidden"
                        />
                        ↑ Upload
                      </label>
                      {playlist.length > 0 && (
                        <button
                          onClick={() => setPlaylist([])}
                          className="px-4 py-2 text-xs text-red-400 hover:text-red-300"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFiles(e.dataTransfer.files);
                    }}
                    className="border border-dashed border-white/30 rounded-2xl p-8 mb-6 text-center hover:border-purple-400/50 transition-colors cursor-pointer"
                  >
                    <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Music className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-sm text-zinc-400">Drop MP3 or MP4 files here</p>
                    <p className="text-xs text-zinc-500 mt-1">or click upload above</p>
                  </div>

                  {/* Waveform for Audio */}
                  {(result?.type === 'audio' || playlist[currentTrackIndex]?.type === 'audio') && (
                    <div className="mb-6">
                      <canvas 
                        ref={canvasRef} 
                        className="w-full h-20 bg-black/60 rounded-2xl"
                      />
                    </div>
                  )}

                  {/* Main Player */}
                  <div className="rounded-2xl overflow-hidden bg-black mb-6">
                    {playlist.length > 0 ? (
                      playlist[currentTrackIndex]?.type === 'audio' ? (
                        <audio 
                          ref={audioRef}
                          controls 
                          className="w-full" 
                          src={playlist[currentTrackIndex]?.url}
                          onPlay={() => { setIsPlaying(true); drawWaveform(audioRef.current!); }}
                          onPause={() => setIsPlaying(false)}
                          autoPlay
                        />
                      ) : (
                        <video 
                          controls 
                          className="w-full aspect-video" 
                          src={playlist[currentTrackIndex]?.url}
                          autoPlay
                        />
                      )
                    ) : (result?.url && (result.type === 'audio' || result.type === 'video')) ? (
                      result?.type === 'audio' ? (
                        <audio 
                          ref={audioRef}
                          controls 
                          className="w-full" 
                          src={result?.url}
                          onPlay={() => { setIsPlaying(true); if (audioRef.current) drawWaveform(audioRef.current); }}
                          onPause={() => setIsPlaying(false)}
                          autoPlay
                        />
                      ) : (
                        <video controls className="w-full aspect-video" src={result?.url} autoPlay />
                      )
                    ) : (
                      <div className="py-16 text-center text-zinc-500">No media loaded</div>
                    )}
                  </div>

                  {/* Playlist */}
                  {playlist.length > 0 && (
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                      {playlist.map((track, index) => (
                        <div
                          key={track.id}
                          onClick={() => setCurrentTrackIndex(index)}
                          className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                            index === currentTrackIndex 
                              ? 'bg-purple-500/20 border border-purple-500/40' 
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                            {track.type === 'audio' ? <Music className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{track.title}</div>
                            <div className="text-xs text-zinc-500 truncate">{track.prompt?.substring(0, 60)}...</div>
                          </div>
                          {index === currentTrackIndex && isPlaying && (
                            <div className="text-purple-400 text-xs font-mono animate-pulse">NOW PLAYING</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {result?.note && <p className="text-xs text-zinc-500 mt-6">{result.note}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Templates / Hub Section */}
        <div id="templates" className="max-w-5xl mx-auto px-6 py-20 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-semibold flex items-center gap-3">
              <Sparkles className="text-purple-400" /> Agent Templates
            </h3>
            <button className="text-sm px-6 py-2.5 rounded-2xl border border-white/20 hover:bg-white/5 flex items-center gap-2">
              <Github className="w-4 h-4" /> Browse All on GitHub
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="glass rounded-3xl p-6 hover:border-purple-500/40 cursor-pointer group transition-all" 
                onClick={() => {
                  setPrompt(template.prompt);
                  setType(template.type as GenerationType);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
              >
                <div className="text-purple-400 text-xs mb-2">TEMPLATE • {template.type.toUpperCase()}</div>
                <div className="font-semibold group-hover:text-purple-300 mb-2">{template.name}</div>
                <div className="text-xs text-zinc-500 line-clamp-2">{template.description}</div>
                <div className="text-xs text-purple-400 mt-6 group-hover:underline">Remix with this prompt →</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 text-xs text-zinc-500">More templates & community agents dropping weekly</div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div id="history" className="max-w-5xl mx-auto px-6 pb-24">
            <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
              <Sparkles className="text-purple-400" /> Recent Generations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((item, i) => (
                <div key={i} className="glass rounded-3xl p-6 hover:border-purple-500/30 transition-all group">
                  <div className="text-xs uppercase tracking-widest text-zinc-500 mb-3">{item.type}</div>
                  <p className="line-clamp-2 text-sm text-zinc-400 group-hover:text-white transition-colors">
                    {item.prompt || item.content?.substring(0, 120) + '...'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 py-16 text-center text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            Epic Agent Studio by Epic Tech AI
          </div>
          <div className="flex items-center gap-8">
            <Link href="/pricing" className="hover:text-white flex items-center gap-2">
              Billing
            </Link>
            <a href="#templates" className="hover:text-white">Templates</a>
            <a href="https://discord.gg/" target="_blank" className="hover:text-white flex items-center gap-2">
              <Users className="w-4 h-4" /> Discord
            </a>
          </div>
          <div className="text-[10px] font-mono">No keys in code. Set on Railway/Vercel.</div>
        </div>
      </footer>
    </div>
  );
}
