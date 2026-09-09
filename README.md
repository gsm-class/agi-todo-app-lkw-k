# TODO App

배포: https://agi-todo-app-lkw-k.vercel.app

작업 관리, 기한 설정, 완료 상태 관리를 지원하는 TODO 애플리케이션. 데이터는 브라우저 로컬 스토리지에 저장된다.

## 기능

- 작업 추가, 편집, 삭제
- 기한 설정과 기한 경과 경고 (기한 초과는 빨간색, 오늘 기한은 주황색)
- 완료 상태 전환 및 완료된 작업 표시/숨김
- 로컬 스토리지 저장과 구 버전 데이터 마이그레이션
- 반응형 디자인

## 기술 스택

- **Framework**: Next.js 16 (App Router, 정적 내보내기)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **State**: React Hooks
- **Test**: Vitest + Testing Library
- **Storage**: localStorage

## 시작하기

### 요구 환경

- Node.js 20.9.0 이상

### 설치와 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 연다.

### 테스트

```bash
npm test -- --run       # 전체 테스트 실행
npm run test:coverage   # 커버리지 포함
npm run lint            # ESLint
```

### 프로덕션 빌드

```bash
npm run build   # out/ 에 정적 파일 생성
npm start       # 빌드 결과를 로컬에서 서빙
```

`next.config.ts`에서 `output: 'export'`를 사용하므로 빌드 결과는 서버가 필요 없는 정적 파일이다. 이 때문에 `next start`는 동작하지 않고, `npm start`가 `out/`을 직접 서빙한다.

## 배포

### Vercel

Vercel 대시보드에서 이 저장소를 Import 하면 추가 설정 없이 배포된다. Next.js 프로젝트로 자동 인식되어 빌드 명령과 출력 디렉터리가 잡힌다.

CLI로 배포하려면:

```bash
npx vercel login
npm run deploy
```

### GitHub Pages

정적 빌드이므로 `out/` 디렉터리를 그대로 올리면 된다. 저장소 하위 경로(`/저장소이름/`)로 서빙하는 경우 `next.config.ts`에 `basePath`를 추가해야 한다.

## 사용 방법

- **추가**: 작업 이름을 입력하고 기한을 선택한 뒤 `작업 추가` 버튼을 누르거나 Enter를 친다.
- **편집**: `편집` 버튼으로 인라인 편집 모드에 들어가 이름과 기한을 바꾸고 `저장`을 누른다.
- **삭제**: `삭제` 버튼을 누르고 확인 대화상자에서 확인을 선택한다.
- **완료**: 왼쪽 체크박스를 클릭한다.
- **필터**: `완료된 작업 표시` 체크박스로 완료된 작업을 숨기거나 보여준다.

## 프로젝트 구조

```
.
├── app/
│   ├── layout.tsx      # 공통 레이아웃과 헤더
│   ├── page.tsx        # 메인 페이지
│   ├── page.test.tsx   # 페이지 통합 테스트
│   └── globals.css     # 글로벌 스타일
├── components/         # TaskForm, TaskList, TaskItem, TaskFilter 및 각 테스트
├── hooks/
│   └── useTodos.ts     # 작업 상태 관리와 영속화
├── types/
│   └── task.ts         # Task 타입 정의
├── utils/
│   ├── constants.ts    # 스토리지 키
│   ├── storage.ts      # 로컬 스토리지 읽기/쓰기와 검증
│   └── migration.ts    # 구 버전 데이터 마이그레이션
└── test/
    └── setup.ts        # 테스트 환경 설정
```

## 라이센스

MIT
