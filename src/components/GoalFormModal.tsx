/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { StudyGoal, GoalFormData, GoalStatus } from '../types/studyGoal.ts';
import { X, Calendar, BookOpen, AlertCircle } from 'lucide-react';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  initialGoal?: StudyGoal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialGoal,
}) => {
  const isEditing = Boolean(initialGoal);

  // Data padrão para novos objetivos: 7 dias a partir de hoje
  const getDefaultDeadline = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('a_iniciar');
  const [errorMessage, setErrorMessage] = useState('');

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza dados quando abre ou muda o initialGoal
  useEffect(() => {
    if (isOpen) {
      if (initialGoal) {
        setTitle(initialGoal.title);
        setDescription(initialGoal.description || '');
        setDeadline(initialGoal.deadline || getDefaultDeadline());
        setStatus(initialGoal.status);
      } else {
        setTitle('');
        setDescription('');
        setDeadline(getDefaultDeadline());
        setStatus('a_iniciar');
      }
      setErrorMessage('');

      // Auto foco no campo de título
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialGoal]);

  // Fechar com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Por favor, informe o título do seu objetivo de estudo.');
      titleInputRef.current?.focus();
      return;
    }

    if (!deadline) {
      setErrorMessage('Por favor, defina um prazo para o seu objetivo.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Container do Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-2xl border border-stone-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-4.5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-stone-900">
                {isEditing ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
              </h2>
              <p className="text-xs text-stone-500">
                {isEditing
                  ? 'Atualize os dados e acompanhe sua evolução.'
                  : 'Defina metas claras para guiar a sua rotina.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com Scroll se necessário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 overflow-y-auto">
          {/* Alerta de Erro de Validação */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Campo: Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-semibold text-stone-800 mb-1.5">
              Título do Objetivo <span className="text-emerald-600">*</span>
            </label>
            <input
              ref={titleInputRef}
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Ex: Aprender sintaxe básica de Python, Ler cap. 2 de Biologia..."
              maxLength={120}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition-colors"
            />
            <div className="flex justify-between items-center mt-1 text-[11px] text-stone-400">
              <span>Seja específico para facilitar a execução</span>
              <span>{title.length}/120</span>
            </div>
          </div>

          {/* Campo: Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-xs font-semibold text-stone-800 mb-1.5">
              Descrição e Anotações <span className="text-stone-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione tópicos que você quer cobrir, links de materiais, capítulos de livros ou exercícios práticos..."
              className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition-colors resize-y min-h-[75px]"
            />
          </div>

          {/* Grid de 2 colunas: Prazo e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo: Prazo */}
            <div>
              <label htmlFor="goal-deadline" className="block text-xs font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>Prazo de Conclusão <span className="text-emerald-600">*</span></span>
              </label>
              <input
                id="goal-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition-colors cursor-pointer"
              />
            </div>

            {/* Campo: Status */}
            <div>
              <label htmlFor="goal-status" className="block text-xs font-semibold text-stone-800 mb-1.5">
                Status Atual
              </label>
              <select
                id="goal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="a_iniciar">A Iniciar</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          {/* Rodapé do Modal com Botões */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
