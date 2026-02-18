
import React, { useState, useEffect } from 'react';
import { X, UploadCloud, FileSpreadsheet, CheckCircle2, Loader2, AlertCircle, History } from 'lucide-react';
import { UploadLog } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoadData: () => void;
  uploadHistory: UploadLog[];
}

const UploadCentre: React.FC<Props> = ({ isOpen, onClose, onLoadData, uploadHistory }) => {
  const [step, setStep] = useState<'IDLE' | 'UPLOADING' | 'VALIDATING' | 'SUCCESS'>('IDLE');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 'UPLOADING') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setStep('VALIDATING');
            return 100;
          }
          return p + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
    if (step === 'VALIDATING') {
      setTimeout(() => setStep('SUCCESS'), 1500);
    }
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/60 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col border border-slate-200 animate-in zoom-in-95 duration-500">
        
        <div className="px-10 py-8 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Data Ingestion Engine</h3>
            <p className="text-sm text-slate-500 font-medium">Connect external SAP ERP records</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white rounded-2xl text-slate-400 hover:text-slate-900 border border-slate-100 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-12 overflow-y-auto max-h-[calc(100vh-160px)]">
          {step === 'IDLE' && (
            <div className="space-y-6 md:space-y-10">
              <div className="group border-4 border-dashed border-slate-100 hover:border-indigo-100 rounded-[30px] md:rounded-[40px] p-8 md:p-16 text-center transition-all cursor-pointer bg-slate-50/50 hover:bg-indigo-50/20" onClick={() => setStep('UPLOADING')}>
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200 flex items-center justify-center mx-auto mb-6 md:mb-8 transition-transform group-hover:scale-110">
                  <UploadCloud className="text-indigo-600 w-8 h-8 md:w-12 md:h-12" />
                </div>
                <h4 className="text-lg md:text-xl font-black text-slate-900 mb-2">Drag SAP CSV Here</h4>
                <p className="text-slate-500 font-medium text-xs md:text-sm">Strict format validation applied upon drop</p>
                <div className="mt-6 md:mt-8 flex items-center justify-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <FileSpreadsheet size={12} />
                   <span>Supports .csv, .xlsx, .json</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-[1px] bg-slate-100"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">OR</span>
                <div className="flex-1 h-[1px] bg-slate-100"></div>
              </div>

              <button onClick={() => setStep('UPLOADING')} className="w-full py-4 md:py-5 bg-slate-900 text-white rounded-2xl md:rounded-[24px] font-black text-base md:text-lg tracking-tight hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-600/10">
                Simulate Production Load
              </button>
            </div>
          )}

          {(step === 'UPLOADING' || step === 'VALIDATING') && (
            <div className="text-center py-6 md:py-10 space-y-6 md:space-y-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto relative">
                <Loader2 className="text-indigo-600 animate-spin" size={32} md:size={48} />
                <span className="absolute text-[10px] font-black text-indigo-700">{progress}%</span>
              </div>
              <div>
                <h4 className="text-xl md:text-2xl font-black text-slate-900">{step === 'UPLOADING' ? 'Ingesting Packets...' : 'Validating Schema...'}</h4>
                <p className="text-slate-500 font-medium text-xs md:text-sm">Parsing SKU attributes and calculating initial classes.</p>
              </div>
              <div className="max-w-xs mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center py-4 md:py-6 space-y-4 md:space-y-6 animate-in zoom-in-95">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10 shrink-0">
                  <CheckCircle2 className="w-8 h-8 md:w-9 md:h-9" />
                </div>
                <div className="text-left">
                  <h4 className="text-lg md:text-xl font-black text-slate-900">Import Complete</h4>
                  <p className="text-slate-500 font-medium text-xs md:text-sm">2,490 records processed from SAP ERP</p>
                </div>
              </div>

              {/* Validation Summary */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 md:p-5 rounded-3xl border border-slate-200 text-left space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-wider">Data Validation Summary</h5>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase">Completed</span>
                </div>
                
                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex sm:flex-col justify-between items-center sm:items-start">
                    <div className="text-xl md:text-2xl font-black text-emerald-600">2,341</div>
                    <div className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wide">Valid Records</div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex sm:flex-col justify-between items-center sm:items-start">
                    <div className="text-xl md:text-2xl font-black text-amber-500">87</div>
                    <div className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wide">Duplicates</div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex sm:flex-col justify-between items-center sm:items-start">
                    <div className="text-xl md:text-2xl font-black text-red-500">62</div>
                    <div className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wide">Rejected</div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden">
                  {[
                    { label: 'Original Records', val: '2,254', color: 'bg-emerald-500' },
                    { label: 'Updated Records', val: '87', color: 'bg-blue-500' },
                    { label: 'Duplicate SKUs (Merged)', val: '87', color: 'bg-amber-500' },
                    { label: 'Missing Required Fields', val: '34', color: 'bg-red-400' },
                    { label: 'Format Errors', val: '18', color: 'bg-red-500' },
                    { label: 'Invalid Data Types', val: '10', color: 'bg-purple-500' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.color}`}></div>
                        <span className="text-[10px] md:text-xs font-semibold text-slate-600">{item.label}</span>
                      </div>
                      <span className="text-[10px] md:text-xs font-black text-slate-900">{item.val}</span>
                    </div>
                  ))}
                </div>

                {/* Schema & Quality Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  <div className="bg-white p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">Schema Consistency</span>
                      <span className="text-xs font-black text-emerald-600">99.8%</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99.8%' }}></div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">Data Quality Score</span>
                      <span className="text-xs font-black text-emerald-600">97.5%</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '97.5%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Alerts Summary */}
                <div className="flex items-center justify-between bg-amber-50 px-3 md:px-4 py-2 md:py-3 rounded-xl border border-amber-100">
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={12} className="text-amber-500" />
                    <span className="text-[10px] md:text-xs font-semibold text-amber-700">12 Anomalies Detected</span>
                  </div>
                  <span className="text-[8px] md:text-[9px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">Review Recommended</span>
                </div>
              </div>

              <button onClick={onLoadData} className="w-full py-3 md:py-4 bg-emerald-600 text-white rounded-2xl font-black text-base md:text-lg tracking-tight hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">
                Finalize and Sync View
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadCentre;
