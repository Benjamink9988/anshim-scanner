# 안심 스캐너 (Anshim Scanner)

**안심 스캐너**는 Google Gemini AI를 활용하여 생활화학제품, 식품, 의약품의 성분을 **자동으로 분류**하고 안전성과 환경 영향을 심층 분석하는 웹 애플리케이션입니다. 제품 라벨을 스캔하여 사용자가 정보에 기반한 현명한 결정을 내리고, 제품을 올바르게 폐기할 수 있도록 돕습니다.

'**안심 (Anshim)**'은 한국어로 '마음이 편안하고 걱정이 없는 상태'를 의미하며, 이는 사용자가 제품을 안심하고 선택하고 사용할 수 있도록 돕는다는 앱의 핵심 가치를 담고 있습니다. 본 프로젝트는 **AI를 활용해 환경/안전/보건 분야의 사회문제를 해결**하는 공모전 출품을 위해 제작되었습니다.

---

## 아이디어 및 분석 기획서

### **환경·안전·보건 분야에서의 AI 활용 아이디어 공모전**

| **분야** | 환경·안전·보건 | **이름/팀명** | 안심 스캐너 |
| :--- | :--- | :--- | :--- |
| **주제** | ※ 아이디어 및 분석의 핵심 내용을 파악할 수 있는 주제명<br/>**AI 기반 제품 성분 분석 및 맞춤형 위험도 보고서 '안심 스캐너'** |
| **추진배경<br/>및 필요성** | ※ 환경·안전·보건 문제현황 및 참여 동기<br/><br/>**- 해결하고자 하는 문제 상황을 설명**<br/>저희는 아이를 키우는 평범한 가족입니다. 어느 날, 벌레 퇴치용 에어졸을 구매하려다 뒷면의 빽빽한 화학 성분표를 보고 '아이가 있는 집에서 이걸 써도 정말 괜찮을까?' 하는 막막함을 느꼈습니다. 욕실 청소용품도 마찬가지였습니다. 성분은 어렵고, 인터넷 정보는 신뢰하기 어려웠습니다.<br/><br/>이러한 고민은 마트에서 장을 볼 때도 이어졌습니다. 과자 뒷면의 생소한 식품첨가물, 아이가 아플 때 먹는 약의 부작용 안내문은 늘 저희를 불안하게 만들었습니다. 다 쓴 제품을 어떻게 버려야 환경오염을 줄일 수 있을지도 막막했습니다.<br/><br/>**- 왜 이 아이디어 또는 분석이 필요한지, 참여 동기를 작성**<br/>저희 가족과 같은 보통 사람들이 전문가의 도움 없이도 AI를 통해 제품의 안전성을 쉽게 확인하고, 올바르게 사용할 수 있는 앱을 직접 만들어보자는 아이디어를 내게 되었습니다. 소비자와 기업 간의 정보 불균형을 해소하고, 더 나아가 올바른 폐기 방법을 안내하여 환경 보호에 기여하는 것이 '안심 스캐너'의 시작이자 본 공모전에 참여하게 된 동기입니다. |
| **세부 내용** | **※ 아이디어 및 분석 세부내용**<br/><br/>**2. 앱 개발인 경우**<br/>- **개발 환경**: <br/> &nbsp;&nbsp; ◦ 개발 언어: **TypeScript**<br/> &nbsp;&nbsp; ◦ 플랫폼: **React 19** 및 **Tailwind CSS**를 사용한 웹 애플리케이션<br/><br/>- **실행 환경**: <br/> &nbsp;&nbsp; ◦ 지원 OS: Windows, macOS, Linux 등 웹 브라우저를 지원하는 모든 OS<br/> &nbsp;&nbsp; ◦ 브라우저: 최신 버전의 **Chrome, Edge**에서 완벽히 호환되며, Firefox, Safari 등 다른 모던 브라우저에서도 실행 가능합니다.<br/><br/>- **앱 주요 기능 및 구성**: <br/> &nbsp;&nbsp; ◦ **핵심 기능**: <br/> &nbsp;&nbsp;&nbsp;&nbsp; 1. **AI 자동 분류**: 제품 성분 정보를 분석하여 **생활화학제품, 식품, 의약품**으로 자동 분류 후, 각 유형에 최적화된 심층 분석을 제공합니다.<br/> &nbsp;&nbsp;&nbsp;&nbsp; 2. **종합 위험도 분석**: 인체 유해성과 환경 영향을 종합하여 0~100점 척도의 '위험도 점수'와 등급을 시각적으로 제시합니다.<br/> &nbsp;&nbsp;&nbsp;&nbsp; 3. **취약 계층 맞춤 분석**: '영유아', '임산부' 등 특정 그룹을 선택 시, 해당 그룹에 민감한 성분을 가중하여 위험도를 재분석합니다. (생활화학제품 전용)<br/> &nbsp;&nbsp;&nbsp;&nbsp; 4. **안전한 폐기 방법 안내**: AI가 제품 유형을 분석하여 환경오염을 최소화할 수 있는 올바른 폐기 방법을 안내합니다.<br/> &nbsp;&nbsp; ◦ **화면·메뉴 구조**: <br/> &nbsp;&nbsp;&nbsp;&nbsp; 1. **스캐너 화면**: 사용자가 제품 성분 이미지(촬영/업로드) 또는 텍스트를 입력하는 시작 화면.<br/> &nbsp;&nbsp;&nbsp;&nbsp; 2. **분석 결과 화면**: AI 분석이 완료된 후, 종합 보고서가 시각적으로 표시되는 화면. (위험도 점수 게이지, 성분 상세 분석, 대안 제품, 폐기 팁 등)<br/> &nbsp;&nbsp;&nbsp;&nbsp; 3. **모달 창**: 사용자 매뉴얼 및 법적 고지사항을 안내합니다.<br/><br/>- **기기 기능 활용 여부**: <br/>사용자 편의성을 최우선으로 고려하여 정보 입력 방식을 점진적으로 확장했습니다. 처음에는 가장 직관적인 방식인 스마트폰 **카메라**로 성분표를 직접 촬영하여 분석하는 기능에서 출발했습니다. 이후, 사용자들이 이미 저장해 둔 제품 사진을 활용할 수 있도록 **이미지 업로드** 기능을 추가했고, 온라인 쇼핑몰의 성분 정보처럼 텍스트를 복사해서 바로 분석하고 싶은 경우를 위해 **성분 또는 제품명 직접 입력** 기능까지 도입하여 누구나 어떤 상황에서든 쉽게 사용할 수 있도록 개발했습니다.<br/><br/>**3. 기타 방식**<br/>- **활용 AI 기술**: **Google Gemini (`gemini-2.5-flash` 모델)**<br/> &nbsp;&nbsp; ◦ **Multimodal OCR**: 카메라로 촬영되거나 업로드된 이미지에서 텍스트(성분표)를 추출합니다.<br/> &nbsp;&nbsp; ◦ **Natural Language Processing (NLP)**: 추출된 텍스트를 분석하여 제품 유형을 분류하고, 저희가 설계한 시스템 명령어(System Instruction)와 JSON 스키마를 기반으로 성분의 유해성, 환경 영향, 부작용 등을 종합적으로 평가하여 구조화된 데이터(JSON)를 생성합니다.<br/><br/>- **구현 절차 및 사용 도구**: <br/> &nbsp;&nbsp; ◦ **절차**: ①사용자 입력 (이미지/텍스트) → ②AI 텍스트 추출 (OCR) → ③AI 제품 유형 분류 → ④유형별 맞춤 분석 요청 → ⑤AI 분석 결과(JSON) 수신 → ⑥UI 시각화 및 보고서 생성<br/> &nbsp;&nbsp; ◦ **사용 도구**: `@google/genai` SDK, React, TypeScript, HTML5, CSS3, html2canvas |
| **결과물<br/>활용방안<br/>및<br/>기대효과** | **※ 활용방안 및 기대효과**<br/>- **활용방안**: <br/> &nbsp;&nbsp; ◦ **소비자**: 저희 가족처럼 일상적인 쇼핑에서 제품을 선택할 때, 명확한 정보에 기반한 안전한 소비 생활을 영위할 수 있습니다.<br/> &nbsp;&nbsp; ◦ **취약 계층**: 영유아, 임산부 등 민감군이 가족 구성원에게 더 안전한 제품을 선택하는 데 실질적인 도움을 받을 수 있습니다.<br/> &nbsp;&nbsp; ◦ **사회**: 올바른 제품 폐기 문화를 확산시키는 교육 및 캠페인 자료로 활용될 수 있습니다.<br/><br/>- **기대효과**: <br/> &nbsp;&nbsp; ◦ **소비자 주권 강화**: 정보 불균형을 해소하고, 소비자가 제품 정보를 쉽게 파악하여 안전한 제품을 선택할 권리를 보장합니다.<br/> &nbsp;&nbsp; ◦ **기업의 사회적 책임 촉진**: 소비자의 현명한 선택이 늘어남에 따라, 기업들이 더 안전하고 투명한 성분을 사용하며 친환경적인 제품을 개발하도록 유도하는 선순환 구조를 기대할 수 있습니다.<br/> &nbsp;&nbsp; ◦ **환경 보호 기여**: 올바른 폐기 방법을 안내하여 생활 속 화학물질로 인한 토양 및 수질 오염 예방에 기여합니다. |
| **활용 툴,<br/>참고문헌** | - **개발도구**: React 19, TypeScript, Tailwind CSS, html2canvas (결과 이미지 저장)<br/>- **분석 툴**: Google Gemini API (`@google/genai` SDK)<br/>- **참고 자료**: 아이콘은 오픈소스 라이브러리인 Lucide를 기반으로 제작되었습니다. AI 모델은 국립환경과학원, 식품의약품안전처 등 공신력 있는 기관의 공개 데이터를 포함한 방대한 정보를 사전 학습하였으며, 앱은 이 지식을 바탕으로 설계된 프롬프트를 통해 분석을 수행합니다. |
| **이미지<br/>(선택사항)** | - 앱의 핵심 기능을 보여주는 화면 캡처 이미지 첨부 예정:<br/> &nbsp;&nbsp; 1. 메인 스캐너 화면 (카메라, 이미지 업로드, 텍스트 입력의 3가지 방식)<br/> &nbsp;&nbsp; 2. 분석 결과 보고서 화면 (위험도 점수 게이지 및 요약)<br/> &nbsp;&nbsp; 3. 취약 계층 분석 적용 화면 (분석 결과가 동적으로 변하는 모습) |

