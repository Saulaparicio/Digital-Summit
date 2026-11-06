import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { TimeControls } from './components/TimeControls';
import { AgendaTimeline } from './components/AgendaTimeline';
import { StageTimerView } from './components/StageTimerView';
import { DelegatesView } from './components/DelegatesView';
import { SummitInfoView } from './components/SummitInfoView';
import { HistoryView } from './components/HistoryView';
import { LiveAlertPopup } from './components/LiveAlertPopup';
import { EditActivityModal } from './components/EditActivityModal';
import { CheckInModal } from './components/CheckInModal';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OFFICIAL_SUMMIT_AGENDA, DELEGATES_LIST } from './data/summitData';
import { AgendaItem, Delegate } from './types/agenda';
import { 
  minutesToTimeString, 
  timeStringToMinutes, 
  getActiveAndNextActivities, 
  shiftScheduleTimes,
  formatTo12Hour
} from './utils/timeUtils';
import { soundEngine } from './utils/audio';
import { triggerSummitConfetti } from './utils/confetti';

export default function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState<'agenda' | 'stage' | 'history' | 'delegates' | 'info'>('agenda');

  // Agenda State with LocalStorage Persistence
  const [agenda, setAgenda] = useState<AgendaItem[]>(() => {
    try {
      const saved = localStorage.getItem('summit_agenda_pnm26');
      return saved ? JSON.parse(saved) : OFFICIAL_SUMMIT_AGENDA;
    } catch {
      return OFFICIAL_SUMMIT_AGENDA;
    }
  });

  // Delegates & Attendance State with LocalStorage Persistence
  const [delegates, setDelegates] = useState<Delegate[]>(() => {
    try {
      const saved = localStorage.getItem('summit_custom_delegates');
      const customList: Delegate[] = saved ? JSON.parse(saved) : [];
      const baseList = [...DELEGATES_LIST, ...customList];
      const savedPhotos = JSON.parse(localStorage.getItem('summit_delegate_photos') || '{}');
      return baseList.map(d => savedPhotos[d.id] ? { ...d, photoUrl: savedPhotos[d.id] } : d);
    } catch {
      return DELEGATES_LIST;
    }
  });

  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('summit_checked_in_delegates');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [myDelegateId, setMyDelegateId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('summit_my_delegate_id');
    } catch {
      return null;
    }
  });

  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState<boolean>(false);
  const [selectedCheckInDelegateId, setSelectedCheckInDelegateId] = useState<string | null>(null);

  // Splash, Onboarding & Welcome Flow States
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('summit_splash_seen') !== 'true';
    } catch {
      return true;
    }
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      return localStorage.getItem('summit_onboarding_completed') !== 'true';
    } catch {
      return false;
    }
  });

  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    try {
      sessionStorage.setItem('summit_splash_seen', 'true');
    } catch {}

    try {
      const onboardingDone = localStorage.getItem('summit_onboarding_completed') === 'true';
      if (!onboardingDone) {
        setShowOnboarding(true);
      } else {
        setShowWelcome(true);
      }
    } catch {
      setShowWelcome(true);
    }
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
    try {
      localStorage.setItem('summit_onboarding_completed', 'true');
    } catch {}
    setShowWelcome(true);
  }, []);

  // Time & Simulation State
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  // Default simulated time: 08:45 (8:45 AM, 5 minutes before Abel Márquez devotional at 8:50 AM)
  const [simulatedMinutes, setSimulatedMinutes] = useState<number>(8 * 60 + 45);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [realSecondsOfDay, setRealSecondsOfDay] = useState<number>(() => {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  });

  // Sound & Desktop Notification Preferences
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  // Popup & Alert State
  const [activeAlertActivity, setActiveAlertActivity] = useState<AgendaItem | null>(null);
  const [alertSecondsUntilStart, setAlertSecondsUntilStart] = useState<number | null>(null);
  const [snoozeUntilSeconds, setSnoozeUntilSeconds] = useState<number | null>(null);
  const alertedStagesRef = useRef<Set<string>>(new Set());

  // Highlighting & Editing State
  const [targetHighlightId, setTargetHighlightId] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<AgendaItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // Sync sound engine mute status
  useEffect(() => {
    soundEngine.isMuted = soundMuted;
  }, [soundMuted]);

  // Persist agenda updates
  const updateAgenda = useCallback((newAgenda: AgendaItem[]) => {
    setAgenda(newAgenda);
    try {
      localStorage.setItem('summit_agenda_pnm26', JSON.stringify(newAgenda));
    } catch {}
  }, []);

  // Real-time clock tick (every second)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setRealSecondsOfDay(now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulation clock tick (when in simulation mode)
  useEffect(() => {
    if (!isSimulated || !isPlaying) return;

    const intervalTimeMs = 1000 / simulationSpeed;
    const simInterval = setInterval(() => {
      setSimulatedMinutes((prev) => {
        // Wrap around at 19:00
        const next = prev + 1 / 60; // 1 second in minutes
        if (next >= 19 * 60) return 7 * 60 + 45;
        return next;
      });
    }, intervalTimeMs);

    return () => clearInterval(simInterval);
  }, [isSimulated, isPlaying, simulationSpeed]);

  // Effective seconds of day based on mode
  const currentSecondsOfDay = useMemo(() => {
    if (isSimulated) {
      return Math.floor(simulatedMinutes * 60);
    }
    return realSecondsOfDay;
  }, [isSimulated, simulatedMinutes, realSecondsOfDay]);

  // Current formatted digital time (HH:mm:ss)
  const currentFormattedTime = useMemo(() => {
    const hrs = Math.floor(currentSecondsOfDay / 3600) % 24;
    const mins = Math.floor((currentSecondsOfDay % 3600) / 60);
    const secs = Math.floor(currentSecondsOfDay % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [currentSecondsOfDay]);

  // Determine active and next activities
  const { currentActivity, nextActivity, nextActivitySeconds } = useMemo(() => {
    return getActiveAndNextActivities(agenda, currentSecondsOfDay);
  }, [agenda, currentSecondsOfDay]);

  // Count of activities concluded so far
  const completedCount = useMemo(() => {
    return agenda.filter((item) => {
      const endSec = timeStringToMinutes(item.endTime) * 60;
      return currentSecondsOfDay >= endSec;
    }).length;
  }, [agenda, currentSecondsOfDay]);

  // Overall Summit Event Progress (from earliest start time to latest end time)
  const { eventProgressPercent, eventStartTimeStr, eventEndTimeStr } = useMemo(() => {
    if (!agenda.length) {
      return { eventProgressPercent: 0, eventStartTimeStr: '07:45', eventEndTimeStr: '18:00' };
    }
    const startMins = Math.min(...agenda.map((a) => timeStringToMinutes(a.startTime)));
    const endMins = Math.max(...agenda.map((a) => timeStringToMinutes(a.endTime)));
    const startSec = startMins * 60;
    const endSec = endMins * 60;
    const totalDuration = endSec - startSec;

    let pct = 0;
    if (totalDuration > 0) {
      if (currentSecondsOfDay <= startSec) {
        pct = 0;
      } else if (currentSecondsOfDay >= endSec) {
        pct = 100;
      } else {
        pct = ((currentSecondsOfDay - startSec) / totalDuration) * 100;
      }
    }

    const startH = Math.floor(startMins / 60);
    const startM = startMins % 60;
    const endH = Math.floor(endMins / 60);
    const endM = endMins % 60;
    const startStr = `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`;
    const endStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

    return {
      eventProgressPercent: Math.min(100, Math.max(0, pct)),
      eventStartTimeStr: startStr,
      eventEndTimeStr: endStr,
    };
  }, [agenda, currentSecondsOfDay]);

  const handleJumpToSimulatedTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    setSimulatedMinutes(h * 60 + m);
    if (!isSimulated) setIsSimulated(true);
  };

  // Real-time Alert & Popup Trigger Logic
  useEffect(() => {
    // If an alert popup is open, dynamically update its countdown against currentSecondsOfDay
    if (activeAlertActivity) {
      const startSec = timeStringToMinutes(activeAlertActivity.startTime) * 60;
      const remaining = startSec - currentSecondsOfDay;
      setAlertSecondsUntilStart(remaining);

      // Auto-dismiss 25 seconds after the activity has started so it doesn't stay indefinitely
      if (remaining < -25) {
        setActiveAlertActivity(null);
        setAlertSecondsUntilStart(null);
      }
    }

    if (!nextActivity || nextActivitySeconds === null) {
      return;
    }

    // Check if snooze is active
    if (snoozeUntilSeconds !== null && currentSecondsOfDay < snoozeUntilSeconds) {
      return;
    }

    // Alert thresholds (in seconds):
    // 300s (5 min), 120s (2 min), 60s (1 min), 0s (starting now)
    const alertThresholds = [300, 120, 60, 0];

    for (const threshold of alertThresholds) {
      const stageKey = `${nextActivity.id}_threshold_${threshold}`;

      // Check if we are within 2 seconds of this threshold and haven't alerted for this stage yet
      if (
        nextActivitySeconds <= threshold &&
        nextActivitySeconds >= threshold - 3 &&
        !alertedStagesRef.current.has(stageKey)
      ) {
        alertedStagesRef.current.add(stageKey);

        // Open Popup!
        setActiveAlertActivity(nextActivity);
        setAlertSecondsUntilStart(nextActivitySeconds);

        // Play audio chime
        if (threshold === 0) {
          soundEngine.playStartedAlert();
        } else {
          soundEngine.playApproachingAlert();
        }

        // Native browser notification if granted
        if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
          const timeText = threshold === 0 ? '¡Inicia en este momento!' : `Inicia en ${Math.round(threshold / 60)} minutos`;
          try {
            new Notification(`Digital Creator Summit: ${nextActivity.title}`, {
              body: `${timeText}. Ponente: ${nextActivity.speaker || 'Programa general'} (${formatTo12Hour(nextActivity.startTime)})`,
              icon: '/favicon.ico'
            });
          } catch {}
        }

        break;
      }
    }
  }, [nextActivity, nextActivitySeconds, currentSecondsOfDay, activeAlertActivity, alertSecondsUntilStart, snoozeUntilSeconds, notificationsEnabled]);

  // Desktop Notification Permission Toggle
  const toggleNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Tu navegador no soporta notificaciones de escritorio.');
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(!notificationsEnabled);
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  };

  // Schedule Shift Handler (+5m, +10m, -5m)
  const handleShiftSchedule = (deltaMinutes: number, fromId?: string) => {
    const shifted = shiftScheduleTimes(agenda, deltaMinutes, fromId);
    updateAgenda(shifted);
  };

  // Reset Schedule to PDF defaults
  const handleResetSchedule = () => {
    if (confirm('¿Restablecer el cronograma al horario oficial del documento PDF?')) {
      updateAgenda(OFFICIAL_SUMMIT_AGENDA);
      alertedStagesRef.current.clear();
    }
  };

  // Trigger Instant Test Alert
  const handleTriggerTestAlert = () => {
    const sample = nextActivity || agenda[2] || agenda[0];
    setActiveAlertActivity(sample);
    setAlertSecondsUntilStart(180); // 3 minutes preview
    soundEngine.playApproachingAlert();
  };

  // Navigate & Highlight Activity in Agenda
  const handleViewInAgenda = (activityId: string) => {
    setActiveView('agenda');
    setTargetHighlightId(activityId);
    setTimeout(() => {
      const el = document.getElementById(activityId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    setTimeout(() => {
      setTargetHighlightId(null);
    }, 3500);
  };

  // Snooze alert
  const handleSnooze = (minutes: number) => {
    setSnoozeUntilSeconds(currentSecondsOfDay + minutes * 60);
    setActiveAlertActivity(null);
  };

  // Edit or Save activity
  const handleSaveActivity = (item: AgendaItem) => {
    const exists = agenda.some((a) => a.id === item.id);
    let newAgenda: AgendaItem[];
    if (exists) {
      newAgenda = agenda.map((a) => (a.id === item.id ? item : a));
    } else {
      newAgenda = [...agenda, item];
    }
    updateAgenda(newAgenda);
  };

  const handleDeleteActivity = (id: string) => {
    updateAgenda(agenda.filter((a) => a.id !== id));
  };

  // Toggle check-in state
  const handleToggleCheckIn = useCallback((delegateId: string) => {
    setCheckedInIds(prev => {
      const next = new Set(prev);
      if (next.has(delegateId)) {
        next.delete(delegateId);
      } else {
        next.add(delegateId);
        soundEngine.playStartedAlert();
        triggerSummitConfetti();
      }
      try {
        localStorage.setItem('summit_checked_in_delegates', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }, []);

  const handleConfirmCheckIn = useCallback((delegateId: string, timestamp?: string) => {
    setCheckedInIds(prev => {
      const next = new Set(prev);
      next.add(delegateId);
      try {
        localStorage.setItem('summit_checked_in_delegates', JSON.stringify(Array.from(next)));
        if (timestamp) {
          const timestamps = JSON.parse(localStorage.getItem('summit_checkin_timestamps') || '{}');
          timestamps[delegateId] = timestamp;
          localStorage.setItem('summit_checkin_timestamps', JSON.stringify(timestamps));
        }
      } catch {}
      return next;
    });
    setMyDelegateId(delegateId);
    triggerSummitConfetti();
    try {
      localStorage.setItem('summit_my_delegate_id', delegateId);
    } catch {}
  }, []);

  const handleRemoveCheckIn = useCallback((delegateId: string) => {
    setCheckedInIds(prev => {
      const next = new Set(prev);
      next.delete(delegateId);
      try {
        localStorage.setItem('summit_checked_in_delegates', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
    if (myDelegateId === delegateId) {
      setMyDelegateId(null);
      try {
        localStorage.removeItem('summit_my_delegate_id');
      } catch {}
    }
  }, [myDelegateId]);

  const handleAddNewDelegate = useCallback((newDelegate: Delegate) => {
    setDelegates(prev => {
      const next = [newDelegate, ...prev];
      try {
        const saved = JSON.parse(localStorage.getItem('summit_custom_delegates') || '[]');
        localStorage.setItem('summit_custom_delegates', JSON.stringify([newDelegate, ...saved]));
      } catch {}
      return next;
    });
  }, []);

  const handleUpdateDelegatePhoto = useCallback((delegateId: string, photoUrl: string) => {
    setDelegates(prev => {
      const next = prev.map(d => d.id === delegateId ? { ...d, photoUrl } : d);
      try {
        const photos = JSON.parse(localStorage.getItem('summit_delegate_photos') || '{}');
        photos[delegateId] = photoUrl;
        localStorage.setItem('summit_delegate_photos', JSON.stringify(photos));
      } catch {}
      return next;
    });
  }, []);

  const handleOpenCheckIn = useCallback((delegateId?: string) => {
    setSelectedCheckInDelegateId(delegateId || myDelegateId || null);
    setIsCheckInModalOpen(true);
  }, [myDelegateId]);

  const myDelegate = useMemo(() => {
    if (!myDelegateId) return null;
    return delegates.find(d => d.id === myDelegateId) || null;
  }, [myDelegateId, delegates]);

  return (
    <div className="min-h-screen bg-[#1C0235] bg-grid-lines text-slate-100 flex flex-col font-sans selection:bg-[#E01E7E] selection:text-white">
      
      {/* Top Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        isSimulated={isSimulated}
        setIsSimulated={setIsSimulated}
        soundMuted={soundMuted}
        toggleSound={() => setSoundMuted(!soundMuted)}
        notificationsEnabled={notificationsEnabled}
        toggleNotifications={toggleNotifications}
        currentFormattedTime={currentFormattedTime}
        completedCount={completedCount}
        eventProgressPercent={eventProgressPercent}
        eventStartTimeStr={eventStartTimeStr}
        eventEndTimeStr={eventEndTimeStr}
        totalActivitiesCount={agenda.length}
        onOpenCheckIn={() => handleOpenCheckIn()}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenWelcome={() => setShowWelcome(true)}
        myDelegateName={myDelegate ? myDelegate.name : null}
        isMyAttendanceConfirmed={myDelegate ? checkedInIds.has(myDelegate.id) : false}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Real-time Time & Simulation Bar (always accessible) */}
        <TimeControls
          isSimulated={isSimulated}
          setIsSimulated={setIsSimulated}
          simulatedMinutes={simulatedMinutes}
          setSimulatedMinutes={setSimulatedMinutes}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          simulationSpeed={simulationSpeed}
          setSimulationSpeed={setSimulationSpeed}
          currentDisplayTime={currentFormattedTime}
          onTriggerTestAlert={handleTriggerTestAlert}
        />

        {/* View Switcher Content */}
        {activeView === 'agenda' && (
          <AgendaTimeline
            items={agenda}
            currentSecondsOfDay={currentSecondsOfDay}
            onEditActivity={(item) => {
              setEditingActivity(item);
              setIsEditModalOpen(true);
            }}
            onAddNewActivity={() => {
              setEditingActivity(null);
              setIsEditModalOpen(true);
            }}
            onShiftSchedule={handleShiftSchedule}
            onResetSchedule={handleResetSchedule}
            targetHighlightId={targetHighlightId}
          />
        )}

        {activeView === 'stage' && (
          <StageTimerView
            currentActivity={currentActivity}
            nextActivity={nextActivity}
            currentSecondsOfDay={currentSecondsOfDay}
            onShiftSchedule={handleShiftSchedule}
            onPlayChime={() => soundEngine.playApproachingAlert()}
          />
        )}

        {activeView === 'history' && (
          <HistoryView
            items={agenda}
            currentSecondsOfDay={currentSecondsOfDay}
            onViewInAgenda={handleViewInAgenda}
            onJumpToSimulatedTime={handleJumpToSimulatedTime}
          />
        )}

        {activeView === 'delegates' && (
          <DelegatesView
            delegates={delegates}
            checkedInIds={checkedInIds}
            onToggleCheckIn={handleToggleCheckIn}
            onOpenCheckInModal={handleOpenCheckIn}
          />
        )}

        {activeView === 'info' && (
          <SummitInfoView />
        )}

      </main>

      {/* Floating Real-Time Approaching Activity Popup Notification */}
      <LiveAlertPopup
        activity={activeAlertActivity}
        secondsUntilStart={alertSecondsUntilStart}
        onDismiss={() => setActiveAlertActivity(null)}
        onSnooze={handleSnooze}
        onViewInAgenda={handleViewInAgenda}
        onNavigateToStage={() => setActiveView('stage')}
        onPlayChime={() => soundEngine.playApproachingAlert()}
      />

      {/* Edit Activity Modal */}
      <EditActivityModal
        activity={editingActivity}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
      />

      {/* Self Check-In / Accreditation Modal */}
      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        delegates={delegates}
        checkedInIds={checkedInIds}
        onConfirmCheckIn={handleConfirmCheckIn}
        onRemoveCheckIn={handleRemoveCheckIn}
        onAddNewDelegate={handleAddNewDelegate}
        onUpdateDelegatePhoto={handleUpdateDelegatePhoto}
        initialSelectedDelegateId={selectedCheckInDelegateId}
      />

      {/* 1. Splash Screen with OneVoice27 Logo */}
      {showSplash && (
        <SplashScreen
          onComplete={handleSplashComplete}
          onSkip={handleSplashComplete}
        />
      )}

      {/* 2. Onboarding Modal with Essential Summit Details */}
      <OnboardingModal
        isOpen={showOnboarding && !showSplash}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingComplete}
      />

      {/* 3. Welcome Screen with In-Screen Check-In & Photo Capture */}
      <WelcomeScreen
        isOpen={showWelcome && !showSplash && !showOnboarding}
        onClose={() => setShowWelcome(false)}
        delegates={delegates}
        checkedInIds={checkedInIds}
        myDelegateId={myDelegateId}
        onConfirmCheckIn={handleConfirmCheckIn}
        onUpdateDelegatePhoto={handleUpdateDelegatePhoto}
        onOpenOnboarding={() => {
          setShowWelcome(false);
          setShowOnboarding(true);
        }}
        onOpenFullCheckInModal={() => {
          setShowWelcome(false);
          setIsCheckInModalOpen(true);
        }}
      />

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-[#3B076C]/60 bg-[#140124] py-6 text-xs text-purple-300/80 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-bold text-white">Digital Creator Summit PNM26 · Unión Adventista Panameña</span>
          <span className="font-mono text-[#00D5D8] font-bold">UnaVoz27 · En Cristo todas las cosas son nuevas</span>
          <span className="text-purple-300">Balboa, Ancón · Edif. 0844</span>
        </div>
      </footer>

    </div>
  );
}
