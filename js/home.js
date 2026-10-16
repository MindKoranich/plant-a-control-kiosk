// PLANT A CONTROL - Home Kiosk Controller
// Unified Specimen Tomato Kiosk with Live Telemetry & LocalStorage Sync

const STORAGE_TASKS_KEY = 'plant_a_control_tasks';
const STORAGE_STAGE_KEY = 'plant_a_control_active_stage';

// LocalStorage helpers for cross-page task & stage persistence
function getTaskStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_TASKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function setTaskStorage(taskId, isDone) {
  try {
    const data = getTaskStorage();
    data[taskId] = isDone;
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(data));
  } catch (e) {}
}

function isTaskCompleted(taskId, defaultChecked = false) {
  const data = getTaskStorage();
  return typeof data[taskId] === 'boolean' ? data[taskId] : defaultChecked;
}

// Live real-time clock
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeElement = document.getElementById('current-time');
  if (timeElement) {
    timeElement.textContent = `${hours}:${minutes}`;
  }
}
setInterval(updateClock, 1000);
updateClock();

// Growth Stages Data with Tomato Agronomy Targets
const STAGE_DATA = {
  1: {
    id: 1,
    title: 'เพาะกล้า',
    stageFullName: 'ระยะที่ 1: เพาะกล้า',
    badgeName: 'ระยะที่ 1: เพาะกล้า',
    day: 12,
    totalDays: 110,
    progressPct: 25,
    remainingDays: 98,
    cropAge: 12,
    cropStageLabel: 'ระยะเพาะกล้า',
    ec: '1.2',
    ph: '6.5',
    rangeSubtitle: 'ช่วงระยะวันที่ 1–25 (วันที่ 12 ของระยะนี้)',
    progressWidth: '8%',
    // Environmental telemetry
    temp: '24.0',
    tempTarget: 'Target: 22–26°C',
    tempStatus: '● OPTIMAL',
    tempBar: '75%',
    rh: '78',
    rhTarget: 'RH Range: 70–80%',
    rhStatus: '● OPTIMAL',
    rhBar: '78%',
    vpd: '0.80',
    vpdTarget: 'Transpiration: Gentle',
    vpdStatus: '● IDEAL',
    vpdBar: '50%',
    // Plant visual styling
    stemWidth: '10px',
    stemHeight: '8rem',
    fruitOpacity: [0, 0, 0, 0],
    fruitScale: 'scale(0.35)',
    todos: [
      {
        id: 'stage1_task0',
        time: '07:30 น.',
        timeStyle: 'border-emerald-500/70 text-emerald-400 bg-[#122227]',
        desc: 'แช่เมล็ดในน้ำอุ่น 50°C (30 นาที) กระตุ้นการงอก',
        defaultChecked: true
      },
      {
        id: 'stage1_task1',
        time: '10:00 น.',
        timeStyle: 'border-[#2b3c46] text-cyan-400 bg-[#162128]',
        desc: 'หยอดเมล็ดลงถาดเพาะ 104 หลุม คุม pH 6.0–6.8',
        defaultChecked: false
      },
      {
        id: 'stage1_task2',
        time: '16:00 น.',
        timeStyle: 'border-[#2b3c46] text-neutral-300 bg-[#162128]',
        desc: 'พ่นละอองฝอยรักษาความชื้นวัสดุเพาะ 70–80%',
        defaultChecked: false
      }
    ]
  },
  2: {
    id: 2,
    title: 'ต้นกล้า',
    stageFullName: 'ระยะที่ 2: ต้นกล้า',
    badgeName: 'ระยะที่ 2: ต้นกล้า',
    day: 35,
    totalDays: 110,
    progressPct: 71,
    remainingDays: 75,
    cropAge: 10,
    cropStageLabel: 'ระยะต้นกล้า',
    ec: '1.8',
    ph: '6.0',
    rangeSubtitle: 'ช่วงระยะวันที่ 26–50 (วันที่ 10 ของระยะนี้)',
    progressWidth: '36%',
    // Environmental telemetry
    temp: '23.0',
    tempTarget: 'Target: 22–25°C',
    tempStatus: '● NORMAL',
    tempBar: '68%',
    rh: '68',
    rhTarget: 'RH Range: 65–70%',
    rhStatus: '● OPTIMAL',
    rhBar: '68%',
    vpd: '0.92',
    vpdTarget: 'Transpiration: Stable',
    vpdStatus: '● IDEAL',
    vpdBar: '55%',
    // Plant visual styling
    stemWidth: '12px',
    stemHeight: '16rem',
    fruitOpacity: [0.9, 0.9, 0.9, 0.9],
    fruitScale: 'scale(0.8)',
    todos: [
      {
        id: 'stage2_task0',
        time: '08:00 น.',
        timeStyle: 'border-emerald-500/70 text-emerald-400 bg-[#122227]',
        desc: 'ตรวจวัดและปรับค่า EC 1.8–2.0 / pH 6.0',
        defaultChecked: true
      },
      {
        id: 'stage2_task1',
        time: '11:00 น.',
        timeStyle: 'border-[#2b3c46] text-cyan-400 bg-[#162128]',
        desc: 'ตรวจสุขภาพใบ ยอด และการจ่ายน้ำของหัวหยด',
        defaultChecked: false
      },
      {
        id: 'stage2_task2',
        time: '16:30 น.',
        timeStyle: 'border-[#2b3c46] text-neutral-300 bg-[#162128]',
        desc: 'แต่งกิ่งแขนง ตัดใบเหลืองล่าง และผูกเชือกค้าง',
        defaultChecked: false
      }
    ]
  },
  3: {
    id: 3,
    title: 'เติบโต',
    stageFullName: 'ระยะที่ 3: เติบโต',
    badgeName: 'ระยะที่ 3: เติบโต',
    day: 62,
    totalDays: 110,
    progressPct: 58,
    remainingDays: 48,
    cropAge: 42,
    cropStageLabel: 'ระยะเจริญเติบโต/ออกดอก',
    ec: '2.2',
    ph: '6.0',
    rangeSubtitle: 'ช่วงระยะวันที่ 51–75 (วันที่ 12 ของระยะนี้)',
    progressWidth: '64%',
    // Environmental telemetry
    temp: '22.5',
    tempTarget: 'Target: 21–24°C',
    tempStatus: '● OPTIMAL',
    tempBar: '65%',
    rh: '65',
    rhTarget: 'RH Range: 60–70%',
    rhStatus: '● OPTIMAL',
    rhBar: '65%',
    vpd: '0.98',
    vpdTarget: 'Transpiration: Active',
    vpdStatus: '● IDEAL',
    vpdBar: '60%',
    // Plant visual styling
    stemWidth: '14px',
    stemHeight: '18rem',
    fruitOpacity: [1, 1, 1, 1],
    fruitScale: 'scale(1.02)',
    todos: [
      {
        id: 'stage3_task0',
        time: '08:30 น.',
        timeStyle: 'border-emerald-500/70 text-emerald-400 bg-[#122227]',
        desc: 'ปรับสารอาหารสูตรขยายผล EC 2.2 / pH 6.0',
        defaultChecked: true
      },
      {
        id: 'stage3_task1',
        time: '13:00 น.',
        timeStyle: 'border-[#2b3c46] text-cyan-400 bg-[#162128]',
        desc: 'ช่วยผสมเกสรและตรวจช่อดอก',
        defaultChecked: false
      },
      {
        id: 'stage3_task2',
        time: '17:00 น.',
        timeStyle: 'border-[#2b3c46] text-neutral-300 bg-[#162128]',
        desc: 'ตัดใบแก่ใต้ช่อผลและคล้องคลิปพยุงผลผลิต',
        defaultChecked: false
      }
    ]
  },
  4: {
    id: 4,
    title: 'เก็บเกี่ยว',
    stageFullName: 'ระยะที่ 4: เก็บเกี่ยว',
    badgeName: 'ระยะที่ 4: เก็บเกี่ยว',
    day: 88,
    totalDays: 110,
    progressPct: 80,
    remainingDays: 22,
    cropAge: 68,
    cropStageLabel: 'ระยะสุกแก่/เก็บเกี่ยว',
    ec: '1.9',
    ph: '6.1',
    rangeSubtitle: 'ช่วงระยะวันที่ 76–110 (วันที่ 13 ของระยะนี้)',
    progressWidth: '92%',
    // Environmental telemetry
    temp: '21.5',
    tempTarget: 'Target: 20–23°C',
    tempStatus: '● NORMAL',
    tempBar: '60%',
    rh: '60',
    rhTarget: 'RH Range: 55–65%',
    rhStatus: '● DRYING',
    rhBar: '60%',
    vpd: '1.05',
    vpdTarget: 'Transpiration: High',
    vpdStatus: '● GOOD',
    vpdBar: '68%',
    // Plant visual styling
    stemWidth: '16px',
    stemHeight: '20rem',
    fruitOpacity: [1, 1, 1, 1],
    fruitScale: 'scale(1.12)',
    todos: [
      {
        id: 'stage4_task0',
        time: '07:00 น.',
        timeStyle: 'border-emerald-500/70 text-emerald-400 bg-[#122227]',
        desc: 'ตรวจระดับความสุกและสีผิวของผลมะเขือเทศ',
        defaultChecked: true
      },
      {
        id: 'stage4_task1',
        time: '09:30 น.',
        timeStyle: 'border-[#2b3c46] text-cyan-400 bg-[#162128]',
        desc: 'เก็บเกี่ยวผลผลิตและจัดเรียงในที่ร่ม',
        defaultChecked: false
      },
      {
        id: 'stage4_task2',
        time: '15:30 น.',
        timeStyle: 'border-[#2b3c46] text-neutral-300 bg-[#162128]',
        desc: 'คัดเกรด ชั่งน้ำหนัก และบันทึกผลผลิตประจำวัน',
        defaultChecked: false
      }
    ]
  }
};

