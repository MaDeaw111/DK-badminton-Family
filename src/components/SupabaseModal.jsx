import React, { useState } from 'react';
import { Database, Key, X, CheckCircle2, Copy, Download, Upload, Server, ShieldCheck } from 'lucide-react';
import { SUPABASE_URL, getSupabaseAnonKey, setSupabaseAnonKey } from '../supabase';

export default function SupabaseModal({ isOpen, onClose, students, onImportData }) {
  const [anonKey, setAnonKey] = useState(getSupabaseAnonKey());
  const [saveMsg, setSaveMsg] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    setSupabaseAnonKey(anonKey);
    setSaveMsg('บันทึกกุญแจเชื่อมต่อ Supabase เรียบร้อยแล้ว!');
    setTimeout(() => {
      setSaveMsg('');
      onClose();
      window.location.reload();
    }, 1200);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dk_badminton_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            onImportData(parsed);
            alert('นำเข้าข้อมูลสำรองเรียบร้อยแล้ว!');
            onClose();
          } else {
            alert('รูปแบบไฟล์ JSON ไม่ถูกต้อง');
          }
        } catch (err) {
          alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141B27] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-['Prompt']">
              ตั้งค่าฐานข้อมูล Supabase
            </h3>
            <p className="text-xs text-slate-400">
              {SUPABASE_URL}
            </p>
          </div>
        </div>

        {saveMsg && (
          <div className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Supabase Anon Key (Public API Key):</span>
            </label>
            <input
              type="password"
              placeholder="วาง eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="form-input text-xs font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              * หากยังไม่ได้วาง Anon Key ระบบจะทำงานผ่านระบบจัดเก็บข้อมูลในเครื่อง (Local Storage Cache) โดยอัตโนมัติ
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSaveKey}
              className="btn-primary text-xs flex-1"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>บันทึกการเชื่อมต่อ Supabase</span>
            </button>
          </div>

          {/* Backup / Restore Section */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              💾 ระบบสำรองข้อมูล (Data Backup & Restore):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportJSON}
                className="btn-secondary text-xs"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>ส่งออกข้อมูล (Export JSON)</span>
              </button>

              <label className="btn-secondary text-xs cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>นำเข้าข้อมูล (Import)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
