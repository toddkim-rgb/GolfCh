# 골술년 챌린지보드 — Handoff 문서

> 최종 업데이트: 2026-05-12 | 브랜치: `claude/create-handoff-file-HrKq1`

---

## PC에서 이어서 작업하기

```bash
git clone <repo-url>          # 또는 이미 clone 돼 있으면:
git fetch origin
git checkout claude/create-handoff-file-HrKq1
git pull origin claude/create-handoff-file-HrKq1

npm install
npm run dev
```

> 브라우저: http://localhost:5173/

---

## 현재 버전 상태

| 항목 | 상태 |
|------|------|
| 앱 빌드 | ✅ 정상 (`npm run build` 통과) |
| Vite dev 서버 자동 실행 | ✅ SessionStart 훅 적용 |
| Supabase 코드 연동 | ✅ 완료 (미설정 시 localStorage 폴백) |
| Supabase 프로젝트 생성 | ⚠️ 미완료 (직접 설정 필요) |
| `.env` 파일 | ⚠️ 미완료 (`.env.example` 참고하여 작성 필요) |
| PC·모바일 동시 접속 | ✅ `--host` 옵션 적용 |
| 일정 등록 폼 개선 | ✅ 코스명 텍스트 입력 + 난이도 별점 추가 |
| 시즌 스코어보드 | ✅ 라운드 행 제거, 주요 통계만 표시 |

---

## 프로젝트 개요

**골술년 챌린지보드**는 소규모 골프 모임(4인)의 라운드 기록, 시즌 순위, 어워즈를 관리하는 모바일 최적화 React 앱입니다.

- **기술 스택**: React 18 + Vite 5, 순수 인라인 스타일 (CSS 프레임워크 없음)
- **데이터 저장**: Supabase PostgreSQL + Realtime / 미설정 시 localStorage 자동 폴백
- **빌드**: `npm run dev` (개발, `--host` 포함), `npm run build` (프로덕션)

---

## 파일 구조

```
GolfCh/
├── .claude/
│   ├── hooks/
│   │   └── session-start.sh   # 세션 시작 시 자동 실행 훅
│   ├── settings.json          # SessionStart 훅 등록
│   └── settings.local.json   # 로컬 권한 설정
├── .env.example               # Supabase 환경변수 템플릿
├── .gitignore                 # node_modules, dist, .env 제외
├── index.html                 # 앱 진입점
├── src/
│   ├── supabase.js            # Supabase 클라이언트 + 헬퍼
│   ├── main.jsx               # ReactDOM 진입점
│   └── App.jsx                # 앱 전체 로직 (~1640줄)
├── package.json
└── vite.config.js
```

---

## 개발 시작하기

```bash
cp .env.example .env    # Supabase URL·키 입력 (선택사항)
npm install
npm run dev
```

- **Supabase 미설정 시**: localStorage로 자동 폴백, 앱 정상 동작
- **세션 자동 실행**: Claude Code 웹 세션 시작 시 `npm install` + `npm run dev` 자동 실행

실행 시 두 주소가 출력됩니다.

```
  ➜  Local:   http://localhost:5173/       ← PC 브라우저
  ➜  Network: http://192.168.x.x:5173/    ← 같은 Wi-Fi 핸드폰 브라우저
```

---

## DB 설정 (Supabase) — 최초 1회 필요

