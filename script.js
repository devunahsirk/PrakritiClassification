/**
 * AYUR Prakriti Assessment Portal - Logic & Scoring Engine
 * CCRAS Compliant (92 Predictors, Table 1 Classifier)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // State Management
    // ----------------------------------------------------
    const state = {
        currentStep: 1, // 1 to 6
        consentGiven: false,
        participantName: '',
        age: 25,
        gender: 'Male',
        weight: 65,
        height: 165,
        palmBreadth: 7.5,
        appearanceSame: 'yes',
        healthyWeight: 65,
        
        // Selections for physical, physiological, psychological, behavioral traits
        // Key represents the data-predictor value
        selections: {
            // Morphological
            'prominent-tendons': null,
            'sukumara-gatra': null,
            'broad-forehead': null,
            'skin-color': null,
            'skin-texture': null,
            'skin-moles': null,
            'skin-wrinkles': null,
            'skin-temp': null,
            'joint-movement': null,
            'joint-sound': null,
            'muscle-laxity': null,
            'eye-size': null,
            'eye-texture': null,
            'eye-color': null,
            'eye-movement': null,
            'eye-reddening': null,
            'eye-lashes': null,
            'hair-texture': null,
            'hair-color': null,
            'hair-curly': null,
            'hair-loss': null,
            'hair-density': null,
            'teeth-texture': null,
            'teeth-size': null,
            'nails-size': null,
            'nails-texture': null,
            'nails-color': null,

            // Physiological
            'gait': null,
            'cheshta': null,
            'voice': null,
            'appetite-frequency': null,
            'appetite-quantity': null,
            'appetite-tolerance': null,
            'appetite-speed': null,
            'thirst-reaction': null,
            'thirst-quantity': null,
            'thirst-frequency': null,
            'stool': null,
            'sweat-quantity': null,
            'sweat-odour': null,
            'sleep-awakening': null,
            'sleep-hours': null,
            'sleep-liking': null,
            'sleep-dreams': null,

            // Cognitive / Psychological
            'indecisiveness': null,
            'friendship': null,
            'puzzle-series': null,
            'puzzle-shapes': null, // manual number
            'puzzle-differences': null, // manual number
            'krodha': null,

            // Behavioral
            'speech-nature': null,
            'orator-dominant': null,
            'valour': null,
            'likings': null,
            'enmity': null,
            'politeness': null
        },

        // Cognitive test states
        compTestStarted: false,
        compTestFinished: false,
        compTimerInterval: null,
        compTimeLeft: 120,
        compAnswers: {}, // QIndex -> selected option
        compLanguage: 'en', // 'en' or 'hi'
        
        memorySingleRecalled: [],
        memoryPairRecalled: []
    };

    // ----------------------------------------------------
    // Cognitive Test Constants
    // ----------------------------------------------------
    const STORIES = {
        en: {
            title: "Comprehension Test (English)",
            instructions: "This test measures immediate grasping speed and comprehension. You will read a short story. You have up to 2 minutes. Once you click \"Show Questions\" or the timer runs out, the story will hide and you will answer 10 questions. (60% or more correct is Shrutagrahi).",
            doneBtn: "Done: Show Questions",
            startBtn: "Start Reading",
            timeLeft: "⏱️ Reading Time Left:",
            hiddenWarning: "⚠️ The story is now hidden. Answer these 10 questions to test your comprehension:",
            text: "In a small village named Komban, there lived a Brahmin named Venkataraman Vishwanathan, who was a devotee of Lord Vishnu. One day, the Brahmin received a goat as a gift from his patron, Chitrartha, in the village of Koshinagar, and was carrying it home on his back. On his way, he had to pass through a forest, where three thieves named Radhe, Sadashiva, and Veera saw him and planned to trick him out of the goat. According to their plan, Radhe stopped the Brahmin and asked, 'O Brahmin, why are you carrying a dog on your back?' Hearing this, the Brahmin got angry and said, 'Fool! Do you not see the difference between a goat and a dog?' and walked away. After walking a short distance, the Brahmin met Sadashiva, who stopped him and asked, 'Why are you carrying a dead calf on your shoulder?' Hearing this, the Brahmin grew furious and continued on his way. A little further, the Brahmin was stopped by the third thief, Veera, who asked, 'Why are you carrying a donkey on your back?' Upon hearing this for the third time, the Brahmin was filled with doubt and wonder as to why all three men could not see that he was carrying a goat. He panicked, thinking that some ghost or demon had possessed the animal on his back, so he threw the goat down and ran away in fear.",
            questions: [
                {
                    q: "1. What was the name of the Brahmin?",
                    options: ["A. Someshwar", "B. Venkataraman Vishwanathan", "C. Yadunath Shastri"],
                    correct: 1
                },
                {
                    q: "2. Which God did he worship?",
                    options: ["A. Lord Shiva", "B. Lord Ganesha", "C. Lord Vishnu"],
                    correct: 2
                },
                {
                    q: "3. What was the name of the patron (Yajaman)?",
                    options: ["A. Chitrartha", "B. Chandrakanth", "C. Devadatta"],
                    correct: 0
                },
                {
                    q: "4. In which village did the patron live?",
                    options: ["A. Komban", "B. Koshinagar", "C. Nanded"],
                    correct: 1
                },
                {
                    q: "5. What did the Brahmin receive as a gift?",
                    options: ["A. A cow", "B. A goat", "C. A dog"],
                    correct: 1
                },
                {
                    q: "6. Who did the Brahmin meet on the road?",
                    options: ["A. Three thieves", "B. A tiger", "C. King's soldiers"],
                    correct: 0
                },
                {
                    q: "7. What did the first thief (Radhe) ask the Brahmin?",
                    options: ["A. Why carry a donkey?", "B. Why carry a dog?", "C. Why carry a calf?"],
                    correct: 1
                },
                {
                    q: "8. What was the name of the second thief?",
                    options: ["A. Sadashiva", "B. Veera", "C. Radhe"],
                    correct: 0
                },
                {
                    q: "9. What did the third thief (Veera) ask the Brahmin?",
                    options: ["A. Why carry a dead calf?", "B. Why carry a dog?", "C. Why carry a donkey?"],
                    correct: 2
                },
                {
                    q: "10. What did the Brahmin do at the end?",
                    options: ["A. Beat the thieves", "B. Left the goat and ran away", "C. Returned the goat"],
                    correct: 1
                }
            ]
        },
        hi: {
            title: "Comprehension Test (हिन्दी)",
            instructions: "यह परीक्षण त्वरित समझ और ग्रहण शक्ति को मापता है। आप एक संक्षिप्त कहानी पढ़ेंगे। आपके पास 2 मिनट का समय है। जैसे ही आप 'प्रश्न दिखाएं' पर क्लिक करेंगे या समय समाप्त होगा, कहानी छिप जाएगी और आप 10 प्रश्नों के उत्तर देंगे। (60% या अधिक सही होना श्रुताग्राही है)।",
            doneBtn: "पढ़ना समाप्त: प्रश्न दिखाएं",
            startBtn: "पढ़ना शुरू करें",
            timeLeft: "⏱️ पढ़ने का समय शेष:",
            hiddenWarning: "⚠️ कहानी अब छिपी हुई है। अपनी समझ का परीक्षण करने के लिए इन 10 प्रश्नों के उत्तर दें:",
            text: "एक छोटे कोंबन गाँव में वेंकट रमण विश्वनाथन नाम का ब्राह्मण रहता था जो विष्णु भगवान की पूजा करता था। एक दिन ब्राह्मण कोशीनगर गाँव में अपने यजमान चित्ररथ से एक बकरी दान स्वरुप अपने घर ले जा रहा था। रास्ते में एक जंगल पड़ा जहाँ राधे, सदाशिव और वीरा नाम के तीन चोरों ने उस ब्राह्मण को देखकर उसे लूटने की योजना बनाई। योजनानुसार राधे ने ब्राह्मण को रोक कर पूछा के, “ब्राह्मणजी, आप अपनी पीठ पर कुत्ते को क्यों ले जा रहे हैं?” ये सुनकर ब्राह्मण क्रोध में आ कर बोला कि, “मूर्ख, क्या तुम्हे बकरी और कुत्ते में अंतर नज़र नहीं आता”, और आगे बढ़ गया। थोड़ी दूर जाकर ब्राह्मण को सदाशिव मिला और उसने ब्राह्मण को रोकते हुए पूछा कि, “आप अपने कंधे पर मृत बछड़ा क्यों ले जा रहे हो?” ये सुनकर ब्राह्मण गुस्सा करते हुए अपने रास्ते चला गया। कुछ दूरी पर पहुँचने पर ब्राह्मण को तीसरा चोर वीरा मिला और उसने ब्राह्मण से पूछा कि, “आप अपनी पीठ पर गधे को क्यों ले जा रहे हो?” यह सुनकर ब्राह्मण को अत्यंत आश्चर्य हुआ कि तीनों व्यक्ति यह क्यों नहीं देख पाये कि वो अपनी पीठ पर बकरी ले जा रहे हैं। ब्राह्मण बहुत घबरा गया, उसने सोचा कि उसकी पीठ पर कोई प्रेत या पिशाच तो नहीं बैठा! और वो बकरी को छोड़ कर वहाँ से भाग गया।",
            questions: [
                {
                    q: "1. ब्राह्मण का क्या नाम था?",
                    options: ["A. सोमेश्वर", "B. वेंकट रमण विश्वनाथन", "C. यदुनाथ शास्त्री"],
                    correct: 1
                },
                {
                    q: "2. वह किस भगवान की पूजा करता था?",
                    options: ["A. भगवान शिव", "B. भगवान गणेश", "C. विष्णु भगवान"],
                    correct: 2
                },
                {
                    q: "3. यजमान का क्या नाम था?",
                    options: ["A. चित्ररथ", "B. चंद्रकांत", "C. देवदत्त"],
                    correct: 0
                },
                {
                    q: "4. यजमान किस गाँव में रहता था?",
                    options: ["A. कोंबन", "B. कोशीनगर", "C. नांदेंड़"],
                    correct: 1
                },
                {
                    q: "5. ब्राह्मण को दान स्वरुप क्या मिला था?",
                    options: ["A. एक गाय", "B. एक बकरी", "C. एक कुत्ता"],
                    correct: 1
                },
                {
                    q: "6. रास्ते में ब्राह्मण को कौन मिला?",
                    options: ["A. तीन चोर", "B. एक शेर", "C. राजा के सिपाही"],
                    correct: 0
                },
                {
                    q: "7. पहले चोर (राधे) ने ब्राह्मण से क्या प्रश्न पूछा?",
                    options: ["A. आप गधे को क्यों ले जा रहे हैं?", "B. आप कुत्ते को क्यों ले जा रहे हैं?", "C. आप बछड़े को क्यों ले जा रहे हैं?"],
                    correct: 1
                },
                {
                    q: "8. दूसरे चोर का क्या नाम था?",
                    options: ["A. सदाशिव", "B. वीरा", "C. राधे"],
                    correct: 0
                },
                {
                    q: "9. तीसरे चोर (वीरा) ने ब्राह्मण से क्या पूछा?",
                    options: ["A. आप मृत बछड़ा क्यों ले जा रहे हैं?", "B. आप कुत्ते को क्यों ले जा रहे हैं?", "C. आप गधे को क्यों ले जा रहे हो?"],
                    correct: 2
                },
                {
                    q: "10. ब्राह्मण ने अंत में क्या किया?",
                    options: ["A. चोरों को मार भगाया", "B. बकरी को छोड़कर भाग गया", "C. बकरी को यजमान को लौटा दिया"],
                    correct: 1
                }
            ]
        }
    };

    const MEMORY_WORDS = {
        single: ["Mango", "Night", "Key", "Car", "House"],
        singleDistractors: ["Apple", "Day", "Lock", "Bike", "Tree"],
        pair: ["Day-Night", "Sister-Brother", "Joy-Sorrow", "Up-Down", "Black-White"],
        pairDistractors: ["Red-Yellow", "Land-Sky", "Sun-Moon", "King-Queen", "Good-Bad"]
    };

    // ----------------------------------------------------
    // Recommendation Texts
    // ----------------------------------------------------
    const RECOMMENDATIONS = {
        'Vata': {
            diet: [
                "Prefer warm, moist, unctuous, and heavy foods. Ghee, butter, and warm oils are beneficial.",
                "Taste Focus: Sweet, sour, and salty tastes pacify Vata. Avoid bitter, pungent, and astringent tastes.",
                "Include well-cooked warm grains (rice, wheat, oats) and nourishing soups.",
                "Drink warm milk with a pinch of ginger, cardamom, or nutmeg before bed."
            ],
            lifestyle: [
                "Establish a regular daily routine (Dinacharya) for sleeping, eating, and working.",
                "Maintain warmth; avoid cold climates, dry winds, and drafty spaces.",
                "Abhyanga: Practice daily self-massage with warm sesame oil to ground Vata.",
                "Engage in mild, calming exercises like gentle yoga, walking, and tai chi. Avoid exhaustion."
            ],
            seasonal: [
                "During late autumn and winter (Vata seasons), stay extra warm, consume highly nourishing hot foods, and stay hydrated.",
                "Avoid dry snacks like crackers, popcorn, and raw cold salads during winter."
            ]
        },
        'Pitta': {
            diet: [
                "Prefer cooling, refreshing, slightly dry, and sweet/bitter foods. Ghee in moderation is excellent.",
                "Taste Focus: Sweet, bitter, and astringent tastes pacify Pitta. Avoid pungent (spicy), sour, and salty tastes.",
                "Include cooling fruits (melons, pears, sweet grapes) and fresh leafy vegetables.",
                "Limit coffee, alcohol, fermented foods, vinegar, and hot spices."
            ],
            lifestyle: [
                "Maintain moderation in all activities. Avoid competitiveness and overworking.",
                "Keep cool; spend time in nature near bodies of water or under the shade. Avoid direct mid-day sun.",
                "Abhyanga: Massage with cooling coconut or sandalwood oil.",
                "Engage in calming exercises in the cool parts of the day (swimming, walking in nature, moon-gazing yoga)."
            ],
            seasonal: [
                "During summer (Pitta season), drink cooling beverages (mint/coriander tea, coconut water) and avoid intense physical exertion.",
                "Slightly reduce spice and heat intake during hot autumn months."
            ]
        },
        'Kapha': {
            diet: [
                "Prefer warm, light, dry, and spicy foods. Use minimal oils, butter, or heavy fats.",
                "Taste Focus: Pungent (spicy), bitter, and astringent tastes pacify Kapha. Avoid sweet, sour, and salty tastes.",
                "Include light grains (barley, millet, buckwheat) and dry heated legumes.",
                "Avoid heavy dairy, cold drinks, iced desserts, and excessive wheat or refined sugar."
            ],
            lifestyle: [
                "Stay active and dynamic; introduce variety and stimulation into your routine. Avoid lethargy.",
                "Keep warm and dry; avoid damp, cold, and humid environments.",
                "Dry massage (Udvartana) using herbal powders or rough cloth is highly recommended to stimulate lymphatic drainage.",
                "Engage in vigorous, active exercises (jogging, hiking, aerobic yoga) daily to burn excess Kapha stagnation."
            ],
            seasonal: [
                "During spring (Kapha season), focus on light fasting, warm spices, and cleansing foods to eliminate accumulated spring dampness.",
                "Avoid heavy daytime sleeping, especially in winter and spring."
            ]
        }
    };

    // ----------------------------------------------------
    // Cache DOM Elements
    // ----------------------------------------------------
    const dom = {
        // App Steps Views
        views: {
            welcome: document.getElementById('welcome-view'),
            consent: document.getElementById('consent-view'),
            general: document.getElementById('step-general-view'),
            physical: document.getElementById('step-physical-view'),
            physiological: document.getElementById('step-physiological-view'),
            psychological: document.getElementById('step-psychological-view'),
            behavioral: document.getElementById('step-behavioral-view'),
            results: document.getElementById('results-view')
        },
        stepper: document.getElementById('stepper-container'),
        progressFill: document.getElementById('progress-bar-fill'),
        stepNodes: document.querySelectorAll('.step-node'),

        // Buttons
        btnStartApp: document.getElementById('btn-start-app'),
        btnConsentBack: document.getElementById('btn-consent-back'),
        btnConsentNext: document.getElementById('btn-consent-next'),
        btnStepGenBack: document.getElementById('btn-step-gen-back'),
        btnStepGenNext: document.getElementById('btn-step-gen-next'),
        btnStepPhysBack: document.getElementById('btn-step-phys-back'),
        btnStepPhysNext: document.getElementById('btn-step-phys-next'),
        btnStepPhysioBack: document.getElementById('btn-step-physio-back'),
        btnStepPhysioNext: document.getElementById('btn-step-physio-next'),
        btnStepPsychBack: document.getElementById('btn-step-psych-back'),
        btnStepPsychNext: document.getElementById('btn-step-psych-next'),
        btnStepBehavBack: document.getElementById('btn-step-behav-back'),
        btnStepBehavNext: document.getElementById('btn-step-behav-next'),
        btnRestart: document.getElementById('btn-restart-assessment'),

        // Inputs General
        nameInput: document.getElementById('participant-name'),
        consentCheck: document.getElementById('consent-check'),
        ageInput: document.getElementById('input-age'),
        genderSelect: document.getElementById('input-gender'),
        palmInput: document.getElementById('input-palm'),
        weightInput: document.getElementById('input-weight'),
        heightInput: document.getElementById('input-height'),
        appearanceSelect: document.getElementById('input-appearance-same'),
        healthyWeightBox: document.getElementById('confounder-weight-box'),
        healthyWeightInput: document.getElementById('input-healthy-weight'),

        // Live calculator texts
        calcBmi: document.getElementById('calc-bmi'),
        calcBuiltClass: document.getElementById('calc-built-class'),
        calcStdHeight: document.getElementById('calc-std-height'),
        calcStdRange: document.getElementById('calc-std-range'),
        calcHeightClass: document.getElementById('calc-height-class'),

        // Cognitive test divs
        btnStartComp: document.getElementById('btn-start-comp-test'),
        btnFinishReading: document.getElementById('btn-finish-reading'),
        compIntro: document.getElementById('comp-intro-screen'),
        compReading: document.getElementById('comp-reading-screen'),
        compQuiz: document.getElementById('comp-quiz-screen'),
        compTimerText: document.getElementById('comp-timer'),
        quizQuestionsBox: document.getElementById('quiz-questions-box'),
        btnLangEn: document.getElementById('btn-lang-en'),
        btnLangHi: document.getElementById('btn-lang-hi'),
        compLangSelector: document.getElementById('comp-lang-selector'),
        
        memorySingleOptions: document.getElementById('memory-single-options'),
        memoryPairOptions: document.getElementById('memory-pair-options'),
        
        triangleInput: document.getElementById('input-triangle-count'),

        // Diagnosis texts & scores
        resName: document.getElementById('results-participant-name'),
        diagnosisText: document.getElementById('diagnosis-text'),
        diagnosisDesc: document.getElementById('diagnosis-description'),
        donutChart: document.getElementById('results-donut-chart'),
        
        scoreVataPct: document.getElementById('score-vata-pct'),
        scoreVataFill: document.getElementById('score-vata-fill'),
        scoreVataWeighted: document.getElementById('score-vata-weighted'),
        scoreVataRaw: document.getElementById('score-vata-raw'),
        
        scorePittaPct: document.getElementById('score-pitta-pct'),
        scorePittaFill: document.getElementById('score-pitta-fill'),
        scorePittaWeighted: document.getElementById('score-pitta-weighted'),
        scorePittaRaw: document.getElementById('score-pitta-raw'),
        
        scoreKaphaPct: document.getElementById('score-kapha-pct'),
        scoreKaphaFill: document.getElementById('score-kapha-fill'),
        scoreKaphaWeighted: document.getElementById('score-kapha-weighted'),
        scoreKaphaRaw: document.getElementById('score-kapha-raw'),
        
        recsAccordion: document.getElementById('recs-accordion-container')
    };

    // ----------------------------------------------------
    // Event Listeners & Setup
    // ----------------------------------------------------
    function init() {
        // Welcome and Consent
        dom.btnStartApp.addEventListener('click', () => switchView('consent'));
        dom.consentCheck.addEventListener('change', toggleConsentBtn);
        dom.nameInput.addEventListener('input', toggleConsentBtn);
        dom.btnConsentBack.addEventListener('click', () => switchView('welcome'));
        dom.btnConsentNext.addEventListener('click', () => {
            state.participantName = dom.nameInput.value.trim() || 'Participant';
            state.consentGiven = dom.consentCheck.checked;
            switchView('general');
        });

        // General Info view listeners
        dom.btnStepGenBack.addEventListener('click', () => switchView('consent'));
        dom.btnStepGenNext.addEventListener('click', () => switchView('physical'));
        
        // Listeners for live computations
        const liveInputs = [dom.weightInput, dom.heightInput, dom.palmInput, dom.appearanceSelect, dom.healthyWeightInput];
        liveInputs.forEach(el => el.addEventListener('input', runLiveCalculations));
        dom.appearanceSelect.addEventListener('change', () => {
            if (dom.appearanceSelect.value === 'no') {
                dom.healthyWeightBox.style.display = 'block';
            } else {
                dom.healthyWeightBox.style.display = 'none';
            }
            runLiveCalculations();
        });

        // Step routing buttons
        dom.btnStepPhysBack.addEventListener('click', () => switchView('general'));
        dom.btnStepPhysNext.addEventListener('click', () => switchView('physiological'));
        dom.btnStepPhysioBack.addEventListener('click', () => switchView('physical'));
        dom.btnStepPhysioNext.addEventListener('click', () => switchView('psychological'));
        
        // Cognitive Section Buttons
        dom.btnStartComp.addEventListener('click', startComprehensionTest);
        dom.btnFinishReading.addEventListener('click', finishReadingStory);
        
        dom.btnStepPsychBack.addEventListener('click', () => switchView('physiological'));
        dom.btnStepPsychNext.addEventListener('click', () => {
            // Read triangle counting manual input
            state.selections['puzzle-shapes'] = parseInt(dom.triangleInput.value) || 0;
            switchView('behavioral');
        });
        
        dom.btnStepBehavBack.addEventListener('click', () => switchView('psychological'));
        dom.btnStepBehavNext.addEventListener('click', () => {
            calculateAndShowResults();
            switchView('results');
        });

        dom.btnRestart.addEventListener('click', resetApp);

        // Language Selector listeners
        dom.btnLangEn.addEventListener('click', () => setComprehensionLanguage('en'));
        dom.btnLangHi.addEventListener('click', () => setComprehensionLanguage('hi'));
        setComprehensionLanguage('en');

        // Standard setup of interactive question options
        setupOptionHandlers();
        setupCognitivePuzzles();

        // Run live calculations initially to set up placeholders
        runLiveCalculations();
    }

    // ----------------------------------------------------
    // Layout and Wizard Navigation
    // ----------------------------------------------------
    function switchView(targetName) {
        // Toggle view active states
        Object.keys(dom.views).forEach(key => {
            if (key === targetName) {
                dom.views[key].classList.add('active');
            } else {
                dom.views[key].classList.remove('active');
            }
        });

        // Stepper updates
        if (targetName === 'welcome' || targetName === 'consent') {
            dom.stepper.style.display = 'none';
        } else {
            dom.stepper.style.display = 'block';
            let stepNum = 1;
            if (targetName === 'physical') stepNum = 2;
            if (targetName === 'physiological') stepNum = 3;
            if (targetName === 'psychological') stepNum = 4;
            if (targetName === 'behavioral') stepNum = 5;
            if (targetName === 'results') stepNum = 6;
            updateStepper(stepNum);
        }
        
        // Scroll to container top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateStepper(activeStep) {
        state.currentStep = activeStep;
        
        // Update nodes classes
        dom.stepNodes.forEach(node => {
            const nodeStep = parseInt(node.getAttribute('data-step'));
            node.classList.remove('active', 'completed');
            
            if (nodeStep === activeStep) {
                node.classList.add('active');
            } else if (nodeStep < activeStep) {
                node.classList.add('completed');
            }
        });

        // Fill bar length
        const pct = ((activeStep - 1) / 5) * 100;
        dom.progressFill.style.width = `${pct}%`;
    }

    function toggleConsentBtn() {
        const nameFilled = dom.nameInput.value.trim().length > 0;
        const checked = dom.consentCheck.checked;
        dom.btnConsentNext.disabled = !(nameFilled && checked);
    }

    // ----------------------------------------------------
    // Live Ayurvedic Anthropometric Calculations
    // ----------------------------------------------------
    function runLiveCalculations() {
        state.weight = parseFloat(dom.weightInput.value) || 65;
        state.height = parseFloat(dom.heightInput.value) || 165;
        state.palmBreadth = parseFloat(dom.palmInput.value) || 7.5;
        state.appearanceSame = dom.appearanceSelect.value;
        state.healthyWeight = parseFloat(dom.healthyWeightInput.value) || 65;

        // 1. BMI Calculation (incorporating exclusions)
        let calcWeight = state.weight;
        if (state.appearanceSame === 'no') {
            calcWeight = state.healthyWeight; // Use historical healthy weight
        }
        
        const bmi = calcWeight / Math.pow(state.height / 100, 2);
        let bmiCategory = 'Normal';
        let builtClass = 'None (0 mark)';
        
        if (bmi < 18.5) {
            bmiCategory = 'Underweight';
            builtClass = 'Apachita (Thin) - Vata = 1 mark';
        } else if (bmi >= 25.0) {
            bmiCategory = 'Overweight / Obese';
            builtClass = 'Upachita (Well-built) - Kapha = 1 mark';
        }

        dom.calcBmi.textContent = `${bmi.toFixed(2)} (${bmiCategory})`;
        dom.calcBuiltClass.textContent = builtClass;

        // 2. Angulapramana Height Calculations
        // bread of 4 fingers of dominant hand = palm breadth.
        // Angulapramana = palm breadth / 4
        const angulaVal = state.palmBreadth / 4;
        const stdHeightCm = angulaVal * 84;
        const shortThreshold = angulaVal * 80;
        const tallThreshold = angulaVal * 88;

        dom.calcStdHeight.textContent = `${stdHeightCm.toFixed(1)} cm`;
        dom.calcStdRange.textContent = `${shortThreshold.toFixed(1)} cm (Short) - ${tallThreshold.toFixed(1)} cm (Tall)`;

        let heightClass = 'Medium (0 mark)';
        if (state.height < shortThreshold) {
            heightClass = 'Hrasva (Short Height) - Vata = 1 mark';
        } else if (state.height > tallThreshold) {
            heightClass = 'Deergha (Tall Height) - Vata = 1 mark';
        }
        dom.calcHeightClass.textContent = heightClass;
    }

    // ----------------------------------------------------
    // Interactive Question Button Setup
    // ----------------------------------------------------
    function setupOptionHandlers() {
        // Handle regular option buttons
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Prevent form submits
                e.preventDefault();
                
                const parentCard = btn.closest('.question-card');
                const predictor = parentCard.getAttribute('data-predictor');
                const val = btn.getAttribute('data-val');

                // Clear previous selections in this card
                parentCard.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                
                // Select this one
                btn.classList.add('selected');
                state.selections[predictor] = val;
            });
        });

        // Handle visual card choices (e.g. Skin color)
        const visualCards = document.querySelectorAll('.visual-choice-card');
        visualCards.forEach(card => {
            card.addEventListener('click', () => {
                const parentCard = card.closest('.question-card');
                const predictor = parentCard.getAttribute('data-predictor');
                const val = card.getAttribute('data-val');

                parentCard.querySelectorAll('.visual-choice-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                state.selections[predictor] = val;
            });
        });
    }

    // ----------------------------------------------------
    // Cognitive Puzzles Setup (Step 4)
    // ----------------------------------------------------
    function setupCognitivePuzzles() {
        // Series completion option handlers (Treated similar to MCQ options)
        const seriesCard = document.querySelector('[data-puzzle="series"]');
        seriesCard.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                seriesCard.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                state.selections['puzzle-series'] = btn.getAttribute('data-val');
            });
        });

        // Render Memory Recall choices (shuffled target + distractor options)
        const allSingle = shuffle([...MEMORY_WORDS.single, ...MEMORY_WORDS.singleDistractors]);
        const allPairs = shuffle([...MEMORY_WORDS.pair, ...MEMORY_WORDS.pairDistractors]);

        // Render singles
        allSingle.forEach(word => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="option-circle"></span>${word}`;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                btn.classList.toggle('selected');
                const index = state.memorySingleRecalled.indexOf(word);
                if (index > -1) {
                    state.memorySingleRecalled.splice(index, 1);
                } else {
                    state.memorySingleRecalled.push(word);
                }
            });
            dom.memorySingleOptions.appendChild(btn);
        });

        // Render pairs
        allPairs.forEach(pair => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="option-circle"></span>${pair}`;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                btn.classList.toggle('selected');
                const index = state.memoryPairRecalled.indexOf(pair);
                if (index > -1) {
                    state.memoryPairRecalled.splice(index, 1);
                } else {
                    state.memoryPairRecalled.push(pair);
                }
            });
            dom.memoryPairOptions.appendChild(btn);
        });
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ----------------------------------------------------
    // Grahya Shakti (Comprehension Story) Test Controllers
    // ----------------------------------------------------
    function setComprehensionLanguage(lang) {
        state.compLanguage = lang;
        if (lang === 'en') {
            dom.btnLangEn.classList.add('selected');
            dom.btnLangHi.classList.remove('selected');
        } else {
            dom.btnLangHi.classList.add('selected');
            dom.btnLangEn.classList.remove('selected');
        }
        // Update instructions and button text
        document.getElementById('comp-instructions-text').textContent = STORIES[lang].instructions;
        dom.btnStartComp.textContent = STORIES[lang].startBtn;
    }

    function startComprehensionTest() {
        state.compTestStarted = true;
        dom.compIntro.style.display = 'none';
        dom.compReading.style.display = 'block';
        
        // Hide language selector during test
        dom.compLangSelector.style.display = 'none';

        // Load story dynamically based on language
        document.querySelector('.story-text').innerHTML = STORIES[state.compLanguage].text;
        dom.btnFinishReading.textContent = STORIES[state.compLanguage].doneBtn;

        // Start timer
        state.compTimeLeft = 120;
        dom.compTimerText.textContent = state.compTimeLeft;
        
        state.compTimerInterval = setInterval(() => {
            state.compTimeLeft--;
            dom.compTimerText.textContent = state.compTimeLeft;
            if (state.compTimeLeft <= 0) {
                finishReadingStory();
            }
        }, 1000);
    }

    function finishReadingStory() {
        if (state.compTimerInterval) {
            clearInterval(state.compTimerInterval);
        }
        state.compTestFinished = true;
        dom.compReading.style.display = 'none';
        dom.compQuiz.style.display = 'block';

        // Render MCQ questions dynamically
        dom.quizQuestionsBox.innerHTML = '';
        const activeQuestions = STORIES[state.compLanguage].questions;
        activeQuestions.forEach((qObj, qIdx) => {
            const qRow = document.createElement('div');
            qRow.className = 'story-q-row';
            
            const qText = document.createElement('div');
            qText.className = 'story-q-text';
            qText.textContent = qObj.q;
            qRow.appendChild(qText);

            const optionsGrid = document.createElement('div');
            optionsGrid.className = 'options-grid';

            qObj.options.forEach((optText, optIdx) => {
                const optBtn = document.createElement('button');
                optBtn.className = 'option-btn';
                optBtn.innerHTML = `<span class="option-circle"></span>${optText}`;
                optBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    optionsGrid.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                    optBtn.classList.add('selected');
                    state.compAnswers[qIdx] = optIdx;
                });
                optionsGrid.appendChild(optBtn);
            });

            qRow.appendChild(optionsGrid);
            dom.quizQuestionsBox.appendChild(qRow);
        });
    }

    // ----------------------------------------------------
    // Tally Raw Scores and Normalize
    // ----------------------------------------------------
    function calculateAndShowResults() {
        let vataRaw = 0;
        let pittaRaw = 0;
        let kaphaRaw = 0;

        // ----------------------------------------------------
        // 1. General & Physical (Morphological) Traits Tally
        // ----------------------------------------------------
        
        // 1.1 Built (BMI)
        const bmiWeight = state.appearanceSame === 'no' ? state.healthyWeight : state.weight;
        const bmi = bmiWeight / Math.pow(state.height / 100, 2);
        if (bmi < 18.5) vataRaw += 1;
        if (bmi >= 25.0) kaphaRaw += 1;

        // 1.2 Height (Angulapramana)
        const angulaVal = state.palmBreadth / 4;
        const shortLimit = angulaVal * 80;
        const tallLimit = angulaVal * 88;
        if (state.height < shortLimit || state.height > tallLimit) {
            vataRaw += 1; // Both tall and short heights give Vata = 1 mark
        }

        // 1.3 Appearance (Tendons & Veins)
        if (state.selections['prominent-tendons'] === 'yes') vataRaw += 1;

        // 1.4 Delicate body (Sukumara gatra)
        if (state.selections['sukumara-gatra'] === 'pitta') pittaRaw += 1;
        if (state.selections['sukumara-gatra'] === 'kapha') kaphaRaw += 1;
        if (state.selections['sukumara-gatra'] === 'both') {
            pittaRaw += 1;
            kaphaRaw += 1;
        }

        // 1.5 Forehead (Maha-lalata)
        if (state.selections['broad-forehead'] === 'yes') kaphaRaw += 1;

        // 1.6 Skin color
        if (state.selections['skin-color'] === 'vata') vataRaw += 1;
        if (state.selections['skin-color'] === 'pitta') pittaRaw += 1;
        if (state.selections['skin-color'] === 'kapha') kaphaRaw += 1;

        // 1.7 Skin texture
        if (state.selections['skin-texture'] === 'vata') vataRaw += 1;
        if (state.selections['skin-texture'] === 'kapha') kaphaRaw += 1;

        // 1.8 Moles & Pimples
        if (state.selections['skin-moles'] === 'yes') pittaRaw += 1;

        // 1.9 Wrinkles
        if (state.selections['skin-wrinkles'] === 'yes') pittaRaw += 1;

        // 1.10 Feel on touch / Ulceration
        if (state.selections['skin-temp'] === 'pitta') pittaRaw += 1; // Ushmanga / Ushnamukha
        if (state.selections['skin-temp'] === 'kapha') kaphaRaw += 1; // Alpasantapa

        // 1.11 Joints Undue Movement
        if (state.selections['joint-movement'] === 'yes') vataRaw += 1;

        // 1.12 Joints Sound on Movement
        if (state.selections['joint-sound'] === 'yes') vataRaw += 1;

        // 1.13 Muscle laxity
        if (state.selections['muscle-laxity'] === 'yes') pittaRaw += 1;

        // 1.14 Eyes size
        if (state.selections['eye-size'] === 'small') {
            vataRaw += 1;
            pittaRaw += 1;
        }
        if (state.selections['eye-size'] === 'big') kaphaRaw += 1;

        // 1.15 Eyes texture (dryness)
        if (state.selections['eye-texture'] === 'yes') vataRaw += 1;

        // 1.16 Eyes sclera color
        if (state.selections['eye-color'] === 'vata') vataRaw += 1;
        if (state.selections['eye-color'] === 'pitta') pittaRaw += 1;
        if (state.selections['eye-color'] === 'kapha') kaphaRaw += 1;

        // 1.17 Eye movement (Chala drishti)
        if (state.selections['eye-movement'] === 'yes') vataRaw += 1;

        // 1.18 Eye reddening
        if (state.selections['eye-reddening'] === 'yes') pittaRaw += 1;

        // 1.19 Eye lashes
        if (state.selections['eye-lashes'] === 'pitta') pittaRaw += 1;
        if (state.selections['eye-lashes'] === 'kapha') kaphaRaw += 1;

        // 1.20 Hair texture
        if (state.selections['hair-texture'] === 'vata') vataRaw += 1;
        if (state.selections['hair-texture'] === 'pitta') pittaRaw += 1;
        if (state.selections['hair-texture'] === 'kapha') kaphaRaw += 1;

        // 1.21 Hair color
        if (state.selections['hair-color'] === 'vata') vataRaw += 1;
        if (state.selections['hair-color'] === 'pitta') pittaRaw += 1;
        if (state.selections['hair-color'] === 'kapha') kaphaRaw += 1;

        // 1.22 Curly hair
        if (state.selections['hair-curly'] === 'yes') kaphaRaw += 1;

        // 1.23 Hair fall & greying
        if (state.selections['hair-loss'] === 'yes') pittaRaw += 1;

        // 1.24 Hair density
        if (state.selections['hair-density'] === 'scanty') {
            vataRaw += 1;
            pittaRaw += 1;
        }
        if (state.selections['hair-density'] === 'dense') kaphaRaw += 1;

        // 1.25 Teeth texture
        if (state.selections['teeth-texture'] === 'yes') vataRaw += 1;

        // 1.26 Teeth size
        if (state.selections['teeth-size'] === 'yes') vataRaw += 1;

        // 1.27 Nails size
        if (state.selections['nails-size'] === 'vata') vataRaw += 1;
        if (state.selections['nails-size'] === 'kapha') kaphaRaw += 1;

        // 1.28 Nails texture
        if (state.selections['nails-texture'] === 'yes') vataRaw += 1;

        // 1.29 Nails color
        if (state.selections['nails-color'] === 'yes') pittaRaw += 1;

        // Max possible Physical Raw: Vata = 18, Pitta = 15, Kapha = 14

        // ----------------------------------------------------
        // 2. Physiological Traits Tally
        // ----------------------------------------------------
        
        // 2.1 Gait
        if (state.selections['gait'] === 'vata') vataRaw += 1;
        if (state.selections['gait'] === 'kapha') kaphaRaw += 1;

        // 2.2 Cheshta (initiation)
        if (state.selections['cheshta'] === 'vata') vataRaw += 1;
        if (state.selections['cheshta'] === 'kapha') kaphaRaw += 1;

        // 2.3 Voice quality
        if (state.selections['voice'] === 'vata') vataRaw += 1;
        if (state.selections['voice'] === 'kapha') kaphaRaw += 1;

        // 2.4 Appetite frequency
        if (state.selections['appetite-frequency'] === 'yes') pittaRaw += 1;

        // 2.5 Appetite quantity
        if (state.selections['appetite-quantity'] === 'both') {
            vataRaw += 1;
            pittaRaw += 1;
        }
        if (state.selections['appetite-quantity'] === 'kapha') kaphaRaw += 1;

        // 2.6 Appetite tolerance
        if (state.selections['appetite-tolerance'] === 'pitta') pittaRaw += 1;
        if (state.selections['appetite-tolerance'] === 'kapha') kaphaRaw += 1;

        // 2.7 Appetite speed
        if (state.selections['appetite-speed'] === 'vata') vataRaw += 1;
        if (state.selections['appetite-speed'] === 'kapha') kaphaRaw += 1;

        // 2.8 Thirst reaction, quantity, frequency
        // For Pitta: if any of the reaction (yes), quantity (pitta) or frequency (pitta) is positive -> Pitta += 1 (max 1 mark)
        const pittaThirst = (state.selections['thirst-reaction'] === 'yes') || 
                            (state.selections['thirst-quantity'] === 'pitta') || 
                            (state.selections['thirst-frequency'] === 'pitta');
        if (pittaThirst) pittaRaw += 1;

        // For Kapha: if quantity (kapha) or frequency (kapha) -> Kapha += 1 (max 1 mark)
        const kaphaThirst = (state.selections['thirst-quantity'] === 'kapha') || 
                            (state.selections['thirst-frequency'] === 'kapha');
        if (kaphaThirst) kaphaRaw += 1;

        // 2.9 Stool quantity & ease
        if (state.selections['stool'] === 'yes') pittaRaw += 1;

        // 2.10 Sweat quantity
        if (state.selections['sweat-quantity'] === 'pitta') pittaRaw += 1;
        if (state.selections['sweat-quantity'] === 'kapha') kaphaRaw += 1;

        // 2.11 Sweat odour
        if (state.selections['sweat-odour'] === 'yes') pittaRaw += 1;

        // 2.12 Sleep easy awakening / less sleep
        // Vata: Jagaruka (yes) and/or Alpanidra (yes) -> Vata += 1 (max 1 mark)
        const vataSleep = (state.selections['sleep-awakening'] === 'yes') || 
                          (state.selections['sleep-hours'] === 'yes');
        if (vataSleep) vataRaw += 1;

        // Kapha: Nidrapriya (yes) -> Kapha += 1
        if (state.selections['sleep-liking'] === 'yes') kaphaRaw += 1;

        // 2.13 Dreams
        if (state.selections['sleep-dreams'] === 'vata') vataRaw += 1;
        if (state.selections['sleep-dreams'] === 'pitta') pittaRaw += 1;
        if (state.selections['sleep-dreams'] === 'kapha') kaphaRaw += 1;

        // Max possible Physiological Raw: Vata = 7, Pitta = 8, Kapha = 10

        // ----------------------------------------------------
        // 3. Cognitive / Psychological Traits Tally
        // ----------------------------------------------------
        
        // 3.1 Indecisiveness
        if (state.selections['indecisiveness'] === 'yes') vataRaw += 1;

        // 3.2 Friendship
        if (state.selections['friendship'] === 'vata') vataRaw += 1;
        if (state.selections['friendship'] === 'kapha') kaphaRaw += 1;

        // 3.3 Comprehension (Grahya Shakti) quiz scoring
        let quizCorrect = 0;
        const activeQuestions = STORIES[state.compLanguage || 'en'].questions;
        activeQuestions.forEach((qObj, qIdx) => {
            if (state.compAnswers[qIdx] === qObj.correct) {
                quizCorrect++;
            }
        });
        if (quizCorrect >= 6) {
            vataRaw += 1; // Shrutagrahi
        } else {
            kaphaRaw += 1; // Chiragrahi
        }

        // 3.4 Memory (Smriti) delayed recall scoring
        let correctSingleCount = 0;
        let correctPairCount = 0;
        
        state.memorySingleRecalled.forEach(w => {
            if (MEMORY_WORDS.single.includes(w)) correctSingleCount++;
        });
        state.memoryPairRecalled.forEach(p => {
            if (MEMORY_WORDS.pair.includes(p)) correctPairCount++;
        });

        // 4+ single words AND 3+ pairs recalled correctly -> Smritimaan (Kapha = 1)
        // Else -> Alpa/Chala smriti (Vata = 1)
        if (correctSingleCount >= 4 && correctPairCount >= 3) {
            kaphaRaw += 1;
        } else {
            vataRaw += 1;
        }

        // 3.5 Intelligence (Medha)
        // Nipunamati / Medhavi / Dhiman: Pitta = 1 mark if series completion is correct OR 12-15 differences are spotted
        const medhavi = (state.selections['puzzle-series'] === 'correct') || 
                        (state.selections['puzzle-differences-spot'] === 'correct');
        if (medhavi) {
            pittaRaw += 1;
        }
        
        // Buddhiyukta: Pitta = 1 mark, Kapha = 1 mark if four-sided shapes count is between 26 and 30
        const buddhiyukta = (state.selections['puzzle-shapes'] >= 26 && state.selections['puzzle-shapes'] <= 30);
        if (buddhiyukta) {
            pittaRaw += 1;
            kaphaRaw += 1;
        }

        // 3.6 Temperament (Krodha)
        if (state.selections['krodha'] === 'krodhi' || state.selections['krodha'] === 'kshipra') {
            pittaRaw += 1;
        }
        if (state.selections['krodha'] === 'alpa') {
            kaphaRaw += 1;
        }

        // Max possible Psychological Raw: Vata = 4, Pitta = 3, Kapha = 5

        // ----------------------------------------------------
        // 4. Behavioral Traits Tally
        // ----------------------------------------------------
        
        // 4.1 Way of talking
        if (state.selections['speech-nature'] === 'vata') vataRaw += 1;
        if (state.selections['speech-nature'] === 'kapha') kaphaRaw += 1;

        // 4.2 Profound orator or dominant speaker (Max 1 mark to Pitta)
        if (state.selections['orator-dominant'] === 'yes') {
            pittaRaw += 1;
        }

        // 4.3 Bravery & valour
        if (state.selections['valour'] === 'yes') {
            pittaRaw += 1;
        }

        // 4.4 Food temperature likings
        if (state.selections['likings'] === 'pitta') pittaRaw += 1;
        if (state.selections['likings'] === 'vata') vataRaw += 1;

        // 4.5 Strong enmity
        if (state.selections['enmity'] === 'yes') kaphaRaw += 1;

        // 4.6 Politeness & humility
        if (state.selections['politeness'] === 'yes') kaphaRaw += 1;

        // Max possible Behavioral Raw: Vata = 2, Pitta = 3, Kapha = 3

        // ----------------------------------------------------
        // Weighted Score Normalizations
        // ----------------------------------------------------
        // Vata: total 31 predictors
        // Pitta: total 29 predictors
        // Kapha: total 32 predictors
        const wVata = (vataRaw / 31) * (100 / 3);
        const wPitta = (pittaRaw / 29) * (100 / 3);
        const wKapha = (kaphaRaw / 32) * (100 / 3);

        const wSum = wVata + wPitta + wKapha;
        
        let pctVata = 33.33;
        let pctPitta = 33.33;
        let pctKapha = 33.33;

        if (wSum > 0) {
            pctVata = (wVata / wSum) * 100;
            pctPitta = (wPitta / wSum) * 100;
            pctKapha = (wKapha / wSum) * 100;
        }

        // Save scores
        state.results = {
            raw: { vata: vataRaw, pitta: pittaRaw, kapha: kaphaRaw },
            weighted: { vata: wVata, pitta: wPitta, kapha: wKapha },
            percentage: { vata: pctVata, pitta: pctPitta, kapha: pctKapha }
        };

        // ----------------------------------------------------
        // Table 1 Classification Engine
        // ----------------------------------------------------
        const doshas = [
            { name: 'Vata', pct: pctVata, raw: vataRaw },
            { name: 'Pitta', pct: pctPitta, raw: pittaRaw },
            { name: 'Kapha', pct: pctKapha, raw: kaphaRaw }
        ];

        // Sort descending by percentage
        doshas.sort((a, b) => b.pct - a.pct);

        const first = doshas[0];
        const second = doshas[1];
        const third = doshas[2];

        let finalDiagnosis = 'SANSARGAJA (DVANDAJA)';
        let diagnosisCode = 'Vata-Pitta'; // placeholder
        let description = '';

        // Samadoshaja rule: All three fall in 30% - 34% range
        const isSama = (pctVata >= 30 && pctVata <= 34) && 
                       (pctPitta >= 30 && pctPitta <= 34) && 
                       (pctKapha >= 30 && pctKapha <= 34);

        // Eka-Doshaja rule:
        // 1st dominant > 50% AND (difference between 1st & 2nd > 25% OR 2nd and 3rd are both in 18%-27%)
        const isEka = (first.pct > 50) && 
                      ((first.pct - second.pct > 25) || 
                       (second.pct >= 18 && second.pct <= 27 && third.pct >= 18 && third.pct <= 27));

        if (isSama) {
            finalDiagnosis = 'SAMA-DOSHAJA';
            diagnosisCode = 'Vata - Pitta - Kapha';
            description = 'Your constitution shows a rare, highly balanced representation of all three doshas (Vata, Pitta, and Kapha). This represents optimal baseline homeostasis, where no single doshic energy dominates.';
        } else if (isEka) {
            finalDiagnosis = `EKA-DOSHAJA (${first.name.toUpperCase()})`;
            diagnosisCode = first.name;
            description = `Your constitution shows a strong, singular dominance of ${first.name} dosha (>50% weighting). Your physical, physiological, and cognitive parameters align heavily with the qualities of ${first.name}.`;
        } else {
            // Sansargaja (Dvandvaja)
            // Dominant written first
            // If percentages are equal, raw score breaks ties. If raw scores are also equal, sort by predefined names
            let d1 = first;
            let d2 = second;

            if (Math.abs(first.pct - second.pct) < 0.001) {
                // equal percentage, check raw
                if (second.raw > first.raw) {
                    d1 = second;
                    d2 = first;
                }
            }

            finalDiagnosis = `SANSARGAJA (${d1.name.toUpperCase()} - ${d2.name.toUpperCase()})`;
            diagnosisCode = `${d1.name} - ${d2.name}`;
            description = `Your constitution shows a combined dominance of ${d1.name} and ${d2.name} doshas. This dual-doshic (Dvandvaja) constitution represents a dynamic blend of the dry, mobile qualities of Vata, hot/energetic qualities of Pitta, or structural/stable qualities of Kapha.`;
        }

        // Write outputs to UI
        dom.resName.textContent = `Participant: ${state.participantName}`;
        dom.diagnosisText.textContent = diagnosisCode.toUpperCase();
        
        let subTitleText = `${finalDiagnosis} constitutional profile.`;
        dom.diagnosisDesc.innerHTML = `<strong>${subTitleText}</strong><br>${description}`;

        // Raw and normalized numbers rendering
        dom.scoreVataPct.textContent = `${pctVata.toFixed(1)}%`;
        dom.scoreVataFill.style.width = `${pctVata}%`;
        dom.scoreVataWeighted.textContent = wVata.toFixed(2);
        dom.scoreVataRaw.textContent = vataRaw;

        dom.scorePittaPct.textContent = `${pctPitta.toFixed(1)}%`;
        dom.scorePittaFill.style.width = `${pctPitta}%`;
        dom.scorePittaWeighted.textContent = wPitta.toFixed(2);
        dom.scorePittaRaw.textContent = pittaRaw;

        dom.scoreKaphaPct.textContent = `${pctKapha.toFixed(1)}%`;
        dom.scoreKaphaFill.style.width = `${pctKapha}%`;
        dom.scoreKaphaWeighted.textContent = wKapha.toFixed(2);
        dom.scoreKaphaRaw.textContent = kaphaRaw;

        // Render SVG donut chart
        renderSVGDonut(pctVata, pctPitta, pctKapha);

        // Render Recommendations
        renderRecommendations(d1 = first, d2 = second, isEka, isSama);
    }

    // ----------------------------------------------------
    // SVG Donut Chart Renderer
    // ----------------------------------------------------
    function renderSVGDonut(vPct, pPct, kPct) {
        // Simple SVG donut logic
        const radius = 70;
        const cx = 100;
        const cy = 100;
        const strokeWidth = 24;
        const circumference = 2 * Math.PI * radius;

        // Calculate stroke offsets based on percentages
        const vOffset = circumference - (vPct / 100) * circumference;
        const pOffset = circumference - (pPct / 100) * circumference;
        const kOffset = circumference - (kPct / 100) * circumference;

        // Start angles
        const vRotation = -90; // Top
        const pRotation = vRotation + (vPct / 100) * 360;
        const kRotation = pRotation + (pPct / 100) * 360;

        dom.donutChart.innerHTML = `
            <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="var(--bg-base)" stroke-width="${strokeWidth + 2}" />
            
            <!-- Vata segment -->
            <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" 
                stroke="var(--accent-vata)" 
                stroke-width="${strokeWidth}" 
                stroke-dasharray="${circumference}" 
                stroke-dashoffset="${vOffset}"
                transform="rotate(${vRotation} ${cx} ${cy})" />
                
            <!-- Pitta segment -->
            <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" 
                stroke="var(--accent-pitta)" 
                stroke-width="${strokeWidth}" 
                stroke-dasharray="${circumference}" 
                stroke-dashoffset="${pOffset}"
                transform="rotate(${pRotation} ${cx} ${cy})" />
                
            <!-- Kapha segment -->
            <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" 
                stroke="var(--accent-kapha)" 
                stroke-width="${strokeWidth}" 
                stroke-dasharray="${circumference}" 
                stroke-dashoffset="${kOffset}"
                transform="rotate(${kRotation} ${cx} ${cy})" />

            <!-- Center text -->
            <circle cx="${cx}" cy="${cy}" r="${radius - strokeWidth/2 - 2}" fill="var(--bg-surface)" />
            <text x="${cx}" y="${cy - 8}" text-anchor="middle" fill="var(--text-secondary)" font-size="10" font-family="var(--font-sans)">CONSTITUTION</text>
            <text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="var(--primary)" font-size="16" font-family="var(--font-serif)" font-weight="bold">PROFILE</text>
        `;
    }

    // ----------------------------------------------------
    // Recommendations Rendering
    // ----------------------------------------------------
    function renderRecommendations(primaryD, secondaryD, isEka, isSama) {
        dom.recsAccordion.innerHTML = '';
        
        let targetDoshas = [];
        if (isSama) {
            targetDoshas = ['Vata', 'Pitta', 'Kapha'];
        } else if (isEka) {
            targetDoshas = [primaryD.name];
        } else {
            // Dvandvaja: Show both but highlight primary first
            targetDoshas = [primaryD.name, secondaryD.name];
        }

        targetDoshas.forEach((doshaName, dIdx) => {
            const data = RECOMMENDATIONS[doshaName];

            // Build diet HTML list
            const dietHTML = data.diet.map(item => `<li>${item}</li>`).join('');
            const lifestyleHTML = data.lifestyle.map(item => `<li>${item}</li>`).join('');
            const seasonalHTML = data.seasonal.map(item => `<li>${item}</li>`).join('');

            const tab = document.createElement('div');
            tab.className = `accordion-tab ${dIdx === 0 ? 'open' : ''}`;
            tab.innerHTML = `
                <div class="accordion-header">
                    <span>${doshaName} Balancing Guidelines ${dIdx === 0 ? '(Primary Focus)' : '(Secondary Focus)'}</span>
                    <span class="accordion-arrow">▼</span>
                </div>
                <div class="accordion-content">
                    <h4 class="rec-title-bold">Dietary Guidelines (Ahara)</h4>
                    <ul class="bullet-list">${dietHTML}</ul>
                    <br>
                    <h4 class="rec-title-bold">Lifestyle & Exercise (Vihara)</h4>
                    <ul class="bullet-list">${lifestyleHTML}</ul>
                    <br>
                    <h4 class="rec-title-bold">Seasonal Adaptations (Ritucharya)</h4>
                    <ul class="bullet-list">${seasonalHTML}</ul>
                </div>
            `;

            // Toggle logic
            tab.querySelector('.accordion-header').addEventListener('click', () => {
                tab.classList.toggle('open');
            });

            dom.recsAccordion.appendChild(tab);
        });
    }

    // ----------------------------------------------------
    // Reset Assessment State
    // ----------------------------------------------------
    function resetApp() {
        // Clear state selections
        Object.keys(state.selections).forEach(k => {
            state.selections[k] = null;
        });

        // Reset text fields and inputs
        dom.nameInput.value = '';
        dom.consentCheck.checked = false;
        dom.weightInput.value = '65';
        dom.heightInput.value = '165';
        dom.palmInput.value = '7.5';
        dom.appearanceSelect.value = 'yes';
        dom.healthyWeightInput.value = '65';
        dom.healthyWeightBox.style.display = 'none';
        dom.triangleInput.value = '';
        
        // Reset selections elements
        document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.visual-choice-card').forEach(card => card.classList.remove('selected'));

        // Reset cognitive tests
        state.compTestStarted = false;
        state.compTestFinished = false;
        state.compAnswers = {};
        state.memorySingleRecalled = [];
        state.memoryPairRecalled = [];
        
        dom.compIntro.style.display = 'block';
        dom.compReading.style.display = 'none';
        dom.compQuiz.style.display = 'none';
        dom.compLangSelector.style.display = 'flex';
        setComprehensionLanguage('en');
        
        dom.memorySingleOptions.innerHTML = '';
        dom.memoryPairOptions.innerHTML = '';
        
        // Re-setup elements
        setupCognitivePuzzles();
        toggleConsentBtn();
        runLiveCalculations();

        // Switch to welcome view
        switchView('welcome');
    }

    // Start initialization
    init();
});
