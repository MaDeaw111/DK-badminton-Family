import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  UserCheck, 
  Zap, 
  FileText, 
  Check, 
  AlertCircle,
  Users,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AttendanceTracker({ 
  students, 
  classGroups,
  currentCoach, 
  onRecordAttendance 
}) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  const [sessionNote, setSessionNote] = useState('ฝึกทักษะประจำวัน (Footwork & Stroke)');
  const [completedNotification, setCompletedNotification] = useState('');

  // Mode: 'by_group' | 'all_list'
  const [attendanceViewMode, setAttendanceViewMode] = useState('by_group');

  // Single Student Check-in
  const handleCheckInSingle = (student, status = 'present') => {
    if (student.remaining_sessions <= 0 && status === 'present') {
      alert(`⚠️ คอร์สของ ${student.name} หมดแล้ว (เหลือ 0 ครั้ง) กรุณาต่ออายุคอร์สก่อนเช็คชื่อ`);
      return;
    }

    onRecordAttendance({
      student_id: student.id,
      coach_id: currentCoach.id,
      session_date: selectedDate,
      status: status,
      notes: sessionNote,
      remaining_after: status === 'present' ? Math.max(0, student.remaining_sessions - 1) : student.remaining_sessions
    });

    setCompletedNotification(`เช็คชื่อ ${student.name} (${status === 'present' ? 'มาเรียน - ตัดคอร์ส 1 ครั้ง' : 'ลา/ขาด'}) เรียบร้อยแล้ว`);
    setTimeout(() => setCompletedNotification(''), 3000);
  };

  // Bulk Group Check-in (Deducts sessions ONLY for Group Course students in this group)
  const handleCheckInBulkGroup = (group) => {
    const groupStudents = students.filter(s => s.class_group_id === group.id);
    const groupCourseStudents = groupStudents.filter(s => s.course_type === 'group');

    if (groupCourseStudents.length === 0) {
      alert(`ไม่มีนักเรียนที่ลงคอร์สกลุ่มใน ${group.name}`);
      return;
    }

    let checkedCount = 0;
    groupCourseStudents.forEach(std => {
      if (std.remaining_sessions > 0) {
        onRecordAttendance({
          student_id: std.id,
          coach_id: currentCoach.id,
          session_date: selectedDate,
          status: 'present',
          notes: `เช็คชื่อยกกลุ่ม: ${group.name} (${sessionNote})`,
          remaining_after: Math.max(0, std.remaining_sessions - 1)
        });
        checkedCount++;
      }
    });

    setCompletedNotification(`⚡ เช็คชื่อยกกลุ่ม ${group.name} สำเร็จ! ตัดคอร์สกลุ่มให้นักเรียน ${checkedCount} คนเรียบร้อยแล้ว (คอร์สเดี่ยวสามารถเช็คแยกได้)`);
    setTimeout(() => setCompletedNotification(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Zap className="w-4 h-4 fill-current" />
            <span>Smart Attendance Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-['Prompt']">
            ระบบเช็คชื่อ & ตัดคอร์สเรียนประจำวัน
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            เลือกเช็คชื่อยกกลุ่ม <strong className="text-emerald-400 font-bold">(ตัดเฉพาะคนลงคอร์สกลุ่ม)</strong> หรือเช็คแยกรายบุคคลสำหรับคอร์สเดี่ยว
          </p>
        </div>

        {/* Controls: Date Picker & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setAttendanceViewMode('by_group')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                attendanceViewMode === 'by_group' 
                  ? 'bg-emerald-500 text-slate-950 font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>เช็คชื่อแยกตามกลุ่ม</span>
            </button>

            <button
              onClick={() => setAttendanceViewMode('all_list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                attendanceViewMode === 'all_list' 
                  ? 'bg-cyan-400 text-slate-950 font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>รายชื่อนักเรียนทั้งหมด</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-white/10 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs text-slate-200">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white font-medium outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {completedNotification && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{completedNotification}</span>
        </div>
      )}

      {/* Session Note Bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold whitespace-nowrap">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>หัวข้อบทเรียนประจำรอบ:</span>
        </div>
        <input
          type="text"
          value={sessionNote}
          onChange={(e) => setSessionNote(e.target.value)}
          placeholder="เช่น ฝึกเซิร์ฟสั้น, หยอดหน้าตาข่าย, ฟุตเวิร์ก 6 จุด..."
          className="form-input text-xs"
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODE 1: ATTENDANCE BY CLASS GROUPS (เช็คชื่อยกกลุ่ม) */}
      {/* ------------------------------------------------------------- */}
      {attendanceViewMode === 'by_group' && (
        <div className="space-y-6">
          {classGroups.map((group) => {
            const groupStudents = students.filter(s => s.class_group_id === group.id);
            const groupCourseCount = groupStudents.filter(s => s.course_type === 'group').length;
            const privateCourseCount = groupStudents.filter(s => s.course_type === 'private').length;

            return (
              <div key={group.id} className="glass-card p-5 space-y-4 border border-white/10">
                
                {/* Group Header & Bulk Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <h3 className="font-bold text-white text-base font-['Prompt'] flex items-center gap-2">
                      <Layers className="w-4.5 h-4.5 text-cyan-400" />
                      <span>{group.name}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      นักเรียนคอร์สกลุ่ม: <strong className="text-cyan-400">{groupCourseCount}</strong> คน • นักเรียนคอร์สเดี่ยว: <strong className="text-amber-400">{privateCourseCount}</strong> คน
                    </p>
                  </div>

                  {/* 1-Tap Bulk Group Check-in Button */}
                  {groupCourseCount > 0 && (
                    <button
                      onClick={() => handleCheckInBulkGroup(group)}
                      className="btn-action-checkin text-xs font-bold shadow-lg shadow-emerald-500/20"
                      title="กดเช็คชื่อมาเรียนให้ทุกคนที่ลงคอร์สกลุ่มพร้อมกันในคลิกเดียว"
                    >
                      <Zap className="w-4 h-4 fill-current text-slate-950" />
                      <span>เช็คชื่อยกกลุ่ม ({groupCourseCount} คน - คอร์สกลุ่ม)</span>
                    </button>
                  )}
                </div>

                {/* Student Rows inside Group */}
                <div className="space-y-2.5">
                  {groupStudents.length === 0 ? (
                    <p className="py-6 text-center text-slate-500 text-xs">ไม่มีนักเรียนสังกัดกลุ่มนี้</p>
                  ) : (
                    groupStudents.map((std) => {
                      const isZero = std.remaining_sessions === 0;
                      const isLow = std.remaining_sessions <= 2;
                      const isGroupCourse = std.course_type === 'group';

                      return (
                        <div 
                          key={std.id}
                          className="p-3 bg-slate-900/70 border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-emerald-400">
                              {std.nickname ? std.nickname.charAt(0) : std.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white text-xs font-['Prompt']">{std.name} ({std.nickname})</h4>
                                <span className={isGroupCourse ? 'badge-group text-[10px]' : 'badge-private text-[10px]'}>
                                  {isGroupCourse ? 'คอร์สกลุ่ม (เช็คยกกลุ่มได้)' : 'คอร์สเดี่ยว (เช็คแยก)'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                ซ้อมวัน: {std.training_days?.join(', ')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3">
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                              isZero ? 'credit-red' : isLow ? 'credit-yellow' : 'credit-green'
                            }`}>
                              เหลือ {std.remaining_sessions} / {std.total_sessions} ครั้ง
                            </span>

                            {/* Individual Check-in Buttons */}
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleCheckInSingle(std, 'present')}
                                disabled={isZero}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                                  isZero
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>มาเรียน (-1)</span>
                              </button>

                              <button
                                onClick={() => handleCheckInSingle(std, 'absent')}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-medium transition"
                              >
                                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                <span>ลา/ขาด</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODE 2: ALL STUDENTS FLAT LIST (เช็คชื่อรวมทุกคน) */}
      {/* ------------------------------------------------------------- */}
      {attendanceViewMode === 'all_list' && (
        <div className="space-y-3">
          {students.map((std) => {
            const isZero = std.remaining_sessions === 0;
            const isLow = std.remaining_sessions <= 2;

            return (
              <div 
                key={std.id}
                className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-lg text-emerald-400">
                    {std.nickname ? std.nickname.charAt(0) : std.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base font-['Prompt']">{std.name}</h4>
                      <span className={std.course_type === 'group' ? 'badge-group' : 'badge-private'}>
                        {std.course_type === 'group' ? 'คอร์สกลุ่ม' : 'คอร์สเดี่ยว'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ชื่อเล่น: <strong className="text-slate-200">{std.nickname}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                    isZero ? 'credit-red' : isLow ? 'credit-yellow' : 'credit-green'
                  }`}>
                    คงเหลือ {std.remaining_sessions} / {std.total_sessions} ครั้ง
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCheckInSingle(std, 'present')}
                      disabled={isZero}
                      className="btn-action-checkin"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>มาเรียน (ตัด 1 ครั้ง)</span>
                    </button>

                    <button
                      onClick={() => handleCheckInSingle(std, 'absent')}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 rounded-xl text-xs font-medium transition"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>ลา/ขาด</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
