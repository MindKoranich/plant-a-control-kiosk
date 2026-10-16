// PLANT A CONTROL - Admin Console Controller
// Real-time parameter editor for Kiosk with LocalStorage sync and JSON export

const STORAGE_ADMIN_SESSION = 'plant_a_control_admin_session';
const STORAGE_KIOSK_DATA_KEY = 'plant_a_control_kiosk_data';
const ADMIN_PASSWORD_DEFAULT = 'admin';

let activeData = null;
let currentAdminStage = 1;

// ==========================================================================
// 1. AUTHENTICATION & SESSION
// ==========================================================================

function checkAdminAuth() {
  const isAuth = sessionStorage.getItem(STORAGE_ADMIN_SESSION) === 'true';
  const loginView = document.getElementById('admin-login-view');
  const dashboardView = document.getElementById('admin-dashboard-view');

  if (isAuth) {
    if (loginView) loginView.classList.add('hidden');
    if (dashboardView) dashboardView.classList.remove('hidden');
    initAdminDashboard();
  } else {
    if (loginView) loginView.classList.remove('hidden');
    if (dashboardView) dashboardView.classList.add('hidden');
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const input = document.getElementById('admin-password-input');
  const errorMsg = document.getElementById('login-error-msg');
  const password = input ? input.value.trim() : '';

  if (password === ADMIN_PASSWORD_DEFAULT || password === '1234') {
    sessionStorage.setItem(STORAGE_ADMIN_SESSION, 'true');
    if (errorMsg) errorMsg.classList.add('hidden');
    checkAdminAuth();
    showToast('🔑 เข้าสู่ระบบผู้ดูแลระบบสำเร็จ');
  } else {
    if (errorMsg) errorMsg.classList.remove('hidden');
    if (input) input.focus();
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem(STORAGE_ADMIN_SESSION);
  checkAdminAuth();
  showToast('🚪 ออกจากระบบเรียบร้อยแล้ว');
}

function togglePasswordVisibility() {
  const input = document.getElementById('admin-password-input');
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

// ==========================================================================
// 2. DATA LOADING & INITIALIZATION
// ==========================================================================

async function initAdminDashboard() {
  await loadAdminData();
  renderAdminStageEditor(currentAdminStage);
}

async function loadAdminData() {
  // 1. Try to load from LocalStorage first (custom admin edits)
  try {
    const localRaw = localStorage.getItem(STORAGE_KIOSK_DATA_KEY);
    if (localRaw) {
      activeData = JSON.parse(localRaw);
      updateSaveStatus('โหลดข้อมูลล่าสุดจาก LocalStorage แล้ว');
      return;
    }
  } catch (e) {}

  // 2. Fetch data/kiosk-data.json
  try {
    const res = await fetch('data/kiosk-data.json');
    if (res.ok) {
      activeData = await res.json();
      updateSaveStatus('โหลดข้อมูลจาก data/kiosk-data.json แล้ว');
      return;
    }
  } catch (e) {
    console.warn('Could not fetch kiosk-data.json:', e);
  }

  // 3. Fallback dummy structure if offline
  if (!activeData) {
    activeData = {
      system: {
        siteName: 'Tomato OS',
        chamber: 'Chamber A • Greenhouse 01',
        cropName: 'Tomato Specimen 01',
        cropVariety: 'Cherry Tomato Premium',
        totalCycleDays: 110,
        systemStatus: 'SYSTEM ONLINE'
      },
      stages: {}
    };
  }
}

function updateSaveStatus(msg) {
  const el = document.getElementById('save-status-text');
  if (el) el.textContent = msg;
}

// ==========================================================================
// 3. STAGE TABS & FORM RENDERING
// ==========================================================================

function switchAdminStage(stageKey) {
  // Save current values before switching
  captureFormValues();
  currentAdminStage = stageKey;

  // Update tab buttons active state
  ['1', '2', '3', '4', 'system'].forEach(k => {
    const tabBtn = document.getElementById(`admin-tab-${k}`);
    if (tabBtn) {
      if (String(k) === String(stageKey)) {
        tabBtn.className = 'admin-tab active';
      } else {
        tabBtn.className = 'admin-tab';
      }
    }
  });

  renderAdminStageEditor(stageKey);
}

function renderAdminStageEditor(stageKey) {
  const container = document.getElementById('admin-editor-container');
  if (!container || !activeData) return;

  if (stageKey === 'system') {
    renderSystemEditor(container);
    return;
  }

  const s = activeData.stages?.[stageKey];
  if (!s) {
    container.innerHTML = `<div class="p-6 admin-glass text-center text-neutral-400 font-bold">ไม่พบข้อมูลสำหรับระยะที่ ${stageKey}</div>`;
    return;
  }

  const ec = s.metrics?.ec || {};
  const ph = s.metrics?.ph || {};
  const env = s.envMatrix || {};
  const cockpit = s.cockpit || {};
  const todos = s.todos || [];
  const warns = s.warns || [];
  const benchmarks = s.benchmarks || [];

  container.innerHTML = `
    <!-- 1. Hero Summary & Lifecycle -->
    <div class="admin-glass p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-[#1e3947] pb-3">
        <div class="flex items-center gap-3">
          <span class="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#2ef387]"></span>
          <h2 class="text-lg font-bold text-white">ข้อมูลทั่วไปประจำระยะ (Stage ${stageKey})</h2>
        </div>
        <span class="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
          STAGE ${stageKey} CONFIG
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="admin-label">ชื่อเต็มระยะ (Title)</label>
          <input type="text" id="edit-stage-title" class="admin-input" value="${s.stageHeaderTitle || s.title || ''}">
        </div>
        <div>
          <label class="admin-label">ชื่อสั้น (Short Name)</label>
          <input type="text" id="edit-stage-short" class="admin-input" value="${s.title || ''}">
        </div>
        <div>
          <label class="admin-label">จำนวนวันของระยะ (Days)</label>
          <input type="text" id="edit-stage-days" class="admin-input admin-input-mono" value="${s.days || ''}">
        </div>
        <div>
          <label class="admin-label">วันที่ในรอบปลูก (Day in Cycle)</label>
          <input type="number" id="edit-stage-dayin" class="admin-input admin-input-mono" value="${s.dayInStage || s.cropAge || 1}">
        </div>
      </div>

      <div>
        <label class="admin-label">คำอธิบายสรุปประจำระยะ (Description)</label>
        <textarea id="edit-stage-desc" class="admin-input" rows="2">${s.desc || ''}</textarea>
      </div>
    </div>

    <!-- 2. EC & pH Telemetry & Action Plan -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- EC Control Card -->
      <div class="admin-glass p-6 space-y-4 border-emerald-500/30">
        <div class="flex items-center justify-between border-b border-[#1e3947] pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">🧪</span>
            <h3 class="font-bold text-white text-base">การควบคุมสารละลายปุ๋ย (EC)</h3>
          </div>
          <span class="text-xs font-mono font-bold text-emerald-400">mS/cm</span>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="admin-label">ช่วงเป้าหมาย EC (Target Range)</label>
            <input type="text" id="edit-ec-target" class="admin-input admin-input-mono text-emerald-400 font-bold" value="${ec.target || '1.8–2.0'}">
          </div>
          <div>
            <label class="admin-label">ค่าที่วัดได้ล่าสุด (Current Value)</label>
            <input type="text" id="edit-ec-current" class="admin-input admin-input-mono text-white font-bold" value="${ec.current || '1.7'}">
          </div>
        </div>

        <div>
          <label class="admin-label">สถานะสรุป (Status Text)</label>
          <input type="text" id="edit-ec-status" class="admin-input" value="${ec.statusText || '✓ อยู่ในช่วง ✓'}">
        </div>

        <div>
          <label class="admin-label">คำแนะนำทันทีสำหรับเกษตรกร (EC Action Plan)</label>
          <textarea id="edit-ec-action" class="admin-input" rows="2">${ec.guideAction || ''}</textarea>
        </div>
      </div>

      <!-- pH Control Card -->
      <div class="admin-glass p-6 space-y-4 border-cyan-500/30">
        <div class="flex items-center justify-between border-b border-[#1e3947] pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">💧</span>
            <h3 class="font-bold text-white text-base">การควบคุมความเป็นกรด-ด่าง (pH)</h3>
          </div>
          <span class="text-xs font-mono font-bold text-cyan-400">pH Index</span>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="admin-label">ช่วงเป้าหมาย pH (Target Range)</label>
            <input type="text" id="edit-ph-target" class="admin-input admin-input-mono text-cyan-400 font-bold" value="${ph.target || '5.8–6.2'}">
          </div>
          <div>
            <label class="admin-label">ค่าที่วัดได้ล่าสุด (Current Value)</label>
            <input type="text" id="edit-ph-current" class="admin-input admin-input-mono text-white font-bold" value="${ph.current || '6.0'}">
          </div>
        </div>

        <div>
          <label class="admin-label">สถานะสรุป (Status Text)</label>
          <input type="text" id="edit-ph-status" class="admin-input" value="${ph.statusText || '✓ อยู่ในช่วง ✓'}">
        </div>

        <div>
          <label class="admin-label">คำแนะนำทันทีสำหรับเกษตรกร (pH Action Plan)</label>
          <textarea id="edit-ph-action" class="admin-input" rows="2">${ph.guideAction || ''}</textarea>
        </div>
      </div>
    </div>

    <!-- 3. Environmental Parameters (Temp, RH, VPD) -->
    <div class="admin-glass p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-[#1e3947] pb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">🌡️</span>
          <h3 class="font-bold text-white text-base">การควบคุมสภาพแวดล้อมโรงเรือน (Environment Control)</h3>
        </div>
        <span class="text-xs font-mono font-bold text-neutral-400">SENSOR READINGS</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Temp -->
        <div class="p-4 rounded-xl bg-[#091318] border border-[#1a3340] space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-bold text-white text-sm">อุณหภูมิ (°C)</span>
            <span class="text-xs text-amber-400 font-mono">TEMP</span>
          </div>
          <div>
            <label class="admin-label">ค่าปัจจุบัน (°C)</label>
            <input type="text" id="edit-env-temp-val" class="admin-input admin-input-mono" value="${env.temp?.val || '25.0°C'}">
          </div>
          <div>
            <label class="admin-label">เป้าหมายอุณหภูมิ</label>
            <input type="text" id="edit-env-temp-target" class="admin-input admin-input-mono" value="${env.temp?.target || 'เป้า 24–27°C'}">
          </div>
        </div>

        <!-- RH -->
        <div class="p-4 rounded-xl bg-[#091318] border border-[#1a3340] space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-bold text-white text-sm">ความชื้นสัมพัทธ์ (% RH)</span>
            <span class="text-xs text-cyan-400 font-mono">HUMIDITY</span>
          </div>
          <div>
            <label class="admin-label">ค่าปัจจุบัน (% RH)</label>
            <input type="text" id="edit-env-hum-val" class="admin-input admin-input-mono" value="${env.hum?.val || '76%'}">
          </div>
          <div>
            <label class="admin-label">เป้าหมายความชื้น</label>
            <input type="text" id="edit-env-hum-target" class="admin-input admin-input-mono" value="${env.hum?.target || 'เป้า 70–80%'}">
          </div>
        </div>

        <!-- VPD -->
        <div class="p-4 rounded-xl bg-[#091318] border border-[#1a3340] space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-bold text-white text-sm">แรงดันไอน้ำ (VPD kPa)</span>
            <span class="text-xs text-emerald-400 font-mono">TRANSPIRATION</span>
          </div>
          <div>
            <label class="admin-label">ค่า VPD ปัจจุบัน</label>
            <input type="text" id="edit-home-vpd" class="admin-input admin-input-mono" value="${s.homeTelemetry?.vpd || '0.85'}">
          </div>
          <div>
            <label class="admin-label">สถานะการคายน้ำ</label>
            <input type="text" id="edit-home-vpd-status" class="admin-input" value="${s.homeTelemetry?.vpdTarget || 'Transpiration: Gentle'}">
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Daily To-Do Tasks & Standard Operating Procedures (SOP) -->
    <div class="admin-glass p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-[#1e3947] pb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">📋</span>
          <h3 class="font-bold text-white text-base">ขั้นตอนปฏิบัติงานรายวัน & SOP (3 งานประจำวัน)</h3>
        </div>
        <span class="text-xs font-mono font-bold text-emerald-400">TO-DO CHECKLIST</span>
      </div>

      <div class="space-y-4" id="admin-todos-container">
        ${todos.map((t, idx) => `
          <div class="p-4 rounded-xl bg-[#0a161c] border border-[#1b3442] space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-400 text-sm">งานที่ ${idx + 1} (${t.time || ''})</span>
              <span class="text-xs font-mono text-neutral-400">TASK ${idx + 1}</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label class="admin-label">เวลาปฏิบัติงาน</label>
                <input type="text" id="edit-todo-time-${idx}" class="admin-input" value="${t.time || ''}">
              </div>
              <div class="md:col-span-3">
                <label class="admin-label">หัวข้องาน (Action Title)</label>
                <input type="text" id="edit-todo-title-${idx}" class="admin-input font-bold" value="${t.title || t.desc || ''}">
              </div>
            </div>
            <div>
              <label class="admin-label">คำอธิบายขั้นตอนโดยละเอียด</label>
              <textarea id="edit-todo-desc-${idx}" class="admin-input" rows="2">${t.desc || ''}</textarea>
            </div>
            ${t.sop ? `
              <div class="p-3 rounded-lg bg-[#061014] border border-[#142630] space-y-2">
                <span class="text-xs font-bold text-cyan-400 block">🧭 ขั้นตอน SOP ย่อย:</span>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" id="edit-todo-sop-0-${idx}" class="admin-input text-xs" value="${t.sop.steps?.[0] || ''}" placeholder="ขั้นตอนที่ 1">
                  <input type="text" id="edit-todo-sop-1-${idx}" class="admin-input text-xs" value="${t.sop.steps?.[1] || ''}" placeholder="ขั้นตอนที่ 2">
                  <input type="text" id="edit-todo-sop-2-${idx}" class="admin-input text-xs" value="${t.sop.steps?.[2] || ''}" placeholder="ขั้นตอนที่ 3">
                </div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 5. Precautions & Hazards -->
    <div class="admin-glass p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-[#1e3947] pb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">⚠️</span>
          <h3 class="font-bold text-white text-base">ข้อควรระวังสำคัญ & การวิเคราะห์ความเสี่ยง</h3>
        </div>
        <span class="text-xs font-mono font-bold text-red-400">CRITICAL HAZARDS</span>
      </div>

      <div class="space-y-4" id="admin-warns-container">
        ${warns.map((w, idx) => `
          <div class="p-4 rounded-xl bg-[#140b0e] border border-red-500/30 space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="md:col-span-2">
                <label class="admin-label text-red-300">ข้อควรระวังที่ ${idx + 1} (Title)</label>
                <input type="text" id="edit-warn-title-${idx}" class="admin-input font-bold" value="${w.title || ''}">
              </div>
              <div>
                <label class="admin-label text-red-300">ระดับความเสี่ยง (Severity)</label>
                <input type="text" id="edit-warn-sev-${idx}" class="admin-input text-red-400 font-bold" value="${w.severity || 'ระดับวิกฤต (Critical)'}">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="admin-label text-amber-300">🔍 สาเหตุและอาการที่พบ (Symptom)</label>
                <textarea id="edit-warn-sym-${idx}" class="admin-input" rows="2">${w.symptom || w.desc || ''}</textarea>
              </div>
              <div>
                <label class="admin-label text-emerald-300">🚨 แนวทางแก้ไขทันที (Action)</label>
                <textarea id="edit-warn-act-${idx}" class="admin-input" rows="2">${w.action || ''}</textarea>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 6. Agronomic Benchmarks (4 Criteria) -->
    <div class="admin-glass p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-[#1e3947] pb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">🎯</span>
          <h3 class="font-bold text-white text-base">เกณฑ์มาตรฐานคุณภาพพืช (4 ด้าน)</h3>
        </div>
        <span class="text-xs font-mono font-bold text-emerald-400">QUALITY BENCHMARKS</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${benchmarks.map((b, idx) => `
          <div class="p-4 rounded-xl bg-[#091318] border border-[#1b3442] space-y-2">
            <label class="admin-label">เกณฑ์ที่ ${idx + 1}</label>
            <input type="text" id="edit-bm-title-${idx}" class="admin-input font-bold text-white mb-2" value="${b.title || ''}">
            <textarea id="edit-bm-desc-${idx}" class="admin-input text-sm" rows="2">${b.desc || ''}</textarea>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSystemEditor(container) {
  const sys = activeData.system || {};
  container.innerHTML = `
    <div class="admin-glass p-6 space-y-5">
      <div class="flex items-center justify-between border-b border-[#1e3947] pb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">⚙️</span>
          <h2 class="text-lg font-bold text-white">ข้อมูลระบบ โรงเรือน และสายพันธุ์พืช (System Config)</h2>
        </div>
        <span class="text-xs font-mono font-bold text-cyan-400">GLOBAL SYSTEM</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="admin-label">ชื่อสถานี / ระบบ (Site Name)</label>
          <input type="text" id="edit-sys-site" class="admin-input font-bold" value="${sys.siteName || 'Tomato OS'}">
        </div>
        <div>
          <label class="admin-label">โรงเรือน / ห้องควบคุม (Chamber)</label>
          <input type="text" id="edit-sys-chamber" class="admin-input" value="${sys.chamber || 'Chamber A • Greenhouse 01'}">
        </div>
        <div>
          <label class="admin-label">รหัสตัวอย่างพืช (Crop Name)</label>
          <input type="text" id="edit-sys-crop" class="admin-input" value="${sys.cropName || 'Tomato Specimen 01'}">
        </div>
        <div>
          <label class="admin-label">ชื่อสายพันธุ์ (Crop Variety)</label>
          <input type="text" id="edit-sys-variety" class="admin-input" value="${sys.cropVariety || 'Cherry Tomato Premium'}">
        </div>
        <div>
          <label class="admin-label">จำนวนวันรอบการปลูกรวม (Total Cycle Days)</label>
          <input type="number" id="edit-sys-totaldays" class="admin-input admin-input-mono text-emerald-400 font-bold" value="${sys.totalCycleDays || 110}">
        </div>
        <div>
          <label class="admin-label">สถานะระบบ (System Status)</label>
          <input type="text" id="edit-sys-status" class="admin-input" value="${sys.systemStatus || 'SYSTEM ONLINE'}">
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// 4. CAPTURE FORM VALUES INTO activeData
// ==========================================================================

function captureFormValues() {
  if (!activeData) return;

  if (currentAdminStage === 'system') {
    const sys = activeData.system || (activeData.system = {});
    const site = document.getElementById('edit-sys-site');
    if (site) sys.siteName = site.value;
    const cham = document.getElementById('edit-sys-chamber');
    if (cham) sys.chamber = cham.value;
    const crop = document.getElementById('edit-sys-crop');
    if (crop) sys.cropName = crop.value;
    const varEl = document.getElementById('edit-sys-variety');
    if (varEl) sys.cropVariety = varEl.value;
    const td = document.getElementById('edit-sys-totaldays');
    if (td) sys.totalCycleDays = Number(td.value) || 110;
    const st = document.getElementById('edit-sys-status');
    if (st) sys.systemStatus = st.value;
    return;
  }

  const s = activeData.stages?.[currentAdminStage];
  if (!s) return;

  // 1. General
  const titleEl = document.getElementById('edit-stage-title');
  if (titleEl) s.stageHeaderTitle = titleEl.value;
  const shortEl = document.getElementById('edit-stage-short');
  if (shortEl) s.title = shortEl.value;
  const daysEl = document.getElementById('edit-stage-days');
  if (daysEl) s.days = daysEl.value;
  const dayInEl = document.getElementById('edit-stage-dayin');
  if (dayInEl) {
    s.dayInStage = Number(dayInEl.value) || 1;
    s.cropAge = s.dayInStage;
  }
  const descEl = document.getElementById('edit-stage-desc');
  if (descEl) s.desc = descEl.value;

  // 2. EC
  if (!s.metrics) s.metrics = {};
  if (!s.metrics.ec) s.metrics.ec = {};
  const ecTargetEl = document.getElementById('edit-ec-target');
  if (ecTargetEl) s.metrics.ec.target = ecTargetEl.value;
  const ecCurEl = document.getElementById('edit-ec-current');
  if (ecCurEl) s.metrics.ec.current = ecCurEl.value;
  const ecStatEl = document.getElementById('edit-ec-status');
  if (ecStatEl) s.metrics.ec.statusText = ecStatEl.value;
  const ecActEl = document.getElementById('edit-ec-action');
  if (ecActEl) s.metrics.ec.guideAction = ecActEl.value;

  // 3. pH
  if (!s.metrics.ph) s.metrics.ph = {};
  const phTargetEl = document.getElementById('edit-ph-target');
  if (phTargetEl) s.metrics.ph.target = phTargetEl.value;
  const phCurEl = document.getElementById('edit-ph-current');
  if (phCurEl) s.metrics.ph.current = phCurEl.value;
  const phStatEl = document.getElementById('edit-ph-status');
  if (phStatEl) s.metrics.ph.statusText = phStatEl.value;
  const phActEl = document.getElementById('edit-ph-action');
  if (phActEl) s.metrics.ph.guideAction = phActEl.value;

  // 4. Cockpit mirror
  if (!s.cockpit) s.cockpit = {};
  s.cockpit.ec = `${s.metrics.ec.target} mS/cm`;
  s.cockpit.ph = s.metrics.ph.target;

  // 5. Env
  if (!s.envMatrix) s.envMatrix = {};
  if (!s.envMatrix.ec) s.envMatrix.ec = {};
  s.envMatrix.ec.val = s.metrics.ec.current;
  s.envMatrix.ec.target = `เป้า ${s.metrics.ec.target}`;
  if (!s.envMatrix.ph) s.envMatrix.ph = {};
  s.envMatrix.ph.val = s.metrics.ph.current;
  s.envMatrix.ph.target = `เป้า ${s.metrics.ph.target}`;

  const tempVal = document.getElementById('edit-env-temp-val');
  if (tempVal) {
    if (!s.envMatrix.temp) s.envMatrix.temp = {};
    s.envMatrix.temp.val = tempVal.value;
  }
  const tempTarget = document.getElementById('edit-env-temp-target');
  if (tempTarget) s.envMatrix.temp.target = tempTarget.value;

  const humVal = document.getElementById('edit-env-hum-val');
  if (humVal) {
    if (!s.envMatrix.hum) s.envMatrix.hum = {};
    s.envMatrix.hum.val = humVal.value;
  }
  const humTarget = document.getElementById('edit-env-hum-target');
  if (humTarget) s.envMatrix.hum.target = humTarget.value;

  // 6. Todos
  if (s.todos) {
    s.todos.forEach((t, idx) => {
      const timeEl = document.getElementById(`edit-todo-time-${idx}`);
      if (timeEl) {
        t.time = timeEl.value;
        t.timeShort = timeEl.value.split('•')[0].trim();
      }
      const titleEl = document.getElementById(`edit-todo-title-${idx}`);
      if (titleEl) t.title = titleEl.value;
      const descEl = document.getElementById(`edit-todo-desc-${idx}`);
      if (descEl) t.desc = descEl.value;

      if (t.sop && t.sop.steps) {
        const s0 = document.getElementById(`edit-todo-sop-0-${idx}`);
        if (s0) t.sop.steps[0] = s0.value;
        const s1 = document.getElementById(`edit-todo-sop-1-${idx}`);
        if (s1) t.sop.steps[1] = s1.value;
        const s2 = document.getElementById(`edit-todo-sop-2-${idx}`);
        if (s2) t.sop.steps[2] = s2.value;
      }
    });
  }

  // 7. Warns
  if (s.warns) {
    s.warns.forEach((w, idx) => {
      const titleEl = document.getElementById(`edit-warn-title-${idx}`);
      if (titleEl) w.title = titleEl.value;
      const sevEl = document.getElementById(`edit-warn-sev-${idx}`);
      if (sevEl) w.severity = sevEl.value;
      const symEl = document.getElementById(`edit-warn-sym-${idx}`);
      if (symEl) w.symptom = symEl.value;
      const actEl = document.getElementById(`edit-warn-act-${idx}`);
      if (actEl) w.action = actEl.value;
    });
  }

  // 8. Benchmarks
  if (s.benchmarks) {
    s.benchmarks.forEach((b, idx) => {
      const titleEl = document.getElementById(`edit-bm-title-${idx}`);
      if (titleEl) b.title = titleEl.value;
      const descEl = document.getElementById(`edit-bm-desc-${idx}`);
      if (descEl) b.desc = descEl.value;
    });
  }
}

// ==========================================================================
// 5. ACTIONS: SAVE, EXPORT, COPY, RESET
// ==========================================================================

function saveKioskData() {
  captureFormValues();
  if (!activeData) return;

  try {
    const raw = JSON.stringify(activeData);
    localStorage.setItem(STORAGE_KIOSK_DATA_KEY, raw);
    localStorage.setItem('plant_a_control_kiosk_data_updated', String(Date.now()));
    updateSaveStatus(`บันทึกล่าสุด: ${new Date().toLocaleTimeString('th-TH')}`);
    showToast('💾 บันทึกข้อมูลเข้าสู่ตู้ Kiosk ทันทีเรียบร้อยแล้ว!');
  } catch (e) {
    alert('เกิดข้อผิดพลาดในการบันทึก: ' + e.message);
  }
}

function downloadJsonFile() {
  captureFormValues();
  if (!activeData) return;

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeData, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', 'kiosk-data.json');
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();

  showToast('📥 เริ่มดาวน์โหลดไฟล์ kiosk-data.json แล้ว!');
}

function copyJsonToClipboard() {
  captureFormValues();
  if (!activeData) return;

  const formatted = JSON.stringify(activeData, null, 2);
  navigator.clipboard.writeText(formatted).then(() => {
    showToast('📋 คัดลอก JSON ทั้งหมดลงคลิปบอร์ดแล้ว!');
  }).catch(() => {
    alert('ไม่สามารถคัดลอกลงคลิปบอร์ดได้ กรุณาใช้ปุ่มดาวน์โหลด');
  });
}

async function resetToDefaults() {
  if (!confirm('ยืนยันที่จะคืนค่าเริ่มต้นทั้งหมดใช่หรือไม่? (การแก้ไขที่ยังไม่ได้บันทึกลงไฟล์จะถูกล้าง)')) {
    return;
  }
  try {
    localStorage.removeItem(STORAGE_KIOSK_DATA_KEY);
    localStorage.setItem('plant_a_control_kiosk_data_updated', 'reset-' + Date.now());
    await loadAdminData();
    renderAdminStageEditor(currentAdminStage);
    showToast('🔄 คืนค่าเป็นชุดข้อมูลตั้งต้นเรียบร้อยแล้ว');
  } catch (e) {
    console.error(e);
  }
}

function showToast(message) {
  const toast = document.getElementById('admin-toast');
  const text = document.getElementById('admin-toast-text');
  if (!toast || !text) return;

  text.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Initial check on load
document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
});
