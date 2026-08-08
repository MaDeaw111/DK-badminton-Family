import { getSupabaseClient } from './supabase';

export const DAYS_OF_WEEK = [
  { id: 'Mon', label: 'วันจันทร์', short: 'จ.' },
  { id: 'Tue', label: 'วันอังคาร', short: 'อ.' },
  { id: 'Wed', label: 'วันพุธ', short: 'พ.' },
  { id: 'Thu', label: 'วันพฤหัสบดี', short: 'พฤ.' },
  { id: 'Fri', label: 'วันศุกร์', short: 'ศ.' },
  { id: 'Sat', label: 'วันเสาร์', short: 'ส.' },
  { id: 'Sun', label: 'วันอาทิตย์', short: 'อา.' }
];

// Initial Custom Class Groups (ตรงกับกลุ่มที่คุณโค้ชสร้างไว้ในระบบ)
export const INITIAL_CLASS_GROUPS = [
  { id: 'grp_1', name: 'บ้านแม่ปิณ&ปิณ', max: 5 },
  { id: 'grp_2', name: 'กลุ่มแนนและเพื่อนๆ', max: 5 },
  { id: 'grp_3', name: 'คอร์สเด็ก', max: 5 },
  { id: 'grp_private', name: 'คอร์สเรียนเดี่ยว (Private 1-on-1)', max: 1 }
];

// Student Master Registry
export const INITIAL_STUDENTS = [
  // กลุ่ม 1: บ้านแม่ปิณ&ปิณ (ซ้อมวันจันทร์)
  {
    id: 'std_1',
    name: 'แม่ปิณ',
    nickname: 'ปิณปิณ',
    age: 35,
    phone: '081-234-5678',
    parent_phone: '089-111-2222',
    training_days: ['Mon'],
    notes: 'คอร์สกลุ่มบ้านแม่ปิณ',
    course_type: 'group',
    class_group_id: 'grp_1',
    course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
    total_sessions: 8,
    remaining_sessions: 8,
    price: 3500,
    status: 'active'
  },
  {
    id: 'std_2',
    name: 'พ่อบิ๊ก',
    nickname: 'พ่อบิ๊ก',
    age: 38,
    phone: '082-999-8888',
    parent_phone: '086-444-5555',
    training_days: ['Mon'],
    notes: 'คอร์สกลุ่มบ้านแม่ปิณ',
    course_type: 'group',
    class_group_id: 'grp_1',
    course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
    total_sessions: 8,
    remaining_sessions: 8,
    price: 3500,
    status: 'active'
  },
  {
    id: 'std_3',
    name: 'เฮียตี้',
    nickname: 'เฮียตี้',
    age: 13,
    phone: '084-111-3333',
    parent_phone: '081-222-4444',
    training_days: ['Mon'],
    notes: 'คอร์สกลุ่มบ้านแม่ปิณ',
    course_type: 'group',
    class_group_id: 'grp_1',
    course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
    total_sessions: 8,
    remaining_sessions: 8,
    price: 3500,
    status: 'active'
  },
  {
    id: 'std_4',
    name: 'พี่เพ็ญ',
    nickname: 'พี่เพ็ญ',
    age: 30,
    phone: '085-777-6666',
    parent_phone: '081-333-9999',
    training_days: ['Mon'],
    notes: 'คอร์สกลุ่มบ้านแม่ปิณ',
    course_type: 'group',
    class_group_id: 'grp_1',
    course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
    total_sessions: 8,
    remaining_sessions: 8,
    price: 3500,
    status: 'active'
  },

  // กลุ่ม 2: กลุ่มแนนและเพื่อนๆ (ซ้อมวันอังคาร, พฤหัสบดี)
  {
    id: 'std_5',
    name: 'บิม',
    nickname: 'บิม',
    age: 14,
    phone: '081-444-5555',
    parent_phone: '089-999-0000',
    training_days: ['Tue', 'Thu'],
    notes: 'กลุ่มแนนและเพื่อนๆ',
    course_type: 'group',
    class_group_id: 'grp_2',
    course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
    total_sessions: 8,
    remaining_sessions: 6,
    price: 3500,
    status: 'active'
  },
  {
    id: 'std_6',
    name: 'ภาค',
    nickname: 'ภาค',
    age: 15,
    phone: '088-555-1234',
    parent_phone: '089-777-8888',
    training_days: ['Tue', 'Thu'],
    notes: 'กลุ่มแนนและเพื่อนๆ',
    course_type: 'group',
    class_group_id: 'grp_2',
    course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
    total_sessions: 8,
    remaining_sessions: 6,
    price: 3500,
    status: 'active'
  },
  {
    id: 'std_7',
    name: 'แนน',
    nickname: 'แนน',
    age: 15,
    phone: '089-222-3333',
    parent_phone: '081-999-8888',
    training_days: ['Tue', 'Thu'],
    notes: 'กลุ่มแนนและเพื่อนๆ',
    course_type: 'group',
    class_group_id: 'grp_2',
    course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
    total_sessions: 8,
    remaining_sessions: 6,
    price: 3500,
    status: 'active'
  },
  {
    id: 'std_8',
    name: 'แก้ม',
    nickname: 'แก้ม',
    age: 14,
    phone: '086-111-2222',
    parent_phone: '084-555-6666',
    training_days: ['Tue', 'Thu'],
    notes: 'กลุ่มแนนและเพื่อนๆ',
    course_type: 'group',
    class_group_id: 'grp_2',
    course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
    total_sessions: 8,
    remaining_sessions: 6,
    price: 3500,
    status: 'active'
  },

  // กลุ่ม 3: คอร์สเด็ก (ซ้อมวันพุธ, เสาร์)
  {
    id: 'std_9',
    name: 'พี่ปุณณ์',
    nickname: 'พี่ปุณณ์',
    age: 10,
    phone: '081-234-5678',
    parent_phone: '089-111-2222',
    training_days: ['Wed', 'Sat'],
    notes: 'คอร์สเด็กเล็ก',
    course_type: 'group',
    class_group_id: 'grp_3',
    course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
    total_sessions: 8,
    remaining_sessions: 8,
    price: 3500,
    status: 'active'
  },
  {
    id: 'std_10',
    name: 'คาถา',
    nickname: 'คาถา',
    age: 11,
    phone: '082-999-8888',
    parent_phone: '086-444-5555',
    training_days: ['Wed', 'Sat'],
    notes: 'คอร์สเด็กเล็ก',
    course_type: 'group',
    class_group_id: 'grp_3',
    course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
    total_sessions: 8,
    remaining_sessions: 8,
    price: 3500,
    status: 'active'
  },
  {
    id: 'std_11',
    name: 'ผิงผิง',
    nickname: 'เจ๊ผิง',
    age: 12,
    phone: '085-777-6666',
    parent_phone: '081-333-9999',
    training_days: ['Wed', 'Sat'],
    notes: 'คอร์สเด็กเล็ก',
    course_type: 'group',
    class_group_id: 'grp_3',
    course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
    total_sessions: 8,
    remaining_sessions: 8,
    price: 3500,
    status: 'active'
  },
  {
    id: 'std_12',
    name: 'หนึ่งคุณ',
    nickname: 'เฮียหนึ่ง',
    age: 12,
    phone: '088-555-1234',
    parent_phone: '089-777-8888',
    training_days: ['Wed', 'Sat'],
    notes: 'คอร์สเด็กเล็ก',
    course_type: 'group',
    class_group_id: 'grp_3',
    course_name: 'คอร์สกลุ่ม 8 ครั้ง (3,500B)',
    total_sessions: 8,
    remaining_sessions: 8,
    price: 3500,
    status: 'active'
  }
];

