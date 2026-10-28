/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookPlus, SearchX, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenCreate: () => void;
  onClearFilters?: () => void;
  onLoadStarters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenCreate,
  onClearFilters,
  onLoadStarters,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-500 mx-auto flex items-center justify-center mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
          Não encontramos objetivos que correspondam ao filtro ou termo de busca pesquisado.
        </p>
        {onClearFilters && (
          <div className="mt-5">
            <button
              type="button"
              onClick={onClearFilters}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
            >
              Limpar filtros e busca
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center max-w-lg mx-auto my-6 shadow-2xs">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4 border border-emerald-100">
        <BookPlus className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-stone-900">
        Nenhum objetivo cadastrado ainda
      </h3>
      <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
        O segredo de aprender com consistência é transformar grandes sonhos em pequenos passos. Cadastre seu primeiro objetivo de estudo para começar!
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onOpenCreate}
          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar primeiro objetivo</span>
        </button>

        {onLoadStarters && (
          <button
            type="button"
            onClick={onLoadStarters}
            className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Carregar exemplos sugeridos</span>
          </button>
        )}
      </div>
    </div>
  );
};
