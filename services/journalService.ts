import AsyncStorage from '@react-native-async-storage/async-storage';
export interface Habit { id: string; title: string }
export interface Card { id: string; question: string; answer: string; tag: string; reviews: number; nextReview: string }
export interface Day { date: string; minutes: number; reviews: number; habits: string[]; note: string }
export interface Settings { focus: number; rest: number; goal: number }
export interface Journal { habits: Habit[]; cards: Card[]; days: Day[]; settings: Settings }
const key = 'daily-review-v1';
export function dateKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
export function blankDay(date = dateKey()): Day { return { date, minutes: 0, reviews: 0, habits: [], note: '' }; }
export function initialJournal(): Journal { return { habits: [{ id: 'reading', title: 'قراءة عشر صفحات' }, { id: 'water', title: 'شرب الماء بانتظام' }, { id: 'move', title: 'المشي أو الحركة' }], cards: [], days: [], settings: { focus: 25, rest: 5, goal: 90 } }; }
export async function loadJournal(): Promise<Journal> { const raw = await AsyncStorage.getItem(key); if (!raw) return initialJournal(); const data = JSON.parse(raw); if (!data.settings || !Array.isArray(data.days) || !Array.isArray(data.cards) || !Array.isArray(data.habits)) throw new Error('invalid data'); return data; }
export async function saveJournal(data: Journal) { await AsyncStorage.setItem(key, JSON.stringify(data)); }
export function weekDays(days: Day[]): Day[] { return Array.from({ length: 7 }, (_, i) => { const date = new Date(); date.setDate(date.getDate() - (6 - i)); const key = dateKey(date); return days.find(d => d.date === key) ?? blankDay(key); }); }
export function arabicDay(date: string, short = false) { return new Date(`${date}T12:00:00`).toLocaleDateString('ar', { weekday: short ? 'short' : 'long' }); }
