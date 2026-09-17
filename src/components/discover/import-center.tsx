'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Database, CheckCircle2, AlertCircle } from 'lucide-react';

export function ImportCenter() {
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSimulateCSVUpload = async () => {
    if (!csvText) {
      setStatus({ type: 'error', message: 'Please provide CSV content' });
      return;
    }
    
    setImporting(true);
    setStatus(null);
    
    try {
      // Very basic CSV parsing for MVP
      const lines = csvText.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const values = line.split(',');
        const row: Record<string, string> = {};
        headers.forEach((h, i) => { row[h] = values[i]?.trim() || ''; });
        return row;
      });

      // Default Mapping based on generic headers
      const mapping = headers.map(h => {
        const lower = h.toLowerCase();
        let target = 'notes';
        if (lower.includes('name')) target = 'name';
        if (lower.includes('email')) target = 'email';
        if (lower.includes('company')) target = 'company';
        if (lower.includes('title')) target = 'title';
        return { csvHeader: h, targetField: target };
      });

      const res = await fetch('/api/discover/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'CSV',
          mapping,
          rows
        })
      });

      if (!res.ok) {
        throw new Error('Failed to import CSV');
      }

      setStatus({ type: 'success', message: 'Successfully queued CSV import job!' });
      setCsvText('');
    } catch (e: any) {
      setStatus({ type: 'error', message: e.message });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Direct Lead Import</h3>
            <p className="text-sm text-slate-500">Upload lists from ZoomInfo, Apollo, or tradeshows.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Paste CSV Content</label>
            <textarea
              className="w-full h-32 p-3 border border-slate-200 rounded-md text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Name,Email,Company,Title&#10;John Doe,john@acme.com,Acme Corp,CEO"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleSimulateCSVUpload} 
            disabled={importing || !csvText}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            {importing ? 'Processing Import...' : 'Run Import Job'}
          </Button>

          {status && (
            <div className={`p-4 rounded-md flex items-center gap-2 text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {status.message}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">CRM Synchronization</h3>
              <p className="text-sm text-slate-500">Automatically ingest contacts and companies from Salesforce or HubSpot.</p>
            </div>
          </div>
          <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
            Configure Connection
          </Button>
        </div>
      </Card>
    </div>
  );
}
