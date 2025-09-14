# 안심 스캐너 (Anshim Scanner)

**안심 스캐너**는 Google Gemini AI를 활용하여 생활화학제품의 안전성과 환경 영향을 분석해주는 웹 애플리케이션입니다. 제품의 성분표 라벨을 스캔하여 사용자가 정보에 기반한 현명한 결정을 내릴 수 있도록 돕고, 모두가 안심하고 제품을 사용할 수 있는 환경을 만드는 것을 목표로 합니다.

'**안심 (Anshim)**'은 한국어로 '마음이 편안하고 걱정이 없는 상태'를 의미합니다. '안심 스캐너'라는 이름은 **"이 앱으로 제품을 스캔하여 안전성을 확인하고, 걱정 없이 안심하고 사용하세요"**라는 핵심 가치를 전달합니다.

---

## 주요 기능

*   **AI 기반 종합 분석**: Gemini AI를 통해 제품의 안전성 점수, 등급(안전, 주의, 고위험), 성분별 위험도, 환경 영향 점수 등을 포함한 상세한 보고서를 생성합니다.
*   **성분 스캔 (OCR)**: 스마트폰 카메라로 촬영한 성분표 이미지에서 텍스트를 자동 추출하여 분석합니다.
*   **취약 계층 맞춤 분석**: 영유아, 임산부, 반려동물, 호흡기 민감군 등 특정 그룹에 대한 위험도를 재평가하는 심층 분석 기능을 제공합니다.
*   **실용적인 가이드 제공**: 위험 등급이 높은 제품의 경우, 위험을 최소화할 수 있는 '안전 사용 가이드'와 '안전한 폐기 방법'을 안내합니다.
*   **다국어 지원**: 한국어와 영어를 모두 지원하여 더 많은 사용자가 이용할 수 있습니다.
*   **결과 공유 및 저장**: 분석 결과를 텍스트, JPG 등 다양한 형식으로 복사, 공유, 저장할 수 있습니다.

---

## 기술 스택 및 라이선스

본 프로젝트는 공모전 규정을 준수하기 위해 오픈소스 라이선스를 가진 기술만을 사용했습니다.

*   **Frontend**: React 19, Tailwind CSS (MIT License)
*   **AI API**: Google Gemini (`gemini-2.5-flash` via `@google/genai`) (Apache 2.0 License)
*   **Icons**: Lucide (ISC License) 기반의 커스텀 아이콘
*   **Language**: TypeScript

---

## 실행 방법

1.  프로젝트 파일을 다운로드합니다.
2.  `index.html` 파일을 웹 브라우저(Chrome, Edge 권장)에서 엽니다.
3.  앱이 정상적으로 실행되기 위해서는 Google Gemini API 키가 필요합니다. **공모전 규정에 따라 민감 정보인 API 키는 소스코드에 포함하여 제출하지 않았습니다.** 따라서, 아래와 같이 웹 브라우저의 개발자 도구(F12) 콘솔에서 직접 API 키를 설정해주셔야 합니다:
    ```javascript
    process = { env: { API_KEY: 'YOUR_GEMINI_API_KEY' } };
    ```
    **주의**: `YOUR_GEMINI_API_KEY` 부분을 실제 발급받은 키로 교체해야 합니다. 이 키는 현재 브라우저 세션에서만 유효하며, 페이지를 새로고침하면 다시 설정해야 합니다.

---

## 사용자 매뉴얼

'안심 스캐너'는 누구나 쉽게 사용할 수 있도록 직관적으로 설계되었습니다. 아래의 간단한 안내를 따라 제품 분석을 시작해보세요.

### 1. 시작하기

앱을 처음 실행하면 제품 라벨을 스캔할 수 있는 초기 화면이 나타납니다. 우측 상단에서 언어(한국어/영어)를 선택할 수 있습니다.