---
## 주요 기능

*   **지능형 자동 분류**: 사용자가 제품 라벨을 스캔하면, AI가 **생활화학제품, 식품, 의약품** 중 어떤 유형인지 자동으로 판단하여 각 카테고리에 최적화된 분석을 제공합니다.
*   **직관적인 위험도 분석**: 안전성을 0-100점 척도의 **위험도 점수(Risk Score)**로 시각화하여 제공합니다. **점수가 높을수록 위험도가 높다**는 것을 의미하여 사용자가 즉각적으로 위험 수준을 인지할 수 있습니다.
*   **3가지 전문 분석 모드**:
    1.  **생활화학제품**: 성분별 유해성, 취약 계층(영유아, 임산부 등) 맞춤 분석, 환경 영향 및 안전한 폐기 방법 분석.
    2.  **식품**: 식품첨가물의 유해성, 알레르기 유발 물질, 영양 프로필 분석.
    3.  **의약품**: 주요 활성 성분, 잠재적 부작용, 금기사항 및 **의약품의 올바른 폐기 방법**을 포함한 정보 제공 (의료 자문이 아님).
*   **포괄적인 영향 평가**: 사용자가 직접 흡입, 접촉, 섭취하는 경우뿐만 아니라, 제품 및 용기가 **부적절하게 폐기되었을 때의 환경 영향**까지 종합적으로 평가합니다.
*   **사용자 편의 기능**: 다국어(한/영) 지원, 분석 결과 텍스트 복사, JPG 파일 저장 기능을 제공합니다.

