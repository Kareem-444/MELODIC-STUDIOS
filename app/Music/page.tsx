'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Star, Music, Headphones } from 'lucide-react';
import Link from "next/link";

type Track = {
  id: number;
  title: string;
  artist: string;
  price: number;
  duration: string;
  genre: string;
  audioFile: string;
  featured?: boolean;
};

const tracks: Track[] = [
  {
    id: 1,
    title: "Beat 1",
    artist: "MELODIC STUDIOS",
    price: 99,
    duration: "1:35",
    genre: "Trap",
    audioFile: "/audio/Beat 1.wav",
    featured: true
  },
  {
    id: 2,
    title: "Beat 2",
    artist: "MELODIC STUDIOS",
    price: 99,
    duration: "1:52",
    genre: "Hip Hop",
    audioFile: "/audio/Beat 2.wav",
    featured: true
  },
  {
    id: 3,
    title: "Beat 3",
    artist: "MELODIC STUDIOS",
    price: 99,
    duration: "1:39",
    genre: "Drill",
    audioFile: "/audio/Beat 3.wav"
  },
  {
    id: 4,
    title: "Beat 4",
    artist: "MELODIC STUDIOS",
    price: 99,
    duration: "2:38",
    genre: "RnB",
    audioFile: "/audio/Beat 4.wav"
  },
  {
    id: 5,
    title: "Beat 5",
    artist: "MELODIC STUDIOS",
    price: 99,
    duration: "1:42",
    genre: "Afrobeat",
    audioFile: "/audio/Beat 5.wav"
  },
  {
    id: 6,
    title: "Beat 6",
    artist: "MELODIC STUDIOS",
    price: 99,
    duration: "2:52",
    genre: "Pop",
    audioFile: "/audio/Beat 6.wav"
  },
  {
    id: 7,
    title: "Beat 7",
    artist: "MELODIC STUDIOS",
    price: 99,
    duration: "2:40",
    genre: "Trap",
    audioFile: "/audio/Beat 7.wav"
  },
  {
    id: 8,
    title: "Beat 8",
    artist: "MELODIC STUDIOS",
    price: 99,
    duration: "1:42",
    genre: "Hip Hop",
    audioFile: "/audio/Beat 8.wav"
  },
  {
    id: 9,
    title: "Beat 9",
    artist: "MELODIC STUDIOS",
    price: 99,
    duration: "2:21",
    genre: "Trap",
    audioFile: "/audio/Beat 9.mp3"
  },
  {
    id: 10,
    title: "Beat 10",
    artist: "MELODIC STUDIOS (BY Xxx Tintacion)",
    price: 99,
    duration: "1:28",
    genre: "Trap",
    audioFile: "/audio/Beat 10.mp3"
  },
];

