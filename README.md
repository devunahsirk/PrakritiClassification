# Prakriti Assessment Portal (CCRAS SOP Compliant)

An interactive, premium web application for Prakriti classification based on the official **Manual of SOPs for Prakriti Assessment** by the **Central Council for Research in Ayurvedic Sciences (CCRAS)**, Ministry of Ayush, Government of India.

The portal evaluates a participant's constitution based on **92 predictors** across physical, physiological, psychological, and behavioral domains, normalizing and categorizing the results as **Eka-Doshaja**, **Sansargaja (Dvandvaja)**, or **Sama-Doshaja** using the rules set out in the manual.

## Core Features

- **Angulapramana Height Calculator**: Calculates standard height (84 Angulas) and height categories (Short/Tall) dynamically from palm breadth (4-finger width).
- **Body Mass Index (BMI) & Confounders**: Standard BMI calculator incorporating exclusions for endocrine and systemic diseases, allowing the input of historical healthy weight.
- **Interactive Comprehension Test (Grahya Shakti)**: Administers a story-reading phase with a 2-minute timer, followed by a 10-question quiz (scoring Shrutagrahi vs. Chiragrahi).
- **Interactive Memory Test (Smriti)**: A word-pair association retention test, asking the participant to recall words and pairs at the end of the section (scoring Smritimaan vs. Alpa/Chala Smriti).
- **Interactive Intelligence Test (Medha)**: Includes series completion and triangle counting puzzles to evaluate cognitive traits.
- **Table 1 Classifier**: Full normalized scoring algorithm mapping raw scores to percentages and determining the exact Prakriti type.
- **Ayurvedic Diet & Lifestyle Recommendations**: Dynamic, personalized guidelines based on the final Doshic profile.

## How to Run Locally

Since this is a client-side Single Page Application (SPA), it does not require any installation or build steps. You can run it instantly:

### Method 1: Double-Click (Simple)
Simply navigate to this folder and double-click `index.html` to open the portal in your web browser.

### Method 2: Local HTTP Server (Recommended)
To run it on a local development server:
- **Using Python** (if installed):
  ```bash
  python -m http.server 3000
  ```
  Then open `http://localhost:3000` in your browser.
  
- **Using Node.js/npm**:
  ```bash
  npx http-server -p 3000
  ```
  Then open `http://localhost:3000` in your browser.

## Project Structure

- `index.html` - Semantic structure containing the multi-step quiz wizard, consent, cognitive tests, and results layouts.
- `styles.css` - Custom styling using a premium dark-emerald Ayurvedic color scheme, glassmorphism card designs, and smooth transitions.
- `script.js` - Dynamic controllers for timer, memory options, intelligence puzzles, raw/weighted scoring math, SVG donut charting, and recommendations accordion.
- `README.md` - Setup and execution guide.

## Scoring Methodology Reference

As per the CCRAS publication:
- **Vata**: 31 Predictors
- **Pitta**: 29 Predictors
- **Kapha**: 32 Predictors
- **Weighted Formula**: `Weighted Score = (Raw Score / Max Predictors) * (100 / 3)`
- **Percentage Formula**: `% Dosha = (Weighted Dosha / Sum of Weighted Doshas) * 100`
- **Table 1 Rules**:
  - *Eka-Doshaja*: Dominant Dosha > 50% AND (difference between 1st & 2nd > 25% OR 2nd & 3rd are both in 18%–27%).
  - *Samadoshaja*: All three Doshas fall in the 30%–34% range.
  - *Sansargaja (Dvandvaja)*: If both of the above are false. Dominant is written first.
