// PLANT A CONTROL - Info Kiosk Controller
// Growth stages guide with live clock and cross-page LocalStorage sync

const STORAGE_TASKS_KEY = 'plant_a_control_tasks';
const STORAGE_STAGE_KEY = 'plant_a_control_active_stage';

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
function updateInfoClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeElement = document.getElementById('info-current-time');
  if (timeElement) {
    timeElement.textContent = `${hours}:${minutes}`;
  }
}
setInterval(updateInfoClock, 1000);
updateInfoClock();

const stageData = {
  1: {
    stageBadge: "ระยะที่ 1: เพาะกล้า",
    title: "ระยะเพาะเมล็ดและอนุบาลต้นกล้า (วันที่ 1–25)",
    desc: "เร่งการงอกที่สมบูรณ์ ควบคุมความชื้นสัมพัทธ์ 70–80% และเฝ้าระวังโรคเน่าคอดิน",
    days: "25 วัน",
    progress: "วันที่ 12 / 110 วันรวม",
    cockpit: {
      ec: "0.8–1.2 mS/cm",
      ph: "5.8–6.2",
      temp: "24–27°C"
    },
    envMatrix: {
      ec: { val: "1.0", target: "เป้า 0.8–1.2", status: "✓ สมบูรณ์", color: "#2ef387" },
      ph: { val: "6.0", target: "เป้า 5.8–6.2", status: "✓ เหมาะสม", color: "#2ef387" },
      temp: { val: "25.0°C", target: "เป้า 24–27°C", status: "✓ ปกติ", color: "#2ef387" },
      hum: { val: "76%", target: "เป้า 70–80%", status: "✓ ชื้นดี", color: "#22d3ee" }
    },
    todos: [
      {
        time: "07:30 น. • เช้าตรู่",
        timeBg: "text-bio-accent",
        title: "แช่เมล็ดพันธุ์ในน้ำอุ่น 50°C เป็นเวลา 30 นาที",
        desc: "คัดเลือกเมล็ดที่สมบูรณ์ เมล็ดเต็ม ไม่ลอยน้ำ แช่น้ำอุ่นควบคุมอุณหภูมิคงที่เพื่อกระตุ้นการงอกและทำลายเชื้อราที่อาจปนเปื้อนผิวเปลือกเมล็ด",
        badges: ["อุณหภูมิเป้าหมาย: 48–50°C", "ระยะเวลา: 30 นาที", "คัดเมล็ดจมน้ำ"],
        done: true
      },
      {
        time: "10:00 น. • ช่วงสาย",
        timeBg: "text-bio-cyan",
        title: "หยอดเมล็ดลงถาดเพาะ 104 หลุม และกลบวัสดุโปร่ง",
        desc: "ใช้วัสดุเพาะพีทมอสชุ่มชื้นพอเหมาะ หยอดเมล็ดหลุมละ 1 เมล็ด ลึกประมาณ 0.5 ซม. กลบหน้าเบามือและพรางแสง 50% วางในที่อากาศถ่ายเทสะดวก",
        badges: ["พีทมอสคุณภาพสูง", "ลึก 0.5 ซม.", "พรางแสง 50%"],
        done: false
      },
      {
        time: "16:00 น. • ช่วงเย็น",
        timeBg: "text-bio-muted",
        title: "พ่นละอองฝอยรักษาสภาพความชื้นและตรวจโรคเน่าคอดิน",
        desc: "สเปรย์ละอองน้ำละเอียดทั่วแปลงเพาะ ควบคุมความชื้นสัมพัทธ์ 70–80% ตรวจสอบโคนต้นกล้าไม่ให้มีรอยช้ำคอดินจากเชื้อรา",
        badges: ["ความชื้น: 70–80%", "ตรวจโคนเน่าคอดิน", "ละอองน้ำละเอียด"],
        done: false
      }
    ],
    equips: [
      {
        cat: "วัสดุเพาะและเมล็ดพันธุ์",
        items: [
          { name: "เมล็ดพันธุ์มะเขือเทศพรีเมียม", detail: "อัตราการงอก >85% เมล็ดเคลือบปลอดเชื้อรา" },
          { name: "ถาดเพาะกล้าขนาด 104 หลุม", detail: "พลาสติกหนา ระบายน้ำก้นหลุมดี ไม่ขังแฉะ" },
          { name: "พีทมอสคัดเกรดเพาะเมล็ด", detail: "เนื้อละเอียด อุ้มน้ำพอดี ค่า pH 5.5–6.0" },
          { name: "ขุยมะพร้าวร่อนล้างสารแทนนิน", detail: "แช่น้ำลดค่า EC ต่ำกว่า 0.5 เรียบร้อย" }
        ]
      },
      {
        cat: "เครื่องมือวัดและพ่นละอองน้ำ",
        items: [
          { name: "เทอร์โมมิเตอร์วัดน้ำดิจิทัล", detail: "ความแม่นยำสูง ±0.1°C ควบคุมน้ำแช่ 50°C" },
          { name: "กระบอกพ่นละอองฝอยแรงดัน", detail: "ละอองหมอกละเอียด ไม่กระทบต้นกล้าอ่อน" },
          { name: "เครื่องวัดอุณหภูมิและความชื้นสัมพัทธ์", detail: "เซนเซอร์ดิจิทัลตรวจจับช่วง 70–80% RH" },
          { name: "สแลนพรางแสง 50% กรองรังสี", detail: "ลดความเข้มแสงแดดเที่ยงวัน ถ่ายเทอากาศดี" }
        ]
      }
    ],
    warnTitle: "ข้อควรระวังสำคัญสำหรับระยะเพาะกล้า (Stage 1)",
    warns: [
      {
        title: "ระวังโรคเน่าคอดิน (Damping-off)",
        severity: "ระดับวิกฤต (Critical)",
        symptom: "เกิดจากเชื้อราในดินเมื่อมีความชื้นสะสมสูงเกินไปและอากาศไม่ถ่ายเท โคนต้นกล้าช้ำลีบและหักล้ม",
        action: "ถอนทำลายต้นที่เป็นโรคทันที งดการรดน้ำซ้ำ และสเปรย์ชีวภัณฑ์ไตรโคเดอร์มาควบคุมทั่วถาด"
      },
      {
        title: "ห้ามรดน้ำแรงเด็ดขาด",
        severity: "ความเสี่ยงสูง (High Risk)",
        symptom: "แรงดันน้ำกระแทกทำให้เมล็ดหลุดลอยจากหลุมเพาะ หรือต้นกล้าแรกเกิดหักโค่นรากหลุด",
        action: "ปรับหัวฉีดเป็นละอองหมอกละเอียด (Fine Mist) พ่นเหนือถาดเพาะ 30 ซม. ให้ละอองตกลงอย่างนุ่มนวล"
      },
      {
        title: "อุณหภูมิน้ำแช่เมล็ดเกินกำหนด",
        severity: "ความเสี่ยงสูง (High Risk)",
        symptom: "ใช้น้ำร้อนเกิน 52°C แช่เมล็ด ทำลายคัพภะ (Embryo) ภายในเมล็ดจนไม่งอกหรือเน่าในถาด",
        action: "ใช้เทอร์โมมิเตอร์ดิจิทัลจุ่มวัดน้ำก่อนใส่เมล็ด คุมอุณหภูมิให้อยู่ที่ 48–50°C นาน 30 นาทีพอดี"
      }
    ],
    adviceTitle: "เกณฑ์การคัดเลือกต้นกล้าก่อนย้ายปลูก (วันที่ 18–25)",
    adviceDesc: "ต้นกล้าที่มีความพร้อมย้ายลงแปลงปลูกจริง ต้องผ่านเกณฑ์มาตรฐานชีวภาพทั้ง 4 ด้าน:",
    benchmarks: [
      { title: "ใบจริง 4–6 ใบ", desc: "แผ่นใบหนาสีเขียวเข้ม ไม่มีรอยจุดสีน้ำตาลหรือรอยไหม้" },
      { title: "ลำต้นอวบหนา 3–4 มม.", desc: "ทรงพุ่มตั้งตรง ข้อใบสั้นกระชับ ไม่ยืดเก้งก้างจากแสงไม่พอ" },
      { title: "ระบบรากขาวฟู", desc: "รากเจริญแผ่กระจายรอบตุ้มพีทมอส ดึงออกจากถาดได้ไม่แตกหลุด" },
      { title: "ปลอดศัตรูพืช 100%", desc: "ตรวจไม่พบไข่หรือตัวเพลี้ยไฟ ไรแดง ใต้ใบอย่างเด็ดขาด" }
    ],
    metrics: {
      ec: {
        target: "0.8–1.2",
        current: "1.0",
        unit: "mS/cm",
        trend: "→",
        status: "optimal",
        statusText: "✓ อยู่ในช่วง ✓",
        statusColor: "#2ef387",
        min: 0.4,
        max: 1.6,
        targetMin: 0.8,
        targetMax: 1.2,
        todayData: [0.92, 0.96, 1.05, 1.02, 0.98, 1.00],
        weekData: [0.88, 0.94, 0.98, 1.04, 1.02, 0.99, 1.00],
        timeLabelsToday: ["06:00", "09:00", "12:00", "15:00", "18:00", "ปัจจุบัน"],
        timeLabelsWeek: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "วันนี้"],
        guideStatus: "สมบูรณ์ตามเป้า",
        guideMeaning: "ต้นอ่อนระยะเพาะกล้าต้องการปุ๋ยเจือจางเพื่อไม่ให้รากช็อค ค่า EC 1.0 ถือว่าสมบูรณ์แบบในการกระตุ้นรากแรกเกิด",
        guideAction: "รักษาความชื้นวัสดุเพาะให้อยู่ที่ 70–80% ปุ๋ยเจือจางสมดุลดี ไม่ต้องเพิ่มปุ๋ยในระยะนี้"
      },
      ph: {
        target: "5.8–6.2",
        current: "6.0",
        unit: "",
        trend: "→",
        status: "optimal",
        statusText: "✓ อยู่ในช่วง ✓",
        statusColor: "#2ef387",
        min: 5.2,
        max: 6.8,
        targetMin: 5.8,
        targetMax: 6.2,
        todayData: [5.9, 6.0, 6.1, 6.0, 5.9, 6.0],
        weekData: [6.1, 6.0, 5.9, 6.0, 6.1, 6.0, 6.0],
        timeLabelsToday: ["06:00", "09:00", "12:00", "15:00", "18:00", "ปัจจุบัน"],
        timeLabelsWeek: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "วันนี้"],
        guideStatus: "เหมาะสมสมบูรณ์",
        guideMeaning: "ค่า pH 6.0 เป็นช่วงที่รากพืชดูดซึมธาตุอาหารรอง เช่น แมกนีเซียม เหล็ก และสังกะสี ได้คล่องตัวที่สุด",
        guideAction: "ตรวจวัดค่า pH น้ำผสมปุ๋ยทุกเช้าก่อนรด หาก pH นิ่งที่ 6.0 ไม่จำเป็นต้องปรับกรด-ด่าง"
      }
    }
  },
  2: {
    stageBadge: "ระยะที่ 2: ต้นกล้า",
    title: "ระยะย้ายปลูกและเจริญทางลำต้น (วันที่ 26–50)",
    desc: "พัฒนาโครงสร้างทรงพุ่ม ระบบรากแข็งแรง และติดตั้งเชือกค้างพยุงลำต้น",
    days: "25 วัน",
    progress: "วันที่ 35 / 110 วันรวม",
    cockpit: {
      ec: "1.8–2.0 mS/cm",
      ph: "5.8–6.2",
      temp: "25–29°C"
    },
    envMatrix: {
      ec: { val: "1.7", target: "เป้า 1.8–2.0", status: "• ต่ำเล็กน้อย", color: "#f59e0b" },
      ph: { val: "6.0", target: "เป้า 5.8–6.2", status: "✓ ปกติ", color: "#2ef387" },
      temp: { val: "27.2°C", target: "เป้า 25–29°C", status: "✓ ปกติ", color: "#2ef387" },
      hum: { val: "68%", target: "เป้า 65–75%", status: "✓ เหมาะสม", color: "#22d3ee" }
    },
    todos: [
      {
        time: "08:00 น. • เช้าตรู่",
        timeBg: "text-bio-accent",
        title: "ตรวจวัดและปรับค่าสารละลาย EC 1.8–2.0 / pH 6.0",
        desc: "ตรวจสอบความเข้มข้นสารอาหารสำหรับต้นที่กำลังสร้างโครงสร้างกิ่งก้าน ควบคุมค่า pH ให้รากดึงธาตุอาหารได้สมบูรณ์",
        badges: ["เป้าหมาย EC: 1.8–2.0", "เป้าหมาย pH: 5.8–6.2"],
        done: true
      },
      {
        time: "11:00 น. • ช่วงสาย",
        timeBg: "text-bio-cyan",
        title: "ตรวจสุขภาพใบ ยอด และการจ่ายน้ำของหัวหยด",
        desc: "เดินตรวจแมลงศัตรูพืชใต้ใบ และตรวจสอบหัวน้ำหยดทุกแถวปลูกว่าไม่มีตะกอนอุดตัน ปริมาณน้ำกระจายสม่ำเสมอ",
        badges: ["ตรวจเพลี้ยไฟ-ไรแดง", "เช็กหัวหยดน้ำสม่ำเสมอ"],
        done: false
      },
      {
        time: "16:30 น. • ช่วงเย็น",
        timeBg: "text-bio-muted",
        title: "แต่งกิ่งแขนงล่าง ตัดใบสัมผัสดิน และผูกเชือกค้าง",
        desc: "ปลิดกิ่งแขนงซอกใบที่แย่งสารอาหารออก ตัดใบแก่ด้านล่างเพื่อให้อากาศโกรก และคล้องคลิปเชือกค้างพยุงลำต้น",
        badges: ["ตัดแขนงข้างออก", "ผูกคลิปค้างพยุงลำต้น"],
        done: false
      }
    ],
    equips: [
      {
        cat: "ระบบค้างพยุงและอุปกรณ์ตัดแต่ง",
        items: [
          { name: "เชือกโยงค้างไนลอนเหนียวพิเศษ", detail: "รับน้ำหนักผลผลิตได้ดี ทนทานรังสี UV ไม่ขาดง่าย" },
          { name: "คลิปหนีบต้นมะเขือเทศ", detail: "พลาสติกยืดหยุ่นสูง มีช่องระบาย ไม่บีบรัดลำต้น" },
          { name: "กรรไกรตัดแต่งกิ่งสแตนเลส", detail: "ใบมีดคมพิเศษ ป้องกันแผลช้ำและลดโอกาสติดเชื้อ" },
          { name: "แผ่นกาวดักแมลงสีเหลือง", detail: "ดักจับแมลงหวี่ขาว เพลี้ยไฟ และเพลี้ยอ่อนรอบแปลง" }
        ]
      },
      {
        cat: "ปุ๋ยและธาตุอาหารหลัก",
        items: [
          { name: "ปุ๋ยสูตรเน้นไนโตรเจน-แคลเซียม", detail: "เสริมสร้างลำต้น ทรงพุ่ม และใบเขียวเข้มสมบูรณ์" },
          { name: "สารปรับปรุงสภาพน้ำและสารจับใบ", detail: "เพิ่มประสิทธิภาพการดูดซึมธาตุอาหารทางราก" },
          { name: "มิเตอร์ EC/pH แบบโพรบแก้วดิจิทัล", detail: "ตรวจวัดค่าน้ำแปลงปลูกทุกเช้าได้อย่างแม่นยำ" },
          { name: "ถุงมือการเกษตรเคลือบไนไตรล์", detail: "จับกระชับมือ ป้องกันยางพืชและสิ่งสกปรก" }
        ]
      }
    ],
    warnTitle: "ข้อควรระวังสำคัญสำหรับระยะต้นกล้า (Stage 2)",
    warns: [
      {
        title: "อย่าให้ปุ๋ยเข้มข้นเกินกำหนด (EC > 2.2)",
        severity: "ระดับวิกฤต (Critical)",
        symptom: "ค่า EC ที่สูงเกินไปทำให้ปลายใบไหม้เกรียม ขอบใบม้วนงอ ต้นชะงักการเจริญเติบโต และรากฝอยไหม้",
        action: "เติมน้ำเปล่าสะอาดลดค่า EC ลงมาที่ 1.8 ทันที แล้วตรวจวัดซ้ำก่อนรอบจ่ายน้ำถัดไป"
      },
      {
        title: "ระวังแผลรอยตัดแต่งกิ่งติดเชื้อรา",
        severity: "ความเสี่ยงสูง (High Risk)",
        symptom: "ตัดแขนงในวันที่อากาศชื้นหรือฝนตก แผลไม่แห้ง เกิดรอยช้ำเน่าดำลามเข้าสู่ลำต้นหลัก",
        action: "ตัดแต่งแขนงเฉพาะช่วงเช้าแดดจัด ใช้กรรไกรคมฆ่าเชื้อแอลกอฮอล์ และพ่นสารชีวภัณฑ์ปิดแผล"
      },
      {
        title: "ตรวจสอบหัวจ่ายน้ำหยดอุดตัน",
        severity: "ระดับวิกฤต (Critical)",
        symptom: "มีเศษตะกอนปุ๋ยอุดตันหัวหยดบางจุด ต้นเหี่ยวเฉาถาวรภายในครึ่งวันแดดแรงจัด",
        action: "เดินตรวจหัวน้ำหยดทุกแถวตอน 11:00 น. หากพบตันให้ถอดล้างหรือเปลี่ยนหัวหยดสำรองทันที"
      }
    ],
    adviceTitle: "เกณฑ์มาตรฐานทรงพุ่มและการไว้กิ่งหลัก (Single Stem)",
    adviceDesc: "การควบคุมโครงสร้างต้นในระยะนี้ส่งผลโดยตรงต่อปริมาณผลผลิตในระยะถัดไป:",
    benchmarks: [
      { title: "ความสูงต้น 60–80 ซม.", desc: "ลำต้นตั้งตรงแข็งแรง พร้อมรับน้ำหนักผลช่อแรก" },
      { title: "เดิดแขนงข้าง 100%", desc: "ตัดแขนงซอกใบออกทั้งหมดจนถึงช่อดอกแรก เพื่อรวมสารอาหาร" },
      { title: "คล้องคลิปค้างทุก 30 ซม.", desc: "ใช้คลิปหนีบเชือกไนลอน ไม่รัดแน่นจนบาดลำต้น" },
      { title: "ใบหนาสีเขียวตองเข้ม", desc: "ขนาดใบสมดุล ไม่หงิกงอ ไม่มีคราบขาวของแมลงหวี่ขาว" }
    ],
    metrics: {
      ec: {
        target: "1.8–2.0",
        current: "1.7",
        unit: "mS/cm",
        trend: "↗",
        status: "warning_low",
        statusText: "• ต่ำเล็กน้อย",
        statusColor: "#f59e0b",
        min: 1.3,
        max: 2.4,
        targetMin: 1.8,
        targetMax: 2.0,
        todayData: [1.60, 1.72, 1.88, 1.92, 1.65, 1.70],
        weekData: [1.90, 1.85, 1.82, 1.78, 1.75, 1.72, 1.70],
        timeLabelsToday: ["06:00", "09:00", "12:00", "15:00", "18:00", "ปัจจุบัน"],
        timeLabelsWeek: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "วันนี้"],
        guideStatus: "ต่ำกว่าเป้า 0.1",
        guideMeaning: "ค่า EC แสดงปริมาณเกลือแร่และธาตุอาหารทั้งหมดในน้ำปลูก หากต่ำกว่าเป้าหมาย ต้นจะได้รับไนโตรเจนและแคลเซียมไม่เพียงพอต่อการสร้างทรงพุ่ม",
        guideAction: "เติมสารละลายแม่ปุ๋ย A และ B สัดส่วนเท่ากันอย่างละ 150–200 ml ลงในถังจ่ายน้ำ กวนผสมให้เข้ากัน 5 นาทีแล้ววัดซ้ำ"
      },
      ph: {
        target: "5.8–6.2",
        current: "6.0",
        unit: "",
        trend: "→",
        status: "optimal",
        statusText: "✓ อยู่ในช่วง ✓",
        statusColor: "#2ef387",
        min: 5.2,
        max: 6.8,
        targetMin: 5.8,
        targetMax: 6.2,
        todayData: [5.9, 6.0, 6.1, 6.0, 6.0, 6.0],
        weekData: [6.1, 6.0, 5.9, 6.0, 6.1, 6.0, 6.0],
        timeLabelsToday: ["06:00", "09:00", "12:00", "15:00", "18:00", "ปัจจุบัน"],
        timeLabelsWeek: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "วันนี้"],
        guideStatus: "เหมาะสมสมบูรณ์",
        guideMeaning: "ค่า pH ส่งผลต่อความสามารถในการดูดซึมธาตุอาหารของราก ค่า 6.0 อยู่ในจุดที่ดีที่สุด (Sweet Spot) รากดูดซึมฟอสฟอรัสและแมกนีเซียมได้เต็มที่ 100%",
        guideAction: "ค่าสมดุลดีเยี่ยม รักษาระดับน้ำในถังพักและตรวจเช็กอีกครั้งในรอบบ่าย ไม่ต้องเติมสารเคมีปรับสภาพน้ำ"
      }
    }
  },
  3: {
    stageBadge: "ระยะที่ 3: เติบโต-ออกดอก",
    title: "ระยะออกดอก ติดผล และขยายผล (วันที่ 51–75)",
    desc: "ช่วงเวลาสำคัญที่สุดในการสร้างผลผลิต ควบคุมปริมาณน้ำสม่ำเสมอ ป้องกันอาการก้นผลเน่าดำ",
    days: "25 วัน",
    progress: "วันที่ 58 / 110 วันรวม",
    cockpit: {
      ec: "2.2–2.5 mS/cm",
      ph: "6.0–6.5",
      temp: "26–30°C"
    },
    envMatrix: {
      ec: { val: "2.3", target: "เป้า 2.2–2.5", status: "✓ ปกติ", color: "#2ef387" },
      ph: { val: "6.2", target: "เป้า 6.0–6.5", status: "✓ สมบูรณ์", color: "#2ef387" },
      temp: { val: "28.5°C", target: "เป้า 26–30°C", status: "✓ ปกติ", color: "#2ef387" },
      hum: { val: "62%", target: "เป้า 60–70%", status: "✓ เหมาะสม", color: "#22d3ee" }
    },
    todos: [
      {
        time: "08:30 น. • เช้าตรู่",
        timeBg: "text-bio-accent",
        title: "จ่ายสารอาหารสูตรขยายผล (EC 2.2 / pH 6.0)",
        desc: "เพิ่มสัดส่วนโพแทสเซียมและฟอสฟอรัส เสริมแคลเซียม-โบรอน ป้องกันผลแตกและอาการก้นผลเน่าดำ (Blossom End Rot)",
        badges: ["เป้าหมาย EC: 2.2", "เสริมแคลเซียม-โบรอน"],
        done: true
      },
      {
        time: "13:00 น. • บ่ายต้น",
        timeBg: "text-bio-cyan",
        title: "ช่วยผสมเกสรด้วยการเขย่าสายค้างเบาๆ",
        desc: "ในพื้นที่ปิดที่ไม่มีผึ้งหรือลมพัด ให้ใช้มือเคาะหรือเขย่าสายค้างช่วง 11:00-13:00 น. เพื่อให้ละอองเกสรตกลงสู่ยอดเกสรตัวเมีย",
        badges: ["ช่วยผสมเกสรเที่ยงวัน", "ตรวจเพลี้ยไฟในดอก"],
        done: false
      },
      {
        time: "17:00 น. • ช่วงเย็น",
        timeBg: "text-bio-muted",
        title: "คล้องคลิปพยุงช่อผลและตัดแต่งใบเปิดรับแสง",
        desc: "เมื่อผลเริ่มขยายขนาด น้ำหนักจะเพิ่มขึ้นอย่างรวดเร็ว ต้องใช้คลิปพยุงก้านผลไม่ให้หักพับ และตัดใบแก่ที่บังช่อผลออก",
        badges: ["คลิปพยุงช่อผล", "เปิดช่องรับแสง"],
        done: false
      }
    ],
    equips: [
      {
        cat: "อุปกรณ์ช่วยติดผลและพยุงน้ำหนัก",
        items: [
          { name: "คลิปพยุงช่อผล (Truss Support)", detail: "ป้องกันก้านช่อผลหักพับจากน้ำหนักผลที่เพิ่มขึ้น" },
          { name: "เครื่องสั่นช่วยผสมเกสรพกพา", detail: "เพิ่มเปอร์เซ็นต์การติดผลทรงสวย ละอองเกสรกระจายดี" },
          { name: "ถังฉีดพ่นฮอร์โมนทางใบ", detail: "พ่นสารเสริมแคลเซียมช่วงเช้าตรู่ก่อนปากใบปิด" },
          { name: "เวอร์เนียร์คาลิปเปอร์ดิจิทัล", detail: "สุ่มวัดอัตราการขยายขนาดเส้นผ่านศูนย์กลางผล" }
        ]
      },
      {
        cat: "ปุ๋ยสูตรขยายผลและชีวภัณฑ์",
        items: [
          { name: "แคลเซียม-โบรอน ชนิดคีเลตเหลว", detail: "ดูดซึมเร็วทางใบ ป้องกันอาการก้นผลเน่าดำอย่างได้ผล" },
          { name: "ปุ๋ยโพแทสเซียมเกรดไฮโดรโปนิกส์", detail: "เร่งการสะสมแป้งและน้ำตาล ให้ผลโตเนื้อแน่น" },
          { name: "เชื้อราไตรโคเดอร์มา / บิวเวอเรีย", detail: "ป้องกันโรคผลเน่าและกำจัดหนอนเจาะสมอผล" },
          { name: "แว่นตานิรภัยและหน้ากากกรอง", detail: "อุปกรณ์ความปลอดภัยประจำตัวผู้ฉีดพ่นสารชีวภัณฑ์" }
        ]
      }
    ],
    warnTitle: "ข้อควรระวังสำคัญสำหรับระยะออกดอกติดผล (Stage 3)",
    warns: [
      {
        title: "ห้ามให้น้ำไม่สม่ำเสมอ (ขาดน้ำสลับแฉะ)",
        severity: "ระดับวิกฤต (Critical)",
        symptom: "ความชื้นดินแกว่งตัวรุนแรง ก้นผลเกิดรอยแผลสีดำบุ๋ม (Blossom End Rot) และผลแตกลายเสียหาย",
        action: "เสริมปุ๋ยแคลเซียม-โบรอนทางใบ และตั้งรอบจ่ายน้ำหยดให้สม่ำเสมอวันละ 5–6 รอบย่อย"
      },
      {
        title: "ระวังอุณหภูมิโรงเรือนสูงเกิน 32°C",
        severity: "ระดับวิกฤต (Critical)",
        symptom: "อากาศร้อนจัดทำให้ละอองเกสรเป็นหมัน ดอกร่วงไม่ติดผล หรือผลเบี้ยวผิดรูปทรง",
        action: "เปิดพัดลมกวนอากาศและระบบ Evaporative Cooling ทันทีเมื่ออุณหภูมิแตะ 30°C"
      },
      {
        title: "ระวังเพลี้ยไฟและหนอนเจาะสมอผล",
        severity: "ความเสี่ยงสูง (High Risk)",
        symptom: "เพลี้ยไฟดูดน้ำเลี้ยงที่กลีบดอก ดอกแห้งกร้าน และหนอนเจาะรูเข้าเนื้อผลอ่อนจนเน่าร่วง",
        action: "เคาะดอกสุ่มตรวจทุก 2 วัน หากพบเกิน 3 ตัว/ดอก ให้พ่นสารชีวภัณฑ์บิวเวอเรียทันที"
      }
    ],
    adviceTitle: "เกณฑ์การคัดแต่งผลเพื่อผลผลิตเกรด A พรีเมียม",
    adviceDesc: "ควบคุมผลผลิตต่อช่อเพื่อให้น้ำหนักและขนาดผลได้มาตรฐานสูงสุด:",
    benchmarks: [
      { title: "ไว้ผล 4–5 ผล/ช่อ", desc: "ปลิดผลเล็ก ปลายช่อ หรือผลรูปทรงบิดเบี้ยวทิ้งตั้งแต่ผลขนาดเท่าเหรียญบาท" },
      { title: "ใส่คลิปพยุงก้านช่อ (Truss)", desc: "ป้องกันก้านช่อผลหักพับจากน้ำหนักผลที่เพิ่มขึ้นอย่างรวดเร็ว" },
      { title: "เปิดทางแสงส่องผล", desc: "ตัดแต่งใบแก่ใต้ช่อผลออก 1–2 ใบ เพื่อให้อากาศถ่ายเทและแสงส่องถึง" },
      { title: "ตรวจผิวผลไร้ตำหนิ", desc: "ไม่มีรอยแตกลายหรือคราบสารเคมีตกค้าง ผิวผลเนียนเต่งตึง" }
    ],
    metrics: {
      ec: {
        target: "2.2–2.5",
        current: "2.3",
        unit: "mS/cm",
        trend: "↗",
        status: "optimal",
        statusText: "✓ อยู่ในช่วง ✓",
        statusColor: "#2ef387",
        min: 1.7,
        max: 2.9,
        targetMin: 2.2,
        targetMax: 2.5,
        todayData: [2.15, 2.24, 2.38, 2.42, 2.30, 2.30],
        weekData: [2.10, 2.18, 2.25, 2.30, 2.35, 2.28, 2.30],
        timeLabelsToday: ["06:00", "09:00", "12:00", "15:00", "18:00", "ปัจจุบัน"],
        timeLabelsWeek: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "วันนี้"],
        guideStatus: "สมบูรณ์ตามเป้า",
        guideMeaning: "ระยะออกดอกและเริ่มติดผล พืชต้องการฟอสฟอรัสและโพแทสเซียมสูง ค่า EC 2.3 อยู่ในเกณฑ์ดีเยี่ยม ช่วยขยายขนาดผลและป้องกันก้นผลเน่าดำ",
        guideAction: "รักษาความเข้มข้นสารอาหารอย่างต่อเนื่อง เสริมแคลเซียม-โบรอนตามรอบ เพื่อป้องกันอาการขาดธาตุอาหารช่วงขยายผล"
      },
      ph: {
        target: "6.0–6.5",
        current: "6.2",
        unit: "",
        trend: "→",
        status: "optimal",
        statusText: "✓ อยู่ในช่วง ✓",
        statusColor: "#2ef387",
        min: 5.4,
        max: 7.0,
        targetMin: 6.0,
        targetMax: 6.5,
        todayData: [6.1, 6.2, 6.3, 6.2, 6.2, 6.2],
        weekData: [6.0, 6.1, 6.2, 6.3, 6.2, 6.2, 6.2],
        timeLabelsToday: ["06:00", "09:00", "12:00", "15:00", "18:00", "ปัจจุบัน"],
        timeLabelsWeek: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "วันนี้"],
        guideStatus: "เหมาะสมสมบูรณ์",
        guideMeaning: "ช่วงขยายผล ค่า pH ที่ 6.2 ช่วยให้พืชดึงแคลเซียมเข้าสู่ปลายผลได้มีประสิทธิภาพสูงสุด ลดความเสี่ยงผลแตก",
        guideAction: "ตรวจวัด pH อย่างสม่ำเสมอ หากสูงเกิน 6.5 ให้ปรับลดด้วยกรดฟอสฟอริกเจือจางทีละน้อย"
      }
    }
  },
  4: {
    stageBadge: "ระยะที่ 4: เก็บเกี่ยว",
    title: "ระยะผลสุก เก็บเกี่ยว และหลังเก็บเกี่ยว (วันที่ 76–110)",
    desc: "คัดเกรดผลผลิตตามระดับสี บรรจุลงภาชนะระบายอากาศ และเตรียมพักแปลงรอบถัดไป",
    days: "35 วัน",
    progress: "วันที่ 85 / 110 วันรวม",
    cockpit: {
      ec: "2.4–2.8 mS/cm",
      ph: "6.0–6.5",
      temp: "24–28°C"
    },
    envMatrix: {
      ec: { val: "2.6", target: "เป้า 2.4–2.8", status: "✓ ปกติ", color: "#2ef387" },
      ph: { val: "6.1", target: "เป้า 6.0–6.5", status: "✓ เหมาะสม", color: "#2ef387" },
      temp: { val: "26.8°C", target: "เป้า 24–28°C", status: "✓ ปกติ", color: "#2ef387" },
      hum: { val: "58%", target: "เป้า 55–65%", status: "✓ เหมาะสม", color: "#22d3ee" }
    },
    todos: [
      {
        time: "07:00 น. • เช้าตรู่",
        timeBg: "text-bio-accent",
        title: "ตรวจสอบระดับความสุกและสีผิวผลตามเกรดตลาด",
        desc: "เลือกเก็บเกี่ยวผลที่มีสีผิวระดับ Turning หรือ Pink สำหรับส่งตลาดไกล และระดับ Red สุกเต็มที่สำหรับการจำหน่ายทันที",
        badges: ["ตรวจสีผิวผล Turning/Pink", "เก็บเกี่ยวช่วงเช้าตรู่"],
        done: true
      },
      {
        time: "09:30 น. • ช่วงสาย",
        timeBg: "text-bio-cyan",
        title: "ใช้กรรไกรตัดขั้วชิดผล เรียงลงตะกร้าในร่ม",
        desc: "ตัดก้านขั้วให้สั้นเรียบเพื่อไม่ให้ทิ่มแทงผลข้างเคียง วางลงในตะกร้าโปร่งไม่เกิน 2-3 ชั้น และนำเข้าที่ร่มทันทีเพื่อลดความร้อนสะสม",
        badges: ["กรรไกรคมตัดขั้วชิด", "วางในร่มถ่ายเท"],
        done: false
      },
      {
        time: "15:30 น. • ช่วงบ่าย",
        timeBg: "text-bio-muted",
        title: "คัดแยกเกรด ชั่งน้ำหนักรวม และบันทึก Yield",
        desc: "คัดแยกผลแตกลาย ผลลาย และผลตำหนิ ชั่งน้ำหนักบันทึกลงระบบคำนวณผลผลิตรวม และนำเข้าห้องเย็นควบคุมอุณหภูมิ 12–15°C",
        badges: ["คัดเกรด A / B / ตกเกรด", "บันทึกผลผลิตรายวัน"],
        done: false
      }
    ],
    equips: [
      {
        cat: "อุปกรณ์เก็บเกี่ยวและคัดบรรจุ",
        items: [
          { name: "กรรไกรเก็บเกี่ยวปลายโค้งมน", detail: "ป้องกันการขีดข่วนผิวเปลือกผลระหว่างการตัด" },
          { name: "ตะกร้าพลาสติกโปร่งระบายอากาศ", detail: "ผิวเรียบ ลดแรงกดทับซ้อนชั้น ถ่ายเทความร้อนดี" },
          { name: "เครื่องชั่งน้ำหนักดิจิทัล 30 กก.", detail: "ความละเอียด 1 กรัม สรุปผลผลิตแม่นยำ" },
          { name: "ถุงมือผ้าสะอาดสำหรับเก็บผล", detail: "ป้องกันรอยนิ้วมือและคราบมันบนผิวผลมะเขือเทศ" }
        ]
      },
      {
        cat: "บรรจุภัณฑ์และเตรียมแปลงรอบใหม่",
        items: [
          { name: "กล่องกระดาษลูกฟูกเจาะรูระบาย", detail: "โครงสร้างแข็งแรง รองรับการขนส่งระยะไกล" },
          { name: "โฟมตาข่ายกันกระแทกสีขาว", detail: "หุ้มผลเดี่ยวเกรดพรีเมียม ป้องกันการช้ำระหว่างขนย้าย" },
          { name: "น้ำยาฆ่าเชื้อทำความสะอาดแปลง", detail: "ล้างระบบน้ำและแปลงปลูกเพื่อสุขอนามัยรอบถัดไป" },
          { name: "แท็บเล็ตบันทึกข้อมูลผลผลิต", detail: "สรุปต้นทุน กำไร และ Yield รวมประจำฤดูกาล" }
        ]
      }
    ],
    warnTitle: "ข้อควรระวังสำคัญสำหรับระยะเก็บเกี่ยว (Stage 4)",
    warns: [
      {
        title: "ห้ามเก็บเกี่ยวตอนผลเปียกน้ำหรือแดดจัด",
        severity: "ระดับวิกฤต (Critical)",
        symptom: "ผลเปียกน้ำค้างหรือผลร้อนสะสมความร้อน ทำให้เชื้อราเน่าเสียง่ายระหว่างการขนส่ง",
        action: "เก็บเกี่ยวเฉพาะช่วงเช้า 07:00–10:00 น. หลังน้ำค้างแห้งสนิท และนำเข้าห้องพักร่มทันที"
      },
      {
        title: "อุณหภูมิห้องเก็บรักษาผลผลิตต่ำเกินไป",
        severity: "ระดับวิกฤต (Critical)",
        symptom: "เก็บที่อุณหภูมิต่ำกว่า 10°C เกิดอาการสะท้านหนาว (Chilling Injury) เนื้อผลเละ รสจืด",
        action: "ตั้งอุณหภูมิห้องพักผลผลิตไว้ที่ 12–15°C ความชื้นสัมพัทธ์ 85–90% เพื่อรักษาความสด"
      },
      {
        title: "ห้ามวางผลผลิตซ้อนทับเกิน 3 ชั้น",
        severity: "ความเสี่ยงสูง (High Risk)",
        symptom: "แรงกดทับทำให้ผลมะเขือเทศชั้นล่างช้ำภายใน แม้เปลือกนอกจะยังไม่ฉีกขาดเสียหาย",
        action: "ใช้ตะกร้าพลาสติกโปร่งเตี้ย วางเรียงชั้นเดียวหรือหุ้มโฟมตาข่ายสำหรับเกรดพรีเมียม"
      }
    ],
    adviceTitle: "เกณฑ์มาตรฐานผลผลิตมะเขือเทศเกรดพรีเมียม",
    adviceDesc: "การคัดแยกล็อตจำหน่ายตามเกรดคุณภาพก่อนส่งมอบลูกค้า:",
    benchmarks: [
      { title: "ระดับสีผิว Turning/Pink", desc: "สีส้มอมชมพู 30–60% เหมาะสำหรับการขนส่งไกล 2–3 วันถึงมือผู้บริโภค" },
      { title: "ค่าความหวาน Brix ≥ 7.0", desc: "สุ่มวัดค่าความหวาน รสชาติเข้มข้น หวานอมเปรี้ยวกลมกล่อม" },
      { title: "ขั้วผลสดเขียวชิดผล", desc: "ก้านขั้วสด มีกลีบเลี้ยงครบ ไม่เหี่ยวแห้ง ตัดชิดขั้วไม่ทิ่มผลอื่น" },
      { title: "เนื้อแน่น ไม่ยุบตัว", desc: "ความแน่นเนื้อผลผ่านเกณฑ์ ไม่มีรอยช้ำหรือรอยขีดข่วนแม้แต่น้อย" }
    ],
    metrics: {
      ec: {
        target: "2.4–2.8",
        current: "2.6",
        unit: "mS/cm",
        trend: "→",
        status: "optimal",
        statusText: "✓ อยู่ในช่วง ✓",
        statusColor: "#2ef387",
        min: 1.9,
        max: 3.2,
        targetMin: 2.4,
        targetMax: 2.8,
        todayData: [2.50, 2.58, 2.65, 2.72, 2.60, 2.60],
        weekData: [2.40, 2.48, 2.55, 2.62, 2.68, 2.62, 2.60],
        timeLabelsToday: ["06:00", "09:00", "12:00", "15:00", "18:00", "ปัจจุบัน"],
        timeLabelsWeek: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "วันนี้"],
        guideStatus: "สมบูรณ์ตามเป้า",
        guideMeaning: "ระยะสุกแก่ของผล การควบคุม EC ที่ระดับ 2.4–2.8 ช่วยเพิ่มความเข้มข้นของน้ำตาล (ค่าความหวาน Brix) และทำให้เนื้อผลแน่นกรอบ",
        guideAction: "ลดการให้น้ำลง 10–15% ก่อนวันเก็บเกี่ยว 3 วัน เพื่อรีดความหวานสะสมในผลมะเขือเทศให้ได้เกรดพรีเมียม"
      },
      ph: {
        target: "6.0–6.5",
        current: "6.1",
        unit: "",
        trend: "→",
        status: "optimal",
        statusText: "✓ อยู่ในช่วง ✓",
        statusColor: "#2ef387",
        min: 5.4,
        max: 7.0,
        targetMin: 6.0,
        targetMax: 6.5,
        todayData: [6.0, 6.1, 6.2, 6.1, 6.1, 6.1],
        weekData: [6.2, 6.1, 6.0, 6.1, 6.2, 6.1, 6.1],
        timeLabelsToday: ["06:00", "09:00", "12:00", "15:00", "18:00", "ปัจจุบัน"],
        timeLabelsWeek: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "วันนี้"],
        guideStatus: "เหมาะสมสมบูรณ์",
        guideMeaning: "ค่า pH 6.1 คงที่ช่วยรักษาความสมดุลของรสชาติ ไม่ทำให้ผลมีรสเปรี้ยวโด่งจากสารตกค้าง",
        guideAction: "ใช้น้ำสะอาดคุณภาพดีล้างระบบท่อส่งน้ำหยด เพื่อป้องกันคราบตะกรันปุ๋ยอุดตันก่อนเริ่มรอบปลูกถัดไป"
      }
    }
  }
};

