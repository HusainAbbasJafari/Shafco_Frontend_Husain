'use client';

import { useState } from 'react';
import { GlobalProvider } from './context/GlobalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from './context/ShowNotification';

import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '@/store/store';


export function Providers({ children }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <GlobalProvider>
                        <NotificationProvider>
                            {children}
                        </NotificationProvider>
                    </GlobalProvider>
                </QueryClientProvider>
            </PersistGate>
        </ReduxProvider>
    );
}
