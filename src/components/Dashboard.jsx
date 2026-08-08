import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  UserPlus, 
  ChevronRight,
  ShieldAlert,
  Repeat,
  Calendar as CalendarIcon,
  ChevronLeft,
  Filter,
  Check,
  UserCheck,
  Grid,
  List,
  FileText,
  Edit,
  Save,
  Layers
} from 'lucide-react';
import { DAYS_OF_WEEK } from '../dataStore';

export default function Dashboard({ 
  students, 
  classGroups = [],
  attendanceLogs, 
  trainingPlans,
  currentCoach, 
  onRenewCourse, 
  onNavigateTab,
  onSaveTrainingPlan
}) {
  const [viewMode, setViewMode] = useState('monthly');

  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // Aug 2026
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date().toISOString().split('T')[0]);

  const [scheduleFilterCourse, setScheduleFilterCourse] = useState('all');

  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [planInput, setPlanInput] = useState('');

  // Statistics
  const totalStudents = students.length;
  const groupStudents = students.filter(s => s.course_type === 'group').length;
  const privateStudents = students.filter(s => s.course_type === 'private').length;
  const lowCreditStudents = students.filter(s => s.remaining_sessions <= 2);

  const todayStr = new Date().toLocaleDateString('th-TH', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const dayNameMap = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
  const currentDayId = dayNameMap[new Date().getDay()];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNamesTh = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getStudentsForDay = (dayId) => {
    return students.filter(std => {
      const matchCourse = scheduleFilterCourse === 'all' || std.course_type === scheduleFilterCourse;
      const matchDay = std.training_days && std.training_days.includes(dayId);
      return matchCourse && matchDay;
    });
  };

  const getStudentsForDate = (dateStr) => {
    const d = new Date(dateStr);
    const dayId = dayNameMap[d.getDay()];
    return getStudentsForDay(dayId);
  };

  // Group training summary for a specific date (Shows Exact Custom Group Names)
  const getGroupsForDate = (dateStr) => {
    const dayStudents = getStudentsForDate(dateStr);
    const groupsMap = {};

    dayStudents.forEach(std => {
      const gId = std.class_group_id || 'grp_1';
      if (!groupsMap[gId]) {
        const foundGroup = classGroups.find(c => c.id === gId);
        let displayName = foundGroup ? foundGroup.name : (std.course_type === 'private' ? 'คอร์สเรียนเดี่ยว' : 'คอร์สกลุ่ม');
        // Clean bracketed time text if present
        displayName = displayName.replace(/\s*\[.*?\]\s*/g, '').trim();

        groupsMap[gId] = {
          id: gId,
          name: displayName,
          count: 0,
          students: []
        };
      }
      groupsMap[gId].count++;
      groupsMap[gId].students.push(std);
    });

    return Object.values(groupsMap);
  };

  const currentPlanText = trainingPlans[selectedCalendarDate] || '• ยังไม่มีรายละเอียดแผนการซ้อมสำหรับวันนี้ กดปุ่ม "แก้ไขแผนซ้อม" เพื่อเพิ่มรายละเอียด';

  const handleSelectDate = (dateStr) => {
    setSelectedCalendarDate(dateStr);
    setIsEditingPlan(false);
  };

  const handleSavePlanSubmit = () => {
    onSaveTrainingPlan(selectedCalendarDate, planInput);
    setIsEditingPlan(false);
  };

  const startEditPlan = () => {
    setPlanInput(trainingPlans[selectedCalendarDate] || '• วอร์มร่างกาย & ฟุตเวิร์ก 6 จุด (15 นาที)\n• ฝึกตีลูกหลัง & เซิร์ฟ (20 นาที)\n• เกมรับหน้าตาข่าย (15 นาที)\n• ซ้อมแข่งเดี่ยว/คู่ (10 นาที)');
    setIsEditingPlan(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="glass-card p-6 relative overflow-hidden bg-gradient-to-r from-[#141B27] via-[#1A2333] to-[#0F202A] border-emerald-500/20">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-12 -bottom-6 text-8xl opacity-10 pointer-events-none">🏸</div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>ยินดีต้อนรับกลับสโมสร, {currentCoach.name}</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-['Prompt']">
              แดชบอร์ด & ตารางกลุ่มซ้อมแบดมินตัน
            </h2>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{todayStr}</span>
            </p>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'monthly' 
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-400/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>ปฏิทินรายเดือน (Monthly)</span>
            </button>

            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'weekly' 
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>รายสัปดาห์ (Weekly)</span>
            </button>

            <button
              onClick={() => setViewMode('overview')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'overview' 
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span>สรุปภาพรวม</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 border-l-4 border-l-emerald-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">นักเรียนทั้งหมด</p>
              <p className="text-2xl font-bold text-white mt-1">{totalStudents} <span className="text-xs font-normal text-slate-400">คน</span></p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-white/5 flex items-center gap-2">
            <span>กลุ่ม: <strong className="text-emerald-400">{groupStudents}</strong> คน</span>
            <span>•</span>
            <span>เดี่ยว: <strong className="text-cyan-400">{privateStudents}</strong> คน</span>
          </div>
        </div>

        <div className="glass-card p-4 border-l-4 border-l-cyan-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">คอร์สกลุ่ม (8 ครั้ง / 3,500B)</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">{groupStudents} <span className="text-xs font-normal text-slate-400">คน</span></p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-white/5">
            คอร์สกลุ่มมาตรฐาน (18:00 - 19:00 น.)
          </div>
        </div>

        <div className="glass-card p-4 border-l-4 border-l-amber-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">คอร์สเดี่ยว (8 ครั้ง / 1,200B)</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{privateStudents} <span className="text-xs font-normal text-slate-400">คน</span></p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-white/5">
            เรียนเดี่ยวรายบุคคล (18:00 - 19:00 น.)
          </div>
        </div>

        <div className="glass-card p-4 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">แจ้งเตือนคอร์สใกล้หมด</p>
              <p className="text-2xl font-bold text-rose-400 mt-1">{lowCreditStudents.length} <span className="text-xs font-normal text-slate-400">คน</span></p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-rose-300/80 pt-2 border-t border-white/5 font-medium">
            {lowCreditStudents.length > 0 ? 'ควรแจ้งต่ออายุคอร์สใหม่' : 'ไม่มีคอร์สค้างเตือน'}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. MONTHLY CALENDAR VIEW WITH CLASS GROUP NAMES IN CELLS */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'monthly' && (
        <div className="space-y-5">
          
          {/* Month Header & Controls */}
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={prevMonth}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-white font-['Prompt']">
                {monthNamesTh[month]} {year + 543}
              </h3>

              <button
                onClick={nextMonth}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 hidden sm:block">
              * แสดง <strong className="text-cyan-400">ชื่อกลุ่มซ้อม</strong> ในปฏิทิน คลิกวันที่เพื่อดูแผนซ้อมและรายชื่อสมาชิก
            </p>
          </div>

          {/* Monthly Calendar Grid */}
          <div className="glass-card p-5 space-y-6">
            
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 border-b border-white/10 pb-2">
              <span className="text-rose-400">อาทิตย์</span>
              <span>จันทร์</span>
              <span>อังคาร</span>
              <span>พุธ</span>
              <span>พฤหัสบดี</span>
              <span>ศุกร์</span>
              <span className="text-cyan-400">เสาร์</span>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty_${idx}`} className="min-h-[95px] bg-slate-900/20 rounded-xl"></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const dayStudents = getStudentsForDate(dStr);
                const dateGroups = getGroupsForDate(dStr);
                const isSelected = selectedCalendarDate === dStr;
                const isToday = new Date().toISOString().split('T')[0] === dStr;
                const hasPlan = Boolean(trainingPlans[dStr]);

                return (
                  <div
                    key={`day_${dayNum}`}
                    onClick={() => handleSelectDate(dStr)}
                    className={`min-h-[95px] p-2 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/20'
                        : isToday
                        ? 'border-cyan-400/60 bg-cyan-500/10'
                        : 'border-white/5 bg-slate-900/60 hover:border-white/20 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-bold ${isToday ? 'text-cyan-400' : 'text-slate-300'}`}>
                          {dayNum}
                        </span>
                        {hasPlan && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="มีแผนการซ้อม"></span>
                        )}
                      </div>

                      {dayStudents.length > 0 && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded-full">
                          รวม {dayStudents.length} คน
                        </span>
                      )}
                    </div>

                    {/* Display Full Custom Class Group Name Badges */}
                    <div className="space-y-1 my-1">
                      {dateGroups.length === 0 ? (
                        <div className="text-[9px] text-slate-600 text-center py-2">ไม่มีคิวซ้อม</div>
                      ) : (
                        dateGroups.map((grp) => (
                          <div 
                            key={grp.id} 
                            className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-semibold truncate border border-white/10 flex items-center justify-between"
                            title={`${grp.name} (${grp.count} คน)`}
                          >
                            <span className="truncate">{grp.name}</span>
                            <span className="text-[9px] bg-cyan-500/20 text-cyan-200 px-1 rounded ml-1 font-bold flex-shrink-0">
                              {grp.count}คน
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SELECTED DATE DETAILS: TRAINING PLAN & GROUPED ROSTER */}
            {/* ------------------------------------------------------------- */}
            {selectedCalendarDate && (
              <div className="p-5 bg-slate-900/80 rounded-2xl border border-emerald-500/30 space-y-5 animate-in fade-in duration-150">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white font-['Prompt'] flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-emerald-400" />
                      <span>ตารางและแผนการซ้อมประจำวันที่ {selectedCalendarDate} (18:00 - 19:00 น.)</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      กลุ่มซ้อมที่มีคิววันนี้: <strong className="text-cyan-400">{getGroupsForDate(selectedCalendarDate).length}</strong> กลุ่ม • นักเรียนรวม: <strong className="text-emerald-400">{getStudentsForDate(selectedCalendarDate).length}</strong> คน
                    </p>
                  </div>

                  {!isEditingPlan ? (
                    <button
                      onClick={startEditPlan}
                      className="btn-secondary text-xs"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-400" />
                      <span>แก้ไขแผนการซ้อม</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditingPlan(false)}
                        className="btn-secondary text-xs"
                      >
                        ยกเลิก
                      </button>
                      <button
                        onClick={handleSavePlanSubmit}
                        className="btn-primary text-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>บันทึกแผนซ้อม</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* DAILY TRAINING PLAN SECTION */}
                <div className="p-4 bg-slate-950/70 border border-white/10 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <FileText className="w-4 h-4" />
                    <span>📋 แผนการซ้อมประจำวัน (Daily Training Plan & Drills):</span>
                  </div>

                  {!isEditingPlan ? (
                    <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-mono bg-slate-900/50 p-3 rounded-lg border border-white/5">
                      {currentPlanText}
                    </div>
                  ) : (
                    <textarea
                      rows="4"
                      value={planInput}
                      onChange={(e) => setPlanInput(e.target.value)}
                      placeholder="เช่น&#10;• วอร์มร่างกาย & ฟุตเวิร์ก 6 จุด (15 นาที)&#10;• ฝึกตีลูกหลัง & เซิร์ฟ (20 นาที)&#10;• เกมรับหน้าตาข่าย (15 นาที)&#10;• ซ้อมแข่งเดี่ยว/คู่ (10 นาที)"
                      className="form-input text-xs font-mono"
                    ></textarea>
                  )}
                </div>

                {/* GROUPED STUDENT ROSTER FOR THIS DATE */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-slate-300 font-['Prompt'] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>กลุ่มซ้อมและรายชื่อนักเรียนที่มีคิวซ้อมวันนี้:</span>
                  </h5>

                  {getGroupsForDate(selectedCalendarDate).length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">ไม่มีกลุ่มซ้อมที่มีคิววันนี้</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getGroupsForDate(selectedCalendarDate).map((grp) => (
                        <div key={grp.id} className="p-4 bg-slate-950/60 border border-white/10 rounded-xl space-y-3">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="font-bold text-white text-xs font-['Prompt']">
                              {grp.name}
                            </span>
                            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                              {grp.count} คน
                            </span>
                          </div>

                          <div className="space-y-2">
                            {grp.students.map((std) => (
                              <div key={std.id} className="p-2.5 bg-slate-900 border border-white/5 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-emerald-400">
                                    {std.nickname ? std.nickname.charAt(0) : std.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-white">{std.name} ({std.nickname})</p>
                                  </div>
                                </div>

                                <span className={std.course_type === 'group' ? 'badge-group text-[9px]' : 'badge-private text-[9px]'}>
                                  {std.course_type === 'group' ? 'คอร์สกลุ่ม' : 'คอร์สเดี่ยว'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. WEEKLY SCHEDULE VIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'weekly' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-['Prompt'] flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-400" />
              <span>ตารางซ้อมรายสัปดาห์ (Weekly Training Days)</span>
            </h3>
            <span className="text-xs text-slate-400">
              * แสดงรายชื่อกลุ่มและนักเรียนที่มีคิวซ้อมในแต่ละวันของสัปดาห์ (18:00-19:00 น.)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {DAYS_OF_WEEK.map((day) => {
              const dayStudents = getStudentsForDay(day.id);
              const isToday = currentDayId === day.id;

              return (
                <div 
                  key={day.id}
                  className={`glass-card p-3 flex flex-col justify-between min-h-[300px] border transition ${
                    isToday ? 'border-emerald-500/60 bg-emerald-500/5 shadow-lg shadow-emerald-500/10' : 'border-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                      <div>
                        <span className={`text-xs font-bold ${isToday ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {day.label}
                        </span>
                        {isToday && (
                          <span className="ml-1.5 text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                            วันนี้
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-extrabold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        {dayStudents.length} คน
                      </span>
                    </div>

                    {dayStudents.length === 0 ? (
                      <div className="py-8 text-center text-slate-500 text-[11px]">
                        ไม่มีคิวซ้อมวัน{day.short}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {dayStudents.map((std) => (
                          <div 
                            key={std.id}
                            className="p-2.5 bg-slate-900/80 border border-white/10 rounded-xl space-y-1.5 hover:border-emerald-500/40 transition"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-xs font-['Prompt']">
                                {std.nickname || std.name}
                              </span>
                              <span className={std.course_type === 'group' ? 'text-[9px] badge-group py-0 px-1.5' : 'text-[9px] badge-private py-0 px-1.5'}>
                                {std.course_type === 'group' ? 'กลุ่ม' : 'เดี่ยว'}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-400 truncate">{std.name}</p>

                            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                              <span className="text-slate-400">คงเหลือ:</span>
                              <span className={`font-bold px-1.5 py-0.2 rounded ${
                                std.remaining_sessions <= 2 ? 'credit-red' : 'credit-green'
                              }`}>
                                {std.remaining_sessions} ครั้ง
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 text-[10px] text-slate-500 text-center border-t border-white/5 mt-3">
                    {dayStudents.length} คนลงคิวซ้อม
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. OVERVIEW SUMMARY VIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <h3 className="font-semibold text-white font-['Prompt']">
                    คอร์สใกล้หมดอายุ ($\le$ 2 ครั้งคงเหลือ)
                  </h3>
                </div>
                <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {lowCreditStudents.length} คน
                </span>
              </div>

              {lowCreditStudents.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2 opacity-80" />
                  <p className="text-sm">ไม่มีนักเรียนที่คอร์สใกล้หมด ทุกคนยังมีจำนวนครั้งเรียนคงเหลือเพียงพอ</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lowCreditStudents.map((std) => (
                    <div key={std.id} className="p-3.5 bg-slate-900/60 border border-white/10 rounded-xl flex items-center justify-between gap-3 hover:border-amber-500/40 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-emerald-400 text-lg border border-white/10">
                          {std.nickname ? std.nickname.charAt(0) : std.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-100 text-sm">{std.name}</h4>
                            <span className={std.course_type === 'group' ? 'badge-group' : 'badge-private'}>
                              {std.course_type === 'group' ? 'คอร์สกลุ่ม 8 ครั้ง' : 'คอร์สเดี่ยว 8 ครั้ง'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            ผู้ปกครอง: {std.parent_phone || 'ไม่ได้ระบุ'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-lg credit-red">
                            เหลือ {std.remaining_sessions} / {std.total_sessions} ครั้ง
                          </span>
                        </div>
                        <button
                          onClick={() => onRenewCourse(std.id)}
                          className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                          title="เติมคอร์สต่ออายุ 8 ครั้ง"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          <span>ต่อคอร์ส +8</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm font-['Prompt'] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>ประวัติการเช็คชื่อล่าสุด</span>
                </h3>
              </div>

              {attendanceLogs.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">ยังไม่มีประวัติการเช็คชื่อวันนี้</p>
              ) : (
                <div className="space-y-2.5">
                  {attendanceLogs.slice(0, 5).map((log) => {
                    const std = students.find(s => s.id === log.student_id);
                    return (
                      <div key={log.id} className="p-2.5 bg-slate-900/50 rounded-xl border border-white/5 text-xs flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-200">{std ? std.name : 'นักเรียน'}</p>
                          <p className="text-[10px] text-slate-400">เมื่อ {log.session_date} {log.notes && `• ${log.notes}`}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                          เช็คเข้าเรียน
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={() => onNavigateTab('attendance')}
                className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <span>ไปที่หน้าเช็คชื่อทั้งหมด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
