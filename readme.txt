## 안심 스캐너 (Anshim Scanner) ##

'안심 스캐너'는 Google Gemini AI를 활용하여 생활화학제품, 식품, 의약품의 성분을 자동으로 분류하고 안전성과 환경 영향을 심층 분석하는 웹 애플리케이션입니다. 제품 라벨을 스캔하여 사용자가 정보에 기반한 현명한 결정을 내릴 수 있도록 돕고, 모두가 안심하고 제품을 사용할 수 있는 환경을 만드는 것을 목표로 합니다.

본 프로젝트는 'AI를 활용한 환경/안전/보건 분야 사회문제 해결'을 주제로 한 공모전 출품작입니다.

--------------------------------------------------
### 주요 기능
--------------------------------------------------
- 지능형 자동 분류: AI가 생활화학제품, 식품, 의약품 중 제품 유형을 자동으로 판단하여 최적화된 분석을 제공합니다.
- 직관적인 위험도 분석: 0-100점 척도의 '위험도 점수(Risk Score)'로 시각화하여 제공합니다. 점수가 높을수록 위험도가 높다는 의미입니다.
- 3가지 전문 분석 모드:
  1. 생활화학제품: 성분 유해성, 취약 계층 맞춤 분석, 환경 영향 및 안전한 폐기 방법 분석.
  2. 식품: 식품첨가물, 알레르기 유발 물질, 영양 프로필 분석.
  3. 의약품: 활성 성분, 부작용, 금기사항 및 의약품의 올바른 폐기 방법 정보 제공 (의료 자문이 아님).
- 포괄적인 영향 평가: 사용자의 직접적인 영향뿐만 아니라, 부적절한 폐기로 인한 환경 영향까지 종합적으로 평가합니다.
- 다국어 지원 및 결과 저장/공유 기능.

--------------------------------------------------
### 기술 스택 및 라이선스
--------------------------------------------------
- Frontend: React 19, Tailwind CSS (MIT License)
- AI API: Google Gemini (`gemini-2.5-flash` via `@google/genai`) (Apache 2.0 License)
- Icons: Lucide (ISC License) 기반의 커스텀 아이콘
- Language: TypeScript
- Other Libraries: html2canvas (결과 이미지 저장)

--------------------------------------------------
### 실행 방법
--------------------------------------------------
1. 프로젝트 파일을 다운로드합니다.
2. 시작 파일인 index.html 파일을 웹 브라우저(Chrome, Edge 권장)에서 엽니다.

--------------------------------------------------
### 사용자 매뉴얼
--------------------------------------------------
1. 시작하기: 제품 성분표 이미지를 업로드하거나 텍스트를 직접 입력합니다.
2. 자동 분석: '분석' 버튼을 누르면 AI가 제품 유형을 자동 감지하여 분석을 시작합니다.
3. 결과 확인: '위험도 점수'와 상세 분석 내용을 확인합니다. 어려운 용어는 (i) 아이콘으로 설명을 볼 수 있습니다.
4. 결과 활용: 하단 버튼으로 결과를 텍스트로 복사하거나, JPG 파일로 저장할 수 있습니다.

--------------------------------------------------
### 법적 고지 (Legal Disclaimer)
--------------------------------------------------
- 본 앱은 공모전 출품을 위한 프로토타입이며, 모든 분석 결과는 참고용으로만 제공됩니다.
- 본 앱은 의료 자문을 제공하지 않습니다. 의약품 관련 정보는 절대 전문가의 조언을 대체할 수 없으며, 건강 문제는 반드시 의사 또는 약사와 상담하십시오.
- 제공된 정보에 기반한 모든 결정의 책임은 사용자에게 있습니다.

--------------------------------------------------
### English Summary
--------------------------------------------------
Project Name: Anshim Scanner

Description: A web application that uses Google Gemini AI to automatically classify and analyze the safety and environmental impact of household products, food, and medicines. This project was created for a competition on "Solving Social Issues with AI."

How to Run:
1. Download the project files.
2. Open index.html in a modern web browser (Chrome recommended).

User Manual:
The app auto-detects product type (household, food, or medicine) from an image or text input. The results are displayed as a Risk Score (higher is riskier) with detailed analysis. For detailed instructions, please see README.md.

Legal Disclaimer:
- This app is a prototype and does not provide medical advice. All AI-generated analysis is for informational purposes only. The user assumes all responsibility for decisions made based on this information.