export default function MusicStore() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [cart, setCart] = useState<Track[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    type Particle = {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    };

    const particles: Particle[] = [];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${particle.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const togglePlay = (track: Track) => {
    if (playing === track.id) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      setPlaying(track.id);
      if (audioRef.current) {
        audioRef.current.src = track.audioFile;
        audioRef.current.play();
      }
    }
  };

  const addToCart = (track: Track) => {
    if (!cart.find(item => item.id === track.id)) {
      setCart([...cart, track]);
    }
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <audio ref={audioRef} />

      <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-40" />

      <div className="fixed inset-0 z-0 bg-gradient-to-br from-emerald-950/40 via-black to-green-950/40 pointer-events-none" />
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-600/20 rounded-full blur-[150px]" />
      </div>

      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 blur-xl opacity-50" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-2xl shadow-emerald-500/50 transform hover:scale-110 transition-transform">
                  <Music className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  MELODIC STUDIOS
                </div>
                <div className="text-xs text-emerald-500/70 font-medium tracking-widest">
                  MUSIC CATALOG
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6 text-sm">
                <a href="#featured" className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors tracking-wide">
                  FEATURED
                </a>
                <a href="#all-tracks" className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors tracking-wide">
                  ALL TRACKS
                </a>
                <a href="#genres" className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors tracking-wide">
                  GENRES
                </a>
              </div>
              {/* Replace shopping cart with Home button */}
              <Link href="/" passHref>
                <button className="relative group px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg font-bold text-sm hover:from-emerald-500 hover:to-green-500 transition-all">
                  Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative z-10 pt-32 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-xl mb-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">
                Premium Audio Collection
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="block text-white">Discover Your Next</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500">
                Musical Masterpiece
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-6">
              Professional-grade instrumentals crafted by award-winning producers.
              Download instantly and elevate your creative projects.
            </p>

            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 blur-xl opacity-75" />
                <div className="relative p-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Daily Updates</span>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  </div>
                  <p className="text-base lg:text-lg text-emerald-300 font-medium leading-relaxed">
                    Our library is updated daily with 10 exclusive beats—be sure to come back regularly to discover the latest beats.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 pt-6 border-t border-white/5 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-emerald-400">{tracks.length}+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Premium Tracks</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400">HD</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Quality Audio</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400">24/7</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Instant Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="relative z-10 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-xl mb-4">
              <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">
                Featured Collection
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Top Picks</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tracks.filter(t => t.featured).map((track, index) => (
              <div
                key={track.id}
                className={`group relative transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 group-hover:border-emerald-500/50 transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/50 group-hover:scale-110 transition-transform">
                        <Music className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{track.title}</h3>
                        <p className="text-emerald-400 font-medium">{track.artist}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full font-semibold">
                            {track.genre}
                          </span>
                          <div className="flex items-center text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => togglePlay(track)}
                        className="relative group/play"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 blur opacity-50 group-hover/play:opacity-75 transition-opacity rounded-full" />
                        <div className="relative bg-gradient-to-r from-emerald-600 to-green-600 p-4 rounded-full hover:from-emerald-500 hover:to-green-500 transition-all transform hover:scale-110 shadow-xl shadow-emerald-600/50">
                          {playing === track.id ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 ml-1 text-white" />
                          )}
                        </div>
                      </button>
                      <div className="flex items-center gap-2 text-emerald-300">
                        <Volume2 className="w-4 h-4" />
                        <span className="text-sm font-medium">{track.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-emerald-400">
                        {track.price} <span className="text-lg font-bold">ج.م</span>
                      </span>
                      <button
                        onClick={() => addToCart(track)}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-lg font-bold text-sm transition-all transform hover:scale-105 shadow-lg shadow-emerald-600/30"
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="all-tracks" className="relative z-10 py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-xl mb-4">
              <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">
                Complete Library
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">All Available Tracks</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`group relative transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 group-hover:border-emerald-500/50 transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/50 group-hover:scale-110 transition-transform">
                        <Music className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{track.title}</h3>
                        <p className="text-emerald-400 font-medium">{track.artist}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full font-semibold">
                            {track.genre}
                          </span>
                          {track.featured && (
                            <div className="flex items-center text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => togglePlay(track)}
                        className="relative group/play"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 blur opacity-50 group-hover/play:opacity-75 transition-opacity rounded-full" />
                        <div className="relative bg-gradient-to-r from-emerald-600 to-green-600 p-4 rounded-full hover:from-emerald-500 hover:to-green-500 transition-all transform hover:scale-110 shadow-xl shadow-emerald-600/50">
                          {playing === track.id ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 ml-1 text-white" />
                          )}
                        </div>
                      </button>
                      <div className="flex items-center gap-2 text-emerald-300">
                        <Volume2 className="w-4 h-4" />
                        <span className="text-sm font-medium">{track.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-emerald-400">
                        {track.price} <span className="text-lg font-bold">ج.م</span>
                      </span>
                      <button
                        onClick={() => addToCart(track)}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-lg font-bold text-sm transition-all transform hover:scale-105 shadow-lg shadow-emerald-600/30"
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20 blur-3xl" />
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 lg:p-16">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-600/50">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Create<br />Something Amazing?
              </h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Download premium tracks instantly. Full commercial rights included with every purchase.
              </p>
              
              <div className="mb-8 p-8 bg-gradient-to-br from-emerald-500/15 to-green-500/15 border-2 border-emerald-500/40 rounded-2xl backdrop-blur-xl text-left shadow-2xl">
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">🔥</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      Did you find the right beat?
                    </h3>
                    <div className="space-y-3 text-gray-200">
                      <p className="leading-relaxed text-base">
                        Just message us on WhatsApp{' '}
                        <a 
                          href="https://wa.me/201020760211" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-300 font-bold hover:text-emerald-200 transition-colors underline decoration-emerald-400/50 hover:decoration-emerald-300"
                        >
                          01020760211
                        </a>
                        {' '}and send us the name of the beat you like.
                      </p>
                      <p className="leading-relaxed text-base">
                        💳 Payment is available via <span className="text-emerald-300 font-bold">Vodafone Cash</span>, very easily.
                      </p>
                      <p className="leading-relaxed text-base">
                        ⚡ And in just <span className="text-emerald-300 font-bold">two minutes</span>, the beat will be in your inbox!
                      </p>
                      <p className="text-emerald-200 font-bold text-lg mt-4 pt-4 border-t border-emerald-400/30">
                        Do not wait for inspiration... own it now. 🎧
                      </p>
                    </div>
                  </div>
                </div>
              </div>
      
              <div className="p-8 bg-gradient-to-br from-green-500/15 to-emerald-500/15 border-2 border-green-500/40 rounded-2xl backdrop-blur-xl text-right shadow-2xl" dir="rtl">
                <div className="flex items-start gap-4 flex-row-reverse">
                  <span className="text-3xl flex-shrink-0">🔥</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 justify-end">
                      هل وجدت البيت المناسب؟
                    </h3>
                    <div className="space-y-3 text-gray-200">
                      <p className="leading-loose text-base">
                        فقط راسلنا على واتساب{' '}
                        <a 
                          href="https://wa.me/201020760211" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-300 font-bold hover:text-emerald-200 transition-colors underline decoration-emerald-400/50 hover:decoration-emerald-300"
                        >
                          01020760211
                        </a>
                        {' '}وأرسل لنا اسم البيت اللي عجبك.
                      </p>
                      <p className="leading-loose text-base">
                        💳 الدفع متاح عن طريق <span className="text-emerald-300 font-bold">فودافون كاش</span>، بكل سهولة.
                      </p>
                      <p className="leading-loose text-base">
                        ⚡ وفي <span className="text-emerald-300 font-bold">دقيقتين بس</span>، البيت هيكون في إيميلك!
                      </p>
                      <p className="text-emerald-200 font-bold text-lg mt-4 pt-4 border-t border-emerald-400/30">
                        ماتستناش الإلهام... امتلكه دلوقتي. 🎧
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}