import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Building2, User, FileText, Target, Activity, Megaphone, 
  PhoneCall, CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function OpportunityGraph({ opportunity }: { opportunity: any }) {
  if (!opportunity) return null;

  const company = opportunity.company;
  const req = opportunity.requirements?.[0];
  const enrollments = opportunity.enrollments || [];
  const activeCampaign = enrollments.length > 0 ? enrollments[0].campaign : null;
  const recentCall = opportunity.calls?.[0];

  return (
    <Card className="p-6 bg-[#F8FAFC] border-[#E2E8F0] w-full overflow-x-auto" data-testid="opportunity-graph">
      <div className="min-w-[800px]">
        
        {/* Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-[#1E293B] uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#3B82F6]" />
              Intent Relationship Graph
            </h3>
            <p className="text-xs text-[#64748B] mt-1">Tracing the intelligence signals driving this opportunity.</p>
          </div>
          <div className="px-3 py-1 rounded bg-white border border-[#E2E8F0] shadow-sm text-xs font-semibold text-[#334155]">
            Intent Score: {opportunity.intentScore}
          </div>
        </div>

        {/* Graph Layout */}
        <div className="flex items-start justify-center gap-4 relative py-6">
          
          {/* SVG Connectors Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
             <svg width="100%" height="100%" className="opacity-40">
               {/* Line from Company to Req */}
               <path d="M 220 50 L 300 50" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4" fill="none" />
               {/* Line from Req to DM */}
               <path d="M 500 50 L 580 50" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4" fill="none" />
               
               {/* Line down to Action */}
               <path d="M 680 90 L 680 140 L 400 140 L 400 170" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4" fill="none" />
               <path d="M 400 240 L 400 280" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4" fill="none" />
             </svg>
          </div>

          {/* LAYER 1: Discovery & Identity */}
          
          {/* Node: Company */}
          <div className="z-10 w-[200px] flex flex-col items-center">
            <div className="w-12 h-12 bg-white border-2 border-[#E2E8F0] rounded-xl flex items-center justify-center shadow-sm mb-3 relative">
               <Building2 className="w-6 h-6 text-[#475569]" />
               {company?.marketSignals?.length > 0 && (
                 <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#3B82F6] rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white">
                   {company.marketSignals.length}
                 </div>
               )}
            </div>
            <div className="text-center bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-sm w-full">
              <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Company</p>
              <h4 className="text-sm font-semibold text-[#0F172A] truncate">{company?.name}</h4>
              <p className="text-[11px] text-[#475569] truncate mt-0.5">{company?.industry}</p>
            </div>
            {/* Context Tooltip equivalent */}
            <div className="mt-2 bg-[#EFF6FF] px-2 py-1 rounded text-[10px] text-[#1D4ED8] font-medium text-center">
              Target ICP Match
            </div>
          </div>

          <div className="z-10 mt-6 text-[#94A3B8]">
             <ArrowRight className="w-5 h-5" />
          </div>

          {/* Node: Requirement */}
          <div className="z-10 w-[200px] flex flex-col items-center">
            <div className="w-12 h-12 bg-white border-2 border-[#E2E8F0] rounded-xl flex items-center justify-center shadow-sm mb-3">
               <FileText className="w-6 h-6 text-[#10B981]" />
            </div>
            <div className="text-center bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-sm w-full">
              <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Public Need</p>
              <h4 className="text-sm font-semibold text-[#0F172A] truncate" title={req?.title}>{req?.title || 'Unknown Need'}</h4>
              <p className="text-[11px] text-[#475569] truncate mt-0.5">{req?.category || 'General'}</p>
            </div>
            <div className="mt-2 bg-[#ECFDF5] px-2 py-1 rounded text-[10px] text-[#047857] font-medium text-center">
              Solution Fit Identified
            </div>
          </div>

          <div className="z-10 mt-6 text-[#94A3B8]">
             <ArrowRight className="w-5 h-5" />
          </div>

          {/* Node: Decision Maker */}
          <div className="z-10 w-[200px] flex flex-col items-center">
            <div className="w-12 h-12 bg-white border-2 border-[#E2E8F0] rounded-xl flex items-center justify-center shadow-sm mb-3">
               <User className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <div className="text-center bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-sm w-full">
              <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Decision Maker</p>
              <h4 className="text-sm font-semibold text-[#0F172A] truncate">{opportunity.name}</h4>
              <p className="text-[11px] text-[#475569] truncate mt-0.5">{opportunity.title}</p>
            </div>
            <div className="mt-2 bg-[#F5F3FF] px-2 py-1 rounded text-[10px] text-[#6D28D9] font-medium text-center">
              Authority Verified
            </div>
          </div>

        </div>

        {/* LAYER 2: Action & Outcome */}
        <div className="flex flex-col items-center mt-4 relative z-10">
           
           {/* Node: Campaign / Call */}
           <div className="w-[300px] flex flex-col items-center">
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 bg-white border-2 border-[#E2E8F0] rounded-full flex items-center justify-center shadow-sm">
                   <Megaphone className="w-5 h-5 text-[#F59E0B]" />
                 </div>
                 <div className="w-10 h-10 bg-white border-2 border-[#E2E8F0] rounded-full flex items-center justify-center shadow-sm">
                   <PhoneCall className="w-5 h-5 text-[#3B82F6]" />
                 </div>
              </div>
              <div className="text-center bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-sm w-full">
                <p className="text-[10px] font-bold text-[#64748B] uppercase mb-2">Orchestration & Outreach</p>
                
                {activeCampaign ? (
                  <div className="flex items-center justify-between text-xs border-b border-[#F1F5F9] pb-2 mb-2">
                    <span className="text-[#475569]">Campaign</span>
                    <span className="font-semibold text-[#0F172A] truncate max-w-[120px]">{activeCampaign.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs border-b border-[#F1F5F9] pb-2 mb-2 text-[#94A3B8]">
                    <span>Campaign</span>
                    <span>Not Enrolled</span>
                  </div>
                )}
                
                {recentCall ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#475569]">Last Call</span>
                    <span className={cn("font-semibold", recentCall.status === 'COMPLETED' ? 'text-[#10B981]' : 'text-[#64748B]')}>
                      {recentCall.status}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                    <span>Calls</span>
                    <span>No Attempts</span>
                  </div>
                )}
              </div>
           </div>

           <div className="h-10 border-l-2 border-dashed border-[#94A3B8] my-2" />

           {/* Node: Final Outcome */}
           <div className="w-[200px] text-center bg-white p-3 rounded-lg border-2 border-[#3B82F6] shadow-sm">
             <p className="text-[10px] font-bold text-[#3B82F6] uppercase mb-1 flex justify-center items-center gap-1">
               <Target className="w-3 h-3" /> Current Status
             </p>
             <h4 className="text-base font-black text-[#0F172A]">{opportunity.status}</h4>
           </div>

        </div>

      </div>
    </Card>
  );
}
