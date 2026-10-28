/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudyGoal, GoalFormData } from '../types/studyGoal.ts';

const STORAGE_KEY = 'studyflow_goals_v1';
const INITIALIZED_KEY = 'studyflow_has_initialized_v1';

/**
 * Exemplos acolhedores e pedagógicos para estudantes iniciantes
 * que abrem a aplicação pela primeira vez.
 */
export const STARTER_GOALS: StudyGoal[] = [
  {
    id: 'starter-1',
    title: 'Dominar a estrutura básica de HTML e CSS',
    description: 'Estudar tags semânticas (<header>, <main>, <footer>) e criar uma página simples com layout responsivo utilizando flexbox.',
    deadline: '2026-11-05',
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'starter-2',
    title: 'Praticar lógica de programação e funções',
    description: 'Resolver 5 exercícios diários de algoritmos básicos (laços de repetição, condicionais e manipulação de arrays).',
    deadline: '2026-11-12',
    status: 'a_iniciar',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'starter-3',
    title: 'Configurar o ambiente de estudos e editor de código',
    description: 'Instalar o VS Code, extensões essenciais para iniciantes e criar uma pasta organizada no computador para os projetos.',
    deadline: '2026-10-25',
    status: 'concluido',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

class StorageService {
  /**
   * Recupera todos os objetivos salvos no localStorage.
   * Se for o primeiro acesso da pessoa, carrega objetivos de exemplo introdutórios.
   */
  public getGoals(): StudyGoal[] {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      const hasInitialized = localStorage.getItem(INITIALIZED_KEY);

      if (!hasInitialized) {
        // Primeiro acesso: inicializa com exemplos acolhedores
        this.saveGoals(STARTER_GOALS);
        localStorage.setItem(INITIALIZED_KEY, 'true');
        return STARTER_GOALS;
      }

      if (!rawData) {
        return [];
      }

      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler dados do localStorage:', error);
      return [];
    }
  }

  /**
   * Salva a lista de objetivos no localStorage.
   */
  public saveGoals(goals: StudyGoal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      localStorage.setItem(INITIALIZED_KEY, 'true');
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  /**
   * Cadastra um novo objetivo de estudo.
   */
  public createGoal(data: GoalFormData): StudyGoal {
    const goals = this.getGoals();
    const now = new Date().toISOString();
    
    // Geração de ID seguro
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : 'goal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);

    const newGoal: StudyGoal = {
      id,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };

    const updatedGoals = [newGoal, ...goals];
    this.saveGoals(updatedGoals);
    return newGoal;
  }

  /**
   * Atualiza as informações de um objetivo existente.
   */
  public updateGoal(id: string, data: Partial<GoalFormData>): StudyGoal | null {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === id);

    if (index === -1) {
      return null;
    }

    const current = goals[index];
    const updatedGoal: StudyGoal = {
      ...current,
      title: data.title !== undefined ? data.title.trim() : current.title,
      description: data.description !== undefined ? data.description.trim() : current.description,
      deadline: data.deadline !== undefined ? data.deadline : current.deadline,
      status: data.status !== undefined ? data.status : current.status,
      updatedAt: new Date().toISOString(),
    };

    goals[index] = updatedGoal;
    this.saveGoals(goals);
    return updatedGoal;
  }

  /**
   * Alterna rapidamente o status de um objetivo (atalho de 1 clique).
   */
  public toggleGoalStatus(id: string): StudyGoal | null {
    const goals = this.getGoals();
    const target = goals.find((g) => g.id === id);
    if (!target) return null;

    let nextStatus: StudyGoal['status'] = 'a_iniciar';
    if (target.status === 'a_iniciar') nextStatus = 'em_andamento';
    else if (target.status === 'em_andamento') nextStatus = 'concluido';
    else if (target.status === 'concluido') nextStatus = 'a_iniciar';

    return this.updateGoal(id, { status: nextStatus });
  }

  /**
   * Exclui um objetivo pelo seu identificador.
   */
  public deleteGoal(id: string): boolean {
    const goals = this.getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length === goals.length) {
      return false;
    }
    this.saveGoals(filtered);
    return true;
  }

  /**
   * Recarrega os exemplos iniciais para auxiliar o estudante.
   */
  public resetToStarters(): StudyGoal[] {
    this.saveGoals(STARTER_GOALS);
    return [...STARTER_GOALS];
  }

  /**
   * Limpa todos os objetivos.
   */
  public clearAll(): void {
    this.saveGoals([]);
  }
}

export const storageService = new StorageService();
