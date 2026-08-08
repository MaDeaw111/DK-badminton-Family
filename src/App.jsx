import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import StudentManager from './components/StudentManager';
import AttendanceTracker from './components/AttendanceTracker';
import SkillEvaluator from './components/SkillEvaluator';
import SupabaseModal from './components/SupabaseModal';

import { 
  COACHES, 
  loadLocalStudents, 
  saveLocalStudents, 
  loadLocalClassGroups,
  saveLocalClassGroups,
  loadLocalTrainingPlans,
  saveLocalTrainingPlans,
  loadLocalAttendance, 
  saveLocalAttendance, 
  loadLocalEvaluations, 
  saveLocalEvaluations 
} from './dataStore';
import { getSupabaseClient } from './supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentCoach, setCurrentCoach] = useState(COACHES[0]);
  
  const [students, setStudents] = useState(loadLocalStudents);
  const [classGroups, setClassGroups] = useState(loadLocalClassGroups);
  const [trainingPlans, setTrainingPlans] = useState(loadLocalTrainingPlans);
  const [attendanceLogs, setAttendanceLogs] = useState(loadLocalAttendance);
  const [evaluations, setEvaluations] = useState(loadLocalEvaluations);
  
  const [isSyncing, setIsSyncing] = useState(false);

  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dk_theme') || 'dark';
  });

  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [selectedEvalStudent, setSelectedEvalStudent] = useState(null);

  // Apply theme to html root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dk_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Sync state to local storage
  useEffect(() => {
    saveLocalStudents(students);
  }, [students]);

  useEffect(() => {
    saveLocalClassGroups(classGroups);
  }, [classGroups]);

  useEffect(() => {
    saveLocalTrainingPlans(trainingPlans);
  }, [trainingPlans]);

  useEffect(() => {
    saveLocalAttendance(attendanceLogs);
  }, [attendanceLogs]);

  useEffect(() => {
    saveLocalEvaluations(evaluations);
  }, [evaluations]);

  // Master Cloud Fetch Handler (ดึงข้อมูลล่าสุดจาก Supabase Cloud ให้ทุกอุปกรณ์ตรงกัน)
  const fetchCloudData = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    setIsSyncing(true);
    try {
      // 1. Fetch Students
      const { data: stdData, error: stdErr } = await supabase.from('students').select('*');
      if (!stdErr && stdData && stdData.length > 0) {
        setStudents(stdData);
      }

      // 2. Fetch Attendance
      const { data: attData, error: attErr } = await supabase.from('attendance_logs').select('*').order('created_at', { ascending: false });
      if (!attErr && attData && attData.length > 0) {
        setAttendanceLogs(attData);
      }

      // 3. Fetch Evaluations
      const { data: evalData, error: evalErr } = await supabase.from('skill_evaluations').select('*');
      if (!evalErr && evalData && evalData.length > 0) {
        const evalsMap = {};
        evalData.forEach(item => {
          evalsMap[item.student_id] = item;
        });
        setEvaluations(evalsMap);
      }
    } catch (e) {
      console.warn("Cloud sync warning:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Initial fetch on mount & Periodic Sync
  useEffect(() => {
    fetchCloudData();

    // Auto sync every 30 seconds across devices
    const interval = setInterval(() => {
      fetchCloudData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Class Groups Handlers
  const handleAddGroup = (newGroup) => {
    setClassGroups(prev => [...prev, newGroup]);
  };

  const handleUpdateGroup = (updatedGroup) => {
    setClassGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
  };

  const handleDeleteGroup = (groupId) => {
    setClassGroups(prev => prev.filter(g => g.id !== groupId));
  };

  // Training Plan Handler
  const handleSaveTrainingPlan = (dateStr, planText) => {
    setTrainingPlans(prev => ({
      ...prev,
      [dateStr]: planText
    }));
  };

  // Student Handlers
  const handleAddStudent = async (newStudentData) => {
    const newStudent = {
      ...newStudentData,
      id: 'std_' + Date.now(),
      created_at: new Date().toISOString()
    };

    setStudents(prev => [newStudent, ...prev]);

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('students').insert([newStudent]).catch(console.error);
      fetchCloudData();
    }
  };

  const handleUpdateStudent = async (updatedData) => {
    setStudents(prev => prev.map(s => s.id === updatedData.id ? updatedData : s));

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('students').update(updatedData).eq('id', updatedData.id).catch(console.error);
      fetchCloudData();
    }
  };

  const handleDeleteStudent = async (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('students').delete().eq('id', id).catch(console.error);
      fetchCloudData();
    }
  };

  const handleRenewCourse = async (id) => {
    const std = students.find(s => s.id === id);
    if (!std) return;

    const renewed = {
      ...std,
      remaining_sessions: std.remaining_sessions + 8,
      total_sessions: std.total_sessions + 8,
      status: 'active'
    };

    setStudents(prev => prev.map(s => s.id === id ? renewed : s));
    alert(`🎉 เติมคอร์สต่ออายุให้ ${std.name} เรียบร้อยแล้ว (+8 ครั้งคงเหลือ)`);

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('students').update({
        remaining_sessions: renewed.remaining_sessions,
        total_sessions: renewed.total_sessions,
        status: 'active'
      }).eq('id', id).catch(console.error);
      fetchCloudData();
    }
  };

  const handleRecordAttendance = async (logData) => {
    const newLog = {
      ...logData,
      id: 'att_' + Date.now(),
      created_at: new Date().toISOString()
    };

    setAttendanceLogs(prev => [newLog, ...prev]);

    if (logData.status === 'present') {
      setStudents(prev => prev.map(s => {
        if (s.id === logData.student_id) {
          const nextRemaining = Math.max(0, s.remaining_sessions - 1);
          return {
            ...s,
            remaining_sessions: nextRemaining
          };
        }
        return s;
      }));

      const supabase = getSupabaseClient();
      if (supabase) {
        const std = students.find(s => s.id === logData.student_id);
        if (std) {
          const nextRemaining = Math.max(0, std.remaining_sessions - 1);
          await supabase.from('students').update({ remaining_sessions: nextRemaining }).eq('id', std.id).catch(console.error);
        }
        await supabase.from('attendance_logs').insert([newLog]).catch(console.error);
        fetchCloudData();
      }
    }
  };

  const handleSaveEvaluation = async (studentId, evalData) => {
    setEvaluations(prev => ({
      ...prev,
      [studentId]: evalData
    }));

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('skill_evaluations').upsert([{
        student_id: studentId,
        coach_id: currentCoach.id,
        ...evalData
      }]).catch(console.error);
      fetchCloudData();
    }
  };

  const handleOpenSkillModalFromList = (student) => {
    setSelectedEvalStudent(student);
    setActiveTab('evaluation');
  };

  return (
    <div className="min-h-screen flex flex-col font-['Kanit',sans-serif] transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentCoach={currentCoach}
        setCurrentCoach={setCurrentCoach}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSyncCloud={fetchCloudData}
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        
        {activeTab === 'dashboard' && (
          <Dashboard 
            students={students}
            classGroups={classGroups}
            attendanceLogs={attendanceLogs}
            trainingPlans={trainingPlans}
            currentCoach={currentCoach}
            onRenewCourse={handleRenewCourse}
            onNavigateTab={setActiveTab}
            onSaveTrainingPlan={handleSaveTrainingPlan}
          />
        )}

        {activeTab === 'students' && (
          <StudentManager 
            students={students}
            classGroups={classGroups}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onRenewCourse={handleRenewCourse}
            onOpenSkillModal={handleOpenSkillModalFromList}
            onAddGroup={handleAddGroup}
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={handleDeleteGroup}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTracker 
            students={students}
            classGroups={classGroups}
            currentCoach={currentCoach}
            onRecordAttendance={handleRecordAttendance}
          />
        )}

        {activeTab === 'evaluation' && (
          <SkillEvaluator 
            students={students}
            evaluations={evaluations}
            currentCoach={currentCoach}
            onSaveEvaluation={handleSaveEvaluation}
            initialStudent={selectedEvalStudent}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
        DK KNIGHT BADMINTON ACADEMY TRACKER • Powered by Supabase DB & React
      </footer>

      {/* Supabase Config Modal */}
      <SupabaseModal 
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        students={students}
        onImportData={(imported) => setStudents(imported)}
      />

    </div>
  );
}
