'use client';

import { createContext, useContext } from "react";
import { toast, Toaster } from "sonner";

const NotificationContext = createContext(undefined);

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationContext must be used within a NotificationProvider");
  }
  return context;
}

export function NotificationProvider({ children }) {
  const showNotification = ({
    title,
    message,
    variant, // 'success' | 'error' | 'warning' | 'default'
    duration = 3000,
    action,
  }) => {
    toast(title || "Notification", {
      description: message,
      duration,
      action,
      variant,  // make sure this is passed
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Toaster richColors position="top-right" />
    </NotificationContext.Provider>
  );
}