let currentStage = 1;
let currentSubTab = 'chart';
let activeChartMetric = 'ec';
let activeChartRange = 'today';

const taskGuideTemplates = {
  1: [
    {
      emoji: '🌡️',
      goal: 'ลดเชื้อที่ติดมากับเมล็ด และช่วยให้เมล็ดเริ่มงอกสม่ำเสมอ',
      steps: ['🧤 คัดเมล็ดเต็ม ไม่แตก และไม่มีรา', '🌡️ เตรียมน้ำอุ่นแล้ววัดอุณหภูมิให้ได้ตามค่าเป้าหมาย', '⏱️ แช่เมล็ดตามเวลา จากนั้นเทน้ำออกและพักเมล็ดให้สะเด็ดน้ำ'],
      parameters: [{ label: 'อุณหภูมิน้ำ', value: '48–50°C' }, { label: 'เวลาแช่', value: '30 นาที' }],
      warning: 'เมล็ดลอยน้ำ เมล็ดนิ่มผิดปกติ หรือน้ำร้อนเกินไป',
      consequence: 'เมล็ดอาจไม่งอก หรืองอกไม่พร้อมกัน'
    },
    {
      emoji: '🌱',
      goal: 'วางเมล็ดให้มีระยะและความลึกพอดี เพื่อให้รากตั้งตัวได้ง่าย',
      steps: ['🧱 เติมวัสดุเพาะที่ชื้นพอดีลงทุกหลุม', '🌱 หยอด 1 เมล็ดต่อหลุม แล้วกลบเบา ๆ', '🌤️ วางถาดในที่มีแสงรำไรและอากาศถ่ายเท'],
      parameters: [{ label: 'จำนวน', value: '1 เมล็ด / หลุม' }, { label: 'ความลึก', value: 'ประมาณ 0.5 ซม.' }, { label: 'พรางแสง', value: '50%' }],
      warning: 'วัสดุแฉะ เมล็ดจมลึก หรือหน้าวัสดุแข็ง',
      consequence: 'ต้นอ่อนอาจโผล่ช้า รากเน่า หรือโตไม่สม่ำเสมอ'
    },
    {
      emoji: '💧',
      goal: 'รักษาความชื้นให้เมล็ดงอก โดยไม่ทำให้โคนต้นกล้าอับชื้น',
      steps: ['🔍 ตรวจผิววัสดุและโคนต้นกล้าทุกแถว', '💧 พ่นละอองเบา ๆ เมื่อผิวเริ่มแห้ง', '🌬️ เปิดทางลมและแยกต้นที่เริ่มมีอาการผิดปกติ'],
      parameters: [{ label: 'ความชื้นอากาศ', value: '70–80%' }, { label: 'วิธีให้น้ำ', value: 'ละอองฝอย' }],
      warning: 'โคนต้นเป็นสีน้ำตาล ต้นล้มพับ หรือมีราเป็นปุย',
      consequence: 'ต้นกล้าอาจเกิดโรคเน่าคอดินและตายเป็นหย่อม'
    }
  ],
  2: [
    {
      emoji: '🧪',
      goal: 'ทำให้น้ำและธาตุอาหารอยู่ในช่วงที่รากดูดใช้ได้ดี',
      steps: ['🧪 วัดค่า EC และ pH ก่อนเติมสารละลาย', '💧 ปรับทีละน้อยและคนให้เข้ากัน', '✅ วัดซ้ำก่อนจ่ายน้ำให้ต้น'],
      parameters: [{ label: 'EC', value: '1.8–2.0' }, { label: 'pH', value: '5.8–6.2' }],
      warning: 'ปลายใบไหม้ ใบม้วน หรือค่า EC สูงขึ้นเร็ว',
      consequence: 'รากชะงักและต้นดูดอาหารได้น้อยลง'
    },
    {
      emoji: '🔍',
      goal: 'พบแมลง โรค และหัวน้ำหยดที่ผิดปกติก่อนต้นเสียหาย',
      steps: ['🍃 พลิกดูใต้ใบ ยอด และช่อดอกทุกแถว', '💧 ตรวจน้ำหยดให้ไหลสม่ำเสมอ', '📝 แยกจุดผิดปกติและบันทึกตำแหน่งไว้'],
      parameters: [{ label: 'จุดตรวจ', value: 'ทุกแถวปลูก' }, { label: 'สิ่งที่ดู', value: 'แมลง + น้ำหยด' }],
      warning: 'ใต้ใบมีจุดดำ ใบหงิก หรือหัวหยดไหลเบา',
      consequence: 'ต้นอาจขาดน้ำและการระบาดอาจลามทั้งแปลง'
    },
    {
      emoji: '✂️',
      goal: 'ลดกิ่งและใบที่แย่งอาหาร พร้อมเปิดทางให้อากาศไหลผ่าน',
      steps: ['✂️ เช็ดกรรไกรให้สะอาดก่อนตัด', '🍃 ตัดกิ่งแขนงล่างและใบที่สัมผัสดิน', '🪢 ผูกคลิปกับค้างให้หลวมพอดี'],
      parameters: [{ label: 'ช่วงทำงาน', value: 'ช่วงเช้า' }, { label: 'อุปกรณ์', value: 'กรรไกร + คลิปค้าง' }],
      warning: 'แผลตัดชื้น มีรอยช้ำ หรือเชือกรัดลำต้น',
      consequence: 'ต้นอาจติดโรค ทรงพุ่มทึบ และลำต้นหักง่าย'
    }
  ],
  3: [
    {
      emoji: '🧪',
      goal: 'ส่งอาหารให้ดอกและผล โดยช่วยลดปัญหาผลแตกและก้นผลเน่า',
      steps: ['🧪 ตรวจค่า EC และ pH ก่อนผสม', '💧 เติมสูตรอาหารทีละน้อยแล้วคนให้เข้ากัน', '✅ วัดซ้ำและจ่ายน้ำตามรอบ'],
      parameters: [{ label: 'EC', value: '2.2' }, { label: 'pH', value: 'ประมาณ 6.0' }],
      warning: 'ปลายใบไหม้ ใบเข้มจัด หรือผลเริ่มแตก',
      consequence: 'ดอกและผลพัฒนาไม่เต็มที่ ผลผลิตลดลง'
    },
    {
      emoji: '🌼',
      goal: 'ช่วยให้ละอองเกสรตกลงบนดอกและเพิ่มโอกาสติดผล',
      steps: ['🌼 ตรวจว่าดอกบานและไม่มีน้ำเกาะ', '🫳 เขย่าค้างหรือก้านดอกเบา ๆ', '📝 บันทึกช่อที่ติดผลหลังทำงาน'],
      parameters: [{ label: 'ช่วงเวลา', value: '11:00–13:00 น.' }, { label: 'แรงเขย่า', value: 'เบา ๆ' }],
      warning: 'ดอกร่วง ดอกแห้ง หรือไม่มีผลเล็กหลังดอกบาน',
      consequence: 'ติดผลน้อยและผลผลิตต่อช่อลดลง'
    },
    {
      emoji: '🪢',
      goal: 'พยุงช่อผลไม่ให้ก้านหัก และเปิดใบให้ผลได้รับแสงพอดี',
      steps: ['🪢 คล้องคลิปใต้ช่อผลโดยไม่กดก้าน', '🍃 ตัดเฉพาะใบแก่ที่บังช่อผล', '🔍 ตรวจว่าผลไม่ถูกเชือกเสียดสี'],
      parameters: [{ label: 'จุดพยุง', value: 'ใต้ช่อผล' }, { label: 'การตัดใบ', value: 'ตัดเท่าที่จำเป็น' }],
      warning: 'ก้านช่อเอน ผลสัมผัสเชือก หรือใบถูกตัดมากเกินไป',
      consequence: 'ช่อผลอาจหัก ผลโตไม่สม่ำเสมอ หรือผิวไหม้แดด'
    }
  ],
  4: [
    {
      emoji: '🍅',
      goal: 'เก็บผลในระดับสีที่เหมาะกับตลาดและลดผลเสียระหว่างขนส่ง',
      steps: ['🍅 เทียบสีผลกับระดับที่ต้องการขาย', '🔍 คัดผลแตก ช้ำ หรือมีโรคออก', '📝 แยกล็อตตามระดับความสุกและบันทึกจำนวน'],
      parameters: [{ label: 'ระดับสี', value: 'Turning / Pink / Red' }, { label: 'ช่วงเก็บ', value: 'เช้าหลังน้ำค้างแห้ง' }],
      warning: 'ผลเปียก ร้อนจัด หรือมีรอยช้ำ',
      consequence: 'ผลผลิตเน่าเร็วและขายได้ราคาต่ำลง'
    },
    {
      emoji: '✂️',
      goal: 'ตัดผลออกอย่างสะอาดโดยไม่ทำให้ผลข้างเคียงและกิ่งเสียหาย',
      steps: ['✂️ เช็ดกรรไกรให้สะอาด', '🍅 ตัดขั้วชิดผลโดยไม่กดหรือโยนผล', '🌤️ วางในตะกร้าโปร่งและนำเข้าร่มทันที'],
      parameters: [{ label: 'ภาชนะ', value: 'โปร่ง ระบายอากาศ' }, { label: 'การวางซ้อน', value: 'ไม่เกิน 2–3 ชั้น' }],
      warning: 'ผลมีรอยกด ขั้วทิ่มผลอื่น หรือภาชนะร้อน',
      consequence: 'ผลช้ำและเกิดเชื้อราเร็วระหว่างพักหรือขนส่ง'
    },
    {
      emoji: '⚖️',
      goal: 'แยกเกรดและบันทึกผลผลิต เพื่อรู้คุณภาพและผลตอบแทนของรอบปลูก',
      steps: ['⚖️ ชั่งน้ำหนักแต่ละกลุ่มเกรด', '🔍 แยกผลดี ผลตำหนิ และผลตกเกรด', '📝 บันทึกน้ำหนักและจำนวนลงแบบฟอร์ม'],
      parameters: [{ label: 'อุณหภูมิพักผล', value: '12–15°C' }, { label: 'ข้อมูลที่บันทึก', value: 'เกรด + น้ำหนัก' }],
      warning: 'น้ำหนักไม่ตรง จำนวนผลหาย หรือผลช้ำเพิ่มขึ้น',
      consequence: 'สรุปต้นทุนและผลผลิตผิด ทำให้วางแผนรอบถัดไปยาก'
    }
  ]
};

