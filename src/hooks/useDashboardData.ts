import {
  activeAutomations,
  agents,
  navigationItems,
  stats,
} from '../data/mockData'

export function useDashboardData() {
  return {
    navigationItems,
    stats,
    activeAutomations,
    agents,
  }
}