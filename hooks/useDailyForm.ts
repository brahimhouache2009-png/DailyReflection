import { useState } from 'react';
import { useJournal } from './useJournal';
export function useDailyForm() { const { addHabit } = useJournal(); const [visible, setVisible] = useState(false); const [title, setTitle] = useState(''); const [error, setError] = useState(''); const submit = () => { if (!title.trim()) { setError('اكتب اسم العادة أولًا.'); return; } addHabit(title); setTitle(''); setError(''); setVisible(false); }; return { visible, setVisible, title, setTitle, error, submit }; }
