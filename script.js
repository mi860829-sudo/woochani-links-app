let currentMission = "";

const ADMIN_PASSWORD = "1004";

const missions = {
  visual: {
    title: "시인지 탐험",
    desc: "현실 카드 3개를 골라 관찰하고, 완성한 뒤 사진으로 남겨요."
  },
  math: {
    title: "수인지 도전",
    desc: "칩을 보고, 움직이고, 마지막에는 머릿속으로 상상해보는 수 미션이에요."
  },
  korean: {
    title: "한글 연구",
    desc: "오늘의 글자를 보고 듣고, 현실에서 써보는 한글 미션이에요."
  },
  english: {
    title: "영어 여행",
    desc: "오늘의 영상, 흘려듣기, 책 표지 기록을 완료해요."
  }
};

function go(pageId) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);
  updateCount();
  updateAdmin();
}

function setSeason() {
  const month = new Date().getMonth() + 1;
  let mark = "🍁";

  if (month >= 3 && month <= 5) mark = "🌸";
  if (month >= 6 && month <= 8) mark = "🌿";
  if (month >= 9 && month <= 11) mark = "🍁";
  if (month === 12 || month <= 2) mark = "❄️";

  document.querySelectorAll(".season-mark").forEach(el => el.textContent = mark);
}

function showTypeLine(text) {
  const line = document.getElementById("type-line");
  line.innerHTML = `${text} <span class="cursor">▌</span>`;
}

function startIntro() {
  setSeason();

  const name = localStorage.getItem("pilotName");

  if (name) {
    go("welcome");

    const welcome = document.getElementById("welcome-line");
    welcome.innerHTML = `환영합니다.<br>파일럿 ${name}`;

    setTimeout(() => {
      go("home");
    }, 2200);

    return;
  }

  const steps = [
    "신호 수신...",
    "새 파일럿 감지",
    "이름을 입력하세요."
  ];

  let i = 0;

  function next() {
    showTypeLine(steps[i]);
    i++;

    if (i < steps.length) {
      setTimeout(next, 1200);
    } else {
      setTimeout(() => {
        document.getElementById("name-box").hidden = false;
        document.getElementById("pilot-name").focus();
      }, 500);
    }
  }

  setTimeout(next, 700);
}

function savePilot() {
  const input = document.getElementById("pilot-name");
  const name = input.value.trim();

  if (!name) {
    alert("이름을 입력해줘.");
    return;
  }

  localStorage.setItem("pilotName", name);

  go("welcome");

  const welcome = document.getElementById("welcome-line");
  welcome.innerHTML = `파일럿 ${name} 등록 완료!<br>환영합니다!`;

  setTimeout(() => {
    go("home");
  }, 2400);
}

function goMission(type) {
  currentMission = type;
  document.getElementById("mission-title").textContent = missions[type].title;
  document.getElementById("mission-desc").textContent = missions[type].desc;
  go("mission");
}

function todayKey() {
  const d = new Date();
  return `missions-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getDone() {
  return JSON.parse(localStorage.getItem(todayKey()) || "[]");
}

function completeMission() {
  if (!currentMission) return;

  const done = getDone();

  if (!done.includes(currentMission)) {
    done.push(currentMission);
    localStorage.setItem(todayKey(), JSON.stringify(done));
  }

  alert("임무 완료!");
  go("home");
}

function updateCount() {
  const el = document.getElementById("done-count");
  if (el) el.textContent = getDone().length;
}

function checkAdmin() {
  const pass = document.getElementById("admin-pass").value.trim();

  if (pass !== ADMIN_PASSWORD) {
    alert("암호가 맞지 않아요.");
    return;
  }

  document.getElementById("admin-pass").value = "";
  go("admin");
}

function updateAdmin() {
  const name = localStorage.getItem("pilotName") || "-";
  const current = document.getElementById("current-pilot-name");
  const adminDone = document.getElementById("admin-done-count");

  if (current) current.textContent = name;
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

function openLink(url) {
  window.location.href = url;
}

document.addEventListener("DOMContentLoaded", () => {
  setSeason();
  startIntro();
  updateCount();
});
