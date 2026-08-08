import React, { useState } from 'react';
import { Award, Star, Save, User, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

// Custom SVG Radar Chart component
function RadarChart({ data }) {
  // data: { footwork: 3, serve: 4, forehand: 5, net_control: 3, defense: 4 }
  const skills = [
    { key: 'footwork', label: 'ฟุตเวิร์ก', val: data.footwork || 3 },
    { key: 'serve', label: 'ลูกเซิร์ฟ', val: data.serve || 3 },
    { key: 'forehand', label: 'ลูกตบ/โฟร์แฮนด์', val: data.forehand || 3 },
    { key: 'net_control', label: 'คุมหน้าตาข่าย', val: data.net_control || 3 },
    { key: 'defense', label: 'เกมรับ/ตั้งรับ', val: data.defense || 3 }
  ];

  const size = 260;
  const center = size / 2;
  const radius = 90;
  const numLevels = 5;

  const getCoordinates = (index, total, value) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (value / 5) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate web background polygons
  const webLevels = Array.from({ length: numLevels }, (_, i) => {
    const levelVal = i + 1;
    const points = skills.map((_, idx) => {
      const { x, y } = getCoordinates(idx, skills.length, levelVal);
      return `${x},${y}`;
    }).join(' ');
    return points;
  });

  // Generate data polygon points
  const dataPoints = skills.map((s, idx) => {
    const { x, y } = getCoordinates(idx, skills.length, s.val);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background webs */}
        {webLevels.map((pts, idx) => (
          <polygon
            key={idx}
            points={pts}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />
        ))}

        {/* Axes lines */}
        {skills.map((_, idx) => {
          const { x, y } = getCoordinates(idx, skills.length, 5);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
            />
          );
        })}

        {/* Polygon Area */}
        <polygon
          points={dataPoints}
          fill="rgba(0, 230, 118, 0.25)"
          stroke="#00E676"
          strokeWidth="2.5"
          className="transition-all duration-300"
        />

        {/* Data Point Circles */}
        {skills.map((s, idx) => {
          const { x, y } = getCoordinates(idx, skills.length, s.val);
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="4.5"
              fill="#00E5FF"
              stroke="#0B0F17"
              strokeWidth="2"
            />
          );
        })}

        {/* Labels */}
        {skills.map((s, idx) => {
          const { x, y } = getCoordinates(idx, skills.length, 5.8);
          return (
            <text
              key={idx}
              x={x}
              y={y}
              fill="#94A3B8"
              fontSize="10"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {s.label} ({s.val})
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default function SkillEvaluator({ 
  students, 
  evaluations, 
  currentCoach, 
  onSaveEvaluation,
  initialStudent = null 
}) {
  const [selectedStudentId, setSelectedStudentId] = useState(
    initialStudent ? initialStudent.id : (students[0]?.id || '')
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const currentEval = evaluations[selectedStudentId] || {
    footwork: 3,
    serve: 3,
    forehand: 3,
    net_control: 3,
    defense: 3,
    comments: ''
  };

  const [formEval, setFormEval] = useState(currentEval);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state on student change
  const handleStudentChange = (id) => {
    setSelectedStudentId(id);
    const existing = evaluations[id] || {
      footwork: 3,
      serve: 3,
      forehand: 3,
      net_control: 3,
      defense: 3,
      comments: ''
    };
    setFormEval(existing);
  };

  const handleStarChange = (key, val) => {
    setFormEval(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    onSaveEvaluation(selectedStudentId, formEval);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Banner */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <Award className="w-4 h-4" />
            <span>Badminton Skill Radar Evaluator</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-['Prompt']">
            ประเมินทักษะและพัฒนาการนักเรียน
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ให้คะแนนทักษะ 5 ด้านหลัก (1-5 ดาว) เพื่อสร้างกราฟใยแมงมุมแสดงพัฒนาการ
          </p>
        </div>

        {/* Student Picker */}
        <div className="w-full sm:w-64">
          <label className="block text-xs font-semibold text-slate-300 mb-1">เลือกนักเรียนที่จะประเมิน:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => handleStudentChange(e.target.value)}
            className="form-input text-xs font-semibold bg-slate-900 border-emerald-500/40 text-emerald-300"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.nickname})
              </option>
            ))}
          </select>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>บันทึกแบบประเมินทักษะของ {selectedStudent?.name} เรียบร้อยแล้ว!</span>
        </div>
      )}

      {selectedStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: 5-Star Rating Controls */}
          <div className="glass-card p-6 space-y-5">
            <h3 className="font-bold text-white text-base font-['Prompt'] flex items-center gap-2 border-b border-white/10 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ให้คะแนนทักษะรายบุคคล</span>
            </h3>

            {/* 5 Rating Fields */}
            {[
              { key: 'footwork', title: '1. ฟุตเวิร์ก & การเคลื่อนที่ (Footwork)', desc: 'ความเร็วการก้าวเท้า การทรงตัว และฟุตเวิร์ก 6 จุด' },
              { key: 'serve', title: '2. ลูกเซิร์ฟ & การเสิร์ฟ (Serve & Return)', desc: 'ความแม่นยำในการเสิร์ฟสั้น/เสิร์ฟยาว' },
              { key: 'forehand', title: '3. ลูกตีหลังคอร์ด / โฟร์แฮนด์ (Forehand)', desc: 'ลูกเซฟ/เคลียร์, ลูกดร็อป และลูกตบหลังคอร์ด' },
              { key: 'net_control', title: '4. การคุมหน้าตาข่าย (Net Control)', desc: 'ลูกหยอด, ลูกตัดหน้าเน็ต และความนิ่งหน้าพลาสติก' },
              { key: 'defense', title: '5. เกมรับ & การรับลูกตบ (Defense)', desc: 'การรับลูกตบ, การดักลูกสวน และสายตาอ่านเกม' }
            ].map(attr => (
              <div key={attr.key} className="p-3 bg-slate-900/50 border border-white/5 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200">{attr.title}</h4>
                  
                  {/* Star Rating Buttons */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarChange(attr.key, star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star 
                          className={`w-4 h-4 ${
                            star <= (formEval[attr.key] || 3)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">{attr.desc}</p>
              </div>
            ))}

            {/* Coach Comments */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">ความเห็นและคำแนะนำจากโค้ช:</label>
              <textarea
                rows="3"
                value={formEval.comments || ''}
                onChange={(e) => setFormEval({ ...formEval, comments: e.target.value })}
                placeholder="เช่น ควรเน้นฝึกสไลด์ก้าวเท้าด้านขวา และจังหวะจุดกระทบลูก..."
                className="form-input text-xs"
              ></textarea>
            </div>

            <button
              onClick={handleSave}
              className="btn-primary w-full"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการประเมินทักษะ</span>
            </button>
          </div>

          {/* Right Column: Visual Radar Chart & Summary */}
          <div className="glass-card p-6 flex flex-col items-center justify-between">
            <div className="w-full text-center mb-2">
              <h3 className="font-bold text-white text-base font-['Prompt']">
                ผังกราฟใยแมงมุมแสดงทักษะ (Skill Radar Chart)
              </h3>
              <p className="text-xs text-emerald-400 mt-1 font-medium">
                {selectedStudent.name} ({selectedStudent.nickname})
              </p>
            </div>

            {/* SVG Radar Chart Visual */}
            <div className="my-6">
              <RadarChart data={formEval} />
            </div>

            {/* Skill Averages */}
            <div className="w-full p-4 bg-slate-900/60 rounded-xl border border-white/10 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">ผู้ประเมิน:</span>
                <span className="font-semibold text-emerald-400">{currentCoach.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">คะแนนเฉลี่ยรวม:</span>
                <span className="font-bold text-amber-400 text-sm">
                  {(( (formEval.footwork||3) + (formEval.serve||3) + (formEval.forehand||3) + (formEval.net_control||3) + (formEval.defense||3) ) / 5).toFixed(1)} / 5.0
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