export const INITIAL_EVALUATIONS = {
  'std_1': { footwork: 3, serve: 4, forehand: 3, net_control: 2, defense: 3, comments: 'ฟุตเวิร์กคล่องขึ้น แต่ต้องระวังลูกหน้าตาข่าย' },
  'std_5': { footwork: 4, serve: 4, forehand: 5, net_control: 4, defense: 4, comments: 'ลูกตบแรงและแม่นยำมาก พัฒนาได้เร็ว' }
};

export const INITIAL_ATTENDANCE = [
  {
    id: 'att_1',
    student_id: 'std_1',
    coach_id: 'coach_1',
    session_date: '2026-08-08',
    status: 'present',
    notes: 'ซ้อมเคลียร์ลูกหลังและเซิร์ฟ',
    remaining_after: 8
  }
];

export const COACHES = [
  { id: 'coach_1', name: 'โค้ช A (Coach A)', role: 'Head Coach', icon: '🏸' },
  { id: 'coach_2', name: 'โค้ช B (Coach B)', role: 'Assistant Coach', icon: '🏸' }
];

export const loadLocalStudents = () => {
  const data = localStorage.getItem('dk_students');
  return data ? JSON.parse(data) : INITIAL_STUDENTS;
};

export const saveLocalStudents = (students) => {
  localStorage.setItem('dk_students', JSON.stringify(students));
};

export const loadLocalClassGroups = () => {
  const data = localStorage.getItem('dk_class_groups');
  return data ? JSON.parse(data) : INITIAL_CLASS_GROUPS;
};

export const saveLocalClassGroups = (groups) => {
  localStorage.setItem('dk_class_groups', JSON.stringify(groups));
};

export const loadLocalTrainingPlans = () => {
  const data = localStorage.getItem('dk_training_plans');
  return data ? JSON.parse(data) : {};
};

export const saveLocalTrainingPlans = (plans) => {
  localStorage.setItem('dk_training_plans', JSON.stringify(plans));
};

export const loadLocalAttendance = () => {
  const data = localStorage.getItem('dk_attendance');
  return data ? JSON.parse(data) : INITIAL_ATTENDANCE;
};

export const saveLocalAttendance = (logs) => {
  localStorage.setItem('dk_attendance', JSON.stringify(logs));
};

export const loadLocalEvaluations = () => {
  const data = localStorage.getItem('dk_evaluations');
  return data ? JSON.parse(data) : INITIAL_EVALUATIONS;
};

export const saveLocalEvaluations = (evals) => {
  localStorage.setItem('dk_evaluations', JSON.stringify(evals));
};