function getTaskGuide(stageNum, index) {
  const guide = taskGuideTemplates[stageNum]?.[index];
  return guide || {
    emoji: '✅',
    goal: 'ทำงานตามรายการประจำวันให้ครบและตรวจผลหลังทำเสร็จ',
    steps: ['🧰 เตรียมอุปกรณ์ให้พร้อม', '✅ ทำตามรายการบนการ์ดทีละข้อ', '📝 ตรวจผลและบันทึกสิ่งผิดปกติ'],
    parameters: [],
    warning: 'พบค่าผิดปกติหรืออาการของต้นเปลี่ยนไปจากเดิม',
    consequence: 'งานอาจคลาดเคลื่อนและส่งผลต่อขั้นตอนถัดไป'
  };
}

function updateEnvironmentalMatrix(stageNum) {
  const data = stageData[stageNum];
  if (!data || !data.envMatrix) return;
  const env = data.envMatrix;

  // Cockpit quick-glance chips
  if (data.cockpit) {
    const cpEc = document.getElementById('cockpitTargetEc');
    if (cpEc) cpEc.textContent = data.cockpit.ec;
    const cpPh = document.getElementById('cockpitTargetPh');
    if (cpPh) cpPh.textContent = data.cockpit.ph;
    const cpTemp = document.getElementById('cockpitTargetTemp');
    if (cpTemp) cpTemp.textContent = data.cockpit.temp;
  }

  // EC Card
  const valEc = document.getElementById('envValEc');
  const targetEc = document.getElementById('envTargetEc');
  const statusEc = document.getElementById('envStatusEc');
  if (valEc) {
    valEc.textContent = env.ec.val;
    valEc.style.color = env.ec.color;
  }
  if (targetEc) targetEc.textContent = env.ec.target;
  if (statusEc) {
    statusEc.textContent = env.ec.status;
    statusEc.style.color = env.ec.color;
    statusEc.style.backgroundColor = env.ec.color === '#f59e0b' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(46, 243, 135, 0.12)';
  }

  // pH Card
  const valPh = document.getElementById('envValPh');
  const targetPh = document.getElementById('envTargetPh');
  const statusPh = document.getElementById('envStatusPh');
  if (valPh) {
    valPh.textContent = env.ph.val;
    valPh.style.color = env.ph.color;
  }
  if (targetPh) targetPh.textContent = env.ph.target;
  if (statusPh) {
    statusPh.textContent = env.ph.status;
    statusPh.style.color = env.ph.color;
    statusPh.style.backgroundColor = 'rgba(46, 243, 135, 0.12)';
  }

  // Temp Card
  const valTemp = document.getElementById('envValTemp');
  const targetTemp = document.getElementById('envTargetTemp');
  const statusTemp = document.getElementById('envStatusTemp');
  if (valTemp) {
    valTemp.textContent = env.temp.val;
    valTemp.style.color = env.temp.color;
  }
  if (targetTemp) targetTemp.textContent = env.temp.target;
  if (statusTemp) {
    statusTemp.textContent = env.temp.status;
    statusTemp.style.color = env.temp.color;
    statusTemp.style.backgroundColor = 'rgba(46, 243, 135, 0.12)';
  }

  // Humidity Card
  const valHum = document.getElementById('envValHum');
  const targetHum = document.getElementById('envTargetHum');
  const statusHum = document.getElementById('envStatusHum');
  if (valHum) {
    valHum.textContent = env.hum.val;
    valHum.style.color = env.hum.color;
  }
  if (targetHum) targetHum.textContent = env.hum.target;
  if (statusHum) {
    statusHum.textContent = env.hum.status;
    statusHum.style.color = env.hum.color;
    statusHum.style.backgroundColor = 'rgba(34, 211, 238, 0.12)';
  }
}

