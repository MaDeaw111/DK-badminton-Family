import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  UserCheck, 
  CreditCard, 
  Edit, 
  Trash2, 
  Repeat, 
  Award, 
  X, 
  CheckCircle2,
  Users,
  Zap,
  Sparkles,
  Calendar as CalendarIcon,
  UserPlus,
  Layers,
  FolderPlus,
  ChevronRight
} from 'lucide-react';
import { DAYS_OF_WEEK } from '../dataStore';

export default function StudentManager({ 
  students, 
  classGroups,
  onAddStudent, 
  onUpdateStudent, 
  onDeleteStudent, 
  onRenewCourse,
  onOpenSkillModal,
  onAddGroup,
  onUpdateGroup,
  onDeleteGroup
}) {
  const [subView, setSubView] = useState('registry'); // 'registry' | 'groups'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  // New Group Form State
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    max: 5
  });

  // Student Form State
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    age: '',
    phone: '',
    parent_phone: '',
    training_days: ['Sat', 'Sun'],
    notes: '',
    course_type: 'group',
    class_group_id: classGroups[0]?.id || 'grp_1',
    course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
    total_sessions: 8,
    remaining_sessions: 8,
    price: 3500
  });

  const applyPackagePreset = (type) => {
    if (type === 'group') {
      setFormData(prev => ({
        ...prev,
        course_type: 'group',
        course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
        class_group_id: classGroups[0]?.id || 'grp_1',
        total_sessions: 8,
        remaining_sessions: 8,
        price: 3500
      }));
    } else if (type === 'private') {
      setFormData(prev => ({
        ...prev,
        course_type: 'private',
        course_name: 'คอร์สเดี่ยว 8 ครั้ง (1,200B)',
        class_group_id: 'grp_private',
        total_sessions: 8,
        remaining_sessions: 8,
        price: 1200
      }));
    }
  };

  const toggleDaySelection = (dayId) => {
    setFormData(prev => {
      const currentDays = prev.training_days || [];
      if (currentDays.includes(dayId)) {
        return { ...prev, training_days: currentDays.filter(d => d !== dayId) };
      } else {
        return { ...prev, training_days: [...currentDays, dayId] };
      }
    });
  };

  const filteredStudents = students.filter(std => {
    const matchesSearch = 
      std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (std.phone && std.phone.includes(searchTerm));
    
    const matchesFilter = filterCourse === 'all' || std.course_type === filterCourse;
    return matchesSearch && matchesFilter;
  });

  const handleSubmitStudent = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.nickname) {
      alert('กรุณากรอกชื่อและชื่อเล่นนักเรียน');
      return;
    }

    if (editingStudent) {
      onUpdateStudent({ ...editingStudent, ...formData });
      setEditingStudent(null);
    } else {
      onAddStudent(formData);
    }

    setIsAddModalOpen(false);
    resetStudentForm();
  };

  const resetStudentForm = () => {
    setFormData({
      name: '',
      nickname: '',
      age: '',
      phone: '',
      parent_phone: '',
      training_days: ['Sat', 'Sun'],
      notes: '',
      course_type: 'group',
      class_group_id: classGroups[0]?.id || 'grp_1',
      course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
      total_sessions: 8,
      remaining_sessions: 8,
      price: 3500
    });
  };

  const startEditStudent = (std) => {
    setEditingStudent(std);
    setFormData({
      name: std.name,
      nickname: std.nickname,
      age: std.age || '',
      phone: std.phone || '',
      parent_phone: std.parent_phone || '',
      training_days: std.training_days || ['Sat', 'Sun'],
      notes: std.notes || '',
      course_type: std.course_type || 'group',
      class_group_id: std.class_group_id || classGroups[0]?.id,
      course_name: std.course_name || 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
      total_sessions: std.total_sessions || 8,
      remaining_sessions: std.remaining_sessions || 8,
      price: std.price || 3500
    });
    setIsAddModalOpen(true);
  };

  // Group Handlers
  const handleSubmitGroup = (e) => {
    e.preventDefault();
    if (!groupFormData.name) {
      alert('กรุณากรอกชื่อกลุ่มซ้อม');
      return;
    }

    if (editingGroup) {
      onUpdateGroup({ ...editingGroup, ...groupFormData });
      setEditingGroup(null);
    } else {
      onAddGroup({
        id: 'grp_' + Date.now(),
        name: groupFormData.name,
        max: parseInt(groupFormData.max) || 5
      });
    }

    setIsAddGroupModalOpen(false);
    setGroupFormData({ name: '', max: 5 });
  };

  const startEditGroup = (group) => {
    setEditingGroup(group);
    setGroupFormData({ name: group.name, max: group.max || 5 });
    setIsAddGroupModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Bar & Actions */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Prompt'] flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>ทะเบียนนักเรียน & จัดกลุ่มเรียน</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            สร้างโปรไฟล์นักเรียน ตั้งชื่อกลุ่มซ้อมแยกได้อย่างอิสระ (4-5 คน/กลุ่ม)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Subview Toggle */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setSubView('registry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                subView === 'registry' 
                  ? 'bg-emerald-500 text-slate-950 font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>รายชื่อนักเรียน ({students.length})</span>
            </button>
            <button
              onClick={() => setSubView('groups')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                subView === 'groups' 
                  ? 'bg-cyan-400 text-slate-950 font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>จัดการกลุ่มซ้อม ({classGroups.length})</span>
            </button>
          </div>

          {subView === 'groups' ? (
            <button
              onClick={() => {
                setEditingGroup(null);
                setGroupFormData({ name: '', max: 5 });
                setIsAddGroupModalOpen(true);
              }}
              className="btn-secondary text-xs"
            >
              <FolderPlus className="w-4 h-4 text-cyan-400" />
              <span>+ สร้างชื่อกลุ่มใหม่</span>
            </button>
          ) : (
            <button
              onClick={() => {
                resetStudentForm();
                setEditingStudent(null);
                setIsAddModalOpen(true);
              }}
              className="btn-primary text-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>สร้างโปรไฟล์นักเรียนใหม่</span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VIEW 1: MASTER STUDENT REGISTRY (รายชื่อนักเรียนรายบุคคล) */}
      {/* ------------------------------------------------------------- */}
      {subView === 'registry' && (
        <div className="space-y-4">
          
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, ชื่อเล่น, เบอร์โทร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setFilterCourse('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  filterCourse === 'all' 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-slate-800 text-slate-400 border-white/10 hover:bg-slate-700'
                }`}
              >
                ทั้งหมด ({students.length})
              </button>
              <button
                onClick={() => setFilterCourse('group')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  filterCourse === 'group' 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                    : 'bg-slate-800 text-slate-400 border-white/10 hover:bg-slate-700'
                }`}
              >
                คอร์สกลุ่ม (3,500B)
              </button>
              <button
                onClick={() => setFilterCourse('private')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  filterCourse === 'private' 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-slate-800 text-slate-400 border-white/10 hover:bg-slate-700'
                }`}
              >
                คอร์สเดี่ยว (1,200B)
              </button>
            </div>
          </div>

          {/* Student Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.length === 0 ? (
              <div className="col-span-full py-12 glass-card text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                <p className="text-sm">ไม่พบข้อมูลนักเรียนตามเงื่อนไขที่ค้นหา</p>
              </div>
            ) : (
              filteredStudents.map((std) => {
                const isLow = std.remaining_sessions <= 2;
                const isZero = std.remaining_sessions === 0;
                const classGroup = classGroups.find(g => g.id === std.class_group_id);

                return (
                  <div 
                    key={std.id} 
                    className="glass-card-interactive p-5 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-xl text-emerald-400 shadow-md">
                            {std.nickname ? std.nickname.charAt(0) : std.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-100 text-base font-['Prompt']">{std.name}</h3>
                            </div>
                            <p className="text-xs text-slate-400">ชื่อเล่น: <strong className="text-slate-200">{std.nickname}</strong> {std.age ? `• ${std.age} ปี` : ''}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditStudent(std)}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition"
                            title="แก้ไขโปรไฟล์นักเรียน"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`คุณต้องการลบข้อมูลของ ${std.name} ใช่หรือไม่?`)) {
                                onDeleteStudent(std.id);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition"
                            title="ลบนักเรียน"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Course Badge & Assigned Custom Group Name */}
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center justify-between">
                          <span className={std.course_type === 'group' ? 'badge-group' : 'badge-private'}>
                            {std.course_type === 'group' ? 'คอร์สกลุ่ม (3,500B)' : 'คอร์สเดี่ยว (1,200B)'}
                          </span>

                          <div className="flex items-center gap-1">
                            {DAYS_OF_WEEK.map(d => {
                              const isScheduled = std.training_days && std.training_days.includes(d.id);
                              return (
                                <span
                                  key={d.id}
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    isScheduled 
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                      : 'bg-slate-900 text-slate-600 border border-white/5 opacity-40'
                                  }`}
                                >
                                  {d.short}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <p className="text-[11px] text-cyan-300 font-semibold bg-slate-900/60 px-2 py-1 rounded-lg border border-white/5 truncate">
                          📍 {classGroup ? classGroup.name : 'กลุ่มซ้อมประจำ'}
                        </p>
                      </div>

                      {/* Sessions Credit Progress */}
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">คอร์สคงเหลือ:</span>
                          <span className={`font-bold px-2.5 py-0.5 rounded-lg text-xs ${
                            isZero ? 'credit-red' : isLow ? 'credit-yellow' : 'credit-green'
                          }`}>
                            {std.remaining_sessions} / {std.total_sessions} ครั้ง
                          </span>
                        </div>

                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              isZero ? 'bg-rose-500' : isLow ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${(std.remaining_sessions / std.total_sessions) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="text-xs text-slate-400 space-y-1 mb-4">
                        {std.parent_phone && (
                          <p className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>ผู้ปกครอง: {std.parent_phone}</span>
                          </p>
                        )}
                        {std.notes && (
                          <p className="text-[11px] text-slate-400 italic line-clamp-1">
                            "{std.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                      <button
                        onClick={() => onOpenSkillModal(std)}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>ประเมินทักษะ</span>
                      </button>

                      <button
                        onClick={() => onRenewCourse(std.id)}
                        className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                        title="เติมคอร์ส 8 ครั้ง"
                      >
                        <Repeat className="w-3.5 h-3.5" />
                        <span>ต่อคอร์ส +8</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 2: DYNAMIC CLASS GROUPS (ตั้งชื่อและจัดกลุ่มเรียนตามใจชอบ) */}
      {/* ------------------------------------------------------------- */}
      {subView === 'groups' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-['Prompt'] flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>รายชื่อกลุ่มซ้อมแยก (Custom Class Groups)</span>
            </h3>
            
            <button
              onClick={() => {
                setEditingGroup(null);
                setGroupFormData({ name: '', max: 5 });
                setIsAddGroupModalOpen(true);
              }}
              className="btn-primary text-xs"
            >
              <FolderPlus className="w-4 h-4" />
              <span>+ เพิ่มชื่อกลุ่มใหม่</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {classGroups.map((group) => {
              const groupEnrolledStudents = students.filter(s => s.class_group_id === group.id);
              const isFull = groupEnrolledStudents.length >= group.max;

              return (
                <div key={group.id} className="glass-card p-5 space-y-4 border border-white/10">
                  {/* Group Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base font-['Prompt']">
                          {group.name}
                        </h4>
                        <button
                          onClick={() => startEditGroup(group)}
                          className="p-1 text-slate-400 hover:text-white rounded"
                          title="แก้ไขชื่อกลุ่ม"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {classGroups.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`คุณต้องการลบกลุ่ม ${group.name} ใช่หรือไม่?`)) {
                                onDeleteGroup(group.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded"
                            title="ลบกลุ่ม"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        สมาชิกปัจจุบัน: <strong className="text-emerald-400">{groupEnrolledStudents.length}</strong> / {group.max} คน
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isFull ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {isFull ? 'เต็มแล้ว (Full)' : 'รับเพิ่มได้'}
                    </span>
                  </div>

                  {/* Enrolled Students inside this Group */}
                  <div className="space-y-2.5">
                    {groupEnrolledStudents.length === 0 ? (
                      <p className="py-6 text-center text-slate-500 text-xs">ยังไม่มีนักเรียนในกลุ่มนี้</p>
                    ) : (
                      groupEnrolledStudents.map((std) => (
                        <div key={std.id} className="p-3 bg-slate-900/80 border border-white/10 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-emerald-400 text-sm border border-white/10">
                              {std.nickname ? std.nickname.charAt(0) : std.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs font-['Prompt']">{std.name} ({std.nickname})</p>
                              <p className="text-[10px] text-slate-400">
                                ซ้อมวัน: {std.training_days?.map(d => DAYS_OF_WEEK.find(dw => dw.id === d)?.short).join(', ')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                              std.remaining_sessions <= 2 ? 'credit-red' : 'credit-green'
                            }`}>
                              เหลือ {std.remaining_sessions} ครั้ง
                            </span>
                            <button
                              onClick={() => startEditStudent(std)}
                              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                              title="ย้ายกลุ่ม/แก้ไข"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ADD / EDIT CUSTOM GROUP MODAL */}
      {/* ------------------------------------------------------------- */}
      {isAddGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141B27] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 relative">
            <button
              onClick={() => setIsAddGroupModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-['Prompt'] mb-1">
              {editingGroup ? 'แก้ไขชื่อกลุ่มซ้อม' : 'ตั้งชื่อกลุ่มซ้อมใหม่'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              กำหนดชื่อกลุ่มซ้อมแยกตามทีม/คลาสเรียนได้ตามต้องการ
            </p>

            <form onSubmit={handleSubmitGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ชื่อกลุ่มซ้อม *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น คอร์สกลุ่ม 1 (เด็กเล็ก), กลุ่มชุดแข่ง"
                  value={groupFormData.name}
                  onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ความจุสมาชิกสูงสุด (คน)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={groupFormData.max}
                  onChange={(e) => setGroupFormData({ ...groupFormData, max: e.target.value })}
                  className="form-input text-xs"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddGroupModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>บันทึกชื่อกลุ่ม</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2-STEP STUDENT REGISTRATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141B27] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-['Prompt'] mb-1">
              {editingStudent ? 'แก้ไขโปรไฟล์นักเรียน' : 'สร้างโปรไฟล์นักเรียนใหม่'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              กรอกโปรไฟล์ประจำตัว แล้วเลือกบรรจุลงกลุ่มซ้อมที่ต้องการ
            </p>

            <form onSubmit={handleSubmitStudent} className="space-y-4">
              
              {/* STEP 1: PERSONAL INFORMATION */}
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-white/10 space-y-3">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>ขั้นตอนที่ 1: ข้อมูลโปรไฟล์ส่วนตัว</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">ชื่อ-นามสกุล *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น พี่ปุณณ์"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">ชื่อเล่น *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น พี่ปุณณ์"
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">อายุ (ปี)</label>
                    <input
                      type="number"
                      placeholder="เช่น 10"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">เบอร์ติดต่อผู้ปกครอง</label>
                    <input
                      type="text"
                      placeholder="เช่น 081-234-5678"
                      value={formData.parent_phone}
                      onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    วันลงซ้อมประจำสัปดาห์:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {DAYS_OF_WEEK.map(day => {
                      const isChecked = formData.training_days && formData.training_days.includes(day.id);
                      return (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => toggleDaySelection(day.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                            isChecked 
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold' 
                              : 'bg-slate-800 text-slate-400 border-white/10 hover:bg-slate-700'
                          }`}
                        >
                          {day.short}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* STEP 2: COURSE & DYNAMIC GROUP ASSIGNMENT */}
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-white/10 space-y-3">
                <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>ขั้นตอนที่ 2: บรรจุลงคอร์สเรียน & เลือกกลุ่มซ้อม</span>
                </div>

                {/* Preset Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPackagePreset('group')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      formData.course_type === 'group'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                        : 'bg-slate-800 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-cyan-400">คอร์สกลุ่ม 8 ครั้ง</div>
                    <div className="text-xs font-extrabold text-white">3,500 บาท</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPackagePreset('private')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      formData.course_type === 'private'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                        : 'bg-slate-800 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-amber-400">คอร์สเดี่ยว 8 ครั้ง</div>
                    <div className="text-xs font-extrabold text-white">1,200 บาท</div>
                  </button>
                </div>

                {/* Select Class Group Dynamic Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">เลือกกลุ่มซ้อมประจำ:</label>
                  <select
                    value={formData.class_group_id}
                    onChange={(e) => setFormData({ ...formData, class_group_id: e.target.value })}
                    className="form-input text-xs font-semibold bg-slate-900 border-white/10 text-slate-200"
                  >
                    {classGroups.map(g => {
                      const count = students.filter(s => s.class_group_id === g.id).length;
                      return (
                        <option key={g.id} value={g.id}>
                          {g.name} ({count}/{g.max} คน)
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">จำนวนครั้งทั้งหมด</label>
                    <input
                      type="number"
                      value={formData.total_sessions}
                      onChange={(e) => setFormData({ ...formData, total_sessions: parseInt(e.target.value) || 8 })}
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">จำนวนครั้งคงเหลือ</label>
                    <input
                      type="number"
                      value={formData.remaining_sessions}
                      onChange={(e) => setFormData({ ...formData, remaining_sessions: parseInt(e.target.value) || 8 })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingStudent ? 'บันทึกการแก้ไข' : 'บันทึกโปรไฟล์ & ลงคอร์ส'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
