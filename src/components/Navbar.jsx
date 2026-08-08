import React from 'react';
import { 
  Calendar, 
  Users, 
  CheckSquare, 
  Award, 
  Database, 
  Sun, 
  Moon, 
  ShieldCheck, 
  ChevronDown,
  Activity,
  RefreshCw
} from 'lucide-react';
import { COACHES } from '../dataStore';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentCoach, 
  setCurrentCoach,
  onOpenSupabaseModal,
  theme,
  onToggleTheme,
  onSyncCloud,
  isSyncing
}) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-200 glass-card rounded-none border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="text-xl">🏸</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-tight font-['Prompt']">
                  DK KNIGHT <span className="text-emerald-500">BADMINTON</span>
                </h1>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.2 rounded border border-emerald-500/20 hidden sm:inline-block">
                  TRACKER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">
                ระบบติดตามการเรียนการสอนและตัดคอร์สสำหรับโค้ช
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 dark:bg-slate-900/60 p-1 rounded-2xl border border-slate-200/50 dark:border-white/10">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>แดชบอร์ด</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'students'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>นักเรียน & คอร์ส</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'attendance'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>เช็คชื่อตัดคอร์ส</span>
            </button>

            <button
              onClick={() => setActiveTab('evaluation')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'evaluation'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>ประเมินทักษะ</span>
            </button>
          </nav>

          {/* Right Action Tools: Sync, Coach Selector, Theme Toggle & Supabase */}
          <div className="flex items-center gap-2">

            {/* Cloud Sync Button */}
            <button
              onClick={onSyncCloud}
              disabled={isSyncing}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                isSyncing 
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 opacity-75' 
                  : 'btn-secondary'
              }`}
              title="กดเพื่อดึงข้อมูลล่าสุดจาก Supabase Cloud ให้ทุกเครื่องตรงกัน"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : 'text-emerald-500'}`} />
              <span className="hidden sm:inline">
                {isSyncing ? 'กำลังซิงก์...' : 'ซิงก์คลาวด์'}
              </span>
            </button>
            
            {/* Coach Switcher Dropdown */}
            <div className="relative">
              <select
                value={currentCoach.id}
                onChange={(e) => {
                  const selected = COACHES.find(c => c.id === e.target.value);
                  if (selected) setCurrentCoach(selected);
                }}
                className="appearance-none bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold py-2 pl-8 pr-7 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {COACHES.map(coach => (
                  <option key={coach.id} value={coach.id} className="bg-slate-900 text-slate-200">
                    {coach.name}
                  </option>
                ))}
              </select>
              <div className="absolute left-2.5 top-2.5 pointer-events-none text-xs">
                {currentCoach.icon}
              </div>
              <div className="absolute right-2 top-2.5 pointer-events-none text-emerald-600 dark:text-emerald-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Theme Switcher Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border btn-secondary transition"
              title={theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง ☀️' : 'เปลี่ยนเป็นโหมดมืด 🌙'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Supabase Status Button */}
            <button
              onClick={onOpenSupabaseModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition"
              title="สถานะระบบคลาวด์ Supabase"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="font-bold">Supabase DB</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200/50 dark:border-white/5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex flex-col items-center gap-1 ${
              activeTab === 'dashboard' ? 'text-emerald-500 font-bold' : 'text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>ปฏิทิน</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex flex-col items-center gap-1 ${
              activeTab === 'students' ? 'text-emerald-500 font-bold' : 'text-slate-400'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>นักเรียน</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex flex-col items-center gap-1 ${
              activeTab === 'attendance' ? 'text-emerald-500 font-bold' : 'text-slate-400'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>เช็คชื่อ</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex flex-col items-center gap-1 ${
              activeTab === 'evaluation' ? 'text-emerald-500 font-bold' : 'text-slate-400'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>ประเมิน</span>
          </button>
        </div>

      </div>
    </header>
  );
}