---

## 기술 스택 및 라이선스

본 프로젝트는 공모전 규정을 준수하기 위해 오픈소스 라이선스를 가진 기술만을 사용했습니다.

*   **Frontend**: React 19, Tailwind CSS (MIT License)
*   **AI API**: Google Gemini (`gemini-2.5-flash` via `@google/genai`) (Apache 2.0 License)
*   **Icons**: Lucide (ISC License) 기반의 커스텀 아이콘
*   **Language**: TypeScript
*   **Other Libraries**: html2canvas (결과 이미지 저장 기능)

---

## 실행 방법

1.  프로젝트 파일을 다운로드합니다.
2.  `index.html` 파일을 웹 브라우저(Chrome, Edge 권장)에서 엽니다.

---

## 법적 고지 (Legal Disclaimer)

*   **프로젝트 목적**: 본 앱은 "AI를 활용한 사회문제 해결" 공모전 출품을 위한 **프로토타입**이며, 상업적 용도가 아닙니다.
*   **정보 제공 목적**: 모든 분석 결과는 AI에 의해 생성되며 참고용으로만 제공됩니다. 내용에 오류나 누락이 있을 수 있습니다.
*   **전문가 조언 대체 불가**: **본 앱은 의료 자문을 제공하지 않습니다.** 특히 의약품 관련 정보는 전문적인 의학적 조언, 진단, 치료를 대체할 수 없습니다. 건강 관련 문제는 반드시 의사 또는 약사와 상담하십시오.
*   **책임의 한계**: 개발팀은 본 앱의 사용으로 인해 발생하는 어떠한 손해에 대해서도 책임을 지지 않습니다. 제공된 정보를 바탕으로 한 모든 결정의 책임은 전적으로 사용자에게 있습니다.

