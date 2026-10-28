/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GoalStatus = 'a_iniciar' | 'em_andamento' | 'concluido';

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface GoalFormData {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
}

export type StatusFilter = 'todos' | GoalStatus;

export interface StatusConfig {
  label: string;
  shortLabel: string;
  colorClass: string;
  borderClass: string;
  bgLightClass: string;
  textClass: string;
  dotColorClass: string;
}

export const STATUS_CONFIG: Record<GoalStatus, StatusConfig> = {
  a_iniciar: {
    label: 'A Iniciar',
    shortLabel: 'A Iniciar',
    colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    borderClass: 'border-amber-200',
    bgLightClass: 'bg-amber-50',
    textClass: 'text-amber-800',
    dotColorClass: 'bg-amber-500',
  },
  em_andamento: {
    label: 'Em Andamento',
    shortLabel: 'Em Andamento',
    colorClass: 'text-sky-700 bg-sky-50 border-sky-200',
    borderClass: 'border-sky-200',
    bgLightClass: 'bg-sky-50',
    textClass: 'text-sky-800',
    dotColorClass: 'bg-sky-500',
  },
  concluido: {
    label: 'Concluído',
    shortLabel: 'Concluído',
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    borderClass: 'border-emerald-200',
    bgLightClass: 'bg-emerald-50',
    textClass: 'text-emerald-800',
    dotColorClass: 'bg-emerald-500',
  },
};
