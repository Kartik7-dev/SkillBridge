import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  FileText,
  MessageSquare,
  Coins,
  ShieldCheck,
  Copy,
  Check,
  Users,
  RefreshCw,
  Info,
  Maximize2,
  ChevronRight,
  HelpCircle,
  Award,
  LayoutGrid,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { loadJitsiScript } from '../../utils/jitsi';
import Avatar from '../shared/Avatar';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import Logo from '../shared/Logo';

export default function SessionRoom({ sessionId: propSessionId }) {
  const { sessionId: routeSessionId } = useParams();
  const sessionId = Number(propSessionId || routeSessionId);
  const navigate = useNavigate();

  const {
    sessions,
    doubts,
    startSession,
    updateSessionNotes,
    addSessionMessage,
    openFeedbackModal,
    currentUser,
    addToast,
  } = useApp();

  const session = sessions.find((s) => s.id === sessionId);
  const relatedDoubt = doubts.find((d) => d.id === session?.doubtId);

  // Active side-panel tab: 'details' | 'chat' | 'notes'
  const [activeSideTab, setActiveSideTab] = useState('details');

  // Jitsi Meeting states
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const isTileViewRef = useRef(false);
  const loadingSafetyTimerRef = useRef(null);
  const [isJitsiLoading, setIsJitsiLoading] = useState(true);
  const [jitsiError, setJitsiError] = useState(null);
  const [isMeetingJoined, setIsMeetingJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isTileView, setIsTileView] = useState(true);

  // Notes & Chat & Modals
  const [notes, setNotes] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [showConfirmComplete, setShowConfirmComplete] = useState(false);
  const [isCopiedNotes, setIsCopiedNotes] = useState(false);
  const [isCopiedRoom, setIsCopiedRoom] = useState(false);

  const chatEndRef = useRef(null);

  // Persistent Timer based on session.startedAt timestamp
  const durationMinutes = session?.duration
    ? parseInt(session.duration, 10) || 15
    : 15;
  const totalDurationSeconds = durationMinutes * 60;

  const calculateRemainingSeconds = () => {
    if (!session?.startedAt) return totalDurationSeconds;
    const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
    return Math.max(0, totalDurationSeconds - elapsed);
  };

  const [secondsRemaining, setSecondsRemaining] = useState(calculateRemainingSeconds);

  // Auto-start session (marks 'in-progress', sets startedAt & roomName)
  useEffect(() => {
    if (session) {
      startSession(session.id);
    }
  }, [session?.id]);

  // Load existing notes
  useEffect(() => {
    if (session) {
      setNotes(session.notes || '');
    }
  }, [session?.id, session?.notes]);

  // Timer interval ticking every 1 second against the real start timestamp
  useEffect(() => {
    const updateTimer = () => {
      setSecondsRemaining(calculateRemainingSeconds());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [session?.startedAt, totalDurationSeconds]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeSideTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.chatMessages, activeSideTab]);

  // Initialize Jitsi Conference using official IFrame API
  const initJitsiConference = async () => {
    if (!session || !jitsiContainerRef.current) return;

    setIsJitsiLoading(true);
    setJitsiError(null);

    // Clean up any existing safety timer
    if (loadingSafetyTimerRef.current) {
      clearTimeout(loadingSafetyTimerRef.current);
      loadingSafetyTimerRef.current = null;
    }

    // Clean up any existing instance first
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.dispose();
      } catch (e) {
        console.warn('Jitsi dispose error:', e);
      }
      jitsiApiRef.current = null;
    }

    try {
      const JitsiMeetExternalAPI = await loadJitsiScript();

      // Clear container element before attaching
      if (jitsiContainerRef.current) {
        jitsiContainerRef.current.innerHTML = '';
      }

      // Consistent room name for this session
      const roomName =
        session.roomName ||
        `SkillBridge_P2P_${session.id}_${Math.abs(Number(session.id) * 2654435761 % 1000000).toString(36)}`;

      const domain = 'meet.jit.si';
      const options = {
        roomName: roomName,
        parentNode: jitsiContainerRef.current,
        width: '100%',
        height: '100%',
        userInfo: {
          displayName: currentUser?.fullName || 'Student Peer',
          email: currentUser?.email || undefined,
        },
        configOverwrite: {
          // 1. Prejoin bypass: modern Jitsi requires prejoinConfig.enabled: false
          prejoinConfig: {
            enabled: false,
          },
          prejoinPageEnabled: false,

          // 2. Start with media devices active
          startWithAudioMuted: false,
          startWithVideoMuted: false,

          // 3. Self-view configuration: ALWAYS visible, never hidden or disabled
          disableSelfView: false,
          disableSelfViewSettings: false,

          // 4. Participant filmstrip: always visible, never autohidden on small screens
          disableFilmstripAutohiding: true,
          filmstrip: {
            disabled: false,
            disableResizable: false,
            disableStageFilmstrip: false,
          },

          // 5. Mirror local video preview naturally like a webcam mirror
          disableLocalVideoFlip: false,

          // 6. Tile View: enabled and visible so single & multiple participants have dedicated video tiles
          tileView: {
            disabled: false,
            numberOfVisibleTiles: 25,
          },

          // 7. Video resolution and quality constraints
          resolution: 720,
          constraints: {
            video: {
              height: { ideal: 720, max: 720, min: 180 },
              width: { ideal: 1280, max: 1280, min: 320 },
              frameRate: { max: 30 },
            },
          },

          // 8. P2P direct WebRTC streaming for high-quality peer calls
          p2p: {
            enabled: true,
            useStunTurn: true,
          },

          // 9. Navigation and deep linking
          disableDeepLinking: true,
          enableWelcomePage: false,
          enableClosePage: false,

          // 10. Toolbar buttons inside call
          toolbarButtons: [
            'microphone',
            'camera',
            'desktop',
            'chat',
            'raisehand',
            'tileview',
            'fullscreen',
            'hangup',
            'settings',
          ],
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          TOOLBAR_ALWAYS_VISIBLE: true,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
          DEFAULT_BACKGROUND: '#171329',
          FILM_STRIP_MAX_HEIGHT: 120,
          VERTICAL_FILMSTRIP: true,
        },
      };

      const api = new JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;

      // Listen to Tile View changes
      api.on('tileViewChanged', ({ enabled }) => {
        isTileViewRef.current = Boolean(enabled);
        setIsTileView(Boolean(enabled));
      });

      // Event Listeners
      api.on('videoConferenceJoined', (event) => {
        if (loadingSafetyTimerRef.current) {
          clearTimeout(loadingSafetyTimerRef.current);
          loadingSafetyTimerRef.current = null;
        }
        setIsJitsiLoading(false);
        setIsMeetingJoined(true);
        addToast('Connected to live peer video conference!', 'success');

        // Automatically ensure Tile View is active so the local self-video tile is prominent immediately
        setTimeout(() => {
          if (!isTileViewRef.current) {
            try {
              api.executeCommand('toggleTileView');
            } catch (err) {
              console.warn('Could not toggle tile view:', err);
            }
          }
        }, 500);

        setTimeout(() => {
          if (!isTileViewRef.current) {
            try {
              api.executeCommand('toggleTileView');
            } catch (err) {
              console.warn('Could not toggle tile view:', err);
            }
          }
        }, 1500);
      });

      // Safety timeout: dismiss loading overlay after 3s so the user can interact even if network delays event
      loadingSafetyTimerRef.current = setTimeout(() => {
        setIsJitsiLoading(false);
      }, 3000);

      // Reinforce iframe permissions and dismiss overlay once iframe document loads
      setTimeout(() => {
        const iframe = jitsiContainerRef.current?.querySelector('iframe');
        if (iframe) {
          try {
            iframe.setAttribute('allow', 'camera *; microphone *; display-capture *; autoplay *; clipboard-write *');
          } catch (e) {
            console.warn('Could not reinforce iframe allow:', e);
          }
          iframe.addEventListener('load', () => {
            setTimeout(() => setIsJitsiLoading(false), 1200);
          });
        }
      }, 100);

      api.on('participantJoined', (participant) => {
        setParticipantCount((prev) => prev + 1);
        addToast(`${participant.displayName || 'Peer'} joined the session room`, 'info');
      });

      api.on('participantLeft', () => {
        setParticipantCount((prev) => Math.max(1, prev - 1));
      });

      api.on('audioMuteStatusChanged', ({ muted }) => {
        setIsAudioMuted(muted);
      });

      api.on('videoMuteStatusChanged', ({ muted }) => {
        setIsVideoMuted(muted);
      });

      api.on('screenSharingStatusChanged', ({ on }) => {
        setIsScreenSharing(on);
      });

      api.on('readyToClose', () => {
        setShowConfirmComplete(true);
      });

      api.on('videoConferenceLeft', () => {
        setIsMeetingJoined(false);
      });
    } catch (err) {
      console.error('Failed to initialize Jitsi:', err);
      setIsJitsiLoading(false);
      setJitsiError(err.message || 'Failed to initialize video conference');
    }
  };

  useEffect(() => {
    initJitsiConference();

    return () => {
      if (loadingSafetyTimerRef.current) {
        clearTimeout(loadingSafetyTimerRef.current);
        loadingSafetyTimerRef.current = null;
      }
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {
          console.warn('Error disposing Jitsi API:', e);
        }
        jitsiApiRef.current = null;
      }
    };
  }, [session?.id]);

  if (!session) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center mt-12 bg-white rounded-3xl border border-[#E9E2F5] shadow-md font-sans">
        <AlertCircle size={40} className="text-[#E11D48] mx-auto mb-3" />
        <h2 className="text-xl font-heading font-bold text-[#171329] mb-2">Session Not Found</h2>
        <p className="text-xs text-[#6B6680] mb-6">
          The requested mentorship session could not be located or has expired.
        </p>
        <Button onClick={() => navigate('/dashboard/my-sessions')}>
          Back to My Sessions
        </Button>
      </div>
    );
  }

  // Format Timer MM:SS
  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCriticalTime = secondsRemaining <= 30 && secondsRemaining > 0;
  const isLowTime = secondsRemaining <= 120 && secondsRemaining > 30;
  const isTimeEnded = secondsRemaining === 0;

  // External commands to Jitsi API
  const handleToggleAudio = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleAudio');
    }
  };

  const handleToggleVideo = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleVideo');
    }
  };

  const handleToggleScreenShare = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleShareScreen');
    }
  };

  const handleToggleTileView = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleTileView');
    }
  };

  const handleLeaveCall = () => {
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.executeCommand('hangup');
      } catch (e) {
        console.warn(e);
      }
    }
    navigate('/dashboard/my-sessions');
  };

  // Notes handling
  const handleNotesChange = (e) => {
    const text = e.target.value;
    setNotes(text);
    updateSessionNotes(session.id, text);
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(notes || session.topic);
    setIsCopiedNotes(true);
    addToast('Notes copied to clipboard', 'info');
    setTimeout(() => setIsCopiedNotes(false), 2000);
  };

  // Copy Room Link / ID
  const handleCopyRoomId = () => {
    const room = session.roomName || `SkillBridge_P2P_${session.id}`;
    navigator.clipboard.writeText(room);
    setIsCopiedRoom(true);
    addToast(`Room ID "${room}" copied to clipboard`, 'info');
    setTimeout(() => setIsCopiedRoom(false), 2000);
  };

  // Chat message send
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addSessionMessage(session.id, chatInput.trim());
    setChatInput('');
  };

  // Completion confirmation flow
  const handleConfirmComplete = () => {
    setShowConfirmComplete(false);
    openFeedbackModal(session);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAF9FF] overflow-hidden font-sans select-none">
      {/* Top Bar */}
      <header className="h-18 bg-white/95 backdrop-blur-xl border-b border-[#E9E2F5] px-4 sm:px-7 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3.5 min-w-0">
          <Link to="/dashboard/my-sessions" className="p-2 rounded-xl text-[#6B6680] hover:text-[#7C3AED] hover:bg-[#F5F0FF] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">My Sessions</span>
          </Link>

          <div className="h-6 w-px bg-[#E9E2F5] hidden sm:block" />

          <Logo size="sm" linkTo="/dashboard" />

          <div className="h-6 w-px bg-[#E9E2F5] hidden md:block" />

          {/* Session Topic & Peer Summary */}
          <div className="min-w-0 hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Live Video Room
              </span>
              <h1 className="text-xs sm:text-sm font-heading font-bold text-[#171329] truncate max-w-xs md:max-w-md">
                {session.topic}
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#6B6680] truncate">
              <span>Helper: <strong className="text-[#171329]">{session.helper?.name}</strong></span>
              <span>&middot;</span>
              <span>Learner: <strong className="text-[#171329]">{session.student?.name || currentUser.fullName}</strong></span>
              <span>&middot;</span>
              <span className="text-[#7C3AED] font-semibold">{participantCount} connected</span>
            </div>
          </div>
        </div>

        {/* Right Controls: Timer + Bounty + Complete Button */}
        <div className="flex items-center gap-3">
          {/* Persisted Session Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-xs ${
              isTimeEnded
                ? 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]'
                : isCriticalTime
                ? 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6] animate-pulse shadow-[0_0_12px_rgba(225,29,72,0.3)]'
                : isLowTime
                ? 'bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7] animate-pulse'
                : 'bg-[#F5F0FF] text-[#7C3AED] border-[#E9E2F5]'
            }`}
            title="Booked session duration countdown (persisted)"
          >
            <Clock
              size={13}
              className={isLowTime || isCriticalTime ? 'animate-spin' : ''}
              style={{ animationDuration: isCriticalTime ? '1.5s' : '3s' }}
            />
            <span>
              {isTimeEnded ? '00:00 (Time Finished)' : formatTimer(secondsRemaining)}
            </span>
          </div>

          {/* Bounty Badge */}
          <div className="hidden lg:flex items-center gap-1 text-xs font-bold text-[#7C3AED] bg-[#F5F0FF] px-3 py-1.5 rounded-full border border-[#E9E2F5]">
            <Coins size={13} className="text-[#7C3AED]" />
            <span>+{session.bounty || 25} pts</span>
          </div>

          {/* Complete Session Action Button */}
          {session.status !== 'completed' ? (
            <Button
              size="sm"
              onClick={() => setShowConfirmComplete(true)}
              icon={CheckCircle2}
              className="shadow-[0_4px_14px_rgba(124,58,237,0.3)]"
            >
              <span className="hidden sm:inline">Mark Complete</span>
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F7FEE7] text-[#4D7C0F] text-xs font-bold border border-[#ECFCCB]">
              <CheckCircle2 size={13} /> Completed
            </span>
          )}
        </div>
      </header>

      {/* Main Workspace Area (Split Video + Side Panel) */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left Side: Real-Time Jitsi Video Call Container */}
        <div className="flex-1 flex flex-col min-w-0 p-3 sm:p-5 h-full overflow-hidden">
          <div className="relative flex-1 w-full bg-[#171329] rounded-3xl overflow-hidden border border-[#E9E2F5] shadow-[0_16px_40px_rgba(91,33,182,0.12)] flex flex-col">
            {/* Top Bar overlay with Security Indicator & Room Name */}
            <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
                  <ShieldCheck size={13} className="text-[#A3E635]" />
                  <span>Jitsi Peer Video Active</span>
                </span>

                <button
                  onClick={handleCopyRoomId}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-[#EDE9FE] hover:text-white text-[10px] font-mono border border-white/10 transition-colors cursor-pointer"
                  title="Click to copy unique conference room identifier"
                >
                  <Copy size={11} />
                  <span>{session.roomName || `Room #${session.id}`}</span>
                  {isCopiedRoom && <span className="text-[#A3E635] text-[9px]">✓ copied</span>}
                </button>
              </div>

              {isLowTime && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/90 text-white text-[11px] font-bold backdrop-blur-md animate-pulse">
                  <Clock size={12} /> 2 mins remaining
                </span>
              )}
            </div>

            {/* Jitsi IFrame Target Mount */}
            <div
              ref={jitsiContainerRef}
              className="w-full h-full flex-1 relative min-h-0 min-w-0 bg-[#171329]"
              style={{ minHeight: '360px' }}
            />

            {/* Loading Overlay */}
            {isJitsiLoading && (
              <div className="absolute inset-0 bg-[#171329] flex flex-col items-center justify-center p-6 text-white z-20">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center mb-4 shadow-[0_8px_24px_rgba(124,58,237,0.4)] animate-pulse">
                  <Video size={30} className="text-white" />
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-1">
                  Connecting to Video Conference...
                </h3>
                <p className="text-xs text-[#EDE9FE]/70 text-center max-w-sm mb-4">
                  Initializing camera &amp; microphone permissions on meet.jit.si for room{' '}
                  <span className="font-mono text-[#C084FC]">
                    {session.roomName || `SkillBridge_P2P_${session.id}`}
                  </span>
                </p>
                <div className="flex items-center gap-2 text-xs text-[#EDE9FE]/60">
                  <RefreshCw size={14} className="animate-spin text-[#7C3AED]" />
                  <span>Establishing WebRTC peer stream</span>
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {jitsiError && (
              <div className="absolute inset-0 bg-[#171329] flex flex-col items-center justify-center p-6 text-white z-20">
                <AlertCircle size={44} className="text-[#E11D48] mb-3" />
                <h3 className="text-base font-heading font-bold text-white mb-1">
                  Video Connection Error
                </h3>
                <p className="text-xs text-[#EDE9FE]/70 text-center max-w-md mb-5 leading-relaxed">
                  {jitsiError}. Please ensure third-party cookies or pop-ups are allowed, or click below to retry.
                </p>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    onClick={initJitsiConference}
                    icon={RefreshCw}
                  >
                    Retry Connection
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10"
                    onClick={() => navigate('/dashboard/my-sessions')}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls Bar */}
          <div className="mt-3 bg-white rounded-2xl p-3 border border-[#E9E2F5] shadow-sm flex items-center justify-between gap-2 shrink-0">
            {/* Quick Status / Room metadata */}
            <div className="flex items-center gap-2 text-xs text-[#6B6680] truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] shrink-0" />
              <span className="font-semibold text-[#171329] truncate hidden sm:inline">
                {currentUser?.fullName} (You)
              </span>
              <span className="hidden sm:inline">&middot;</span>
              <span className="text-[11px] truncate">
                Jitsi controls embedded in call
              </span>
            </div>

            {/* Quick action triggers */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleAudio}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isAudioMuted
                    ? 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]'
                    : 'bg-[#F5F0FF] text-[#7C3AED] border-[#E9E2F5] hover:bg-[#EDE9FE]'
                }`}
                title={isAudioMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isAudioMuted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              <button
                onClick={handleToggleVideo}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isVideoMuted
                    ? 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]'
                    : 'bg-[#F5F0FF] text-[#7C3AED] border-[#E9E2F5] hover:bg-[#EDE9FE]'
                }`}
                title={isVideoMuted ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                {isVideoMuted ? <VideoOff size={16} /> : <Video size={16} />}
              </button>

              <button
                onClick={handleToggleScreenShare}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isScreenSharing
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-xs'
                    : 'bg-[#F5F0FF] text-[#7C3AED] border-[#E9E2F5] hover:bg-[#EDE9FE]'
                }`}
                title="Toggle Screen Sharing"
              >
                <Share2 size={16} />
              </button>

              <button
                onClick={handleToggleTileView}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isTileView
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-xs'
                    : 'bg-[#F5F0FF] text-[#7C3AED] border-[#E9E2F5] hover:bg-[#EDE9FE]'
                }`}
                title={isTileView ? 'Switch to Speaker View' : 'Switch to Tile View (See All / Self Video)'}
              >
                <LayoutGrid size={16} />
              </button>

              <div className="h-5 w-px bg-[#E9E2F5]" />

              <button
                onClick={handleLeaveCall}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#E11D48] bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FFE4E6] transition-colors cursor-pointer"
              >
                Leave Call
              </button>

              <Button
                size="sm"
                onClick={() => setShowConfirmComplete(true)}
                icon={CheckCircle2}
                className="hidden md:inline-flex"
              >
                Complete
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Panel (Doubt Details | Chat | Notes) */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-[#E9E2F5] flex flex-col shrink-0 h-[420px] lg:h-full overflow-hidden">
          {/* Side Tabs Switcher */}
          <div className="p-3 border-b border-[#E9E2F5] bg-[#FAF9FF] grid grid-cols-3 gap-1.5 shrink-0">
            <button
              onClick={() => setActiveSideTab('details')}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeSideTab === 'details'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_2px_8px_rgba(124,58,237,0.3)]'
                  : 'text-[#6B6680] hover:text-[#7C3AED] hover:bg-white'
              }`}
            >
              <Info size={13} />
              <span>Doubt</span>
            </button>

            <button
              onClick={() => setActiveSideTab('chat')}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
                activeSideTab === 'chat'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_2px_8px_rgba(124,58,237,0.3)]'
                  : 'text-[#6B6680] hover:text-[#7C3AED] hover:bg-white'
              }`}
            >
              <MessageSquare size={13} />
              <span>Chat</span>
              {session.chatMessages?.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeSideTab === 'chat' ? 'bg-white/25 text-white' : 'bg-[#EDE9FE] text-[#7C3AED]'
                }`}>
                  {session.chatMessages.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSideTab('notes')}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeSideTab === 'notes'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_2px_8px_rgba(124,58,237,0.3)]'
                  : 'text-[#6B6680] hover:text-[#7C3AED] hover:bg-white'
              }`}
            >
              <FileText size={13} />
              <span>Notes</span>
            </button>
          </div>

          {/* TAB 1: Doubt Details Panel */}
          {activeSideTab === 'details' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Question Title & Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] bg-[#F5F0FF] px-2.5 py-0.5 rounded-full border border-[#E9E2F5]">
                    {relatedDoubt?.category || 'Question Subject'}
                  </span>
                  <span className="text-xs font-bold text-[#7C3AED] flex items-center gap-1">
                    <Coins size={13} className="text-[#7C3AED]" />
                    +{session.bounty || relatedDoubt?.bounty || 25} pts
                  </span>
                </div>

                <h3 className="font-heading font-bold text-sm text-[#171329] leading-snug">
                  {session.topic}
                </h3>

                <p className="mt-2 text-xs text-[#6B6680] leading-relaxed bg-[#FAF9FF] p-3 rounded-2xl border border-[#E9E2F5] font-sans">
                  {relatedDoubt?.description ||
                    'Student requested peer walkthrough, troubleshooting, and code review during this 1-on-1 session.'}
                </p>
              </div>

              {/* Required Skills & Duration */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#9892AB] mb-2">
                  Skills &amp; Time Window
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {(session.skills || relatedDoubt?.skills || ['General']).map((s) => (
                    <Badge key={s} size="xs" variant="default">
                      {s}
                    </Badge>
                  ))}
                  <span className="text-[10px] font-semibold text-[#6B6680] bg-[#FAF9FF] px-2.5 py-0.5 rounded-full border border-[#E9E2F5]">
                    Duration: {session.duration || '15 min'}
                  </span>
                </div>
              </div>

              {/* Participant Profiles */}
              <div className="space-y-3 pt-3 border-t border-[#E9E2F5]">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#9892AB]">
                  Session Participants
                </h4>

                {/* Helper Card */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF9FF] border border-[#E9E2F5]">
                  <Avatar initials={session.helper?.initials || 'AS'} size="md" statusDot="online" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-heading font-bold text-[#171329] truncate">
                        {session.helper?.name}
                      </p>
                      <span className="text-[10px] font-bold text-[#7C3AED] bg-white px-2 py-0.5 rounded-full border border-[#E9E2F5]">
                        Mentor
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6680] truncate">{session.helper?.college}</p>
                  </div>
                </div>

                {/* Learner Card */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF9FF] border border-[#E9E2F5]">
                  <Avatar initials={session.student?.initials || currentUser.initials} size="md" statusDot="online" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-heading font-bold text-[#171329] truncate">
                        {session.student?.name || currentUser.fullName}
                      </p>
                      <span className="text-[10px] font-semibold text-[#6B6680] bg-white px-2 py-0.5 rounded-full border border-[#E9E2F5]">
                        Learner
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6680] truncate">{currentUser.college}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Live Chat Interface */}
          {activeSideTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Quick reply chips */}
              <div className="p-2.5 border-b border-[#E9E2F5] bg-[#FAF9FF]/70 flex gap-1.5 overflow-x-auto shrink-0">
                {[
                  'Screen shared!',
                  'Take a look at line 42',
                  'Makes total sense 👍',
                  'Problem solved! 🎉',
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => addSessionMessage(session.id, chip)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white text-[#6B6680] hover:text-[#7C3AED] hover:border-[#7C3AED] border border-[#E9E2F5] shrink-0 transition-colors cursor-pointer shadow-2xs"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Messages feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {session.chatMessages?.map((msg) => {
                  const isMe = msg.sender === currentUser.fullName || msg.sender === 'Kartik Mehta';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar initials={msg.initials || 'ST'} size="sm" />
                      <div
                        className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed font-sans ${
                          isMe
                            ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-xs'
                            : 'bg-[#FAF9FF] text-[#171329] border border-[#E9E2F5]'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 mb-1 text-[10px] ${
                            isMe ? 'text-[#EDE9FE] justify-end' : 'text-[#6B6680]'
                          }`}
                        >
                          <span className="font-semibold">{msg.sender}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-[#E9E2F5] bg-white flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  placeholder="Type message or code snippet..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-2xl bg-[#FAF9FF] border border-[#E9E2F5] text-xs text-[#171329] placeholder-[#9892AB] outline-none focus:border-[#7C3AED] focus:bg-white font-sans"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white hover:opacity-95 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-xs"
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Auto-saved Solution Notes */}
          {activeSideTab === 'notes' && (
            <div className="flex-1 flex flex-col p-4 space-y-3 min-h-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C3AED] bg-[#F5F0FF] px-2.5 py-0.5 rounded-full border border-[#E9E2F5]">
                  Auto-saved Notes
                </span>
                <button
                  onClick={handleCopyNotes}
                  className="px-2.5 py-1 rounded-xl text-[#7C3AED] hover:bg-[#F5F0FF] transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer border border-[#E9E2F5]"
                  title="Copy notes"
                >
                  {isCopiedNotes ? <Check size={13} className="text-[#4D7C0F]" /> : <Copy size={13} />}
                  <span>{isCopiedNotes ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-[11px] text-[#6B6680] leading-snug">
                Write solution summaries, key code snippets, and next steps with your peer. Persisted in localStorage.
              </p>

              <textarea
                rows={10}
                value={notes}
                onChange={handleNotesChange}
                placeholder="e.g. 
- Problem Cause: Red-Black tree deletion fixup failed when sibling node had double-black property.
- Solution: Perform left-rotation on sibling, swap color flags, and balance terminal node.
- Follow-up: Re-test on 15-node randomized tree."
                className="w-full flex-1 p-3.5 rounded-2xl border border-[#E9E2F5] bg-[#FAF9FF] text-xs font-mono text-[#171329] placeholder-[#9892AB] outline-none focus:border-[#7C3AED] focus:bg-white focus:shadow-[0_4px_16px_rgba(124,58,237,0.1)] transition-all resize-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal Before Completing */}
      {showConfirmComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171329]/40 backdrop-blur-xs"
            onClick={() => setShowConfirmComplete(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-[0_24px_60px_rgba(91,33,182,0.22)] border border-[#E9E2F5] z-10 animate-scale-in text-center font-sans">
            <div className="w-14 h-14 rounded-2xl bg-[#F5F0FF] text-[#7C3AED] border border-[#E9E2F5] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-xl font-heading font-extrabold text-[#171329] mb-2">
              Mark Session Complete?
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6680] leading-relaxed mb-6">
              Has the doubt been solved? Once marked complete, conference room notes are finalized, the doubt is marked resolved, and bounty points (+{session.bounty || 25} pts) will transfer to the helper.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={() => setShowConfirmComplete(false)}
              >
                Continue Call
              </Button>
              <Button
                size="md"
                className="flex-1"
                onClick={handleConfirmComplete}
              >
                Yes, Complete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