### 1. Supabase 프로젝트 생성
1. [supabase.com](https://supabase.com) → New Project 생성
2. Project Settings → API → `URL`과 `anon public` 키 복사

### 2. 테이블 생성 (SQL Editor)

```sql
create table app_data (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz default now()
);

alter table app_data replica identity full;
alter table app_data enable row level security;
create policy "allow all" on app_data for all using (true) with check (true);
```

### 3. 환경변수 설정

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 데이터 동기화 방식

```
앱 시작  →  Supabase 로드 시도  →  성공: 클라우드 데이터 / 실패: localStorage 폴백
데이터 변경  →  Supabase upsert (설정 시) 또는 localStorage 저장
다른 기기 변경  →  Supabase Realtime 수신  →  자동 반영
```

`app_data` 테이블 키:

| key | 내용 | 타입 |
|-----|------|------|
| `gcb_players` | 선수 목록 | `Player[]` |
| `gcb_courses` | 골프장 목록 | `Course[]` |
| `gcb_rounds` | 라운드 기록 (scores 포함) | `Round[]` |
| `gcb_handicaps` | 연도별 핸디캡 | `{[year]: {[pid]: number}}` |
| `gcb_schedules` | 예정 일정 | `Schedule[]` |

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

### 시즌 스코어보드 표시 항목

| 행 | 내용 |
|----|------|
| 핸디 | 해당 연도 핸디캡 |
| 평균 | 평균 타수 |
| 버디 | 총 버디 수 |
| 핸디차이 | 평균 - 핸디 |
| 핸디미만 | 핸디 미만 라운드 횟수 |
| 최저 | 베스트 스코어 |

> 라운드별 행은 제거됨 — 상세 라운드는 "라운드" 탭에서 확인

### 일정 등록 폼 필드

| 필드 | 타입 | 필수 |
|------|------|------|
| 날짜 | date picker | ✅ |
| 티오프 시간 | time picker | ✅ |
| 골프클럽명 | 텍스트 입력 | ✅ |
| 코스명 | 텍스트 직접 입력 | 선택 |
| 난이도 | 별점 1~5 (재클릭 시 해제) | 선택 |

---

## 주요 컴포넌트 (`src/App.jsx`)

| 컴포넌트 | 위치 (줄) | 역할 |
|----------|-----------|------|
| `App` | ~1443 | 루트: 상태 관리, 탭 라우팅 |
| `useStored` | ~384 | Supabase/localStorage 읽기·쓰기·실시간 구독 훅 |
| `SeasonView` | ~630 | 시즌 순위표 + 스코어보드 (통계만) |
| `RoundsView` | ~825 | 라운드 목록, 관리자 수정·삭제 |
| `RoundEditModal` | ~752 | 라운드 수정 모달 |
| `AwardsView` | ~945 | 연도별 시상 내역 |
| `AdminRoundForm` | ~1073 | 새 라운드 입력 폼 |
| `CourseManager` | ~1145 | 코스 추가·수정·삭제 |
| `PlayerManager` | ~1233 | 선수 추가·수정·삭제 |
| `HandicapManager` | ~1274 | 선수별 연도별 핸디캡 설정 |
| `ScheduleManager` | ~1308 | 라운드 일정 등록 (코스명 텍스트 + 난이도 별점) |
| `ScheduleNotice` | ~573 | 홈 화면 예정 라운드 알림 카드 |

---

## SessionStart 훅 (자동 실행)

**파일**: `.claude/hooks/session-start.sh`

Claude Code 웹 세션 시작 시 자동으로:
1. `npm install` — 의존성 설치
2. `npm run dev` — Vite 개발 서버 백그라운드 실행 (`/tmp/vite-dev.log` 로그)

**비동기 모드** (`async: true`): 세션 시작과 동시에 백그라운드 실행, 수초 후 서버 준비 완료.

---

## 전체 변경 이력

| 커밋 | 내용 |
|------|------|
| `7468132` | 시즌 스코어보드: 라운드 행 제거, 주요 통계만 표시 |
| `a4e04fc` | settings.local.json: hooks 디렉토리 생성 권한 추가 |
| `e215655` | SessionStart 훅 추가: npm install + Vite dev 서버 자동 실행 |
| `426ca37` | Supabase 미설정 시 localStorage 폴백 처리 |
| `d3280d8` | 일정 등록 폼: 코스명 텍스트 입력 전환 + 난이도 별점 추가 |
| `8e26331` | .gitignore에 .env 추가 (Supabase 키 노출 방지) |
| `3d54880` | Supabase 실시간 DB 연동: localStorage → Supabase 교체 |
| `5e7631a` | vite --host 옵션 추가 (모바일 접속 지원) |
| `6e15850` | handoff.md 최초 작성 |
| `c327dbe` | 관리 뷰 골프장 검색 삭제, 엑셀 263개 골프장 데이터 반영 |
| `1b7e09d` | 초기 화면에 예정된 라운딩 알림 카드 추가 |
| `f303f92` | 미사용 GolfApp.jsx 삭제 |
| `df89589` | App.jsx에 라운드 수정/삭제 기능 반영 |
| `48ca7af` | 라운드 뷰에 관리자 수정/삭제 기능 추가 |
| `0a262e5` | 관리자 라운드 수정·삭제 UI 추가 |
| `e833c6d` | Initial commit: Vite 빌드 환경 설정 |

---

## 알려진 제약사항 / TODO

- `App.jsx` 단일 파일(~1640줄) — 기능 추가 시 컴포넌트 파일 분리 권장
- 골프장 263개 난이도 모두 `3`으로 일괄 설정 — 실제 난이도 반영 필요
- Supabase 미설정 시 기기 간 데이터 공유 불가 (localStorage는 기기별 독립)
- 배포 시 Vercel 등 호스팅 플랫폼 대시보드에 환경변수 별도 등록 필요
