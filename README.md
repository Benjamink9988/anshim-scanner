# 안심 스캐너 (Anshim Scanner)

**안심 스캐너**는 Google Gemini AI를 활용하여 생활화학제품 및 식품의 안전성과 환경 영향을 분석해주는 웹 애플리케이션입니다. 제품의 성분표 라벨을 스캔하여 사용자가 정보에 기반한 현명한 결정을 내릴 수 있도록 돕고, 모두가 안심하고 제품을 사용할 수 있는 환경을 만드는 것을 목표로 합니다.

'**안심 (Anshim)**'은 한국어로 '마음이 편안하고 걱정이 없는 상태'를 의미합니다. '안심 스캐너'라는 이름은 **"이 앱으로 제품을 스캔하여 안전성을 확인하고, 걱정 없이 안심하고 사용하세요"**라는 핵심 가치를 전달합니다.

---

## 주요 기능

*   **듀얼 분석 모드**: **생활화학제품**과 **식품** 두 가지 모드를 제공하여 각 제품 유형에 최적화된 분석을 수행합니다.
*   **AI 기반 종합 분석**: Gemini AI를 통해 제품의 안전성 점수, 등급, 성분별 위험도, 환경 영향(생활화학제품) 또는 식품첨가물, 알레르기 정보(식품) 등을 포함한 상세 보고서를 생성합니다.
*   **성분 스캔 (OCR)**: 스마트폰 카메라로 촬영한 성분표 이미지에서 텍스트를 자동 추출하여 분석합니다.
*   **취약 계층 맞춤 분석 (생활화학제품)**: 영유아, 임산부, 반려동물 등 특정 그룹에 대한 위험도를 재평가하는 심층 분석 기능을 제공합니다.
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

---

## 사용자 매뉴얼

'안심 스캐너'는 누구나 쉽게 사용할 수 있도록 직관적으로 설계되었습니다. 아래의 간단한 안내를 따라 제품 분석을 시작해보세요.

### 1. 시작하기

앱을 처음 실행하면 상단에서 **분석 모드('생활화학제품' 또는 '식품')**를 선택할 수 있습니다. 우측 상단에서는 언어(한국어/영어)를 선택할 수 있습니다.

### 2. 제품 라벨 스캔 및 분석

1.  **모드 선택**: 분석하려는 제품 유형에 맞게 모드를 선택합니다.
2.  **이미지 준비**: 분석할 제품의 성분 목록이 잘 보이도록 선명하고 밝은 사진을 준비합니다. 성분 목록이 길 경우, 여러 부분으로 나누어 여러 장의 사진을 촬영해도 좋습니다.
3.  **이미지 업로드**:
    *   `이미지 업로드` 버튼: 스마트폰이나 컴퓨터에 저장된 사진을 선택합니다. 한 번에 여러 장을 선택할 수 있습니다.
    *   `사진 찍기` 버튼: 스마트폰의 카메라를 직접 실행하여 라벨을 촬영합니다.
4.  **미리보기 확인**: 업로드한 이미지들이 화면에 나타납니다. 잘못된 이미지는 우측 상단의 'X' 버튼을 눌러 삭제할 수 있습니다.
5.  **분석 시작**: 이미지가 준비되면, 하단의 `N개 이미지 분석` 버튼을 클릭하여 AI 분석을 시작합니다. 잠시 후 분석이 진행되는 동안 로딩 화면이 표시됩니다.

### 3. 분석 결과 확인하기

분석이 완료되면 선택한 모드에 맞는 상세한 결과 보고서가 표시됩니다.

*   **주요 분석 결과**: 제품의 전반적인 안전 등급과 핵심 요약 정보를 한눈에 파악할 수 있습니다.
*   **생활화학제품 분석 시**:
    *   **취약 계층 분석**: '영유아', '임산부' 등 특정 그룹에 대한 맞춤형 분석이 필요하다면, 해당 버튼을 클릭하여 재평가된 결과를 확인합니다.
    *   **상세 정보**: '안전 사용 가이드', '성분 심층 분석', '환경 영향' 등 상세 정보를 제공합니다.
