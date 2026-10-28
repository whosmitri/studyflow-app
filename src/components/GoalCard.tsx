/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudyGoal, STATUS_CONFIG } from '../types/studyGoal.ts';
import {
  Calendar,
  Pencil,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react';

interface GoalCardProps {
  goal: StudyGoal;
  onEdit: (goal: StudyGoal) => void;
  onRequestDelete: (goal: StudyGoal) => void;
  onToggleStatus: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onRequestDelete,
  onToggleStatus,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusInfo = STATUS_CONFIG[goal.status];

  // Formatação amigável da data de prazo em português do Brasil
  const formatDeadline = (dateStr: string) => {
    if (!dateStr) return { formatted: 'Sem prazo definido', isOverdue: false, isNear: false, label: '' };

    // data no formato YYYY-MM-DD
    const [year, month, day] = dateStr.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day, 23, 59, 59);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatted = deadlineDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isOverdue = diffDays < 0 && goal.status !== 'concluido';
    const isToday = diffDays === 0 && goal.status !== 'concluido';
    const isTomorrow = diffDays === 1 && goal.status !== 'concluido';
    const isNear = diffDays > 1 && diffDays <= 3 && goal.status !== 'concluido';

    let urgencyLabel = '';
    if (goal.status === 'concluido') {
      urgencyLabel = 'Finalizado';
    } else if (isOverdue) {
      urgencyLabel = `Atrasado há ${Math.abs(diffDays)} dia(s)`;
    } else if (isToday) {
      urgencyLabel = 'Vence hoje!';
    } else if (isTomorrow) {
      urgencyLabel = 'Vence amanhã';
    } else if (isNear) {
      urgencyLabel = `Restam ${diffDays} dias`;
    }

    return { formatted, isOverdue, isNear: isNear || isToday || isTomorrow, label: urgencyLabel };
  };

  const deadlineInfo = formatDeadline(goal.deadline);
  const isCompleted = goal.status === 'concluido';

  return (
    <article
      className={`bg-white rounded-xl border transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs group ${
        isCompleted
          ? 'border-emerald-200/80 bg-emerald-50/20'
          : deadlineInfo.isOverdue
          ? 'border-rose-200'
          : 'border-stone-200 hover:border-stone-300'
      }`}
    >
      <div>
        {/* Cabeçalho do Card: Status & Ações Rápidas */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          {/* Status Badge sem pílula genérica, com indicador claro */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleStatus(goal.id)}
              type="button"
              className={`text-xs font-medium px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${statusInfo.colorClass}`}
              title="Clique para avançar o status deste objetivo"
              aria-label={`Status: ${statusInfo.label}. Clique para alterar.`}
            >
              {goal.status === 'a_iniciar' && <Clock className="w-3.5 h-3.5" />}
              {goal.status === 'em_andamento' && <PlayCircle className="w-3.5 h-3.5" />}
              {goal.status === 'concluido' && <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>{statusInfo.label}</span>
            </button>

            {/* Aviso de Prazo se estiver atrasado ou próximo */}
            {deadlineInfo.label && (
              <span
                className={`text-xs font-medium flex items-center gap-1 ${
                  deadlineInfo.isOverdue
                    ? 'text-rose-600'
                    : isCompleted
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              >
                {deadlineInfo.isOverdue && <AlertCircle className="w-3.5 h-3.5" />}
                <span>{deadlineInfo.label}</span>
              </span>
            )}
          </div>

          {/* Botões de Ação: Editar e Excluir */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-70 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(goal)}
              type="button"
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
              title="Editar objetivo"
              aria-label={`Editar ${goal.title}`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRequestDelete(goal)}
              type="button"
              className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
              title="Excluir objetivo"
              aria-label={`Excluir ${goal.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-semibold text-stone-900 leading-snug break-words ${
            isCompleted ? 'line-through text-stone-400' : ''
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição do Objetivo */}
        {goal.description && (
          <div className="mt-2 text-stone-600 text-xs sm:text-sm leading-relaxed">
            <p
              className={`break-words whitespace-pre-line ${
                !isExpanded && goal.description.length > 130 ? 'line-clamp-2' : ''
              }`}
            >
              {goal.description}
            </p>
            {goal.description.length > 130 && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
              >
                <span>{isExpanded ? 'Mostrar menos' : 'Ler mais'}</span>
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Rodapé do Card: Prazo e Ação Rápida de Conclusão */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2 text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-medium text-stone-700">{deadlineInfo.formatted}</span>
        </div>

        {/* Botão rápido para marcar como concluído */}
        <button
          type="button"
          onClick={() => onToggleStatus(goal.id)}
          className={`flex items-center gap-1 font-medium transition-colors px-2 py-1 rounded text-xs cursor-pointer ${
            isCompleted
              ? 'text-stone-500 hover:text-stone-700'
              : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          {isCompleted ? (
            <>
              <span>Reabrir</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Concluir</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