let currentActiveStage = 2;

// Stage switching function
function selectStage(stageNum) {
  const data = STAGE_DATA[stageNum];
  if (!data) return;
  currentActiveStage = stageNum;

  try {
    localStorage.setItem(STORAGE_STAGE_KEY, String(stageNum));
  } catch (e) {}

  // 1. Update Lifecycle Stage Tracker
  const stageIcons = {
    1: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m0-16a8 8 0 100 16 8 8 0 000-16z" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    2: '<svg class="w-8 h-8 text-neutral-950" fill="currentColor" viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"></path></svg>',
    3: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    4: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
  };

  const progressBar = document.getElementById('stage-progress-bar');
  if (progressBar) {
    progressBar.style.width = data.progressWidth;
  }

  for (let i = 1; i <= 4; i++) {
    const btn = document.getElementById(`stage-btn-${i}`);
    const iconDiv = document.getElementById(`stage-icon-${i}`);
    const labelSpan = document.getElementById(`stage-label-${i}`);
    if (btn) {
      btn.setAttribute('aria-selected', i === stageNum ? 'true' : 'false');
      btn.setAttribute('tabindex', '0');
    }
    if (!iconDiv || !labelSpan) continue;

    if (i === stageNum) {
      // Active state
      iconDiv.className = 'w-14 h-14 rounded-full bg-emerald-400 border-2 border-emerald-300 flex items-center justify-center text-emerald-950 font-bold mb-1.5 scale-105 transition-all shadow-md';
      iconDiv.innerHTML = stageIcons[i] || `<svg class="w-7 h-7 text-neutral-950" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`;
      labelSpan.className = 'text-sm text-white font-extrabold tracking-wide whitespace-nowrap transition-colors';
    } else if (i < stageNum) {
      // Completed prior stage
      iconDiv.className = 'w-13 h-13 rounded-full bg-[#122227] border-2 border-emerald-500/70 flex items-center justify-center text-emerald-400 mb-2 shadow-sm transition-all group-hover:scale-105';
      iconDiv.innerHTML = `<svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`;
      labelSpan.className = 'text-sm text-neutral-300 font-medium whitespace-nowrap transition-colors';
    } else {
      // Future stage
      iconDiv.className = 'w-13 h-13 rounded-full bg-[#162128] border-2 border-[#2b3c46] flex items-center justify-center text-neutral-400 mb-2 transition-all group-hover:scale-105';
      iconDiv.innerHTML = stageIcons[i];
      labelSpan.className = 'text-sm text-neutral-400 font-medium whitespace-nowrap transition-colors';
    }
  }

  // 2. Update telemetry stats (top-left card)
  const elDay = document.getElementById('telemetry-day');
  if (elDay) elDay.textContent = data.day;

  const elStageName = document.getElementById('telemetry-stage-name');
  if (elStageName) elStageName.textContent = data.stageFullName;

  const elStagePct = document.getElementById('telemetry-stage-pct');
  if (elStagePct) elStagePct.textContent = `${data.progressPct}%`;

  const elProgressFill = document.getElementById('telemetry-progress-fill');
  if (elProgressFill) elProgressFill.style.width = `${data.progressPct}%`;

  const elRemaining = document.getElementById('telemetry-remaining');
  if (elRemaining) elRemaining.textContent = `เหลือ ${data.remainingDays} วัน`;

  const elCropStage = document.getElementById('telemetry-crop-stage-label');
  if (elCropStage) elCropStage.textContent = data.cropStageLabel;

  const elCropAge = document.getElementById('telemetry-crop-age-days');
  if (elCropAge) elCropAge.textContent = data.cropAge;

  const elEc = document.getElementById('telemetry-ec');
  if (elEc) elEc.textContent = `EC: ${data.ec}`;

  const elPh = document.getElementById('telemetry-ph');
  if (elPh) elPh.textContent = `pH: ${data.ph}`;

  // Environmental Telemetry (right column)
  const elTempVal = document.getElementById('telemetry-temp-val');
  if (elTempVal) elTempVal.textContent = data.temp;
  const elTempTarget = document.getElementById('telemetry-temp-target');
  if (elTempTarget) elTempTarget.textContent = data.tempTarget;
  const elTempStatus = document.getElementById('telemetry-temp-status');
  if (elTempStatus) elTempStatus.textContent = data.tempStatus;
  const elTempBar = document.getElementById('telemetry-temp-bar');
  if (elTempBar) elTempBar.style.width = data.tempBar;

  const elRhVal = document.getElementById('telemetry-rh-val');
  if (elRhVal) elRhVal.textContent = data.rh;
  const elRhTarget = document.getElementById('telemetry-rh-target');
  if (elRhTarget) elRhTarget.textContent = data.rhTarget;
  const elRhStatus = document.getElementById('telemetry-rh-status');
  if (elRhStatus) elRhStatus.textContent = data.rhStatus;
  const elRhBar = document.getElementById('telemetry-rh-bar');
  if (elRhBar) elRhBar.style.width = data.rhBar;

  const elVpdVal = document.getElementById('telemetry-vpd-val');
  if (elVpdVal) elVpdVal.textContent = data.vpd;
  const elVpdTarget = document.getElementById('telemetry-vpd-target');
  if (elVpdTarget) elVpdTarget.textContent = data.vpdTarget;
  const elVpdStatus = document.getElementById('telemetry-vpd-status');
  if (elVpdStatus) elVpdStatus.textContent = data.vpdStatus;
  const elVpdBar = document.getElementById('telemetry-vpd-bar');
  if (elVpdBar) elVpdBar.style.width = data.vpdBar;

  // 3. Update Todo List Card Header
  const elTasksBadge = document.getElementById('tasks-stage-badge');
  if (elTasksBadge) elTasksBadge.textContent = data.badgeName;

  const elTasksDay = document.getElementById('tasks-day-text');
  if (elTasksDay) elTasksDay.textContent = `วันที่ ${data.day}`;

  const elTasksRange = document.getElementById('tasks-range-text');
  if (elTasksRange) elTasksRange.textContent = data.rangeSubtitle;

  const equipmentLink = document.getElementById('equipment-link');
  if (equipmentLink) equipmentLink.href = `info.html?stage=${stageNum}`;

  const moreNavLink = document.getElementById('nav-more-btn');
  if (moreNavLink) moreNavLink.href = `info.html?stage=${stageNum}`;

  // 4. Render interactive To-Do items
  renderTodoList(data.todos, stageNum);

  // 5. Plant visual adjustment by stage
  const plantContainer = document.getElementById('specimen-plant-container');
  if (plantContainer) {
    plantContainer.setAttribute('data-stage', String(stageNum));
  }

  const plantStem = document.getElementById('plant-stem');
  if (plantStem) {
    plantStem.style.width = data.stemWidth;
    plantStem.style.height = data.stemHeight;
    plantStem.style.opacity = '1';
  }

  const fruitIds = ['plant-fruit-1', 'plant-fruit-2', 'plant-fruit-3', 'plant-fruit-4'];
  fruitIds.forEach((id, index) => {
    const el = document.getElementById(id);
    if (!el) return;
    const opacity = data.fruitOpacity[index] !== undefined ? data.fruitOpacity[index] : (stageNum >= 2 ? 1 : 0);
    el.style.opacity = String(opacity);
    el.style.transform = data.fruitScale;
  });
}

