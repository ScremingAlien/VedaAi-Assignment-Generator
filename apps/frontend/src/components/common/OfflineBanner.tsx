'use client';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function OfflineBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
      You are offline. Please check your internet connection.
    </div>
  );
}
