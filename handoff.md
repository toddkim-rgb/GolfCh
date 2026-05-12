# 골술년 챌린지보드 — Handoff 문서

## 프로젝트 개요

**골술년 챌린지보드**는 소규모 골프 모임(4인)의 라운드 기록, 시즌 순위, 어워즈를 관리하는 모바일 최적화 React 앱입니다.

- **기술 스택**: React 18 + Vite 5, 순수 인라인 스타일 (CSS 프레임워크 없음)
- **데이터 저장**: Supabase (PostgreSQL + 실시간 동기화, 모든 기기 공유)
- **빌드**: `npm run dev` (개발), `npm run build` (프로덕션)

---

## 파일 구조

```
GolfCh/
├── index.html          # 앱 진입점, 뷰포트 설정, 배경색
├── src/
│   ├── main.jsx        # ReactDOM.render 진입점
│   └── App.jsx         # 앱 전체 로직 (단일 파일)
├── package.json
└── vite.config.js
```

> 모든 컴포넌트·로직이 `src/App.jsx` 한 파일에 있습니다.

---

## 주요 기능

### 네비게이션 탭 (하단 고정)
| 탭 ID | 이름 | 설명 |
|-------|------|------|
| `season` | 시즌 | 연도별 선수 순위표 + 라운드 히스토리 |
| `rounds` | 라운드 | 전체 라운드 목록, 스코어 상세 |
| `awards` | 어워즈 | 챔피언·버디왕·베스트스코어 등 시상 |
| `admin` | 관리 | 라운드 입력·일정·코스·선수·핸디캡 관리 |

### 관리자 인증
- 아이디: `admin` / 비밀번호: `golf2025`
- 로그인 시 관리자 메뉴 및 라운드 수정·삭제 기능 활성화

---

## 데이터 모델

| 키 (app_data.key) | 타입 | 설명 |
|-------------------|------|------|
| `gcb_players` | `Player[]` | 선수 목록 (id, name, gender) |
| `gcb_courses` | `Course[]` | 골프장 목록 (id, name, region, difficulty) |
| `gcb_rounds` | `Round[]` | 라운드 기록 (date, courseId, weather, memo, scores[]) |
| `gcb_handicaps` | `{[year]: {[pid]: number}}` | 연도별 선수 핸디캡 |
| `gcb_schedules` | `Schedule[]` | 예정 라운드 일정 |

```ts
type Score = { pid: string; score: number; birdies: number }
type Round = { id: string; date: string; courseId: string; weather: string; memo: string; scores: Score[] }
```

---

## 주요 컴포넌트

| 컴포넌트 | 위치 (줄) | 역할 |
|----------|-----------|------|
| `App` | ~1428 | 루트: 상태 관리, 탭 라우팅 |
| `SeasonView` | ~614 | 시즌 순위표 + 라운드 캘린더 |
| `RoundsView` | ~809 | 라운드 목록, 관리자 수정·삭제 |
| `RoundEditModal` | ~736 | 라운드 수정 모달 |
| `AwardsView` | ~929 | 연도별 시상 내역 |
| `AdminRoundForm` | ~1056 | 새 라운드 입력 폼 |
| `CourseManager` | ~1128 | 코스 추가·수정·삭제 |
| `PlayerManager` | ~1214 | 선수 추가·수정·삭제 |
| `HandicapManager` | ~1255 | 선수별 연도별 핸디캡 설정 |
| `ScheduleManager` | ~1287 | 라운드 일정 등록 |
| `ScheduleNotice` | ~557 | 홈 화면 예정 라운드 알림 카드 |

---

## 핵심 로직

### 통계 계산 (`computeStats`, 줄 ~351)
- 선수별 평균스코어, 베스트스코어, 버디 합산, 핸디캡 대비 언더 횟수 계산

### 챔피언 산출 (`champScore`, 줄 ~378)
```js
champScore = hcpDiff * 2 - birdies
// 낮을수록 좋음 (핸디캡 초과 차이 패널티 + 버디 보너스)
```

