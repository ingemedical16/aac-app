'use client';

import { useEffect } from 'react';
import { initI18n } from '../../lib/i18n';
import Board from '../../components/Board';

export default function AACPage() {
  useEffect(() => initI18n(), []);

  return (
    <div style={{ padding: 20 }}>
      <h1>AAC Communication Board</h1>
      <Board />
    </div>
  );
}
