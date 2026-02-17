
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

        <div className="p-12">
          {step === 'IDLE' && (
            <div className="space-y-10">
              <div className="group border-4 border-dashed border-slate-100 hover:border-indigo-100 rounded-[40px] p-16 text-center transition-all cursor-pointer bg-slate-50/50 hover:bg-indigo-50/20" onClick={() => setStep('UPLOADING')}>
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-slate-200 flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110">
                  <UploadCloud className="text-indigo-600 w-12 h-12" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">Drag SAP CSV Here</h4>
                <p className="text-slate-500 font-medium text-sm">Strict format validation applied upon drop</p>
                <div className="mt-8 flex items-center justify-center space-x-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                   <FileSpreadsheet size={14} />
                   <span>Supports .csv, .xlsx, .json</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-[1px] bg-slate-100"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">OR</span>
                <div className="flex-1 h-[1px] bg-slate-100"></div>
              </div>

              <button onClick={() => setStep('UPLOADING')} className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg tracking-tight hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-600/10">
                Simulate Production Load
              </button>
            </div>
          )}

          {(step === 'UPLOADING' || step === 'VALIDATING') && (
            <div className="text-center py-10 space-y-8">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto relative">
                <Loader2 className="text-indigo-600 animate-spin" size={48} />
                <span className="absolute text-[10px] font-black text-indigo-700">{progress}%</span>
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-900">{step === 'UPLOADING' ? 'Ingesting Packets...' : 'Validating Schema...'}</h4>
                <p className="text-slate-500 font-medium">Parsing SKU attributes and calculating initial classes.</p>
              </div>
              <div className="max-w-xs mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center py-10 space-y-8 animate-in zoom-in-95">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={56} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-900">Import Complete</h4>
                <p className="text-slate-500 font-medium">2,490 records successfully added to command center.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                   <span className="text-slate-500 uppercase">Schema Consistency</span>
                   <span className="text-emerald-600">99.8% OK</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                   <span className="text-slate-500 uppercase">Alerts Triggered</span>
                   <span className="text-amber-500">12 Anomalies</span>
                </div>
              </div>
              <button onClick={onLoadData} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg tracking-tight hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">
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
