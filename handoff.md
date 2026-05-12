# 골술년 챌린지보드 — Handoff 문서

> 최종 업데이트: 2026-05-12 | 브랜치: `claude/create-handoff-file-HrKq1`

---

## 현재 버전 상태

| 항목 | 상태 |
|------|------|
| 앱 빌드 | ✅ 정상 (`npm run build` 통과) |
| Supabase 코드 연동 | ✅ 완료 |
| Supabase 프로젝트 생성 | ⚠️ 미완료 (직접 설정 필요) |
| `.env` 파일 | ⚠️ 미완료 (`.env.example` 참고하여 작성 필요) |
| PC·모바일 동시 접속 | ✅ `--host` 옵션 적용 완료 |

---

## 프로젝트 개요

**골술년 챌린지보드**는 소규모 골프 모임(4인)의 라운드 기록, 시즌 순위, 어워즈를 관리하는 모바일 최적화 React 앱입니다.

- **기술 스택**: React 18 + Vite 5, 순수 인라인 스타일 (CSS 프레임워크 없음)
- **데이터 저장**: Supabase PostgreSQL + Realtime (모든 기기 실시간 공유)
- **빌드**: `npm run dev --host` (개발), `npm run build` (프로덕션)

---

## 파일 구조

```
GolfCh/
├── .env.example        # Supabase 환경변수 템플릿 (복사 후 .env로 사용)
├── index.html          # 앱 진입점, 뷰포트 설정, 배경색
├── src/
│   ├── supabase.js     # Supabase 클라이언트 + loadData / saveData / subscribeData
│   ├── main.jsx        # ReactDOM 진입점
│   └── App.jsx         # 앱 전체 로직 (단일 파일, ~1620줄)
├── package.json
└── vite.config.js
```

---

## 개발 시작하기

```bash
cp .env.example .env    # Supabase URL·키 입력
npm install
npm run dev
```

실행 시 두 주소가 출력됩니다.

```
  ➜  Local:   http://localhost:5173/       ← PC 브라우저
  ➜  Network: http://192.168.x.x:5173/    ← 같은 Wi-Fi 핸드폰 브라우저
```

> 소스·브랜치 분리 없이 단일 빌드로 PC·모바일 브라우저 모두 동작합니다.

---

## DB 설정 (Supabase) — 최초 1회 필요

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
```

`.env` 파일 내용:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## 데이터 동기화 방식

`src/supabase.js` + `useStored` 훅이 담당합니다.

```
앱 시작  →  Supabase에서 최신 데이터 로드  →  로딩 화면 표시 후 렌더
데이터 변경  →  React 상태 업데이트 + Supabase upsert 동시 실행
다른 기기 변경  →  Supabase Realtime 수신  →  새로고침 없이 자동 반영
```

`app_data` 테이블 구조:

| key | 저장 내용 | 타입 |
|-----|-----------|------|
| `gcb_players` | 선수 목록 | `Player[]` |
| `gcb_courses` | 골프장 목록 | `Course[]` |
| `gcb_rounds` | 라운드 기록 (scores 포함) | `Round[]` |
| `gcb_handicaps` | 연도별 핸디캡 | `{[year]: {[pid]: number}}` |
| `gcb_schedules` | 예정 일정 | `Schedule[]` |

```ts
type Score = { pid: string; score: number; birdies: number }
type Round = { id: string; date: string; courseId: string; weather: string; memo: string; scores: Score[] }
```

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

## 주요 컴포넌트 (`src/App.jsx`)

| 컴포넌트 | 위치 (줄) | 역할 |
|----------|-----------|------|
| `App` | ~1430 | 루트: 상태 관리, 탭 라우팅 |
| `SeasonView` | ~615 | 시즌 순위표 + 라운드 캘린더 |
| `RoundsView` | ~810 | 라운드 목록, 관리자 수정·삭제 |
| `RoundEditModal` | ~737 | 라운드 수정 모달 |
| `AwardsView` | ~930 | 연도별 시상 내역 |
| `AdminRoundForm` | ~1057 | 새 라운드 입력 폼 |
| `CourseManager` | ~1129 | 코스 추가·수정·삭제 |
| `PlayerManager` | ~1215 | 선수 추가·수정·삭제 |
| `HandicapManager` | ~1256 | 선수별 연도별 핸디캡 설정 |
| `ScheduleManager` | ~1288 | 라운드 일정 등록 |
| `ScheduleNotice` | ~558 | 홈 화면 예정 라운드 알림 카드 |
| `useStored` | ~382 | Supabase 읽기·쓰기·실시간 구독 훅 |

---

## 핵심 로직

### 챔피언 산출 (`champScore`, 줄 ~379)
```js
champScore = hcpDiff * 2 - birdies   // 낮을수록 좋음
```

### 통계 계산 (`computeStats`, 줄 ~352)
선수별 평균스코어, 베스트스코어, 버디 합산, 핸디캡 대비 언더 횟수 계산

### `useStored(key, init)` (줄 ~383)
- 앱 마운트 시 Supabase에서 데이터 로드, 없으면 `init` 시드 저장
- setter 호출 시 React 상태 + Supabase 동시 업데이트
- `subscribeData`로 실시간 구독, 다른 기기 변경 즉시 반영
- 반환: `[value, setter, isReady]` — `isReady`가 `false`이면 로딩 화면 표시

---

## 시드 데이터 (초기값)

| 항목 | 내용 |
|------|------|
| 선수 | 전정은(F), 왕석균(M), 김석현(M), 천성민(M) |
| 코스 | 기본 8개(`c1`~`c8`) + 엑셀 임포트 263개(`ec001`~`ec263`) |
| 핸디캡 | 2025·2026년 기초값 설정 |
| 라운드 | 샘플 라운드 데이터 포함 |

---

## 전체 변경 이력

| 커밋 | 날짜 | 내용 |
|------|------|------|
| `3d54880` | 2026-05-12 | **Supabase 실시간 DB 연동** — localStorage → Supabase 교체, `src/supabase.js` 추가, `.env.example` 추가 |
| `6d2ba75` | 2026-05-12 | handoff.md 업데이트: PC·모바일 동시 사용 방법 추가 |
| `5e7631a` | 2026-05-12 | `vite --host` 옵션 추가 — 로컬 네트워크 모바일 접속 지원 |
| `6e15850` | 2026-05-12 | handoff.md 최초 작성 |
| `c327dbe` | 이전 | 관리 뷰 인터넷 골프장 검색 삭제, 엑셀 263개 골프장 데이터 반영 |
| `1b7e09d` | 이전 | 초기 화면에 예정된 라운딩 알림 카드 추가 |
| `f303f92` | 이전 | 미사용 루트 GolfApp.jsx 삭제 |
| `df89589` | 이전 | App.jsx에 라운드 수정/삭제 기능 반영 |
| `48ca7af` | 이전 | 라운드 뷰에 관리자 수정/삭제 기능 추가 |
| `e833c6d` | 이전 | Initial commit: Vite 빌드 환경 설정 |

---

## 알려진 제약사항 / TODO

- `App.jsx` 단일 파일(~1620줄) — 기능 추가 시 컴포넌트 파일 분리 권장
- 골프장 263개의 난이도가 모두 `3`으로 일괄 설정 — 실제 난이도 반영 필요
- Supabase `.env` 없이 실행 시 데이터 로드 실패 — 배포 전 환경변수 설정 필수
- Vercel 등 배포 시 환경변수를 호스팅 플랫폼 대시보드에 별도 등록 필요
