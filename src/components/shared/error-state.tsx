import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while communicating with the data server.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-red-900/40 bg-red-950/20 my-6">
      <div className="p-3.5 rounded-full bg-red-900/30 border border-red-800/60 text-red-400 mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-red-200">{title}</h4>
      <p className="text-sm text-red-300/80 max-w-sm mt-1 mb-5">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-red-800 bg-red-950/40 hover:bg-red-900/50 text-red-200 text-xs font-mono flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Request
        </Button>
      )}
    </div>
  );
}
