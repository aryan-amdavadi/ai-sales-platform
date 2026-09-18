import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Phone, Mail, User, ShieldCheck, CheckCircle2, Clock, MapPin, StopCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function FollowUpPlanCard({ plan }: { plan?: any }) {
  if (!plan) return null;

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'SCHEDULE_MEETING': return <Calendar className="w-5 h-5 text-indigo-600" />;
      case 'CALLBACK':
      case 'RETRY_CALL': return <Phone className="w-5 h-5 text-amber-600" />;
      case 'SEND_CONTENT': return <Mail className="w-5 h-5 text-blue-600" />;
      case 'ROUTE_TO_SALES': return <User className="w-5 h-5 text-emerald-600" />;
      case 'STOP_CAMPAIGN':
      case 'SUPPRESS_OUTREACH': return <StopCircle className="w-5 h-5 text-rose-600" />;
      default: return <ShieldCheck className="w-5 h-5 text-slate-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'SCHEDULE_MEETING': return 'bg-indigo-50 border-indigo-200';
      case 'CALLBACK':
      case 'RETRY_CALL': return 'bg-amber-50 border-amber-200';
      case 'SEND_CONTENT': return 'bg-blue-50 border-blue-200';
      case 'ROUTE_TO_SALES': return 'bg-emerald-50 border-emerald-200';
      case 'STOP_CAMPAIGN':
      case 'SUPPRESS_OUTREACH': return 'bg-rose-50 border-rose-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const formattedDate = plan.scheduledFor ? format(new Date(plan.scheduledFor), 'MMM d, h:mm a') : 'Immediate';

  return (
    <Card className="p-5 bg-white border-[#DCE5EF] space-y-4 rounded-md shadow-sm mb-6" data-testid="follow-up-plan-card">
      <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3 mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold tracking-tight text-[#10233F] uppercase">
            Autonomous Follow-Up Plan
          </h3>
        </div>
        <div className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Scheduled
        </div>
      </div>

      <div className={cn("p-4 rounded-lg border", getActionColor(plan.action))}>
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white rounded-full shadow-sm">
            {getActionIcon(plan.action)}
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-bold text-sm text-slate-900">{plan.action.replace(/_/g, ' ')}</h4>
            <p className="text-xs font-medium text-slate-600">{plan.reason}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-black/5">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">When</p>
            <p className="text-xs font-semibold text-slate-900 mt-0.5">{formattedDate}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expected Outcome</p>
            <p className="text-xs font-semibold text-slate-900 mt-0.5">{plan.expectedOutcome}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Channel</p>
            <p className="text-xs font-semibold text-slate-900 mt-0.5">{plan.channel}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Owner</p>
            <p className="text-xs font-semibold text-slate-900 mt-0.5">{plan.owner.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
