// src/types/viewMode.ts

/**
 * Defines how the application layout behaves.
 * This is NOT related to routing or permissions.
 */
export enum ViewMode {
  PUBLIC = "public",        // Home, About, Contact, Login, Register
  DASHBOARD = "dashboard",  // User / Professional / Admin dashboards
  BOARD = "board",          // AAC board (child or adult usage)
}