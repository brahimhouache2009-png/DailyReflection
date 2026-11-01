import { useContext } from 'react';
import { JournalContext } from '@/contexts/JournalContext';
export function useJournal() { const value = useContext(JournalContext); if (!value) throw new Error('JournalProvider is required'); return value; }
