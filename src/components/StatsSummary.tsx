/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudyGoal } from '../types/studyGoal.ts';
import { Target, Clock, CheckCircle2, PlayCircle, Sparkles } from 'lucide-react';

interface StatsSummaryProps {
  goals: StudyGoal[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ goals }) => {
  const total = goals.length;
  const completed = goals.filter((g) => g.status === 'concluido').length;
  const inProgress = goals.filter((g) => g.status === 'em_andamento').length;
  const notStarted = goals.filter((g) => g.status === 'a_iniciar').length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Frase pedagógica de acolhimento baseada no progresso
  const getMotivationalMessage = () => {
    if (total === 0) {
      return 'Bem-vindo(a)! Adicione o seu primeiro objetivo para dar a largada nos estudos.';
    }
    if (percentage === 100) {
      return 'Incrível! Você concluiu todos os seus objetivos cadastrados. Que tal definir novas metas?';
    }
    if (percentage >= 50) {
      return 'Mais da metade do caminho percorrido! Mantenha a constância e o foco diário.';
    }
    if (inProgress > 0) {
      return 'Você está em movimento! Concentre-se em um objetivo de cada vez para fixar o aprendizado.';
    }
    return 'Um passo de cada vez: escolha um objetivo para iniciar hoje e marque o seu ritmo!';
  };

  return (
    <section className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Painel de contagem total e mensagem */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              Painel de Aprendizado
            </h2>
          </div>
          <p className="text-sm text-stone-600 flex items-start gap-1.5 leading-relaxed">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{getMotivationalMessage()}</span>
          </p>

          {/* Barra de progresso visual */}
          {total > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5 font-medium">
                <span>Progresso geral dos estudos</span>
                <span className="tabular-nums font-semibold text-emerald-700">{percentage}% concluído</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/60">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cartões numéricos de métricas com números tabulares */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          {/* Total Cadastrado */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 text-center min-w-[100px]">
            <span className="block text-2xl font-bold text-stone-900 tabular-nums">
              {total}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Total {total === 1 ? 'Objetivo' : 'Objetivos'}
            </span>
          </div>

          {/* A Iniciar */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-center min-w-[100px]">
            <span className="block text-2xl font-bold text-amber-800 tabular-nums flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-amber-600" />
              {notStarted}
            </span>
            <span className="text-xs text-amber-700 font-medium">A Iniciar</span>
          </div>

          {/* Em Andamento */}
          <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3 text-center min-w-[100px]">
            <span className="block text-2xl font-bold text-sky-800 tabular-nums flex items-center justify-center gap-1">
              <PlayCircle className="w-4 h-4 text-sky-600" />
              {inProgress}
            </span>
            <span className="text-xs text-sky-700 font-medium">Em Andamento</span>
          </div>

          {/* Concluídos */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-center min-w-[100px]">
            <span className="block text-2xl font-bold text-emerald-800 tabular-nums flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {completed}
            </span>
            <span className="text-xs text-emerald-700 font-medium">Concluídos</span>
          </div>
        </div>
      </div>
    </section>
  );
};
