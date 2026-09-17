'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Cpu,
  Users,
  TrendingUp,
  DollarSign,
  Zap,
  Activity,
  Calendar,
  AlertCircle,
  Briefcase,
  Target
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { DetailLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { formatDistanceToNow, format } from 'date-fns';

export default function CompanyIntelligencePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/companies/${id}`);
        if (!res.ok) throw new Error('Company not found');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCompanyData();
  }, [id]);

  if (loading) return <DetailLoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!data || !data.company) return null;

  const { company, whyNow } = data;
  const signals = company.marketSignals || [];

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'HIRING': return <Briefcase className="h-5 w-5 text-blue-500" />;
      case 'TECHNOLOGY': return <Cpu className="h-5 w-5 text-indigo-500" />;
      case 'FUNDING': return <DollarSign className="h-5 w-5 text-emerald-500" />;
      case 'GROWTH': return <TrendingUp className="h-5 w-5 text-orange-500" />;
      case 'LEADERSHIP': return <Users className="h-5 w-5 text-purple-500" />;
      case 'COMPETITOR': return <Target className="h-5 w-5 text-red-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span>{company.name} Intelligence</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              {company.industry} • {company.location} • {company.size}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Why Now & Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Why Now Engine */}
          <Card className="p-6 border-indigo-200 dark:border-indigo-900 shadow-md bg-indigo-50/50 dark:bg-indigo-950/20">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              <h2 className="text-xl font-semibold">Why Now?</h2>
            </div>
            {whyNow ? (
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Relevance Score</p>
                    <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                      {whyNow.score}/100
                    </div>
                  </div>
                  <StatusBadge 
                    status={whyNow.score >= 80 ? 'HOT' : whyNow.score >= 50 ? 'WARM' : 'COLD'} 
                  />
                </div>
                <p className="text-sm font-medium leading-relaxed bg-white dark:bg-black/40 p-4 rounded-lg border">
                  {whyNow.rationale}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No actionable timing signals detected.</p>
            )}
          </Card>

          {/* Company Overview */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <span>Company Overview</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {company.description || 'No description available.'}
            </p>
            {company.domain && (
              <a href={`https://${company.domain}`} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">
                {company.domain}
              </a>
            )}
          </Card>

          {/* Quick Stats / Signals */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <Cpu className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
              <p className="text-xs text-muted-foreground mb-1">Tech Stack</p>
              <p className="font-medium text-sm truncate">{company.techStack || 'Unknown'}</p>
            </Card>
            <Card className="p-4 text-center">
              <Briefcase className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-xs text-muted-foreground mb-1">Hiring Trend</p>
              <p className="font-medium text-sm truncate">{company.hiringSignals || 'Stable'}</p>
            </Card>
            <Card className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <p className="text-xs text-muted-foreground mb-1">Growth</p>
              <p className="font-medium text-sm truncate">{company.growthSignals || 'Unknown'}</p>
            </Card>
            <Card className="p-4 text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
              <p className="text-xs text-muted-foreground mb-1">Funding</p>
              <p className="font-medium text-sm truncate">{company.fundingSignals || 'Private'}</p>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN: Market Signals Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <Activity className="h-6 w-6 text-indigo-500" />
                <span>Market Signals Timeline</span>
              </h2>
              <div className="text-sm text-muted-foreground">
                {signals.length} Signals Detected
              </div>
            </div>

            {signals.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg bg-muted/20">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-1">No Signals Found</h3>
                <p className="text-muted-foreground text-sm">Our intelligence engine hasn't detected any recent market activity for this company.</p>
              </div>
            ) : (
              <div className="relative border-l border-border ml-3 space-y-8 pb-4">
                {signals.map((signal: any, idx: number) => (
                  <div key={signal.id} className="relative pl-8">
                    {/* Timeline Node */}
                    <div className="absolute -left-4 top-1 bg-background border-2 border-border rounded-full p-1.5 shadow-sm">
                      {getSignalIcon(signal.type)}
                    </div>
                    
                    <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase px-2 py-1 bg-muted rounded-md">
                            {signal.type}
                          </span>
                          <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-md">
                            Relevance: {signal.relevance}/100
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground space-x-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDistanceToNow(new Date(signal.discoveredAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-semibold mb-2">{signal.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {signal.details}
                      </p>
                      
                      <div className="flex items-center justify-between border-t pt-3 mt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="font-medium mr-2">Source:</span>
                          {signal.sourceUrl ? (
                            <a href={signal.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                              {signal.source}
                            </a>
                          ) : (
                            <span>{signal.source}</span>
                          )}
                        </div>
                        <div className="text-xs flex items-center space-x-1">
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className={`font-medium ${signal.confidence >= 90 ? 'text-emerald-500' : signal.confidence >= 70 ? 'text-yellow-500' : 'text-orange-500'}`}>
                            {signal.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
