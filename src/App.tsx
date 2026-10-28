/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StudyGoal, GoalFormData, StatusFilter } from './types/studyGoal.ts';
import { storageService } from './services/storageService.ts';
import { Header } from './components/Header.tsx';
import { StatsSummary } from './components/StatsSummary.tsx';
import { GoalFilterTabs } from './components/GoalFilterTabs.tsx';
import { GoalCard } from './components/GoalCard.tsx';
import { GoalFormModal } from './components/GoalFormModal.tsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.tsx';
import { EmptyState } from './components/EmptyState.tsx';
import { NotificationToast, ToastMessage } from './components/NotificationToast.tsx';
import { Plus, Database, HeartHandshake } from 'lucide-react';

export default function App() {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filtros, busca e ordenação
  const [currentFilter, setCurrentFilter] = useState<StatusFilter>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'deadline' | 'recent' | 'alphabetical'>('deadline');

  // Estado dos Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<StudyGoal | null>(null);

  // Notificações amigáveis (Toast)
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 1. Carregar objetivos do localStorage na montagem
  useEffect(() => {
    const savedGoals = storageService.getGoals();
    setGoals(savedGoals);
    setIsLoaded(true);
  }, []);

  // 2. Manipulação de Objetivos
  const handleCreateOrUpdateGoal = (formData: GoalFormData) => {
    if (editingGoal) {
      const updated = storageService.updateGoal(editingGoal.id, formData);
      if (updated) {
        setGoals((prev) =>
          prev.map((g) => (g.id === updated.id ? updated : g))
        );
        addToast('Objetivo atualizado com sucesso!');
      }
    } else {
      const created = storageService.createGoal(formData);
      setGoals((prev) => [created, ...prev]);
      addToast('Novo objetivo de estudo cadastrado!');
    }
    setEditingGoal(null);
  };

  const handleOpenCreateModal = () => {
    setEditingGoal(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (goal: StudyGoal) => {
    setEditingGoal(goal);
    setIsFormModalOpen(true);
  };

  const handleRequestDelete = (goal: StudyGoal) => {
    setGoalToDelete(goal);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!goalToDelete) return;
    const success = storageService.deleteGoal(goalToDelete.id);
    if (success) {
      setGoals((prev) => prev.filter((g) => g.id !== goalToDelete.id));
      addToast('Objetivo excluído com sucesso.', 'info');
    }
    setIsDeleteModalOpen(false);
    setGoalToDelete(null);
  };

  const handleToggleStatus = (id: string) => {
    const updated = storageService.toggleGoalStatus(id);
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      if (updated.status === 'concluido') {
        addToast('Parabéns! Objetivo marcado como concluído! 🎉');
      } else {
        addToast('Status do objetivo atualizado.');
      }
    }
  };

  const handleLoadStarters = () => {
    const starters = storageService.resetToStarters();
    setGoals(starters);
    setCurrentFilter('todos');
    setSearchQuery('');
    addToast('Exemplos de estudo carregados com sucesso!');
  };

  // Contagens para os filtros
  const filterCounts = useMemo(() => {
    return {
      todos: goals.length,
      a_iniciar: goals.filter((g) => g.status === 'a_iniciar').length,
      em_andamento: goals.filter((g) => g.status === 'em_andamento').length,
      concluido: goals.filter((g) => g.status === 'concluido').length,
    };
  }, [goals]);

  // Filtragem e ordenação dos objetivos
  const filteredAndSortedGoals = useMemo(() => {
    return goals
      .filter((goal) => {
        // Filtro por status
        if (currentFilter !== 'todos' && goal.status !== currentFilter) {
          return false;
        }

        // Filtro por busca de texto
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = goal.title.toLowerCase().includes(query);
          const matchDesc = goal.description.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          // Prazos mais próximos primeiro; sem data vão para o final
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline.localeCompare(b.deadline);
        }
        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' });
        }
        // 'recent'
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [goals, currentFilter, searchQuery, sortBy]);

  const hasAnyGoals = goals.length > 0;
  const isFiltered = hasAnyGoals && (currentFilter !== 'todos' || searchQuery.trim().length > 0);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-medium">Carregando seus estudos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Cabeçalho Superior */}
      <Header
        onOpenCreateModal={handleOpenCreateModal}
        totalGoals={goals.length}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Painel Estatístico & Progresso Geral */}
        <StatsSummary goals={goals} />

        {/* Barra de Filtros, Busca e Ordenação */}
        {hasAnyGoals && (
          <GoalFilterTabs
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            counts={filterCounts}
          />
        )}

        {/* Lista de Cartões de Objetivos ou Estado Vazio */}
        {filteredAndSortedGoals.length > 0 ? (
          <section
            aria-label="Lista de Objetivos de Estudo"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start"
          >
            {filteredAndSortedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleOpenEditModal}
                onRequestDelete={handleRequestDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </section>
        ) : (
          <EmptyState
            isFiltered={isFiltered}
            onOpenCreate={handleOpenCreateModal}
            onClearFilters={() => {
              setCurrentFilter('todos');
              setSearchQuery('');
            }}
            onLoadStarters={handleLoadStarters}
          />
        )}

        {/* Rodapé Acolhedor de Apoio ao Estudante */}
        {hasAnyGoals && (
          <div className="pt-8 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-stone-400" />
              <span>Seus dados ficam salvos automaticamente neste navegador via LocalStorage.</span>
            </div>
            <div className="flex items-center gap-1 text-stone-600">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>StudyFlow — Um passo de cada vez no seu aprendizado.</span>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Cadastro / Edição */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleCreateOrUpdateGoal}
        initialGoal={editingGoal}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        goal={goalToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setGoalToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Notificações Amigáveis (Toast) */}
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
