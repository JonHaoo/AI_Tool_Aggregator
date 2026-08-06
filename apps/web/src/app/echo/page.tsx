"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    size: 1 + Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full bg-purple-400/20"
          style={{
            left: `${particle.left}%`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}
    </div>
  );
};

export default function EchoPage() {
  const [text, setText] = useState(
    "在这片宁静的夜空下，星星闪烁着柔和的光芒，仿佛在诉说着古老的传说。\n\n风轻轻吹过，带来了远方花朵的芬芳，让人心旷神怡。\n\n让我们跟随这段文字，一起感受语言的魅力，在阅读中找到内心的平静。\n\n每一次朗读，都是一次与文字的对话，一个与自己内心的交流。\n\n愿这段跟读之旅，带给你片刻的宁静与美好。"
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentLine, setCurrentLine] = useState(0);
  const [showInput, setShowInput] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const lineHeight = 80;
  const visibleLines = 3;

  const scrollToLine = useCallback(
    (lineIndex: number) => {
      if (containerRef.current) {
        const scrollAmount = lineIndex * lineHeight;
        containerRef.current.scrollTo({
          top: scrollAmount,
          behavior: "smooth",
        });
      }
    },
    []
  );

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (delta > (1000 / speed) * 0.9) {
        setCurrentLine((prev) => {
          if (prev >= lines.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    },
    [isPlaying, speed, lines.length]
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  useEffect(() => {
    if (isPlaying) {
      scrollToLine(currentLine);
    }
  }, [currentLine, isPlaying, scrollToLine]);

  const handlePlayPause = () => {
    if (currentLine >= lines.length - 1 && !isPlaying) {
      setCurrentLine(0);
      scrollToLine(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentLine(0);
    scrollToLine(0);
  };

  const handleStartReading = () => {
    setShowInput(false);
    setCurrentLine(0);
    scrollToLine(0);
  };

  const handleEditText = () => {
    setIsPlaying(false);
    setShowInput(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showInput) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          handlePlayPause();
          break;
        case "KeyR":
          e.preventDefault();
          handleReset();
          break;
        case "ArrowUp":
          e.preventDefault();
          setSpeed((prev) => Math.min(3, prev + 0.5));
          break;
        case "ArrowDown":
          e.preventDefault();
          setSpeed((prev) => Math.max(0.5, prev - 0.5));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showInput]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      <FloatingParticles />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950/50 to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_var(--tw-gradient-stops))] from-slate-950/80 via-transparent to-transparent pointer-events-none" />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(90vh) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(10vh) scale(1);
          }
          100% {
            transform: translateY(-10vh) scale(0);
            opacity: 0;
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.6);
          }
        }
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="relative z-10 flex flex-col h-screen">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-light tracking-wide">跟读时光</h1>
              <p className="text-xs text-white/50">沉浸式跟读体验</p>
            </div>
          </div>

          {!showInput && (
            <button
              onClick={handleEditText}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              编辑文本
            </button>
          )}
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          {showInput ? (
            <div className="w-full max-w-4xl space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-light tracking-wide">
                  准备开始跟读
                </h2>
                <p className="text-white/60 text-sm">
                  输入或粘贴你想要跟读的文本
                </p>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="在此输入文本..."
                className="w-full h-64 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none text-lg leading-relaxed placeholder-white/30 transition-all"
              />

              <div className="flex items-center justify-between">
                <p className="text-sm text-white/40">
                  {lines.length} 段落 · 约 {Math.ceil(lines.length * 3)} 秒
                </p>
                <button
                  onClick={handleStartReading}
                  disabled={lines.length === 0}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2 shadow-lg shadow-purple-500/30"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  开始跟读
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl space-y-8">
              <div className="relative">
                <div
                  ref={containerRef}
                  className="h-64 overflow-hidden relative"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-start pt-8">
                    {lines.map((line, index) => {
                      const distance = index - currentLine;
                      const isActive = index === currentLine;
                      const isPast = index < currentLine;
                      const isFuture = index > currentLine;

                      return (
                        <div
                          key={index}
                          className={`
                            text-center text-2xl font-light leading-relaxed transition-all duration-500 mb-8
                            ${
                              isActive
                                ? "text-white scale-110 opacity-100"
                                : isPast
                                ? "text-white/30 scale-100 opacity-50"
                                : "text-white/20 scale-95 opacity-30"
                            }
                          `}
                          style={{
                            transform: `translateY(${
                              distance * 20
                            }px) scale(${isActive ? 1.1 : 1 - Math.abs(distance) * 0.05})`,
                            textShadow: isActive
                              ? "0 0 40px rgba(168, 85, 247, 0.5), 0 0 80px rgba(168, 85, 247, 0.3)"
                              : "none",
                          }}
                        >
                          {line}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-1 h-16 rounded-full bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-50" />
                </div>
                <div className="absolute right-0 top-0 bottom-8 w-12 flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-1 h-16 rounded-full bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-50" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>
                    第 {currentLine + 1} / {lines.length} 段落
                  </span>
                  <span>
                    {Math.round(
                      ((currentLine + 1) / lines.length) * 100
                    )}
                    %
                  </span>
                </div>

                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{
                      width: `${((currentLine + 1) / lines.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    onClick={handleReset}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                    title="重置"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={handlePlayPause}
                    className="p-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/30 active:scale-95 pulse-glow"
                  >
                    {isPlaying ? (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/60">速度</span>
                    <button
                      onClick={() => setSpeed(Math.max(0.5, speed - 0.5))}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm font-mono w-12 text-center">
                      {speed.toFixed(1)}x
                    </span>
                    <button
                      onClick={() => setSpeed(Math.min(3, speed + 0.5))}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {!showInput && (
          <footer className="px-6 py-4 border-t border-white/10">
            <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-white/40">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  沉浸模式
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  跟读 {speed.toFixed(1)}x
                </span>
              </div>
              <span>空格键暂停 · R 键重置</span>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
