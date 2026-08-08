import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Award, 
  LayoutDashboard, 
  Database, 
  ChevronDown, 
  UserCheck,
  Sun,
  Moon
} from 'lucide-react';
import { COACHES } from '../dataStore';
import { getSupabaseAnonKey } from '../supabase';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentCoach, 
  setCurrentCoach, 
  onOpenSupabaseModal,
  theme,
  onToggleTheme
}) {
  const [showCoachMenu, setShowCoachMenu] = useState(false);
  const isSupabaseConnected = Boolean(getSupabaseAnonKey());

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Brand & Coach Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🏸</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-wide text-white font-['Prompt']">
                  DK KNIGHT <span className="text-emerald-400">BADMINTON</span>
                </h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  TRACKER
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">ระบบติดตามการเรียนการสอนและตัดคอร์สสำหรับโค้ช</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Switcher Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 transition"
              title={theme === 'dark' ? 'สลับเป็นโหมดสว่าง (Light Mode)' : 'สลับเป็นโหมดมืด (Dark Mode)'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Coach Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCoachMenu(!showCoachMenu)}
                className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 px-3 py-1.5 rounded-xl transition text-xs text-slate-200"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium">{currentCoach.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCoachMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#141B27] border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] text-slate-400 border-b border-white/5 font-semibold">
                    เลือกโปรไฟล์โค้ชผู้ใช้งาน:
                  </div>
                  {COACHES.map((coach) => (
                    <button
                      key={coach.id}
                      onClick={() => {
                        setCurrentCoach(coach);
                        setShowCoachMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/5 transition ${
                        currentCoach.id === coach.id ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{coach.icon}</span>
                        {coach.name}
                      </span>
                      {currentCoach.id === coach.id && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>แดชบอร์ด</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          >
            <Users className="w-4 h-4" />
            <span>นักเรียน & คอร์ส</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>เช็คชื่อตัดคอร์ส</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluation')}
            className={`tab-btn ${activeTab === 'evaluation' ? 'active' : ''}`}
          >
            <Award className="w-4 h-4" />
            <span>ประเมินทักษะ</span>
          </button>

          {/* Supabase Status Button */}
          <button
            onClick={onOpenSupabaseModal}
            className={`ml-1 px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              isSupabaseConnected 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20'
            }`}
            title="ตั้งค่าฐานข้อมูล Supabase"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Supabase DB</span>
            <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`}></span>
          </button>
        </nav>
      </div>
    </header>
  );
}
