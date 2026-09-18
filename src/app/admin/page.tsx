'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Activity, Users, AlertTriangle } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('WORKSPACES');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchData = async (type: string) => {
    setLoading(true);
    try {
      let endpoint = '';
      if (type === 'WORKSPACES') endpoint = '/api/admin/security?type=workspaces';
      else if (type === 'FRAUD') endpoint = '/api/admin/security?type=fraud';
      else if (type === 'SECURITY') endpoint = '/api/admin/security?type=events';
      else if (type === 'AUDIT') endpoint = '/api/admin/security?type=audit';

      const res = await fetch(endpoint);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleAction = async (action: string, payload: any) => {
    setProcessing(true);
    try {
      await fetch('/api/admin/security', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload })
      });
      await fetchData(activeTab);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enterprise Admin & Security</h1>
          <p className="text-sm text-gray-500">Manage workspaces, review fraud signals, and audit platform activities.</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'WORKSPACES' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('WORKSPACES')}
        >
          Workspaces
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'FRAUD' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('FRAUD')}
        >
          <AlertTriangle className="w-4 h-4" />
          Fraud Signals
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'SECURITY' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('SECURITY')}
        >
          Security Events
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'AUDIT' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('AUDIT')}
        >
          Audit Logs
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading data...</div>
      ) : (
        <Card className="p-0 overflow-hidden">
          {activeTab === 'WORKSPACES' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-4 py-3">Workspace Name</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((ws) => (
                    <tr key={ws.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{ws.name} <span className="text-gray-400 font-normal ml-1">({ws.id})</span></td>
                      <td className="px-4 py-3 text-gray-500">{new Date(ws.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {ws.isSuspended ? (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Suspended</span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Active</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {ws.isSuspended ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={processing}
                            onClick={() => handleAction('unsuspendWorkspace', { workspaceId: ws.id })}
                          >
                            Unsuspend
                          </Button>
                        ) : (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            disabled={processing}
                            onClick={() => handleAction('suspendWorkspace', { workspaceId: ws.id, reason: 'Manual suspension' })}
                          >
                            Suspend
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'FRAUD' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-4 py-3">Signal Type</th>
                    <th className="px-4 py-3">Risk Level</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((sig) => (
                    <tr key={sig.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{sig.type}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${sig.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                          {sig.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{sig.description}</td>
                      <td className="px-4 py-3 text-gray-500">{sig.status}</td>
                      <td className="px-4 py-3">
                        {sig.status === 'OPEN' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={processing}
                            onClick={() => handleAction('resolveFraud', { id: sig.id })}
                          >
                            Resolve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No fraud signals detected.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-4 py-3">Event Type</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">IP Address</th>
                    <th className="px-4 py-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((evt) => (
                    <tr key={evt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{evt.type}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-[10px] font-bold uppercase">
                          {evt.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{evt.description}</td>
                      <td className="px-4 py-3 text-gray-500">{evt.ipAddress || 'Unknown'}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(evt.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No security events found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'AUDIT' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Actor</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Entity Type</th>
                    <th className="px-4 py-3">Entity ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{log.actor}</td>
                      <td className="px-4 py-3 text-blue-600 font-mono text-xs">{log.action}</td>
                      <td className="px-4 py-3 text-gray-500">{log.entityType}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.entityId}</td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No audit logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
