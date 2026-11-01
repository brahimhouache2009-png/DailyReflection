import { useCallback, useEffect, useRef, useState } from 'react';
import { useJournal } from './useJournal';
export function useFocusTimer() {
 const { data, addMinutes } = useJournal();
 const [mode, setMode] = useState<'focus' | 'rest'>('focus');
 const duration = (mode === 'focus' ? data.settings.focus : data.settings.rest) * 60;
 const [remaining, setRemaining] = useState(duration);
 const [running, setRunning] = useState(false);
 const [finished, setFinished] = useState(false);
 const end = useRef(0);
 const credited = useRef(false);
 useEffect(() => { setRemaining(duration); setRunning(false); setFinished(false); credited.current = false; }, [duration, mode]);
 useEffect(() => { if (!running) return; const tick = () => { const left = Math.max(0, Math.ceil((end.current - Date.now()) / 1000)); setRemaining(left); if (left === 0) { setRunning(false); setFinished(true); if (!credited.current && mode === 'focus') { credited.current = true; addMinutes(duration / 60); } } }; tick(); const timer = setInterval(tick, 250); return () => clearInterval(timer); }, [running, mode, duration, addMinutes]);
 const toggle = useCallback(() => { if (running) { setRemaining(Math.max(0, Math.ceil((end.current - Date.now()) / 1000))); setRunning(false); } else { const seconds = remaining === 0 ? duration : remaining; if (remaining === 0) { credited.current = false; setFinished(false); setRemaining(duration); } end.current = Date.now() + seconds * 1000; setRunning(true); } }, [running, remaining, duration]);
 const reset = useCallback(() => { setRunning(false); setRemaining(duration); setFinished(false); credited.current = false; }, [duration]);
 return { mode, setMode, remaining, running, finished, toggle, reset, progress: 1 - remaining / Math.max(1, duration) };
}
