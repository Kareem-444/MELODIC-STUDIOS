'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.hue = 160 + Math.random() * 20;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas!.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.speedY *= -1;
      }
      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const gradient = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, ${this.opacity})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 80%, 60%, 0)`);
        ctx!.fillStyle = gradient;
        ctx!.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle, i) => {
        particle.update();
        particle.draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(165, 70%, 55%, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(250px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(250px) rotate(-360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <canvas 
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{ opacity: 0.5 }}
      />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-black to-green-950/60" />
        <div 
          className="absolute top-0 right-0 w-full h-full max-w-3xl max-h-3xl bg-emerald-500/20 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * 50}px)`
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-full h-full max-w-3xl max-h-3xl bg-green-500/20 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: `translate(${-mousePosition.x * 50}px, ${-mousePosition.y * 50}px)`
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl max-h-2xl bg-teal-500/10 rounded-full blur-3xl" style={{ animation: 'pulse-slow 4s ease-in-out infinite' }} />
      </div>

      <nav className="fixed top-0 w-full z-50 transition-all duration-300">
        <div 
          className="absolute inset-0 backdrop-blur-2xl border-b border-white/10"
          style={{
            background: scrollY > 50 ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/50 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
                  MELODIC STUDIOS
                </div>
                <div className="text-xs text-emerald-500/70 font-bold tracking-widest">
                  SONIC EXCELLENCE
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-10">
              <a href="#services" className="text-sm font-bold text-gray-300 hover:text-emerald-400 transition-all hover:tracking-wider tracking-wide">
                SERVICES
              </a>
              <a href="#showcase" className="text-sm font-bold text-gray-300 hover:text-emerald-400 transition-all hover:tracking-wider tracking-wide">
                SHOWCASE
              </a>
              <a href="#technology" className="text-sm font-bold text-gray-300 hover:text-emerald-400 transition-all hover:tracking-wider tracking-wide">
                TECHNOLOGY
              </a>
              <a href="#testimonials" className="text-sm font-bold text-gray-300 hover:text-emerald-400 transition-all hover:tracking-wider tracking-wide">
                CLIENTS
              </a>
              <Link href="/Music">
                <button className="relative group px-8 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-xl font-black text-sm overflow-hidden shadow-xl shadow-emerald-600/50">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center gap-2">
                    ENTER CATALOG
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative z-10 pt-40 pb-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 transition-all duration-1000"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateX(0)' : 'translateX(-50px)'
              }}>
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 border border-emerald-500/30 rounded-full backdrop-blur-2xl shadow-lg shadow-emerald-500/20">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping absolute" />
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                </div>
                <span className="text-xs font-black text-emerald-400 tracking-widest uppercase">
                  Award-Winning Production House
                </span>
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-black leading-none">
                <span className="block text-white mb-2">Redefining</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500" style={{
                  backgroundSize: '200% auto',
                  animation: 'gradient 3s linear infinite'
                }}>
                  Sonic Art
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-xl font-light">
                Experience a new dimension of professionally engineered instrumental masterpieces. 
                <span className="text-emerald-400 font-semibold"> Crafted for visionaries</span> who refuse to compromise.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 pt-6">
                <Link href="/Music">
                  <button className="group relative px-10 py-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl font-black text-lg overflow-hidden shadow-2xl shadow-emerald-600/60 hover:shadow-emerald-500/80 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-white/10 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-3">
                      EXPLORE CATALOG
                      <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </Link>
                
                <button className="group px-10 py-6 bg-white/5 hover:bg-white/10 backdrop-blur-2xl border-2 border-white/20 hover:border-emerald-500/50 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl">
                  <span className="flex items-center justify-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <svg className="relative w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                    WATCH DEMO
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-12 border-t border-white/10">
                {[
                  { value: '3,200+', label: 'Compositions', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
                  { value: '99.5%', label: 'Satisfaction', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
                  { value: '24/7', label: 'Support', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
                ].map((item, i) => (
                  <div key={i} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative text-center">
                      <svg className="w-8 h-8 mx-auto mb-2 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d={item.icon} />
                      </svg>
                      <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                        {item.value}
                      </div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">
                        {item.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div 
              className="relative transition-all duration-1000 delay-300"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateX(0)' : 'translateX(50px)'
              }}
            >
              <div className="relative w-full h-96 lg:h-[600px]">
                <div 
                  className="absolute top-0 right-0 w-64 lg:w-72 h-80 lg:h-96 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-6 lg:p-8 shadow-2xl transition-all duration-500 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
                    transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg) translateZ(50px) rotate(8deg)`,
                    boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 blur-2xl opacity-50" />
                    <div className="relative w-14 lg:w-16 h-14 lg:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-4 lg:mb-6 flex items-center justify-center shadow-lg">
                      <svg className="w-7 lg:w-8 h-7 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-black text-white mb-2 lg:mb-3">Studio Mastery</h3>
                  <p className="text-xs lg:text-sm text-gray-300 leading-relaxed mb-4 lg:mb-6">
                    Pristine recordings captured in acoustically perfect environments with industry-leading equipment
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-emerald-400 font-bold">
                      <span>AUDIO QUALITY</span>
                      <span>96kHz/24-bit</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-lg shadow-emerald-500/50" />
                    </div>
                  </div>
                </div>

                <div 
                  className="absolute bottom-0 left-0 w-64 lg:w-72 h-80 lg:h-96 backdrop-blur-2xl border border-green-500/30 rounded-3xl p-6 lg:p-8 shadow-2xl transition-all duration-500 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
                    transform: `rotateY(${mousePosition.x * -5}deg) rotateX(${-mousePosition.y * -5}deg) translateZ(30px) rotate(-8deg)`,
                    boxShadow: '0 25px 50px -12px rgba(5, 150, 105, 0.4)'
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-500 blur-2xl opacity-50" />
                    <div className="relative w-14 lg:w-16 h-14 lg:h-16 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl mb-4 lg:mb-6 flex items-center justify-center shadow-lg">
                      <svg className="w-7 lg:w-8 h-7 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-black text-white mb-2 lg:mb-3">Instant Access</h3>
                  <p className="text-xs lg:text-sm text-gray-300 leading-relaxed mb-4 lg:mb-6">
                    Download immediately after purchase. Multiple formats available with lifetime access guarantee
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-green-400 font-bold">
                      <span>DELIVERY SPEED</span>
                      <span>IMMEDIATE</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg shadow-green-500/50 animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 lg:w-96 h-80 lg:h-96 bg-gradient-to-r from-emerald-600/40 via-teal-600/40 to-green-600/40 rounded-full blur-3xl animate-pulse pointer-events-none" />
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 lg:w-[500px] h-96 lg:h-[500px] pointer-events-none">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2"
                      style={{
                        animation: `orbit ${10 + i * 5}s linear infinite`,
                        animationDelay: `${i * 2}s`
                      }}
                    >
                      <div className="w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-lg shadow-emerald-500/50" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="showcase" className="relative z-10 py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 border border-emerald-500/30 rounded-full backdrop-blur-2xl shadow-lg">
              <span className="text-xs font-black text-emerald-400 tracking-widest uppercase">
                Premium Features
              </span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Unparalleled Excellence
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              Every track represents the pinnacle of audio engineering, crafted with precision and passion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
                title: "Studio Perfection",
                description: "Recorded in world-class studios with acoustically optimized environments. Every frequency balanced to perfection using reference-grade monitoring.",
                color: "from-emerald-600 to-green-600"
              },
              {
                icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
                title: "Genre Mastery",
                description: "From cinematic orchestrations to cutting-edge electronic productions. 25+ genres with authentic instrumentation and production techniques.",
                color: "from-teal-600 to-emerald-600"
              },
              {
                icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
                title: "Complete Rights",
                description: "Full commercial licensing included with every purchase. Use in albums, films, games, broadcasts - unlimited applications without restrictions.",
                color: "from-green-600 to-teal-600"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-2xl hover:border-emerald-500/50 transition-all duration-500 hover:transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/0 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-600/50`}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}