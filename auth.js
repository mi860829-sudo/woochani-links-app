(function () {
  "use strict";

  const ALLOWED_EMAIL = "mi860829@gmail.com";

  const loginScreen = document.getElementById("login-screen");
  const appContent = document.getElementById("app-content");
  const googleBtn = document.getElementById("google-signin");
  const loginError = document.getElementById("login-error");
  const loginSetup = document.getElementById("login-setup");

  if (!loginScreen || !appContent || !googleBtn) {
    return;
  }

  function isConfigReady() {
    const config = window.FIREBASE_CONFIG;
    return (
      config &&
      config.apiKey &&
      config.apiKey !== "YOUR_API_KEY" &&
      config.projectId &&
      config.projectId !== "YOUR_PROJECT_ID"
    );
  }

  function showLogin(message) {
    document.body.classList.remove("logged-in");
    appContent.classList.add("hidden");
    appContent.setAttribute("aria-hidden", "true");
    loginScreen.classList.remove("hidden");
    loginScreen.setAttribute("aria-hidden", "false");

    if (message) {
      loginError.textContent = message;
      loginError.hidden = false;
    } else {
      loginError.textContent = "";
      loginError.hidden = true;
    }
  }

  function showApp() {
    document.body.classList.add("logged-in");
    loginError.textContent = "";
    loginError.hidden = true;
    loginScreen.classList.add("hidden");
    loginScreen.setAttribute("aria-hidden", "true");
    appContent.classList.remove("hidden");
    appContent.setAttribute("aria-hidden", "false");
  }

  function setLoading(loading) {
    googleBtn.disabled = loading;
    googleBtn.setAttribute("aria-busy", loading ? "true" : "false");
  }

  // 스크립트 로드 직후: 홈은 숨기고 로그인 화면만 표시
  showLogin();

  if (typeof firebase === "undefined") {
    loginSetup.hidden = false;
    loginSetup.textContent =
      "Firebase 스크립트를 불러오지 못했습니다. 네트워크 연결을 확인해 주세요.";
    googleBtn.disabled = true;
    return;
  }

  if (!isConfigReady()) {
    loginSetup.hidden = false;
    googleBtn.disabled = true;
    return;
  }

  loginSetup.hidden = true;

  const app = firebase.initializeApp(window.FIREBASE_CONFIG);
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.onAuthStateChanged(async function (user) {
    if (!user) {
      showLogin();
      return;
    }

    const email = (user.email || "").toLowerCase();
    if (email !== ALLOWED_EMAIL.toLowerCase()) {
      await auth.signOut();
      showLogin("허용되지 않은 계정입니다. 접근할 수 없습니다.");
      return;
    }

    showApp();
  });

  googleBtn.addEventListener("click", function () {
    loginError.hidden = true;
    setLoading(true);

    auth
      .signInWithPopup(provider)
      .then(function (result) {
        const email = (result.user.email || "").toLowerCase();
        if (email !== ALLOWED_EMAIL.toLowerCase()) {
          return auth.signOut().then(function () {
            showLogin("허용되지 않은 계정입니다. 접근할 수 없습니다.");
          });
        }
      })
      .catch(function (err) {
        if (err.code === "auth/popup-closed-by-user") {
          return;
        }
        if (err.code === "auth/unauthorized-domain") {
          showLogin(
            "이 도메인이 Firebase에 등록되지 않았습니다. Authorized domains에 woochani-links-app.vercel.app 을 추가하세요."
          );
          return;
        }
        showLogin("로그인에 실패했습니다. 다시 시도해 주세요.");
      })
      .finally(function () {
        setLoading(false);
      });
  });
})();
