let currentMission = "";
let selectedCard = null;
let timerInterval = null;
let timeLeft = 600;

const ADMIN_PASSWORD = "1004";

/* 시인지카드 1~60 */
const visualCards = Array.from({ length: 60 }, (_, i) => {
  const num = String(i + 1).padStart(3, "0");

  return {
    id: i + 1,
    title: `시인지카드 ${i + 1}`,
  image: `visual-card-${num}.jpg`}
  

document.addEventListener("DOMContentLoaded", () => {
  startIntro();
  updateCount();
  updateAdmin();
});

/* 공통 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function go(pageId) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);
  updateCount();
  updateAdmin();
}

/* 인트로 타자 효과 */
async function typeText(text, speed = 80) {
  const line = document.getElementById("type-line");
  line.innerHTML = "";

  if (!text) {
    line.innerHTML = `<span class="cursor">|</span>`;
    await delay(800);
    return;
  }

  for (let i = 0; i < text.length; i++) {
    line.innerHTML = text.slice(0, i + 1) + `<span class="cursor">|</span>`;
    await delay(speed);
  }

  await delay(850);
}

async function startIntro() {
  const savedName = localStorage.getItem("pilotName");
  const nameBox = document.getElementById("name-box");
  const enterBtn = document.getElementById("enter-btn");
  const input = document.getElementById("pilot-name");

  if (nameBox) nameBox.hidden = true;
  if (enterBtn) enterBtn.hidden = true;
  if (input) input.value = "";

  await typeText("신호 수신중...");
  await delay(500);

  await typeText("파일럿...");
  await delay(500);

  if (!savedName) {
    await typeText("이름을 등록해주세요");
    await delay(300);

    if (nameBox) nameBox.hidden = false;
    if (input) input.focus();

    return;
  }

  await typeText(`파일럿 ${savedName}`);
  await delay(300);

  if (enterBtn) enterBtn.hidden = false;
}

async function savePilot() {
  const input = document.getElementById("pilot-name");
  const name = input.value.trim();
  const nameBox = document.getElementById("name-box");
  const enterBtn = document.getElementById("enter-btn");

  if (!name) {
    alert("이름을 입력해줘.");
    return;
  }

  localStorage.setItem("pilotName", name);

  if (nameBox) nameBox.hidden = true;
  if (enterBtn) enterBtn.hidden = true;

  await typeText("환영합니다");
  await delay(500);

  await typeText(`파일럿 ${name}`);
  await delay(300);

  if (enterBtn) enterBtn.hidden = false;
}

/* 오늘 완료 기록 */
function todayKey() {
  const d = new Date();
  return `missions-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getDone() {
  return JSON.parse(localStorage.getItem(todayKey()) || "[]");
}

function saveDone(done) {
  localStorage.setItem(todayKey(), JSON.stringify(done));
}

function updateCount() {
  const done = getDone();

  const el = document.getElementById("done-count");
  if (el) el.textContent = done.length;

  const adminDone = document.getElementById("admin-done-count");
  if (adminDone) adminDone.textContent = done.length;
}

function markMissionDone(type) {
  const done = getDone();

  if (!done.includes(type)) {
    done.push(type);
    saveDone(done);
  }

  updateCount();
}

/* 메인 미션 */
function goMission(type) {
  currentMission = type;

  if (type === "visual") {
    openVisualMission();
    return;
  }

  alert("이 미션은 다음 단계에서 연결할게.");
}

/* 시인지 카드 진행 */
function getDoneVisualCards() {
  return JSON.parse(localStorage.getItem("doneVisualCards") || "[]");
}

function saveDoneVisualCards(done) {
  localStorage.setItem("doneVisualCards", JSON.stringify(done));
}

/* 완료한 카드는 빠지고, 아직 안 한 카드 중 앞에서 3개만 표시 */
function getVisibleVisualCards() {
  const done = getDoneVisualCards();

  return visualCards
    .filter(card => !done.includes(card.id))
    .slice(0, 3);
}

function openVisualMission() {
  selectedCard = null;
  stopTimer();
  timeLeft = 600;
  updateTimerText();

  const selectView = document.getElementById("card-select-view");
  const playView = document.getElementById("card-play-view");
  const cardList = document.getElementById("card-list");
  const preview = document.getElementById("photo-preview");

  if (selectView) selectView.hidden = false;
  if (playView) playView.hidden = true;
  if (preview) {
    preview.hidden = true;
    preview.src = "";
  }

  if (cardList) {
    cardList.innerHTML = "";

    const cards = getVisibleVisualCards();

    if (cards.length === 0) {
      cardList.innerHTML = `
        <div class="mission-finished">
          🎉 시인지카드 60장 완료!
        </div>
      `;
      markMissionDone("visual");
    } else {
      cards.forEach(card => {
        const btn = document.createElement("button");
        btn.className = "card-choice";
        btn.onclick = () => selectVisualCard(card);

        btn.innerHTML = `
          <img src="${card.image}" alt="${card.title}">
          <div>${card.title}</div>
        `;

        cardList.appendChild(btn);
      });
    }
  }

  go("mission");
}

function selectVisualCard(card) {
  selectedCard = card;

  const selectView = document.getElementById("card-select-view");
  const playView = document.getElementById("card-play-view");

  if (selectView) selectView.hidden = true;
  if (playView) playView.hidden = false;

  document.getElementById("mission-title").textContent = "오늘의 시인지 미션";
  document.getElementById("selected-card-title").textContent = card.title;
  document.getElementById("selected-card-img").src = card.image;

  timeLeft = 600;
  updateTimerText();
}

/* 10분 타이머 */
function updateTimerText() {
  const el = document.getElementById("timer-text");
  const circle = document.getElementById("timer-circle");
  if (!el) return;

  const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const sec = String(timeLeft % 60).padStart(2, "0");
  el.textContent = `${min}:${sec}`;

  // 원형 진행바 업데이트
  if (circle) {
    const total = 600;
    const pct = timeLeft / total;
    const circumference = 2 * Math.PI * 54;
    circle.style.strokeDashoffset = circumference * (1 - pct);
  }
}
  
/* 사진 */
function previewPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const preview = document.getElementById("photo-preview");
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
}

/* 시인지 카드 완료 */
function completeCardMission() {
  if (!selectedCard) return;

  const doneCards = getDoneVisualCards();

  if (!doneCards.includes(selectedCard.id)) {
    doneCards.push(selectedCard.id);
    saveDoneVisualCards(doneCards);
  }

  const remaining = getVisibleVisualCards();

  if (remaining.length === 0) {
    markMissionDone("visual");
  }

  showClearEffect();

  setTimeout(() => {
    openVisualMission();
  }, 1800);
}

function showClearEffect() {
  const effect = document.getElementById("clear-effect");
  if (!effect) return;

  effect.hidden = false;

  setTimeout(() => {
    effect.hidden = true;
  }, 1600);
}

/* 관리실 */
function pressPass(num) {
  const input = document.getElementById("admin-pass");
  if (!input) return;

  if (input.value.length >= 4) return;
  input.value += num;
}

function clearPass() {
  const input = document.getElementById("admin-pass");
  if (input) input.value = "";
}

function checkAdmin() {
  const input = document.getElementById("admin-pass");
  const pass = input.value.trim();

  if (pass !== ADMIN_PASSWORD) {
    alert("암호가 맞지 않아요.");
    clearPass();
    return;
  }

  clearPass();
  go("admin");
}

function updateAdmin() {
  const name = localStorage.getItem("pilotName") || "-";

  const current = document.getElementById("current-pilot-name");
  if (current) current.textContent = name;

  const adminDone = document.getElementById("admin-done-count");
  if (adminDone) adminDone.textContent = getDone().length;
}

function changePilotName() {
  const input = document.getElementById("new-pilot-name");
  const name = input.value.trim();

  if (!name) {
    alert("새 이름을 입력해줘.");
    return;
  }

  localStorage.setItem("pilotName", name);
  input.value = "";
  updateAdmin();
  alert(`파일럿 ${name}으로 변경했어요.`);
}

function resetToday() {
  localStorage.removeItem(todayKey());
  updateCount();
  updateAdmin();
  alert("오늘 기록을 초기화했어요.");
}

function resetVisualCards() {
  localStorage.removeItem("doneVisualCards");
  alert("시인지 카드 기록을 초기화했어요.");
}

/* 외부 링크용 */
function openLink(url) {
  window.location.href = url;
}