function switchStage(stageNum) {
  currentStage = stageNum;
  try {
    localStorage.setItem(STORAGE_STAGE_KEY, String(stageNum));
  } catch (e) {}

  const navHomeBtn = document.getElementById('nav-home-btn');
  if (navHomeBtn) {
    navHomeBtn.href = `index.html?stage=${stageNum}`;
  }
  const infoLogoLink = document.getElementById('infoLogoLink');
  if (infoLogoLink) {
    infoLogoLink.href = `index.html?stage=${stageNum}`;
  }
  
  const progressMap = {
    1: '28%',
    2: '51%',
    3: '74%',
    4: '100%'
  };

  const track = document.getElementById('stageProgressTrack');
  if (track) {
    track.style.width = progressMap[stageNum] || '28%';
  }

  for (let i = 1; i <= 4; i++) {
    const btn = document.getElementById('stageBtn-' + i);
    if (!btn) continue;
    if (i === stageNum) {
      btn.className = 'stage-tab glass-panel-active';
      const node = btn.querySelector('.stage-node');
      if (node) node.classList.add('stage-node-active');
    } else {
      btn.className = 'stage-tab glass-panel border-bio-line hover:border-bio-cyan/40';
      const node = btn.querySelector('.stage-node');
      if (node) node.classList.remove('stage-node-active');
    }
  }

  const data = stageData[stageNum];
  const stageBadgeEl = document.getElementById('stageBadge');
  if (stageBadgeEl) stageBadgeEl.innerText = data.stageBadge;
  const stageTitleEl = document.getElementById('stageTitle');
  if (stageTitleEl) stageTitleEl.innerText = data.title;
  const stageDescEl = document.getElementById('stageDesc');
  if (stageDescEl) stageDescEl.innerText = data.desc;
  const stageDaysEl = document.getElementById('stageDays');
  if (stageDaysEl) stageDaysEl.innerText = data.days;
  const progressEl = document.getElementById('stageProgress');
  if (progressEl) {
    progressEl.innerHTML = `<span>ความคืบหน้า</span><span class="text-white font-bold">${data.progress}</span>`;
  }

  // Update Environmental Matrix & Cockpit
  updateEnvironmentalMatrix(stageNum);

  // 1. Render ToDos with big readable text, SOP numbered steps, and synchronized completion state
  const todoContainer = document.getElementById('todoContainer');
  if (todoContainer) {
    todoContainer.innerHTML = data.todos.map((item, idx) => {
      const taskId = `stage${stageNum}_task${idx}`;
      const isDone = isTaskCompleted(taskId, item.done);
      const guide = getTaskGuide(stageNum, idx);
      return `
      <div class="todo-card glass-panel p-5 rounded-2xl border-bio-line space-y-3.5 hover:border-bio-accent/40 transition-all ${isDone ? 'todo-card-done' : ''}" data-todo-card="${idx}" data-task-id="${taskId}">
        <div class="flex items-center justify-between border-b border-bio-line/80 pb-2.5">
          <span class="todo-time" data-tone="${idx}">
            <span class="todo-time-emoji">${guide.emoji}</span>
            ${item.time}
          </span>
          <span class="todo-step-label">
            ขั้นตอน ${idx + 1} / ${data.todos.length}
          </span>
        </div>
        
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <h3 class="todo-card-title text-[20px] font-thai font-bold text-white leading-snug">
              ${guide.emoji} ${item.title}
            </h3>
            <p class="todo-card-summary text-[15.5px] font-thai text-[#d1e2eb] mt-1.5 leading-relaxed">
              ${item.desc}
            </p>
            <div class="mt-3 flex flex-wrap items-center gap-2">
              ${item.badges.map(b => `
                <span class="px-3 py-1 rounded-lg bg-bio-card2 border border-bio-line text-bio-cyan font-thai font-bold text-[14px]">
                  ${b}
                </span>
              `).join('')}
            </div>
          </div>

          <div class="todo-card-actions">
            <button type="button" 
                    role="checkbox"
                    aria-checked="${isDone}"
                    tabindex="0"
                    onclick="toggleTodoCheck(this, '${taskId}', ${item.done})" 
                    onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleTodoCheck(this, '${taskId}', ${item.done});}"
                    class="todo-check-button ${isDone ? 'is-done' : ''}" 
                    title="กดเพื่อทำเครื่องหมายว่าเสร็จสิ้น" 
                    aria-label="กดเพื่อทำเครื่องหมายงานที่ ${idx + 1} ว่าเสร็จสิ้น">
            ${isDone ? '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : '<span class="todo-check-pending-label"><span class="todo-check-pending-icon">✓</span>กดทำ</span>'}
            </button>
            <button class="todo-detail-button" type="button" onclick="toggleTaskDetails(this)" aria-expanded="false" tabindex="0">
              <span class="todo-detail-icon">＋</span>
              <span>ดูขั้นตอน</span>
            </button>
          </div>
        </div>

        <div class="todo-detail-panel" hidden>
          <div class="flex items-center justify-between pb-1 border-b border-bio-cyan/20">
            <div class="todo-detail-heading flex items-center gap-2 font-thai font-bold text-[16px]">
              <span class="text-lg">${guide.emoji}</span>
              <span>คู่มือขั้นตอนปฏิบัติมาตรฐาน (SOP)</span>
            </div>
            <span class="text-[13px] font-mono font-bold text-bio-cyan px-2.5 py-0.5 rounded bg-bio-cyan/15 border border-bio-cyan/30">STANDARD OPERATION</span>
          </div>

          <div class="todo-detail-section">
            <strong class="text-bio-accent flex items-center gap-1.5 font-thai text-[15px]">
              <span>🎯</span> เป้าหมายการปฏิบัติ
            </strong>
            <p class="text-[#d1e2eb] font-medium font-thai text-[15px] leading-relaxed">${guide.goal}</p>
          </div>

          <div class="space-y-2">
            <strong class="text-white block font-bold text-[15px] font-thai">🧭 ขั้นตอนปฏิบัติทีละขั้น (SOP)</strong>
            <div class="space-y-2">
              ${guide.steps.map((step, sIdx) => `
                <div class="todo-sop-numbered-step">
                  <div class="todo-sop-number-badge">${sIdx + 1}</div>
                  <div class="todo-sop-step-text">${step}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="todo-parameters">
            ${guide.parameters.map(parameter => `
              <div>
                <span>${parameter.label}</span>
                <b>${parameter.value}</b>
              </div>
            `).join('')}
          </div>

          <div class="todo-warning">
            <strong class="flex items-center gap-1.5 font-thai text-[15px]"><span>⚠️</span> จุดสังเกตความผิดปกติ:</strong>
            <p class="mt-1 font-thai text-[14.5px] leading-relaxed text-[#fecdd3]">${guide.warning}</p>
            <div class="todo-consequence mt-2 font-thai text-[14.5px] leading-relaxed">
              <b>ผลกระทบหากไม่แก้ไข:</b> ${guide.consequence}
            </div>
          </div>
        </div>
      </div>
    `;
    }).join('');
  }

  // 2. Render Equipments with big readable typography and specs
  const equipContainer = document.getElementById('equipContainer');
  if (equipContainer) {
    equipContainer.innerHTML = data.equips.map((cat, idx) => `
      <div class="glass-panel p-5 rounded-2xl border-bio-line space-y-4">
        <div class="flex items-center justify-between border-b border-bio-line/80 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl ${idx === 0 ? 'bg-bio-accent/20 border-bio-accent/40 text-bio-accent' : 'bg-bio-cyan/20 border-bio-cyan/40 text-bio-cyan'} border flex items-center justify-center font-bold text-lg">
              ${idx === 0 ? '📦' : '⚙️'}
            </div>
            <div>
              <h3 class="text-[20px] font-thai font-bold text-white leading-tight">${idx + 1}. ${cat.cat}</h3>
              <p class="text-[14.5px] font-thai text-[#d1e2eb] mt-0.5">หมวดหมู่วัสดุ-เครื่องมือจำเป็นประจำ Stage ${stageNum}</p>
            </div>
          </div>
          <span class="text-[13.5px] font-mono font-bold px-3 py-1 rounded-full bg-bio-card2 border border-bio-line text-bio-cyan">
            ${cat.items.length} รายการ
          </span>
        </div>
        <div class="grid grid-cols-2 gap-3.5">
          ${cat.items.map((item, itemIdx) => `
            <div class="kiosk-equip-card">
              <div class="kiosk-equip-top">
                <span class="kiosk-equip-index">ITEM ${String(itemIdx + 1).padStart(2, '0')}</span>
                <span class="w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-bio-accent shadow-[0_0_8px_rgba(46,243,135,0.8)]' : 'bg-bio-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)]'}"></span>
              </div>
              <div class="kiosk-equip-name font-thai">${item.name}</div>
              <div class="kiosk-equip-spec font-thai">${item.detail}</div>
              <div class="kiosk-equip-tip font-thai">
                <span>💡</span>
                <span>ตรวจสอบสเปกก่อนนำเข้าแปลง</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  // 3. Update Precautions & Hazards Tab (Tab 4)
  const warnHeader = document.getElementById('warnHeader');
  if (warnHeader) warnHeader.innerText = data.warnTitle;

  const warnList = document.getElementById('warnList');
  if (warnList) {
    warnList.innerHTML = data.warns.map((w) => `
      <div class="kiosk-hazard-card">
        <div class="kiosk-hazard-header">
          <div class="kiosk-hazard-title font-thai">
            <span class="text-xl">⚠️</span>
            <span>${w.title}</span>
          </div>
          <span class="kiosk-hazard-badge">${w.severity}</span>
        </div>
        <div class="kiosk-hazard-body font-thai">
          <div class="kiosk-hazard-col">
            <div class="kiosk-hazard-col-title flex items-center gap-1.5 font-thai">
              <span>🔍</span>
              <span>สาเหตุและอาการที่พบ</span>
            </div>
            <div class="kiosk-hazard-col-text font-thai">${w.symptom}</div>
          </div>
          <div class="kiosk-hazard-col">
            <div class="kiosk-hazard-col-title text-bio-accent flex items-center gap-1.5 font-thai">
              <span>🚨</span>
              <span>แนวทางแก้ไขทันที</span>
            </div>
            <div class="kiosk-hazard-col-text font-thai">${w.action}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  const warnAdviceTitle = document.getElementById('warnAdviceTitle');
  if (warnAdviceTitle) warnAdviceTitle.innerText = data.adviceTitle;
  const warnAdviceDesc = document.getElementById('warnAdviceDesc');
  if (warnAdviceDesc) warnAdviceDesc.innerText = data.adviceDesc;

  const warnBenchmarkGrid = document.getElementById('warnBenchmarkGrid');
  if (warnBenchmarkGrid && data.benchmarks) {
    warnBenchmarkGrid.innerHTML = data.benchmarks.map(b => `
      <div class="kiosk-benchmark-card">
        <div class="kiosk-benchmark-icon">✓</div>
        <div>
          <b class="text-white block font-thai font-bold text-[16px] leading-snug">${b.title}</b>
          <span class="kiosk-benchmark-text font-thai mt-1 block leading-relaxed">${b.desc}</span>
        </div>
      </div>
    `).join('');
  }

  updateTodoProgress();
  renderTelemetryView();
}

function switchSubTab(tab) {
  currentSubTab = tab;
  const tabs = ['chart', 'todo', 'equip', 'warn'];
  tabs.forEach(t => {
    const btn = document.getElementById('subTab-' + t);
    const view = document.getElementById('view-' + t);
    if (!btn || !view) return;
    if (t === tab) {
      btn.className = 'flex-1 h-[48px] px-2 rounded-xl font-thai font-bold text-[15px] flex items-center justify-center gap-2 transition-all bg-bio-card2 text-bio-accent border border-bio-accent/50';
      btn.setAttribute('aria-selected', 'true');
      view.classList.remove('hidden');
    } else {
      btn.className = 'flex-1 h-[48px] px-2 rounded-xl font-thai font-bold text-[15px] flex items-center justify-center gap-2 transition-all text-bio-muted hover:text-white border border-transparent';
      btn.setAttribute('aria-selected', 'false');
      view.classList.add('hidden');
    }
  });
  if (tab === 'chart') {
    renderTelemetryView();
  }
}

// ==========================================================================
// TELEMETRY CHARTS & AGRONOMIC INFOGRAPHICS ENGINE
// ==========================================================================

function renderTelemetryView() {
  const stage = stageData[currentStage];
  if (!stage || !stage.metrics) return;
  const ec = stage.metrics.ec;
  const ph = stage.metrics.ph;

  // 1. Update EC Card
  const ecTargetEl = document.getElementById('ec-header-target');
  if (ecTargetEl) ecTargetEl.textContent = `EC (เป้า ${ec.target})`;
  const ecDot = document.getElementById('ec-status-dot');
  if (ecDot) {
    ecDot.style.backgroundColor = ec.statusColor;
    ecDot.style.boxShadow = `0 0 10px ${ec.statusColor}`;
  }
  const ecValEl = document.getElementById('ec-metric-value');
  if (ecValEl) {
    ecValEl.textContent = ec.current;
    ecValEl.style.color = ec.statusColor;
  }
  const ecArrowEl = document.getElementById('ec-metric-arrow');
  if (ecArrowEl) {
    ecArrowEl.textContent = ec.trend;
    ecArrowEl.style.color = ec.statusColor;
  }
  const ecBadgeEl = document.getElementById('ec-metric-badge');
  if (ecBadgeEl) {
    ecBadgeEl.textContent = ec.statusText;
    ecBadgeEl.style.color = ec.statusColor;
    ecBadgeEl.style.backgroundColor = ec.statusColor === '#f59e0b' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(46, 243, 135, 0.12)';
    ecBadgeEl.style.borderColor = ec.statusColor === '#f59e0b' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(46, 243, 135, 0.3)';
  }

  // 2. Update pH Card
  const phTargetEl = document.getElementById('ph-header-target');
  if (phTargetEl) phTargetEl.textContent = `pH (เป้า ${ph.target})`;
  const phDot = document.getElementById('ph-status-dot');
  if (phDot) {
    phDot.style.backgroundColor = ph.statusColor;
    phDot.style.boxShadow = `0 0 10px ${ph.statusColor}`;
  }
  const phValEl = document.getElementById('ph-metric-value');
  if (phValEl) {
    phValEl.textContent = ph.current;
    phValEl.style.color = ph.statusColor;
  }
  const phBadgeEl = document.getElementById('ph-metric-badge');
  if (phBadgeEl) {
    phBadgeEl.textContent = ph.statusText;
    phBadgeEl.style.color = ph.statusColor;
    phBadgeEl.style.backgroundColor = ph.statusColor === '#f59e0b' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(46, 243, 135, 0.12)';
    phBadgeEl.style.borderColor = ph.statusColor === '#f59e0b' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(46, 243, 135, 0.3)';
  }

  // 3. Render Trend Chart
  renderSvgChart(activeChartMetric, activeChartRange);

  // 4. Update Actionable Farmer Guide
  const subTitleEl = document.getElementById('guideSubtitle');
  if (subTitleEl) subTitleEl.textContent = `แนวทางปฏิบัติประจำระยะสำหรับค่า EC และ pH (${stage.stageBadge})`;

  const guideEcDot = document.getElementById('guideEcDot');
  if (guideEcDot) guideEcDot.style.backgroundColor = ec.statusColor;
  const guideEcStatus = document.getElementById('guideEcStatus');
  if (guideEcStatus) {
    guideEcStatus.textContent = ec.guideStatus;
    guideEcStatus.style.color = ec.statusColor;
    guideEcStatus.style.borderColor = ec.statusColor === '#f59e0b' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(46, 243, 135, 0.3)';
    guideEcStatus.style.backgroundColor = ec.statusColor === '#f59e0b' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(46, 243, 135, 0.1)';
  }
  const guideEcMeaning = document.getElementById('guideEcMeaning');
  if (guideEcMeaning) guideEcMeaning.textContent = ec.guideMeaning;
  const guideEcAction = document.getElementById('guideEcAction');
  if (guideEcAction) guideEcAction.innerHTML = `<b>วิธีปฏิบัติทันที:</b> ${ec.guideAction}`;

  const guidePhDot = document.getElementById('guidePhDot');
  if (guidePhDot) guidePhDot.style.backgroundColor = ph.statusColor;
  const guidePhStatus = document.getElementById('guidePhStatus');
  if (guidePhStatus) {
    guidePhStatus.textContent = ph.guideStatus;
    guidePhStatus.style.color = ph.statusColor;
    guidePhStatus.style.borderColor = ph.statusColor === '#f59e0b' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(46, 243, 135, 0.3)';
    guidePhStatus.style.backgroundColor = ph.statusColor === '#f59e0b' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(46, 243, 135, 0.1)';
  }
  const guidePhMeaning = document.getElementById('guidePhMeaning');
  if (guidePhMeaning) guidePhMeaning.textContent = ph.guideMeaning;
  const guidePhAction = document.getElementById('guidePhAction');
  if (guidePhAction) guidePhAction.innerHTML = `<b>คำแนะนำ:</b> ${ph.guideAction}`;
}

function renderSvgChart(metricKey, rangeKey) {
  const stage = stageData[currentStage];
  if (!stage || !stage.metrics) return;
  const metric = stage.metrics[metricKey];
  if (!metric) return;

  // Update chart header title
  const chartTitleEl = document.getElementById('chartMainTitle');
  if (chartTitleEl) chartTitleEl.textContent = metricKey === 'ec' ? 'แนวโน้ม EC' : 'แนวโน้ม pH';

  // Update Metric button active states
  const btnEc = document.getElementById('btn-metric-ec');
  const btnPh = document.getElementById('btn-metric-ph');
  if (btnEc) btnEc.className = metricKey === 'ec' ? 'chart-metric-btn active' : 'chart-metric-btn';
  if (btnPh) btnPh.className = metricKey === 'ph' ? 'chart-metric-btn active' : 'chart-metric-btn';

  // Update Range button active states
  const btnToday = document.getElementById('btn-range-today');
  const btnWeek = document.getElementById('btn-range-week');
  if (btnToday) btnToday.className = rangeKey === 'today' ? 'kiosk-time-pill active' : 'kiosk-time-pill';
  if (btnWeek) btnWeek.className = rangeKey === 'week' ? 'kiosk-time-pill active' : 'kiosk-time-pill';

  // Update Legend target & current readout
  const legendTargetEl = document.getElementById('legendTargetRange');
  if (legendTargetEl) legendTargetEl.textContent = metric.target;
  const currentValEl = document.getElementById('footerCurrentVal');
  if (currentValEl) {
    currentValEl.textContent = `${metric.current} ${metric.unit}`.trim();
    currentValEl.style.color = metric.statusColor;
  }

  const values = rangeKey === 'today' ? metric.todayData : metric.weekData;
  const labels = rangeKey === 'today' ? metric.timeLabelsToday : metric.timeLabelsWeek;

  const width = 680;
  const height = 200;
  const paddingLeft = 36;
  const paddingRight = 36;
  const paddingTop = 26;
  const paddingBottom = 38;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const yMin = metric.min;
  const yMax = metric.max;

  const getX = (index) => paddingLeft + (index / (values.length - 1)) * plotWidth;
  const getY = (val) => paddingTop + plotHeight * (1 - (val - yMin) / (yMax - yMin));

  const points = values.map((v, i) => ({ x: getX(i), y: getY(v) }));

  // Build smooth Bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX = p0.x + (p1.x - p0.x) / 2;
    pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  // Area path
  const lastPt = points[points.length - 1];
  const firstPt = points[0];
  const baselineY = paddingTop + plotHeight;
  const areaD = `${pathD} L ${lastPt.x} ${baselineY} L ${firstPt.x} ${baselineY} Z`;

  // Target Zone coordinates
  const yZoneTop = getY(metric.targetMax);
  const yZoneBottom = getY(metric.targetMin);
  const zoneY = Math.min(yZoneTop, yZoneBottom);
  const zoneH = Math.abs(yZoneBottom - yZoneTop);

  // Time labels
  const labelsSvg = labels.map((lbl, idx) => {
    return `<text x="${points[idx].x}" y="${height - 12}" fill="#94a9b3" font-family="'Prompt', sans-serif" font-size="12" font-weight="600" text-anchor="middle">${lbl}</text>`;
  }).join('');

  // Current Dot
  const dotColor = metric.statusColor;

  const svg = `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.32" />
          <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <!-- Background Grid lines -->
      <line x1="${paddingLeft}" y1="${paddingTop}" x2="${width - paddingRight}" y2="${paddingTop}" stroke="rgba(28, 50, 62, 0.6)" stroke-dasharray="3,3" />
      <line x1="${paddingLeft}" y1="${paddingTop + plotHeight * 0.5}" x2="${width - paddingRight}" y2="${paddingTop + plotHeight * 0.5}" stroke="rgba(28, 50, 62, 0.4)" stroke-dasharray="3,3" />
      <line x1="${paddingLeft}" y1="${baselineY}" x2="${width - paddingRight}" y2="${baselineY}" stroke="rgba(28, 50, 62, 0.7)" />

      <!-- TARGET ZONE -->
      <rect x="${paddingLeft}" y="${zoneY}" width="${plotWidth}" height="${zoneH}" fill="rgba(46, 243, 135, 0.12)" stroke="rgba(46, 243, 135, 0.45)" stroke-dasharray="4,4" rx="4" />
      <text x="${paddingLeft + 12}" y="${zoneY + 16}" fill="#2ef387" font-family="'Space Mono', monospace" font-size="11" font-weight="700">TARGET ZONE (${metric.target})</text>

      <!-- Fill Area under curve -->
      <path d="${areaD}" fill="url(#curveGradient)" />

      <!-- Curve Line -->
      <path d="${pathD}" fill="none" stroke="#22d3ee" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Data Dots -->
      ${points.slice(0, -1).map(pt => `<circle cx="${pt.x}" cy="${pt.y}" r="3.5" fill="#22d3ee" opacity="0.6" />`).join('')}

      <!-- Current / Active Latest Dot (with outer pulse ring) -->
      <circle cx="${lastPt.x}" cy="${lastPt.y}" r="11" fill="none" stroke="${dotColor}" stroke-width="2.5" opacity="0.9" />
      <circle cx="${lastPt.x}" cy="${lastPt.y}" r="5.5" fill="${dotColor}" />

      <!-- X-Axis Labels -->
      ${labelsSvg}
    </svg>
  `;

  const wrapper = document.getElementById('chartSvgWrapper');
  if (wrapper) wrapper.innerHTML = svg;
}

function switchChartMetric(metric) {
  activeChartMetric = metric;
  renderTelemetryView();
}

function switchChartRange(range) {
  activeChartRange = range;
  renderTelemetryView();
}

function toggleTodoCheck(btn, taskId, defaultChecked = false) {
  const isDone = btn.classList.contains('is-done');
  const newStatus = !isDone;
  if (taskId) {
    setTaskStorage(taskId, newStatus);
  }

  if (!newStatus) {
    btn.className = 'todo-check-button w-12 h-12 rounded-xl flex items-center justify-center font-thai font-bold flex-shrink-0 transition-all';
    btn.innerHTML = '<span class="todo-check-pending-label"><span class="todo-check-pending-icon">✓</span>กดทำ</span>';
    btn.closest('.todo-card')?.classList.remove('todo-card-done');
    btn.title = 'กดเพื่อทำเครื่องหมายว่าเสร็จสิ้น';
    btn.setAttribute('aria-label', 'กดเพื่อทำเครื่องหมายว่าเสร็จสิ้น');
  } else {
    btn.className = 'todo-check-button is-done w-12 h-12 rounded-xl flex items-center justify-center font-thai font-bold flex-shrink-0 transition-all';
    btn.innerHTML = '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>';
    btn.closest('.todo-card')?.classList.add('todo-card-done');
    btn.title = 'ทำเครื่องหมายว่าเสร็จสิ้นแล้ว';
    btn.setAttribute('aria-label', 'ทำเครื่องหมายว่าเสร็จสิ้นแล้ว');
  }
  updateTodoProgress();
}

function toggleTaskDetails(btn) {
  const card = btn.closest('.todo-card');
  const panel = card?.querySelector('.todo-detail-panel');
  if (!panel) return;
  const isOpen = !panel.hidden;
  panel.hidden = isOpen;
  btn.setAttribute('aria-expanded', String(!isOpen));
  btn.querySelector('.todo-detail-icon').textContent = isOpen ? '＋' : '−';
  btn.querySelector('span:last-child').textContent = isOpen ? 'ดูขั้นตอน' : 'ซ่อนขั้นตอน';
  card.classList.toggle('todo-card-expanded', !isOpen);
}

function updateTodoProgress() {
  const cards = [...document.querySelectorAll('.todo-card')];
  const doneCount = cards.filter(card => card.classList.contains('todo-card-done')).length;
  const progress = document.getElementById('todoProgress');
  if (progress) progress.textContent = `เสร็จแล้ว ${doneCount} / ${cards.length}`;
  const counter = document.getElementById('todoCounter');
  if (counter) counter.textContent = doneCount === cards.length ? 'ครบทุกงานวันนี้' : `เหลือ ${cards.length - doneCount} งานวันนี้`;
}

// Initial render: check URL parameter or localStorage
const params = new URLSearchParams(window.location.search);
const requestedStage = Number(params.get('stage'));
let validStage = 1;

if (Number.isInteger(requestedStage) && stageData[requestedStage]) {
  validStage = requestedStage;
} else {
  try {
    const saved = Number(localStorage.getItem(STORAGE_STAGE_KEY));
    if (Number.isInteger(saved) && stageData[saved]) {
      validStage = saved;
    }
  } catch (e) {}
}

switchStage(validStage);
updateTodoProgress();
switchSubTab('chart');

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
        if (stageData[num]) {
          stageData[num].stageBadge = s.stageBadge || stageData[num].stageBadge;
          stageData[num].title = s.stageHeaderTitle || s.title || stageData[num].title;
          stageData[num].desc = s.desc || stageData[num].desc;
          stageData[num].days = s.days || stageData[num].days;
          stageData[num].progress = s.progress || stageData[num].progress;
          if (s.cockpit) stageData[num].cockpit = s.cockpit;
          if (s.envMatrix) stageData[num].envMatrix = s.envMatrix;
          if (s.todos) {
            stageData[num].todos = s.todos.map((t, idx) => ({
              time: t.time,
              timeBg: t.timeBg || (idx === 0 ? 'text-bio-accent' : idx === 1 ? 'text-bio-cyan' : 'text-bio-muted'),
              title: t.title,
              desc: t.desc,
              badges: t.badges || [],
              done: Boolean(t.defaultChecked)
            }));
            if (!taskGuideTemplates[num]) taskGuideTemplates[num] = [];
            s.todos.forEach((t, idx) => {
              if (t.sop) {
                taskGuideTemplates[num][idx] = t.sop;
              }
            });
          }
          if (s.equips) stageData[num].equips = s.equips;
          if (s.warnTitle) stageData[num].warnTitle = s.warnTitle;
          if (s.warns) stageData[num].warns = s.warns;
          if (s.adviceTitle) stageData[num].adviceTitle = s.adviceTitle;
          if (s.adviceDesc) stageData[num].adviceDesc = s.adviceDesc;
          if (s.benchmarks) stageData[num].benchmarks = s.benchmarks;
          if (s.metrics) stageData[num].metrics = s.metrics;
        }
      }

      if (json && json.system && json.system.siteName) {
        const infoLogo = document.getElementById('infoLogoTitle');
        if (infoLogo) infoLogo.textContent = json.system.siteName;
      }

      // Re-render current stage with new data from JSON
      switchStage(currentStage);
    }
  } catch (err) {
    console.info('Info kiosk operating with embedded dataset:', err.message);
  }
}
loadKioskDataAndApply();

// Cross-tab synchronization (tasks and admin data changes)
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_TASKS_KEY) {
    switchStage(currentStage);
  } else if (event.key === 'plant_a_control_kiosk_data' || event.key === 'plant_a_control_kiosk_data_updated') {
    loadKioskDataAndApply();
  }
});

