const ADMIN_PASSWORD = "6927";

const activityContent = {
  listen: {
    icon: "🎧",
    title: "흘려듣기",
    description: "오늘 듣고 싶은 방법을 골라요.",
    options: [
      { icon: "🎵", title: "소리 듣기", note: "좋아하는 노래를 편하게 들어요" },
      { icon: "📺", title: "영상 흘려보기", note: "익숙한 영상을 가볍게 만나요" }
    ]
  },
  nobuyoung: {
    icon: "🎬",
    title: "노부영 영상",
    description: "오늘 만날 노래와 이야기를 골라요.",
    options: [
      { icon: "🌈", title: "노부영 영상 보기", note: "노래와 이야기를 이어서 만나요" }
    ]
  },
  books: {
    icon: "📚",
    title: "책 읽기",
    description: "오늘 읽고 싶은 책을 골라요.",
    options: [
      { icon: "가", title: "한글 책", note: "좋아하는 우리말 이야기를 읽어요" },
      { icon: "A", title: "영어 책", note: "익숙한 영어 이야기를 읽어요" }
    ]
  }
};

const adminSections = {
  diary: {
    icon: "📅",
    title: "일기장",
    description: "하루 이야기를 모아보는 공간이에요."
  },
  shelf: {
    icon: "📚",
    title: "책장",
    description: "읽은 한글책과 영어책을 모아보는 공간이에요."
  },
  records: {
    icon: "🗂️",
    title: "기록",
    description: "우차니가 어떤 활동을 했는지 살펴보는 공간이에요."
  },
  settings: {
    icon: "⚙️",
    title: "설정",
    description: "앱의 활동과 연결 주소를 관리하는 공간이에요."
  }
};

document.addEventListener("DOMContentLoaded", startIntro);

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function go(pageId) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  const nextPage = document.getElementById(pageId);
  if (nextPage) nextPage.classList.add("active");
  window.scrollTo(0, 0);
}

async function typeText(text, speed = 80) {
  const line = document.getElementById("type-line");
  if (!line) return;

  line.innerHTML = "";
  if (!text) {
    line.innerHTML = '<span class="cursor">|</span>';
    await delay(800);
    return;
  }

  for (let i = 0; i < text.length; i += 1) {
    line.innerHTML = `${text.slice(0, i + 1)}<span class="cursor">|</span>`;
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
    if (nameBox) nameBox.hidden = false;
    if (input) input.focus();
    return;
  }

  await typeText(`파일럿 ${savedName}`);
  if (enterBtn) enterBtn.hidden = false;
}

async function savePilot() {
  const input = document.getElementById("pilot-name");
  const name = input ? input.value.trim() : "";
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
  if (enterBtn) enterBtn.hidden = false;
}

function openActivity(type) {
  const content = activityContent[type];
  if (!content) return;

  const icon = document.getElementById("activity-icon");
  const title = document.getElementById("activity-title");
  const description = document.getElementById("activity-description");
  const options = document.getElementById("activity-options");

  icon.textContent = content.icon;
  title.textContent = content.title;
  description.textContent = content.description;
  options.innerHTML = "";

  content.options.forEach(option => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "activity-option";
    button.innerHTML = `
      <span aria-hidden="true">${option.icon}</span>
      <span>
        <strong>${option.title}</strong>
        <small>${option.note}</small>
      </span>
      <b aria-hidden="true">›</b>
    `;
    button.addEventListener("click", () => {
      alert(`${option.title} 연결은 다음 단계에서 설정할 수 있어요.`);
    });
    options.appendChild(button);
  });

  go("activity");
}

function pressPass(num) {
  const input = document.getElementById("admin-pass");
  if (!input || input.value.length >= 4) return;
  input.value += num;
}

function clearPass() {
  const input = document.getElementById("admin-pass");
  if (input) input.value = "";
}

function checkAdmin() {
  const input = document.getElementById("admin-pass");
  const pass = input ? input.value.trim() : "";

  if (pass !== ADMIN_PASSWORD) {
    alert("암호가 맞지 않아요.");
    clearPass();
    return;
  }

  clearPass();
  go("admin");
}

function openAdminSection(sectionId) {
  const section = adminSections[sectionId];
  if (!section) return;

  document.getElementById("admin-section-icon").textContent = section.icon;
  document.getElementById("admin-section-title").textContent = section.title;
  document.getElementById("admin-section-description").textContent = section.description;
  go("admin-section");
}
