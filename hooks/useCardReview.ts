import { useMemo, useState } from 'react';
import { dateKey } from '@/services/journalService';
import { useJournal } from './useJournal';
export function useCardReview() {
 const { data, reviewCard, addCard } = useJournal();
 const [query, setQuery] = useState('');
 const [filter, setFilter] = useState<'all' | 'due'>('all');
 const [activeId, setActiveId] = useState<string | null>(null);
 const [revealed, setRevealed] = useState(false);
 const [formVisible, setFormVisible] = useState(false);
 const [question, setQuestion] = useState('');
 const [answer, setAnswer] = useState('');
 const [tag, setTag] = useState('');
 const [error, setError] = useState('');
 const due = data.cards.filter(c => c.nextReview <= dateKey());
 const cards = useMemo(() => data.cards.filter(c => (filter === 'all' || c.nextReview <= dateKey()) && `${c.question} ${c.answer} ${c.tag}`.toLowerCase().includes(query.toLowerCase())), [data.cards, filter, query]);
 const active = data.cards.find(c => c.id === activeId);
 const openReview = (id?: string) => { setActiveId(id ?? due[0]?.id ?? null); setRevealed(false); };
 const rate = (remembered: boolean) => { if (activeId) reviewCard(activeId, remembered); setActiveId(null); setRevealed(false); };
 const submit = () => { if (!question.trim() || !answer.trim()) { setError('أضف السؤال والإجابة قبل حفظ البطاقة.'); return; } addCard(question, answer, tag); setQuestion(''); setAnswer(''); setTag(''); setError(''); setFormVisible(false); };
 return { cards, due, query, setQuery, filter, setFilter, active, openReview, closeReview: () => setActiveId(null), revealed, setRevealed, rate, formVisible, setFormVisible, question, setQuestion, answer, setAnswer, tag, setTag, error, submit };
}