---
*This README is also available in English.*

# Anshim Scanner

**Anshim Scanner** is a web application that leverages Google Gemini AI to **automatically classify** and analyze the safety and environmental impact of **household products, food, and medicines**. By scanning a product label, this app helps users make informed decisions and dispose of products correctly.

The name '**Anshim (안심)**' is Korean for "peace of mind," reflecting the app's core value of empowering users to choose and use products with confidence. This project was created for a competition themed **"Solving Social Issues in Environment/Safety/Health using AI."**

---

## Key Features

*   **Intelligent Auto-Classification**: When a user scans a product label, the AI automatically determines whether it is a **household product, food, or medicine**, providing a tailored analysis for each category.
*   **Intuitive Risk Analysis**: Safety is visualized with a **Risk Score** on a scale of 0-100. A **higher score indicates higher risk**, allowing users to assess the hazard level at a glance.
*   **Three Specialized Analysis Modes**:
    1.  **Household Products**: Analyzes ingredient hazards, offers personalized analysis for vulnerable groups (infants, pregnant women, etc.), and assesses environmental impact and safe disposal.
    2.  **Food**: Analyzes risks from food additives, identifies allergens, and provides a nutritional profile.
    3.  **Medicine**: Provides information on active ingredients, potential side effects, contraindications, and **critical guidance on proper drug disposal** (this is not medical advice).
*   **Comprehensive Impact Assessment**: The analysis evaluates not only direct user impact (inhalation, contact, ingestion) but also the **environmental impact of improper disposal** of the product and its packaging.
*   **User-Friendly Features**: Supports multiple languages (KR/EN) and allows users to copy results or save them as JPG files.

---

## Tech Stack & Licenses

This project uses only open-source licensed technologies to comply with contest regulations.

*   **Frontend**: React 19, Tailwind CSS (MIT License)
*   **AI API**: Google Gemini (`gemini-2.5-flash` via `@google/genai`) (Apache 2.0 License)
*   **Icons**: Custom icons based on Lucide (ISC License)
*   **Language**: TypeScript
*   **Other Libraries**: html2canvas (JPG saving functionality)

---

## How to Run

1.  Download the project files.
2.  Open the `index.html` file in a web browser (Chrome or Edge recommended).

---

## Legal Disclaimer

*   **Project Purpose**: This app is a **prototype** developed for a competition on "Solving Social Issues with AI" and is not a commercial product.
*   **For Informational Purposes Only**: All analysis results are AI-generated and for informational purposes only. They may contain errors or omissions.
*   **Not a Substitute for Professional Advice**: **THIS APP DOES NOT PROVIDE MEDICAL ADVICE.** Information regarding medicines is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a doctor or pharmacist with any health concerns.
*   **Limitation of Liability**: The development team is not liable for any damages arising from the use of this app. The user is solely responsible for all decisions made based on the information provided.