### 데이터 영속성 (`useStored`, 줄 ~381)
- `useState` + `useEffect`로 localStorage 자동 동기화하는 커스텀 훅

---

## 시드 데이터

### 선수 (4명, 초기값)
- 전정은(F), 왕석균(M), 김석현(M), 천성민(M)

### 코스
- 초기 8개 코스 (`c1`~`c8`) + 엑셀 임포트 263개 코스 (`ec001`~`)

---

## 최근 변경 이력

| 커밋 | 내용 |
|------|------|
| `5e7631a` | dev 서버에 `--host` 옵션 추가 (로컬 네트워크 모바일 접속 지원) |
| `6e15850` | handoff.md 최초 작성 |
| `c327dbe` | 관리 뷰 인터넷 골프장 검색 삭제, 엑셀 263개 골프장 데이터 반영 |
| `1b7e09d` | 초기 화면에 예정된 라운딩 알림 카드 추가 |
| `df89589` | 메인 App.jsx에 라운드 수정/삭제 기능 반영 |
| `48ca7af` | 라운드 뷰에 관리자 수정/삭제 기능 추가 |

---

## 알려진 제약사항 / TODO

- Supabase 프로젝트 설정 필요 (`.env` 파일에 URL·키 입력)
- `App.jsx`가 단일 파일(~1600줄)이므로 기능 추가 시 컴포넌트 분리 권장
- 골프장 데이터(ec001~) 난이도가 모두 `3`으로 일괄 설정됨, 실제 난이도 반영 필요

---

## DB 설정 (Supabase)

데이터는 Supabase에 저장되며 모든 기기가 실시간으로 동기화됩니다.

### 1. Supabase 프로젝트 생성
1. [supabase.com](https://supabase.com) → New Project 생성
2. Project Settings → API → `URL`과 `anon public` 키 복사

### 2. 테이블 생성
Supabase 대시보드 → SQL Editor에서 실행:

```sql
create table app_data (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz default now()
);

-- 실시간 업데이트 활성화
alter table app_data replica identity full;

-- 인증 없이 읽기/쓰기 허용 (소규모 내부 앱용)
alter table app_data enable row level security;
create policy "allow all" on app_data for all using (true) with check (true);
```

### 3. 환경변수 설정
```bash
cp .env.example .env
# .env 파일에 실제 URL과 키 입력
```

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 데이터 구조

`app_data` 테이블의 `key` 컬럼별 저장 내용:

| key | 내용 |
|-----|------|
| `gcb_players` | 선수 배열 |
| `gcb_courses` | 골프장 배열 |
| `gcb_rounds` | 라운드 배열 (scores 포함) |
| `gcb_handicaps` | 연도별 핸디캡 객체 |
| `gcb_schedules` | 일정 배열 |

### 동기화 방식
- 앱 시작 시 Supabase에서 최신 데이터 로드
- 데이터 변경 시 즉시 Supabase에 upsert
- 다른 기기의 변경사항은 Supabase Realtime으로 자동 수신 → 새로고침 없이 반영

---

## 개발 시작하기

```bash
cp .env.example .env   # Supabase URL·키 입력 후
npm install
npm run dev
```

`--host` 옵션이 적용되어 있어 실행 시 두 가지 주소가 출력됩니다.

```
  ➜  Local:   http://localhost:5173/        ← PC 브라우저
  ➜  Network: http://192.168.x.x:5173/     ← 같은 Wi-Fi의 핸드폰 브라우저
```

**PC·모바일 동시 사용 방법**
- 소스 분리·브랜치 불필요, 단일 빌드로 PC 브라우저·모바일 브라우저 모두 동작
- 개발 중: PC와 핸드폰이 같은 Wi-Fi에 있으면 Network 주소로 폰에서 바로 접속
- 배포 시: `npm run build` 후 Vercel / GitHub Pages 등 무료 호스팅에 올리면 인터넷 어디서나 접속 가능

> 주의: `.env` 파일의 Supabase URL·키가 없으면 데이터 로드 실패. 배포 전 환경변수 설정 필수.
