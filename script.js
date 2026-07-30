const ADMIN_PASSWORD = "6927";

/* ==================================================
   아이 활동 화면
================================================== */

const activityContent = {
  listen: {
    icon: "🎧",
    title: "흘려듣기",
    description: "오늘 듣고 싶은 방법을 골라요.",
    options: [
      {
        icon: "🎵",
        title: "소리 듣기",
        note: "좋아하는 노래를 편하게 들어요"
      },
      {
        icon: "📺",
        title: "영상 흘려보기",
        note: "익숙한 영상을 가볍게 만나요"
      }
    ]
  },

  nobuyoung: {
    icon: "🎬",
    title: "노부영 영상",
    description: "오늘 만날 노래와 이야기를 골라요.",
    options: [
      {
        icon: "🌈",
        title: "노부영 영상 보기",
        note: "노래와 이야기를 이어서 만나요"
      }
    ]
  },

  books: {
    icon: "📚",
    title: "책 읽기",
    description: "오늘 읽고 싶은 책을 골라요.",
    options: [
      {
        icon: "가",
        title: "한글 책",
        note: "좋아하는 우리말 이야기를 읽어요"
      },
      {
        icon: "A",
        title: "영어 책",
        note: "익숙한 영어 이야기를 읽어요"
      }
    ]
  }
};

/* ==================================================
   관리실 화면
================================================== */

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

/* HTML을 모두 불러온 후 인트로 실행 */
document.addEventListener("DOMContentLoaded", () => {
  startIntro();
});

/* ==================================================
   공통 기능
================================================== */

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function go(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const nextPage = document.getElementById(pageId);

  if (nextPage) {
    nextPage.classList.add("active");
  }

  window.scrollTo(0, 0);
}

/* ==================================================
   시작 화면 타자 효과
================================================== */

async function typeText(text, speed = 80) {
  const line = document.getElementById("type-line");

  if (!line) {
    console.error("type-line 요소를 찾을 수 없습니다.");
    return;
  }

  line.innerHTML = "";

  for (let i = 0; i < text.length; i += 1) {
    line.innerHTML =
      text.slice(0, i + 1) +
      '<span class="cursor">|</span>';

    await delay(speed);
  }

  await delay(850);
}

async function startIntro() {
  const savedName = localStorage.getItem("pilotName");

  const nameBox = document.getElementById("name-box");
  const enterBtn = document.getElementById("enter-btn");
  const input = document.getElementById("pilot-name");

  if (nameBox) {
    nameBox.hidden = true;
  }

  if (enterBtn) {
    enterBtn.hidden = true;
  }

  if (input) {
    input.value = "";
  }

  await typeText("신호 수신중...");
  await delay(500);

  await typeText("파일럿...");
  await delay(500);

  if (!savedName) {
    await typeText("이름을 등록해주세요");

    if (nameBox) {
      nameBox.hidden = false;
    }

    if (input) {
      input.focus();
    }

    return;
  }

  await typeText(`파일럿 ${savedName}`);

  if (enterBtn) {
    enterBtn.hidden = false;
  }
}

/* ==================================================
   파일럿 이름 등록
================================================== */

async function savePilot() {
  const input = document.getElementById("pilot-name");
  const nameBox = document.getElementById("name-box");
  const enterBtn = document.getElementById("enter-btn");

  const name = input ? input.value.trim() : "";

  if (!name) {
    alert("이름을 입력해줘.");
    return;
  }

  localStorage.setItem("pilotName", name);

  if (nameBox) {
    nameBox.hidden = true;
  }

  if (enterBtn) {
    enterBtn.hidden = true;
  }

  await typeText("환영합니다");
  await delay(500);

  await typeText(`파일럿 ${name}`);

  if (enterBtn) {
    enterBtn.hidden = false;
  }
}

/* ==================================================
   아이 활동 열기
================================================== */

function openActivity(type) {
  const content = activityContent[type];

  if (!content) {
    console.error("활동 정보를 찾을 수 없습니다:", type);
    return;
  }

  const icon = document.getElementById("activity-icon");
  const title = document.getElementById("activity-title");
  const description =
    document.getElementById("activity-description");
  const options =
    document.getElementById("activity-options");

  if (!icon || !title || !description || !options) {
    console.error("활동 화면의 HTML 요소가 없습니다.");
    return;
  }

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
      alert(
        `${option.title} 연결은 다음 단계에서 설정할 수 있어요.`
      );
    });

    options.appendChild(button);
  });

  go("activity");
}

/* ==================================================
   비밀창고 열기
================================================== */

function unlockSecretRoom() {
  const modal =
    document.getElementById("secret-code-modal");
  const input =
    document.getElementById("secret-code-input");

  if (!modal || !input) {
    console.error("비밀 암호창을 찾을 수 없습니다.");
    return;
  }

  input.value = "";
  modal.hidden = false;

  setTimeout(() => {
    input.focus();
  }, 80);
}

function closeSecretCode() {
  const modal =
    document.getElementById("secret-code-modal");
  const input =
    document.getElementById("secret-code-input");

  if (input) {
    input.value = "";
  }

  if (modal) {
    modal.hidden = true;
  }
}

function confirmSecretCode() {
  const input =
    document.getElementById("secret-code-input");

  const button =
    document.getElementById("secret-unlock-btn");

  const message =
    document.getElementById("secret-message");

  const pass = input ? input.value.trim() : "";

  /* 암호가 틀린 경우 */
  if (pass !== ADMIN_PASSWORD) {
    if (input) {
      input.value = "";
      input.focus();
    }

    if (message) {
      message.textContent =
        "봉인이 풀리지 않았어요.";
    }

    if (button) {
      button.classList.remove("unlocking");
      button.classList.add("denied");

      setTimeout(() => {
        button.classList.remove("denied");
      }, 650);
    }

    return;
  }

  /* 암호가 맞는 경우 */
  closeSecretCode();

  if (message) {
    message.textContent =
      "암호 확인 · 봉인 해제 중";
  }

  if (button) {
    button.classList.add("unlocking");
  }

  setTimeout(() => {
    if (button) {
      button.classList.remove("unlocking");
    }

    if (message) {
      message.textContent = "";
    }

    go("admin");
  }, 850);
}

/* 키보드 Enter와 Esc 지원 */
document.addEventListener("keydown", event => {
  const modal =
    document.getElementById("secret-code-modal");

  if (!modal || modal.hidden) {
    return;
  }

  if (event.key === "Enter") {
    confirmSecretCode();
  }

  if (event.key === "Escape") {
    closeSecretCode();
  }
});

/* ==================================================
   관리실 메뉴 열기
================================================== */

function openAdminSection(sectionId) {
  const section = adminSections[sectionId];

  if (!section) {
    console.error(
      "관리실 메뉴를 찾을 수 없습니다:",
      sectionId
    );

    return;
  }

  const icon =
    document.getElementById("admin-section-icon");

  const title =
    document.getElementById("admin-section-title");

  const description =
    document.getElementById(
      "admin-section-description"
    );

  if (icon) {
    icon.textContent = section.icon;
  }

  if (title) {
    title.textContent = section.title;
  }

  if (description) {
    description.textContent =
      section.description;
  }

  go("admin-section");
}
