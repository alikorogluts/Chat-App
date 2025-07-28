import { useState, useEffect, useRef, useCallback } from "react";
import { Video, Mic, PhoneOff, VideoOff, MicOff, Move, X, Maximize2, Minimize2, Phone } from "lucide-react";
import { motion } from "framer-motion";

function _videoCall() {
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'active' | 'ended'>('idle');
  const [time, setTime] = useState(0);
  const [isMicOn, setMicOn] = useState(true);
  const [isCamOn, setCamOn] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);
  const [mainView, setMainView] = useState<'local' | 'remote'>('remote');
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const constraintsRef = useRef(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Responsive window size tracking
  const updateWindowSize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  // Detect device and window size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setFullscreen(false);
    };

    checkMobile();
    updateWindowSize();

    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', updateWindowSize);
    };
  }, [updateWindowSize]);

  // Timer effect
  useEffect(() => {
    let interval: number;
    if (callStatus === 'active') {
      interval = window.setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Handle fullscreen change
  useEffect(() => {
    if (isFullscreen && modalRef.current) {
      modalRef.current.classList.add("fixed", "inset-0", "z-[1001]");
    } else if (modalRef.current) {
      modalRef.current.classList.remove("fixed", "inset-0", "z-[1001]");
    }
  }, [isFullscreen]);

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setCallStatus('idle');
      setTime(0);
      setFullscreen(false);
    }, 500);
  };

  const toggleFullscreen = () => {
    if (!isMobile) setFullscreen(!isFullscreen);
  };

  const swapViews = () => {
    setMainView(mainView === 'remote' ? 'local' : 'remote');
  };

  const initiateCall = () => {
    setCallStatus('ringing');
    // Simulate call being answered after 5 seconds
    setTimeout(() => {
      if (callStatus === 'ringing') {
        setCallStatus('active');
      }
    }, 5000);
  };

  const acceptCall = () => {
    setCallStatus('active');
  };

  const rejectCall = () => {
    setCallStatus('ended');
    setTimeout(() => setCallStatus('idle'), 500);
  };

  // Calculate dynamic dimensions based on window size
  const getVideoContainerStyle = () => {
    if (isFullscreen) {
      return {
        height: `${windowSize.height - 150}px`,
        width: '100%'
      };
    }

    if (isMobile) {
      return {
        height: `${windowSize.height - 180}px`,
        width: '100%'
      };
    }

    return {
      height: '480px',
      width: '100%',
      maxWidth: '800px'
    };
  };

  return (
    <div className="relative">
      {/* Video Call Button */}
      <button
        onClick={initiateCall}
        className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label="Görüntülü ara"
      >
        <Video className="w-5 h-5" />
      </button>

      {/* Call Modal */}
      {callStatus !== 'idle' && (
        <div
          ref={constraintsRef}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80"
        >
          <motion.div
            ref={modalRef}
            drag={!isMobile && !isFullscreen}
            dragConstraints={constraintsRef}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: callStatus === 'ended' ? 0 : 1,
              scale: callStatus === 'ended' ? 0.95 : 1,
              y: callStatus === 'ended' ? 20 : 0
            }}
            transition={{ duration: 0.3 }}
            className={`relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl ${isMobile
              ? 'w-full h-full rounded-none'
              : isFullscreen
                ? 'w-screen h-screen rounded-none'
                : 'w-full max-w-2xl p-6 shadow-2xl'
              }`}
          >
            {/* Header */}
            <div
              className={`flex justify-between items-center ${isMobile || isFullscreen
                ? 'p-4 bg-black/50'
                : 'mb-4 p-2'
                }`}
            >
              <div className="flex items-center gap-2 text-gray-300">
                {!isMobile && !isFullscreen && <Move className="w-4 h-4 opacity-70" />}
                <h2 className="text-lg font-medium">
                  {callStatus === 'ringing'
                    ? 'Gelen Çağrı'
                    : 'Görüntülü Arama'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {!isMobile && callStatus === 'active' && (
                  <button
                    onClick={toggleFullscreen}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                  >
                    {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                )}
                <button
                  onClick={handleEndCall}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Timer + Status */}
            {callStatus === 'active' && (
              <div className="text-center mb-4">
                <div className="inline-block bg-blue-900/50 px-4 py-1 rounded-full">
                  <p className="text-sm font-medium text-blue-300">{formatTime(time)}</p>
                </div>
              </div>
            )}

            {/* Video Area */}
            <div
              className={`relative bg-gradient-to-br from-gray-950 to-black rounded-xl border border-gray-800 mb-4 overflow-hidden flex items-center justify-center`}
              style={getVideoContainerStyle()}
            >
              {/* Ringing Screen */}
              {callStatus === 'ringing' && (
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center mb-6">
                    <span className="text-5xl">👤</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ahmet Yılmaz</h3>
                  <p className="text-gray-400 mb-8">Görüntülü arama...</p>

                  <div className="flex gap-6">
                    <button
                      onClick={rejectCall}
                      className="p-4 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 transition-all shadow-lg"
                    >
                      <PhoneOff className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={acceptCall}
                      className="p-4 rounded-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 transition-all shadow-lg"
                    >
                      <Phone className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* Active Call Content */}
              {callStatus === 'active' && (
                <>
                  {/* Main Video Stream */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {mainView === "remote" ? (
                      isCamOn ? (
                        <div className="flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center mb-4">
                            <span className="text-5xl">👤</span>
                          </div>
                          <span className="text-gray-300 bg-black/50 px-3 py-1 rounded-full text-lg">
                            Ahmet Yılmaz
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                            <VideoOff className="w-12 h-12 text-rose-500" />
                          </div>
                          <span className="text-rose-400 bg-black/50 px-3 py-1 rounded-full text-lg">
                            Kamera Kapalı
                          </span>
                        </div>
                      )
                    ) : (
                      isCamOn ? (
                        <div className="flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-600 to-emerald-700 flex items-center justify-center mb-4">
                            <span className="text-5xl">👤</span>
                          </div>
                          <span className="text-gray-300 bg-black/50 px-3 py-1 rounded-full text-lg">
                            Siz
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                            <VideoOff className="w-12 h-12 text-rose-500" />
                          </div>
                          <span className="text-rose-400 bg-black/50 px-3 py-1 rounded-full text-lg">
                            Kameranız Kapalı
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  {/* Picture-in-Picture View */}
                  <div
                    onClick={swapViews}
                    className="absolute bottom-4 right-4 w-24 h-24 rounded-lg border-2 border-blue-500 overflow-hidden cursor-pointer bg-gray-900 shadow-lg transition-all hover:scale-105"
                  >
                    {mainView === "remote" ? (
                      isCamOn ? (
                        <div className="w-full h-full bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center">
                          <span className="text-3xl">👤</span>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <VideoOff className="w-8 h-8 text-rose-500" />
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                        <span className="text-3xl">👤</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Call Controls */}
            {callStatus === 'active' && (
              <div className={`flex justify-center gap-4 ${isMobile || isFullscreen
                ? 'absolute bottom-0 left-0 right-0 py-6 bg-black/50'
                : 'py-4'
                }`}>
                <button
                  onClick={() => setMicOn(!isMicOn)}
                  className={`p-4 rounded-full flex items-center justify-center transition-all ${isMicOn
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-rose-900/60 hover:bg-rose-900"
                    }`}
                >
                  {isMicOn ? (
                    <Mic className="w-5 h-5 text-white" />
                  ) : (
                    <MicOff className="w-5 h-5 text-rose-300" />
                  )}
                </button>

                <button
                  onClick={() => setCamOn(!isCamOn)}
                  className={`p-4 rounded-full flex items-center justify-center transition-all ${isCamOn
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-rose-900/60 hover:bg-rose-900"
                    }`}
                >
                  {isCamOn ? (
                    <Video className="w-5 h-5 text-white" />
                  ) : (
                    <VideoOff className="w-5 h-5 text-rose-300" />
                  )}
                </button>

                <button
                  onClick={handleEndCall}
                  className="p-4 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 transition-all shadow-lg"
                >
                  <PhoneOff className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default _videoCall;