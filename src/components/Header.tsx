/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  totalGoals: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal, totalGoals }) => {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-stone-900">
                StudyFlow
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
                Iniciante
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Organize seus estudos com clareza e sem complicação
            </p>
          </div>
        </div>

        {/* Primary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateModal}
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-sm rounded-lg transition-colors shadow-xs whitespace-nowrap cursor-pointer"
            aria-label="Cadastrar novo objetivo de estudo"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