*   **식품 분석 시**:
    *   **상세 정보**: '알레르기 정보', '식품첨가물 분석', '영양 분석' 등 식품에 특화된 정보를 제공합니다.

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

**Anshim Scanner** is a web application that leverages Google Gemini AI to analyze the safety and environmental impact of household chemical products and food. By scanning a product's ingredient label, this app empowers users to make informed decisions, aiming to create an environment where everyone can use products with peace of mind.

'**Anshim (안심)**' is a Korean word that means **"a state of being at ease and free from worry."** The name 'Anshim Scanner' conveys the core value: **"Scan products with this app to verify their safety, and use them with peace of mind."**

---

## Key Features

*   **Dual Analysis Modes**: Offers two modes, **'Household Product'** and **'Food'**, to provide optimized analysis for each product type.
*   **Comprehensive AI Analysis**: Generates detailed reports including safety scores, grades, ingredient risks, environmental impact (for household products), or food additives and allergen info (for food) using Gemini AI.
*   **Ingredient Scan (OCR)**: Automatically extracts and analyzes text from images of ingredient labels taken with a smartphone camera.
*   **Personalized Analysis for Vulnerable Groups (Household Products)**: Offers a refined analysis feature that re-evaluates risks for specific groups, such as infants, pregnant women, and pets.
*   **Actionable Guidance**: Provides a 'Safety Tips' guide for high-risk products and a 'Safe Disposal Tip' for environmental protection.
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

---

## User Manual

'Anshim Scanner' is designed to be intuitive and easy for anyone to use. Follow the simple steps below to start your product analysis.

### 1. Getting Started

When you first launch the app, you can select an **analysis mode ('Household Product' or 'Food')** at the top. You can also select your preferred language (Korean/English) in the top-right corner.

### 2. Scanning and Analyzing a Product Label

1.  **Select Mode**: Choose the mode that matches your product type.
2.  **Prepare Your Images**: Get clear, well-lit photos of the product's ingredient list. If the list is long, you can take multiple pictures.
3.  **Upload Images**:
    *   `Upload Image(s)` button: Select one or more photos stored on your device.
    *   `Take Photo` button: Launch your smartphone's camera to capture the label.
4.  **Review Previews**: The uploaded images will appear on the screen. Remove any incorrect images by clicking the 'X' button.
5.  **Start Analysis**: Click the `Analyze X Image(s)` button at the bottom to begin.

### 3. Understanding the Results

A detailed report tailored to the selected mode will be displayed.

*   **Key Findings**: Get an at-a-glance overview of the product's safety grade and key summary.
*   **For Household Product Analysis**:
    *   **Vulnerable Group Analysis**: Click buttons like 'Infants' for a personalized re-evaluation of risks.
    *   **Detailed Information**: View 'Safety Tips', 'Ingredient Deep Dive', 'Environmental Impact', and more.
*   **For Food Analysis**:
    *   **Detailed Information**: Check for food-specific details like 'Allergen Info', 'Food Additive Analysis', and 'Nutritional Summary'.

### 4. Using the Results and Starting Over

*   **Save and Share Results**: Use the icons in the sticky menu at the bottom.
    *   **Copy Text**: Copies the entire report in text format.
    *   **Save as JPG**: Saves the current report view as an image file.
    *   **Save as TXT**: Downloads the report as a text file.
*   **Start Over**: Click the `Scan Another Product` button to return to the initial screen.

---

## Legal Disclaimer

*   **For Informational Purposes Only**: All analysis results provided by 'Anshim Scanner' are generated by Google Gemini AI and are intended for informational purposes only.
*   **Not a Substitute for Professional Advice**: The information in this app is not a substitute for medical, legal, or other professional advice. If you have health concerns related to product use, please consult a doctor or a qualified professional.
*   **Limitation of Liability**: AI-generated analysis may contain errors or inaccuracies. Users are solely responsible for all decisions made based on the information provided. The development team is not liable for any direct or indirect damages arising from the use of this application.