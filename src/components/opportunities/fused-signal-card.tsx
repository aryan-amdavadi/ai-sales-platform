import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { computeFusedSignals, FusedSignal } from '@/lib/scoring/fusion';
import { ArrowDown, Plus, ShieldCheck, Zap, User, FileText, Activity, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FusedSignalCard({ opportunity }: { opportunity: any }) {
  const fusionResult = useMemo(() => computeFusedSignals(opportunity), [opportunity]);

  if (!fusionResult || fusionResult.signals.length === 0) {
    return null;
  }

  const { confidence, explanation, signals } = fusionResult;

  const getIcon = (type: FusedSignal['type']) => {
    switch (type) {
      case 'REQUIREMENT': return <FileText className="w-4 h-4 text-[#10B981]" />;
      case 'AUTHORITY': return <User className="w-4 h-4 text-[#8B5CF6]" />;
      case 'URGENCY': return <Zap className="w-4 h-4 text-[#F59E0B]" />;
      case 'MARKET_SIGNAL': return <Activity className="w-4 h-4 text-[#3B82F6]" />;
      case 'SOURCE': return <Layers className="w-4 h-4 text-[#64748B]" />;
      default: return <ShieldCheck className="w-4 h-4 text-[#64748B]" />;
    }
  };

  return (
    <Card className="p-5 bg-white border-[#DCE5EF] space-y-4 rounded-md shadow-sm mb-6" data-testid="fused-signal-card">
      <div className="flex items-center gap-2 border-b border-[#DCE5EF] pb-3 mb-4">
        <Layers className="w-4 h-4 text-[#2563EB]" />
        <h3 className="text-xs font-bold tracking-tight text-[#10233F] uppercase">
          Buying Signal Fusion
        </h3>
      </div>

      <div className="flex flex-col items-center max-w-sm mx-auto">
        
        {/* Signal Stack */}
        <div className="w-full space-y-2">
          {signals.map((signal, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md shadow-sm">
                <div className="flex-shrink-0 bg-white p-1.5 rounded-md border border-[#E2E8F0]">
                  {getIcon(signal.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#0F172A] truncate" title={signal.text}>{signal.text}</p>
                  <p className="text-[10px] text-[#64748B] uppercase font-bold mt-0.5 tracking-wider">{signal.type.replace('_', ' ')} (Weight: +{signal.weight})</p>
                </div>
              </div>

              {idx < signals.length - 1 && (
                <div className="flex justify-center -my-1 relative z-10">
                  <div className="bg-white border border-[#E2E8F0] rounded-full p-0.5 shadow-sm">
                    <Plus className="w-3 h-3 text-[#94A3B8]" />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Down Arrow */}
        <div className="my-4 text-[#3B82F6] animate-bounce">
          <ArrowDown className="w-6 h-6" />
        </div>

        {/* Fused Confidence Result */}
        <div className={cn(
          "w-full text-center p-4 rounded-lg border-2 shadow-sm",
          confidence >= 80 ? "bg-[#ECFDF5] border-[#10B981]" : 
          confidence >= 60 ? "bg-[#EFF6FF] border-[#3B82F6]" : 
          "bg-[#F8FAFC] border-[#CBD5E1]"
        )}>
          <p className={cn(
            "text-[11px] font-bold uppercase tracking-wider mb-1",
            confidence >= 80 ? "text-[#047857]" : 
            confidence >= 60 ? "text-[#1D4ED8]" : 
            "text-[#475569]"
          )}>
            Fused Opportunity Confidence
          </p>
          <h4 className={cn(
            "text-3xl font-black",
            confidence >= 80 ? "text-[#059669]" : 
            confidence >= 60 ? "text-[#2563EB]" : 
            "text-[#334155]"
          )}>
            {confidence}%
          </h4>
          <p className={cn(
            "text-xs mt-2 font-medium",
            confidence >= 80 ? "text-[#065F46]" : 
            confidence >= 60 ? "text-[#1E3A8A]" : 
            "text-[#475569]"
          )}>
            {explanation}
          </p>
        </div>

      </div>
    </Card>
  );
}