**※ 중요**: 앱을 사용하려면 [실행 방법](#실행-방법) 섹션의 안내에 따라 브라우저 개발자 도구에서 Gemini API 키를 먼저 설정해야 합니다.

### 2. 제품 라벨 스캔 및 분석

1.  **이미지 준비**: 분석할 제품의 성분 목록이 잘 보이도록 선명하고 밝은 사진을 준비합니다. 성분 목록이 길 경우, 여러 부분으로 나누어 여러 장의 사진을 촬영해도 좋습니다.
2.  **이미지 업로드**:
    *   `이미지 업로드` 버튼: 스마트폰이나 컴퓨터에 저장된 사진을 선택합니다. 한 번에 여러 장을 선택할 수 있습니다.
    *   `사진 찍기` 버튼: 스마트폰의 카메라를 직접 실행하여 라벨을 촬영합니다.
3.  **미리보기 확인**: 업로드한 이미지들이 화면에 나타납니다. 잘못된 이미지는 우측 상단의 'X' 버튼을 눌러 삭제할 수 있습니다.
4.  **분석 시작**: 이미지가 준비되면, 하단의 `N개 이미지 분석` 버튼을 클릭하여 AI 분석을 시작합니다. 잠시 후 분석이 진행되는 동안 로딩 화면이 표시됩니다.

### 3. 분석 결과 확인하기

분석이 완료되면 상세한 결과 보고서가 표시됩니다.

*   **주요 분석 결과**: 제품의 전반적인 '안전 등급'과 '환경 등급'을 점수와 함께 한눈에 파악할 수 있습니다. AI가 요약한 핵심 내용도 제공됩니다.
*   **취약 계층 분석**: '영유아', '임산부' 등 특정 그룹에 대한 맞춤형 분석이 필요하다면, 해당 버튼을 클릭하세요. AI가 해당 그룹의 민감도를 고려하여 안전성 점수와 등급을 다시 평가한 결과를 보여줍니다.
*   **상세 정보**:
    *   **안전 사용 가이드**: 주의가 필요한 제품의 경우, 위험을 줄일 수 있는 구체적인 사용 방법을 안내합니다.
    *   **성분 심층 분석**: 제품에 포함된 모든 성분을 목록으로 보여주고, 각 성분의 위험도를 '낮음', '중간', '높음'으로 평가하여 그 이유를 설명합니다.
    *   **환경 영향, 과거 사고 이력, 대안 제품**: 제품의 환경적 측면과 관련된 추가 정보를 제공합니다.

### 4. 결과 활용 및 새로 시작하기

*   **결과 저장 및 공유**: 화면 하단의 고정된 메뉴에 있는 아이콘을 사용하여 분석 결과를 활용할 수 있습니다.
    *   **텍스트 복사**: 분석 보고서 전체를 텍스트 형식으로 복사합니다.
    *   **JPG로 저장**: 현재 보고서 화면을 하나의 이미지 파일로 저장합니다.
    *   **TXT로 저장**: 분석 보고서를 텍스트 파일(.txt)로 다운로드합니다.
*   **새로 시작하기**: `다른 제품 스캔하기` 버튼을 누르면 초기 화면으로 돌아가 새로운 제품을 분석할 수 있습니다.

---

## 법적 고지 (Legal Disclaimer)

*   **정보 제공 목적**: '안심 스캐너'가 제공하는 모든 분석 결과는 Google Gemini AI를 통해 생성된 정보이며, 참고용으로만 제공됩니다.
*   **전문가 조언 대체 불가**: 본 앱의 정보는 의학적, 법률적 또는 기타 전문적인 조언을 대체할 수 없습니다. 제품 사용과 관련된 건강상의 우려가 있는 경우, 반드시 의사나 전문가와 상담하시기 바랍니다.
*   **책임의 한계**: AI 분석에는 오류나 부정확성이 포함될 수 있습니다. 사용자는 제공된 정보를 바탕으로 내린 모든 결정에 대해 스스로 책임을 져야 하며, 개발팀은 이로 인해 발생하는 어떠한 직간접적인 손해에 대해서도 책임을 지지 않습니다.

---
*This README is also available in English.*

# Anshim Scanner

**Anshim Scanner** is a web application that leverages Google Gemini AI to analyze the safety and environmental impact of household chemical products. By scanning a product's ingredient label, this app empowers users to make informed decisions, aiming to create an environment where everyone can use products with peace of mind.

'**Anshim (안심)**' is a Korean word that means **"a state of being at ease and free from worry."** The name 'Anshim Scanner' conveys the core value: **"Scan products with this app to verify their safety, and use them with peace of mind."**

---

## Key Features

*   **Comprehensive AI Analysis**: Generates a detailed report including a safety score, grade (Safe, Caution, High Risk), ingredient-specific risks, and an environmental impact score using Gemini AI.
*   **Ingredient Scan (OCR)**: Automatically extracts and analyzes text from images of ingredient labels taken with a smartphone camera.
*   **Personalized Analysis for Vulnerable Groups**: Offers a refined analysis feature that re-evaluates risks for specific groups, such as infants, pregnant women, pets, and individuals with respiratory sensitivities.
*   **Actionable Guidance**: Provides a 'Safety Tips' guide for high-risk products to minimize exposure and offers a 'Safe Disposal Tip' for environmental protection.
*   **Multilingual Support**: Supports both Korean and English to cater to a wider audience.
*   **Share & Save Results**: Allows users to copy, share, and save the analysis results in various formats like Text and JPG.

---

## Tech Stack & Licenses

This project uses only open-source licensed technologies to comply with contest regulations.

*   **Frontend**: React 19, Tailwind CSS (MIT License)
*   **AI API**: Google Gemini (`gemini-2.5-flash` via `@google/genai`) (Apache 2.0 License)
*   **Icons**: Custom icons based on Lucide (ISC License)
*   **Language**: TypeScript

---

## How to Run

1.  Download the project files.
2.  Open the `index.html` file in a web browser (Chrome or Edge recommended).
3.  To run the app, a Google Gemini API key is required. **In compliance with competition rules, the sensitive API key is not included in the source code.** Therefore, you must set it manually in your browser's developer tools (F12) console by executing the following command:
    ```javascript
    process = { env: { API_KEY: 'YOUR_GEMINI_API_KEY' } };
    ```
    **Note**: You must replace `YOUR_GEMINI_API_KEY` with your actual API key. This key is only valid for the current session and will need to be set again if you refresh the page.

---

## User Manual

'Anshim Scanner' is designed to be intuitive and easy for anyone to use. Follow the simple steps below to start your product analysis.

### 1. Getting Started

When you first launch the app, you will see the initial screen for scanning product labels. You can select your preferred language (Korean/English) in the top-right corner.

**※ Important**: Before using the app, you must first set your Gemini API key in the browser's developer tools as instructed in the [How to Run](#how-to-run) section.

### 2. Scanning and Analyzing a Product Label

1.  **Prepare Your Images**: Get clear, well-lit photos of the product's ingredient list. If the list is long, you can take multiple pictures covering different sections.
2.  **Upload Images**:
    *   `Upload Image(s)` button: Select one or more photos stored on your smartphone or computer.
    *   `Take Photo` button: Launch your smartphone's camera directly to capture the label.
3.  **Review Previews**: The images you've uploaded will appear on the screen. You can remove any incorrect images by clicking the 'X' button in the top-right corner of the preview.
4.  **Start Analysis**: Once your images are ready, click the `Analyze X Image(s)` button at the bottom to begin the AI analysis. A loading screen will appear while the analysis is in progress.

### 3. Understanding the Results

Once the analysis is complete, a detailed report will be displayed.

*   **Key Findings**: Get an at-a-glance overview of the product's overall 'Safety Grade' and 'Eco-Grade', complete with scores. An AI-generated summary of key findings is also provided.
*   **Vulnerable Group Analysis**: If you need a personalized analysis for specific groups like 'Infants' or 'Pregnant Individuals', click the corresponding buttons. The AI will re-evaluate the safety score and grade based on the sensitivities of that group and show you the updated results.
*   **Detailed Information**:
    *   **Safety & Mitigation Tips**: For products that require caution, this section provides specific instructions on how to minimize risks.
    *   **Ingredient Deep Dive**: Lists all identified ingredients, rating each with a 'Low', 'Moderate', or 'High' risk level and explaining the reason.
    *   **Environmental Impact, Incident History, Alternatives**: Provides additional information regarding the product's environmental aspects and other relevant data.

### 4. Using the Results and Starting Over

*   **Save and Share Results**: Use the icons in the sticky menu at the bottom of the screen to utilize the analysis report.
    *   **Copy Text**: Copies the entire analysis report in text format.
    *   **Save as JPG**: Saves the current report view as a single image file.
    *   **Save as TXT**: Downloads the analysis report as a text file (.txt).
*   **Start Over**: Click the `Scan Another Product` button to return to the initial screen and analyze a new product.

---

## Legal Disclaimer

*   **For Informational Purposes Only**: All analysis results provided by 'Anshim Scanner' are generated by Google Gemini AI and are intended for informational purposes only.
*   **Not a Substitute for Professional Advice**: The information in this app is not a substitute for medical, legal, or other professional advice. If you have health concerns related to product use, please consult a doctor or a qualified professional.
*   **Limitation of Liability**: AI-generated analysis may contain errors or inaccuracies. Users are solely responsible for all decisions made based on the information provided. The development team is not liable for any direct or indirect damages arising from the use of this application.