// Render To-Do items with separated click targets:
// Circle button: toggle completion state (immediate save to localStorage)
// Text & badges: click opens info.html?stage=X&tab=todo&task=Y to view complete step-by-step instructions
function renderTodoList(todos, stageNum) {
  const tasksContainer = document.getElementById('tasks-list-items');
  if (!tasksContainer) return;

  // Calculate checklist progress (exact match to design spec)
  const totalCount = todos.length;
  const doneCount = todos.filter(t => isTaskCompleted(t.id, t.defaultChecked)).length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const progressText = document.getElementById('home-tasks-progress-text');
  if (progressText) {
    progressText.textContent = `${doneCount} of ${totalCount} Tasks Completed (${pct}%)`;
  }
  const progressBar = document.getElementById('home-tasks-progress-bar');
  if (progressBar) {
    progressBar.style.width = `${pct}%`;
  }
  const statusBadge = document.getElementById('home-tasks-status-badge');
  if (statusBadge) {
    if (pct === 100) {
      statusBadge.className = 'text-[12px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1.5';
      statusBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400"></span>ALL DONE ✓';
    } else {
      statusBadge.className = 'text-[12px] font-mono font-bold text-[#2ef387] bg-[#2ef387]/15 border border-[#2ef387]/35 px-2.5 py-0.5 rounded-full flex items-center gap-1.5';
      statusBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-[#2ef387]"></span>IN PROGRESS';
    }
  }

  // Update procedure & equipment links for the active stage
  const procLink = document.getElementById('procedures-link');
  if (procLink) procLink.href = `info.html?stage=${stageNum}&tab=todo`;
  const equipLink = document.getElementById('equipment-link');
  if (equipLink) equipLink.href = `info.html?stage=${stageNum}&tab=equip`;

  tasksContainer.innerHTML = todos.map(todo => {
    const isDone = isTaskCompleted(todo.id, todo.defaultChecked);
    return `
      <div class="task-item-card flex items-center justify-between p-3.5 rounded-xl border transition-all ${
        isDone 
          ? 'bg-[#12221c]/70 border-emerald-500/40 is-completed' 
          : 'bg-[#162128]/70 hover:bg-[#162128] border-[#23323b] hover:border-[#2b3c46]'
      }" data-task-id="${todo.id}">
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          <!-- Circular checkbox button with 44px hitbox and keyboard support -->
          <button type="button" 
                  role="checkbox"
                  aria-checked="${isDone}"
                  tabindex="0"
                  class="task-check-btn ${isDone ? 'is-checked' : ''}" 
                  onclick="handleTaskToggle('${todo.id}', ${todo.defaultChecked}, event)"
                  onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();handleTaskToggle('${todo.id}', ${todo.defaultChecked}, event);}"
                  aria-label="${isDone ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}"
                  title="${isDone ? 'คลิกเพื่อยกเลิก' : 'คลิกเพื่อบันทึกว่าทำเสร็จแล้ว'}">
            <span class="check-dot"></span>
          </button>
          
          <!-- Task description link to info.html with tab=todo&task=ID deep link -->
          <a href="info.html?stage=${stageNum}&tab=todo&task=${todo.id}" 
             class="task-text-link" 
             title="คลิกเพื่อดูขั้นตอนปฏิบัติ SOP ในหน้าข้อมูลเพิ่มเติม">
            <span class="px-3 py-1.5 rounded-md border text-[13.5px] font-mono font-bold tracking-wider ${todo.timeStyle} flex-shrink-0">
              ${todo.time}
            </span>
            <span class="task-text text-[16.5px] font-semibold text-white tracking-normal font-sans transition-colors leading-relaxed">
              ${todo.desc}
            </span>
          </a>
        </div>
        
        <!-- Hint link icon with min 44px touch target linking to specific task SOP -->
        <a href="info.html?stage=${stageNum}&tab=todo&task=${todo.id}" 
           class="text-[13.5px] text-cyan-300 hover:text-emerald-300 font-bold pl-3 py-2 min-h-[44px] flex items-center gap-1 transition-colors"
           title="ดูรายละเอียดขั้นตอน SOP">
          <span>วิธีทำ</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    `;
  }).join('');
}

// Toggle task status and update localStorage
function handleTaskToggle(taskId, defaultChecked, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const currentStatus = isTaskCompleted(taskId, defaultChecked);
  const newStatus = !currentStatus;
  setTaskStorage(taskId, newStatus);

  // Re-render current stage To-Dos to reflect change
  const data = STAGE_DATA[currentActiveStage];
  if (data) {
    renderTodoList(data.todos, currentActiveStage);
  }
}

// Real-time synchronization when tasks are toggled from another page/tab (e.g. info.html)
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_TASKS_KEY) {
    const data = STAGE_DATA[currentActiveStage];
    if (data && data.todos) {
      renderTodoList(data.todos, currentActiveStage);
    }
  }
});

