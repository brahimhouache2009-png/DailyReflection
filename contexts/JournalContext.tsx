import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { blankDay, Card, dateKey, Day, initialJournal, Journal, loadJournal, saveJournal, Settings } from '@/services/journalService';
interface JournalContextValue { data: Journal; today: Day; ready: boolean; storageError: string; addHabit: (title: string) => void; removeHabit: (id: string) => void; toggleHabit: (id: string) => void; setNote: (note: string) => void; addCard: (question: string, answer: string, tag: string) => void; deleteCard: (id: string) => void; reviewCard: (id: string, remembered: boolean) => void; updateSettings: (settings: Settings) => void; addMinutes: (minutes: number) => void }
export const JournalContext = createContext<JournalContextValue | undefined>(undefined);
export function JournalProvider({ children }: { children: ReactNode }) {
 const [data, setData] = useState<Journal>(initialJournal);
 const [ready, setReady] = useState(false);
 const [storageError, setStorageError] = useState('');
 const [currentDate, setCurrentDate] = useState(dateKey());
 const writeQueue = useRef<Promise<unknown>>(Promise.resolve());
 useEffect(() => { let active = true; loadJournal().then(value => { if (active) setData(value); }).catch(() => { if (active) setStorageError('تعذّر قراءة البيانات المحفوظة. أعد فتح التطبيق قبل إضافة بيانات.'); }).finally(() => { if (active) setReady(true); }); const timer = setInterval(() => setCurrentDate(dateKey()), 30000); const sub = AppState.addEventListener('change', () => setCurrentDate(dateKey())); return () => { active = false; clearInterval(timer); sub.remove(); }; }, []);
 const loadedOnce = useRef(false);
 useEffect(() => { if (!ready) return; if (!loadedOnce.current) { loadedOnce.current = true; return; } writeQueue.current = writeQueue.current.then(() => saveJournal(data)).catch(() => setStorageError('تعذّر حفظ التغييرات على الجهاز. تحقق من مساحة التخزين.')); }, [data, ready]);
 const changeDay = (transform: (day: Day) => Day) => setData(old => { const key = dateKey(); const day = old.days.find(d => d.date === key) ?? blankDay(key); return { ...old, days: [...old.days.filter(d => d.date !== key), transform(day)] }; });
 const addHabit = (title: string) => { if (title.trim()) setData(old => ({ ...old, habits: [...old.habits, { id: `h${Date.now()}`, title: title.trim() }] })); };
 const removeHabit = (id: string) => setData(old => ({ ...old, habits: old.habits.filter(h => h.id !== id) }));
 const toggleHabit = (id: string) => changeDay(day => ({ ...day, habits: day.habits.includes(id) ? day.habits.filter(h => h !== id) : [...day.habits, id] }));
 const setNote = (note: string) => changeDay(day => ({ ...day, note }));
 const addMinutes = (minutes: number) => { if (minutes > 0) changeDay(day => ({ ...day, minutes: day.minutes + minutes })); };
 const addCard = (question: string, answer: string, tag: string) => { const card: Card = { id: `c${Date.now()}`, question: question.trim(), answer: answer.trim(), tag: tag.trim(), reviews: 0, nextReview: dateKey() }; setData(old => ({ ...old, cards: [card, ...old.cards] })); };
 const deleteCard = (id: string) => setData(old => ({ ...old, cards: old.cards.filter(c => c.id !== id) }));
 const reviewCard = (id: string, remembered: boolean) => setData(old => { const key = dateKey(); const day = old.days.find(d => d.date === key) ?? blankDay(key); const next = new Date(); next.setDate(next.getDate() + (remembered ? 1 : 0)); return { ...old, cards: old.cards.map(c => c.id === id ? { ...c, reviews: c.reviews + 1, nextReview: dateKey(next) } : c), days: [...old.days.filter(d => d.date !== key), { ...day, reviews: day.reviews + 1 }] }; });
 const updateSettings = (settings: Settings) => setData(old => ({ ...old, settings }));
 return <JournalContext.Provider value={{ data, today: data.days.find(d => d.date === currentDate) ?? blankDay(currentDate), ready, storageError, addHabit, removeHabit, toggleHabit, setNote, addCard, deleteCard, reviewCard, updateSettings, addMinutes }}>{children}</JournalContext.Provider>;
}
