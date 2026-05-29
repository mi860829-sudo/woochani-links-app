# Firebase + Vercel 배포 설정 (한국어)

배포 URL: **https://woochani-links-app.vercel.app**

허용 계정: **mi860829@gmail.com** (`auth.js`의 `ALLOWED_EMAIL`)

---

## A. Firebase 콘솔에서 할 일 (필수)

### 1. 프로젝트 · 웹 앱

1. [Firebase 콘솔](https://console.firebase.google.com/) → 프로젝트 선택
2. ⚙ **프로젝트 설정** → **일반** → **내 앱** → 웹 앱
3. `firebaseConfig` 6개 값을 복사해 둡니다 (아래 Vercel 환경 변수에 사용)

| Firebase 콘솔 필드 | Vercel 환경 변수 이름 |
|-------------------|----------------------|
| apiKey | `FIREBASE_API_KEY` |
| authDomain | `FIREBASE_AUTH_DOMAIN` |
| projectId | `FIREBASE_PROJECT_ID` |
| storageBucket | `FIREBASE_STORAGE_BUCKET` |
| messagingSenderId | `FIREBASE_MESSAGING_SENDER_ID` |
| appId | `FIREBASE_APP_ID` |

### 2. Authentication → Google 로그인

1. **Build → Authentication** → **Sign-in method**
2. **Google** → **사용 설정** → 저장
3. 처음이면 **시작하기**로 Authentication을 먼저 켭니다.

### 3. Authorized domains (가장 중요)

1. **Authentication** → **Settings** → **Authorized domains**
2. **도메인 추가** 클릭
3. 아래 **호스트 이름만** 입력 (`https://` 없음):

```
woochani-links-app.vercel.app
```

4. 저장

> `localhost`는 로컬 테스트용입니다. Vercel만 쓸 경우 없어도 되지만, 있어도 무방합니다.

### 4. (선택) Google OAuth 동의 화면

Google 로그인 팝업에서 “앱이 확인되지 않음” 또는 테스트 사용자만 로그인된다면:

1. [Google Cloud Console](https://console.cloud.google.com/) → Firebase와 **같은 프로젝트** 선택
2. **APIs & Services → OAuth consent screen**
3. **Testing** 상태면 **Test users**에 `mi860829@gmail.com` 추가  
   또는 앱을 **Production**으로 게시

---

## B. Google Cloud Console (도메인 오류 시 추가 확인)

Firebase가 만든 **Web client** OAuth 클라이언트:

1. **APIs & Services → Credentials**
2. **Web client (auto created by Google Service)** 선택
3. **Authorized JavaScript origins**에 추가:

```
https://woochani-links-app.vercel.app
```

4. **Authorized redirect URIs**에 Firebase 핸들러가 있는지 확인 (보통 자동):

```
https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler
```

(`YOUR_PROJECT_ID`는 실제 Firebase `projectId`)

---

## C. Vercel에서 할 일 (필수)

### 1. 환경 변수 6개

**Vercel** → 프로젝트 **woochani-links-app** → **Settings** → **Environment Variables**

`.env.example`과 동일한 6개를 **Production** (필요 시 Preview도)에 추가:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

### 2. 다시 배포

환경 변수 저장 후 **Deployments → … → Redeploy** (또는 Git push).

빌드 시 `npm run build`가 `firebase-config.js`를 생성합니다.  
이 파일은 Git에 없고 배포 시에만 만들어집니다.

### 3. 배포 확인

브라우저에서 다음 주소가 **404가 아니어야** 합니다:

- https://woochani-links-app.vercel.app/auth.js
- https://woochani-links-app.vercel.app/firebase-config.js

로그인 화면 → **Google로 로그인** → `mi860829@gmail.com`만 홈이 보이면 성공입니다.

---

## D. 문제 해결

| 증상 | 조치 |
|------|------|
| 로그인 버튼 비활성 + Vercel 안내 | Vercel 환경 변수 6개 누락 → 추가 후 Redeploy |
| `auth/unauthorized-domain` | Authorized domains에 `woochani-links-app.vercel.app` 추가 |
| `auth.js` 404 | 최신 코드가 Git에 push·배포되지 않음 → push 후 Redeploy |
| `firebase-config.js` 404 | 빌드 실패 또는 env 없음 → Vercel 빌드 로그 확인 |
| 허용 이메일인데 차단 | Google 계정 이메일이 정확히 `mi860829@gmail.com`인지 확인 |
| 팝업 “앱 미검증” | OAuth consent screen 테스트 사용자 추가 또는 Production 게시 |

---

## E. 체크리스트 (복사용)

- [ ] Firebase Authentication → Google **사용 설정**
- [ ] Authorized domains: `woochani-links-app.vercel.app`
- [ ] Vercel 환경 변수 6개 설정
- [ ] Redeploy 완료
- [ ] `/auth.js`, `/firebase-config.js` 200 OK
- [ ] Google 로그인 → `mi860829@gmail.com` 성공
