# 골술년 챌린지보드 — Handoff 문서

## 프로젝트 개요

**골술년 챌린지보드**는 소규모 골프 모임(4인)의 라운드 기록, 시즌 순위, 어워즈를 관리하는 모바일 최적화 React 앱입니다.

- **기술 스택**: React 18 + Vite 5, 순수 인라인 스타일 (CSS 프레임워크 없음)
- **데이터 저장**: `localStorage` (서버 없음, 100% 클라이언트 사이드)
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

## 데이터 모델 (localStorage 키)

| 키 | 타입 | 설명 |
|----|------|------|
| `golfPlayers` | `Player[]` | 선수 목록 (id, name, gender) |
| `golfCourses` | `Course[]` | 골프장 목록 (id, name, region, difficulty) |
| `golfRounds` | `Round[]` | 라운드 기록 (date, courseId, weather, memo, scores[]) |
| `golfHandicaps` | `{[year]: {[pid]: number}}` | 연도별 선수 핸디캡 |
| `golfSchedules` | `Schedule[]` | 예정 라운드 일정 |

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
| `c327dbe` | 관리 뷰 인터넷 골프장 검색 삭제, 엑셀 263개 골프장 데이터 반영 |
| `1b7e09d` | 초기 화면에 예정된 라운딩 알림 카드 추가 |
| `df89589` | 메인 App.jsx에 라운드 수정/삭제 기능 반영 |
| `48ca7af` | 라운드 뷰에 관리자 수정/삭제 기능 추가 |

---

## 알려진 제약사항 / TODO

- 데이터가 브라우저 localStorage에만 저장되므로 기기 간 공유 불가
- 멀티 기기 동기화가 필요하면 Firebase / Supabase 연동 고려
- `App.jsx`가 단일 파일(~1600줄)이므로 기능 추가 시 컴포넌트 분리 권장
- 골프장 데이터(ec001~) 난이도가 모두 `3`으로 일괄 설정됨, 실제 난이도 반영 필요

---

## 개발 시작하기

```bash
npm install
npm run dev   # http://localhost:5173
```
