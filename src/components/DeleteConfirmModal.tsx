/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { StudyGoal } from '../types/studyGoal.ts';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  goal: StudyGoal | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  goal,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
        className="bg-white rounded-2xl border border-stone-200 shadow-xl w-full max-w-md overflow-hidden p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Cancelar e fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 id="delete-dialog-title" className="text-base font-bold text-stone-900">
            Confirmar exclusão de objetivo
          </h3>
          <p id="delete-dialog-desc" className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            Você tem certeza de que deseja excluir o objetivo:{' '}
            <strong className="text-stone-800 break-words font-semibold">"{goal.title}"</strong>?
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Esta ação removerá este objetivo permanentemente da sua lista.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4.5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sim, excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