// Dynamic JSON Loader: fetch from LocalStorage (Admin edited) or data/kiosk-data.json
async function loadKioskDataAndApply() {
  try {
    let json = null;
    try {
      const localRaw = localStorage.getItem('plant_a_control_kiosk_data');
      if (localRaw) {
        json = JSON.parse(localRaw);
      }
    } catch (e) {}

    if (!json) {
      const res = await fetch('data/kiosk-data.json');
      if (res.ok) {
        json = await res.json();
      }
    }

    if (json && json.stages) {
      for (const [key, s] of Object.entries(json.stages)) {
        const num = Number(key);
        if (STAGE_DATA[num]) {
          STAGE_DATA[num].title = s.title || STAGE_DATA[num].title;
          STAGE_DATA[num].stageFullName = s.stageFullName || STAGE_DATA[num].stageFullName;
          STAGE_DATA[num].badgeName = s.badgeName || STAGE_DATA[num].badgeName;
          STAGE_DATA[num].day = s.dayInStage || s.cropAge || STAGE_DATA[num].day;
          STAGE_DATA[num].totalDays = s.totalDays || STAGE_DATA[num].totalDays;
          STAGE_DATA[num].progressPct = s.progressPct || STAGE_DATA[num].progressPct;
          STAGE_DATA[num].remainingDays = s.remainingDays || STAGE_DATA[num].remainingDays;
          STAGE_DATA[num].cropAge = s.cropAge || STAGE_DATA[num].cropAge;
          STAGE_DATA[num].cropStageLabel = s.cropStageLabel || STAGE_DATA[num].cropStageLabel;
          STAGE_DATA[num].progressWidth = s.progressWidth || STAGE_DATA[num].progressWidth;
          STAGE_DATA[num].rangeSubtitle = s.rangeSubtitle || STAGE_DATA[num].rangeSubtitle;

          // Environmental telemetry
          if (s.homeTelemetry) {
            STAGE_DATA[num].ec = s.homeTelemetry.ec || STAGE_DATA[num].ec;
            STAGE_DATA[num].ph = s.homeTelemetry.ph || STAGE_DATA[num].ph;
            STAGE_DATA[num].temp = s.homeTelemetry.temp || STAGE_DATA[num].temp;
            STAGE_DATA[num].tempTarget = s.homeTelemetry.tempTarget || STAGE_DATA[num].tempTarget;
            STAGE_DATA[num].tempStatus = s.homeTelemetry.tempStatus || STAGE_DATA[num].tempStatus;
            STAGE_DATA[num].tempBar = s.homeTelemetry.tempBar || STAGE_DATA[num].tempBar;
            STAGE_DATA[num].rh = s.homeTelemetry.rh || STAGE_DATA[num].rh;
            STAGE_DATA[num].rhTarget = s.homeTelemetry.rhTarget || STAGE_DATA[num].rhTarget;
            STAGE_DATA[num].rhStatus = s.homeTelemetry.rhStatus || STAGE_DATA[num].rhStatus;
            STAGE_DATA[num].rhBar = s.homeTelemetry.rhBar || STAGE_DATA[num].rhBar;
            STAGE_DATA[num].vpd = s.homeTelemetry.vpd || STAGE_DATA[num].vpd;
            STAGE_DATA[num].vpdTarget = s.homeTelemetry.vpdTarget || STAGE_DATA[num].vpdTarget;
            STAGE_DATA[num].vpdStatus = s.homeTelemetry.vpdStatus || STAGE_DATA[num].vpdStatus;
            STAGE_DATA[num].vpdBar = s.homeTelemetry.vpdBar || STAGE_DATA[num].vpdBar;
            if (s.homeTelemetry.stemWidth) STAGE_DATA[num].stemWidth = s.homeTelemetry.stemWidth;
            if (s.homeTelemetry.stemHeight) STAGE_DATA[num].stemHeight = s.homeTelemetry.stemHeight;
            if (s.homeTelemetry.fruitOpacity) STAGE_DATA[num].fruitOpacity = s.homeTelemetry.fruitOpacity;
            if (s.homeTelemetry.fruitScale) STAGE_DATA[num].fruitScale = s.homeTelemetry.fruitScale;
          }

          if (s.todos && s.todos.length > 0) {
            STAGE_DATA[num].todos = s.todos.map(t => ({
              id: t.id,
              time: t.timeShort || t.time,
              timeStyle: t.timeStyle || 'border-[#2b3c46] text-neutral-300 bg-[#162128]',
              desc: t.title || t.desc,
              defaultChecked: Boolean(t.defaultChecked)
            }));
          }
        }
      }

      if (json && json.system && json.system.siteName) {
        const logoTitle = document.getElementById('siteLogoTitle');
        if (logoTitle) logoTitle.textContent = json.system.siteName;
      }

      // Re-render current stage with new data from JSON
      selectStage(currentActiveStage);
    }
  } catch (err) {
    console.info('Home kiosk operating with embedded dataset:', err.message);
  }
}

// Initialize on page load: check URL query parameter or localStorage
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedStage = Number(urlParams.get('stage'));
  let initialStage = 2;

  if (Number.isInteger(requestedStage) && STAGE_DATA[requestedStage]) {
    initialStage = requestedStage;
  } else {
    try {
      const savedStage = Number(localStorage.getItem(STORAGE_STAGE_KEY));
      if (Number.isInteger(savedStage) && STAGE_DATA[savedStage]) {
        initialStage = savedStage;
      }
    } catch (e) {}
  }

  selectStage(initialStage);
  loadKioskDataAndApply();
});

// Sync on storage change (if admin updates values or user toggles tasks in another tab)
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_TASKS_KEY) {
    const data = STAGE_DATA[currentActiveStage];
    if (data) renderTodoList(data.todos, currentActiveStage);
  } else if (event.key === 'plant_a_control_kiosk_data' || event.key === 'plant_a_control_kiosk_data_updated') {
    loadKioskDataAndApply();
  }
});
