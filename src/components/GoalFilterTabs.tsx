/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StatusFilter, GoalStatus } from '../types/studyGoal.ts';
import { Search, ArrowUpDown, X } from 'lucide-react';

interface GoalFilterTabsProps {
  currentFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'deadline' | 'recent' | 'alphabetical';
  onSortChange: (sort: 'deadline' | 'recent' | 'alphabetical') => void;
  counts: {
    todos: number;
    a_iniciar: number;
    em_andamento: number;
    concluido: number;
  };
}

export const GoalFilterTabs: React.FC<GoalFilterTabsProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  counts,
}) => {
  const filterTabs: Array<{ id: StatusFilter; label: string; count: number }> = [
    { id: 'todos', label: 'Todos', count: counts.todos },
    { id: 'a_iniciar', label: 'A Iniciar', count: counts.a_iniciar },
    { id: 'em_andamento', label: 'Em Andamento', count: counts.em_andamento },
    { id: 'concluido', label: 'Concluídos', count: counts.concluido },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
      {/* Abas de filtro interativas */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              type="button"
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-1.5 py-0.2 rounded-full tabular-nums font-semibold ${
                  isActive ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Busca e Ordenação */}
      <div className="flex items-center gap-3">
        {/* Campo de Busca */}
        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg placeholder-stone-400 text-stone-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Seletor de Ordenação */}
        <div className="relative shrink-0">
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-stone-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent border-none text-xs sm:text-sm text-stone-700 focus:outline-none cursor-pointer pr-1"
              aria-label="Ordenar objetivos"
            >
              <option value="deadline">Prazo mais próximo</option>
              <option value="recent">Mais recentes</option>
              <option value="alphabetical">Ordem alfabética</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
