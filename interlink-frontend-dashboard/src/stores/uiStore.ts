/**
 * UI Store
 * Zustand store for UI state (modals, sidebar, etc.)
 */

import { create } from 'zustand';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;

  // Modals
  activeModal: string | null;
  modalData: any;

  // Loading states
  isPageLoading: boolean;

  // Notifications
  notifications: Notification[];

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  showModal: (modalName: string, data?: any) => void;
  hideModal: () => void;

  setPageLoading: (loading: boolean) => void;

  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  sidebarOpen: true,
  activeModal: null,
  modalData: null,
  isPageLoading: false,
  notifications: [],

  // Sidebar actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Modal actions
  showModal: (modalName, data) => set({
    activeModal: modalName,
    modalData: data
  }),
  hideModal: () => set({
    activeModal: null,
    modalData: null
  }),

  // Loading actions
  setPageLoading: (loading) => set({ isPageLoading: loading }),

  // Notification actions
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        ...notification,
        id: Date.now().toString(),
      },
    ],
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),

  clearNotifications: () => set({ notifications: [] }),
}));
