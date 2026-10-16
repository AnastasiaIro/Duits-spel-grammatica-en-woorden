/* Audio Sound Effects (Lazy Initialized voor Browser-Compatibiliteit) */
let audioCtx = null;

function playSound(type) {
    try {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'correct') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
            osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'wrong') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.25);
        } else if (type === 'jump') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        }
    } catch (e) {
        console.warn('Audio effect error:', e);
    }
}

/* Fisher-Yates Shuffle voor willekeurige vragen */
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/* Vragenbank per Level (10 levels Klas 3 A2) */
const questionBank = [
    // LEVEL 1
    { level: 1, category: 'grammar', type: 'mc', question: 'Vul in: "Du ___ (heißen) Mark."', options: ['heißt', 'heißest', 'heißen', 'heiß'], correct: 0, explanation: 'Na een s-klank (ß) komt bij "du" alleen een -t.' },
    { level: 1, category: 'grammar', type: 'open', question: 'Vul in: "Wir ___ (sein) in der Schule."', answer: ['sind'], explanation: 'Het werkwoord sein: wir sind = wij zijn.' },
    { level: 1, category: 'words', type: 'mc', question: 'Wat betekent het Duitse woord "bellen"?', options: ['Blaffen', 'Opbellen', 'Aanbellen', 'Schreeuwen'], correct: 0, explanation: '"Bellen" betekent blaffen! Opbellen is anrufen.' },
    { level: 1, category: 'grammar', type: 'open', question: 'Vul in: "Er ___ (haben) zwei Brüder."', answer: ['hat'], explanation: 'Haben vervoegen: er/sie/es hat.' },
    { level: 1, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "De dag"', answer: ['der tag', 'tag'], explanation: 'De dag = der Tag.' },

    // LEVEL 2
    { level: 2, category: 'grammar', type: 'mc', question: 'Welke uitgang krijgt "ihr" bij regelmatige werkwoorden?', options: ['-t', '-st', '-en', '-e'], correct: 0, explanation: 'Bij "ihr" krijgt de stam de uitgang -t (ihr spielt).' },
    { level: 2, category: 'grammar', type: 'open', question: 'Vul in: "Ich ___ (wohnen) in Berlin."', answer: ['wohne'], explanation: 'Bij "ich" is de uitgang altijd -e (wohne).' },
    { level: 2, category: 'words', type: 'mc', question: 'Wat is de Duitse vertaling van "het station"?', options: ['der Bahnhof', 'die Station', 'der Flugsteig', 'das Gleis'], correct: 0, explanation: 'Het treinstation is "der Bahnhof".' },
    { level: 2, category: 'grammar', type: 'mc', question: 'Welk lidwoord hoort bij "Schule"?', options: ['die', 'der', 'das', 'dem'], correct: 0, explanation: 'Schule is vrouwelijk: die Schule.' },
    { level: 2, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "De trein"', answer: ['der zug', 'zug'], explanation: 'De trein = der Zug.' },

    // LEVEL 3
    { level: 3, category: 'words', type: 'mc', question: 'Wat betekent "das Meer" in het Nederlands?', options: ['De zee', 'Het meer', 'Een plas', 'Rivier'], correct: 0, explanation: '"Das Meer" is de zee. Het meer is "der See".' },
    { level: 3, category: 'grammar', type: 'mc', question: 'Welke naamval is het onderwerp van de zin?', options: ['1e naamval', '3e naamval', '4e naamval', '2e naamval'], correct: 0, explanation: 'Het onderwerp staat altijd in de 1e naamval (Nominativ).' },
    { level: 3, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "De doos" (Falsche Freund!)', answer: ['die schachtel', 'schachtel'], explanation: 'De doos = die Schachtel (geen Dose!).' },
    { level: 3, category: 'words', type: 'mc', question: 'Wat betekent het woord "klingeln"?', options: ['Aanbellen', 'Klinken', 'Klimmen', 'Zingen'], correct: 0, explanation: 'Klingeln = aanbellen.' },
    { level: 3, category: 'grammar', type: 'open', question: 'Vul in: "Ihr ___ (machen) Hausaufgaben."', answer: ['macht'], explanation: 'Ihr maakt: ihr macht.' },

    // LEVEL 4
    { level: 4, category: 'grammar', type: 'mc', question: 'Vul in: "Ich habe ___ (ein) Hund (m)." (4e nv)', options: ['einen', 'ein', 'einem', 'einer'], correct: 0, explanation: 'Lijdend voorwerp (4e naamval) mannelijk is "einen".' },
    { level: 4, category: 'grammar', type: 'mc', question: 'Welke vraag stel je om het lijdend voorwerp (4e nv) te vinden?', options: ['Wen oder was?', 'Wer oder was?', 'Wem?', 'Wo?'], correct: 0, explanation: '4e naamval vraag je met: Wen oder was?' },
    { level: 4, category: 'grammar', type: 'open', question: 'Vul in (4e nv): "Wir sehen ___ (der) Lehrer (m)."', answer: ['den'], explanation: 'Mannelijk in de 4e naamval verandert van der naar den.' },
    { level: 4, category: 'words', type: 'mc', question: 'Wat is "waarschijnlijk" in het Duits?', options: ['wahrscheinlich', 'vielleicht', 'unbedingt', 'sicherlich'], correct: 0, explanation: 'Waarschijnlijk = wahrscheinlich.' },
    { level: 4, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "Het bagage"', answer: ['das gepäck', 'gepäck'], explanation: 'Het bagage = das Gepäck.' },

    // LEVEL 5
    { level: 5, category: 'grammar', type: 'open', question: 'Vul in (Feesttentenregel): "Er ___ (arbeiten) viel."', answer: ['arbeitet'], explanation: 'Na een stam op -t of -d komt er een extra "e" voor de uitgang: arbeitet.' },
    { level: 5, category: 'grammar', type: 'mc', question: 'Vul in: "Ich ___ (können) gut Deutsch sprechen."', options: ['kann', 'könne', 'kannst', 'können'], correct: 0, explanation: 'Modaal werkwoord kunnen: ich kann, du kannst, er/sie/es kann.' },
    { level: 5, category: 'grammar', type: 'mc', question: 'Der-groep: "___ (Dieser) Mann (m) hilft mir." (Onderwerp)', options: ['Dieser', 'Diesen', 'Diesem', 'Diese'], correct: 0, explanation: 'Onderwerp = 1e naamval mannelijk -> Dieser.' },
    { level: 5, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "De schoolreis"', answer: ['die klassenfahrt', 'klassenfahrt'], explanation: 'De schoolreis = die Klassenfahrt.' },
    { level: 5, category: 'words', type: 'mc', question: 'Wat betekent "bekommen"?', options: ['Krijgen', 'Komen', 'Worden', 'Slaag behalen'], correct: 0, explanation: '"Bekommen" betekent krijgen (Falsche Freund!). Worden is werden.' },

    // LEVEL 6
    { level: 6, category: 'grammar', type: 'mc', question: 'Welke naamval is het meewerkend voorwerp?', options: ['3e naamval', '4e naamval', '1e naamval', '2e naamval'], correct: 0, explanation: 'Het meewerkend voorwerp staat in de 3e naamval (Dativ).' },
    { level: 6, category: 'grammar', type: 'mc', question: 'Ein-groep: "Er hilft ___ (seine) Mutter (f)." (3e nv)', options: ['seiner', 'seine', 'seinem', 'seinen'], correct: 0, explanation: 'Helfen eist de 3e naamval. Vrouwelijk 3e nv = seiner.' },
    { level: 6, category: 'grammar', type: 'open', question: 'Vul in: "Ich gebe ___ (der) Mann (m) ein Buch." (3e nv)', answer: ['dem'], explanation: 'Mannelijk 3e naamval verandert van der naar dem.' },
    { level: 6, category: 'words', type: 'mc', question: 'Wat betekent "erfolgreich"?', options: ['Succesvol', 'Gevaarlijk', 'Rijk', 'Eerlijk'], correct: 0, explanation: 'Erfolgreich = succesvol.' },
    { level: 6, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "Het uitje / de uitstap"', answer: ['der ausflug', 'ausflug'], explanation: 'Het uitje = der Ausflug.' },

    // LEVEL 7
    { level: 7, category: 'words', type: 'mc', question: 'Wat betekent "brav" in het Duits?', options: ['Braaf / gehoorzaam', 'Dapper / moedig', 'Druk', 'Stil'], correct: 0, explanation: '"Brav" betekent braaf. Dapper is "mutig"!' },
    { level: 7, category: 'grammar', type: 'open', question: 'Vul in (Der-groep): "Ich sehe ___ (jeder) Schüler (m)." (4e nv)', answer: ['jeden'], explanation: 'Lijdend voorwerp = 4e nv. Mannelijk krijgt -en (jeden).' },
    { level: 7, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "Het cijfer op school"', answer: ['die note', 'note'], explanation: 'Het cijfer = die Note.' },
    { level: 7, category: 'grammar', type: 'mc', question: 'Vul in: "Wir ___ (wollen) nach Hause gehen."', options: ['wollen', 'willen', 'wollt', 'will'], correct: 0, explanation: 'Wir wollen = wij willen.' },
    { level: 7, category: 'words', type: 'mc', question: 'Wat betekent "schlimm"?', options: ['Erg / erg ernstig', 'Slim / pienter', 'Slecht', 'Vies'], correct: 0, explanation: 'Schlimm = erg. Slim in het Duits is "schlau"!' },

    // LEVEL 8
    { level: 8, category: 'grammar', type: 'mc', question: 'Welke voorzetsels eisen ALTIJD de 4e naamval?', options: ['bis, durch, für, gegen, ohne, um', 'aus, bei, mit, nach, seit, von, zu', 'an, auf, hinter, in, neben', 'mit, ohne, nach, vor'], correct: 0, explanation: 'Ezelsbruggetje: DOGFU (durch, ohne, gegen, für, um + bis) = 4e naamval!' },
    { level: 8, category: 'grammar', type: 'open', question: 'Vul in: "Das Geschenk ist für ___ (der) Vater (m)."', answer: ['den'], explanation: '"Für" heeft de 4e naamval. Mannelijk 4e nv = den.' },
    { level: 8, category: 'words', type: 'mc', question: 'Wat betekent "verstehen"?', options: ['Begrijpen', 'Verstaan', 'Verstoppen', 'Vertellen'], correct: 0, explanation: 'Verstehen = begrijpen.' },
    { level: 8, category: 'grammar', type: 'mc', question: 'Vul in: "Wir fahren ohne ___ (unsere) Eltern (pl)."', options: ['unsere', 'unserer', 'unseren', 'unserem'], correct: 0, explanation: '"Ohne" + 4e naamval meervoud = onze -> unsere.' },
    { level: 8, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "Onmiddellijk / meteen"', answer: ['sofort'], explanation: 'Onmiddellijk = sofort.' },

    // LEVEL 9
    { level: 9, category: 'grammar', type: 'mc', question: 'Welke voorzetsels eisen ALTIJD de 3e naamval?', options: ['aus, bei, mit, nach, seit, von, zu', 'bis, durch, für, gegen, ohne, um', 'über, unter, vor, tussen', 'an, auf, in, neben'], correct: 0, explanation: 'Ezelsbrugje: "aus, bei, mit, nach, seit, von, zu" eisen altijd de 3e naamval!' },
    { level: 9, category: 'grammar', type: 'open', question: 'Vul in: "Ich wohne bei ___ (mein) Onkel (m)."', answer: ['meinem'], explanation: '"Bei" + 3e naamval mannelijk = meinem.' },
    { level: 9, category: 'words', type: 'mc', question: 'Wat betekent "angst haben"?', options: ['Bang zijn', 'Boos zijn', 'Honger hebben', 'Ziek zijn'], correct: 0, explanation: 'Angst haben = bang zijn.' },
    { level: 9, category: 'grammar', type: 'mc', question: 'Vul in: "Sie geht zu ___ (die) Oma (f)."', options: ['der', 'die', 'dem', 'den'], correct: 0, explanation: '"Zu" + 3e naamval vrouwelijk = der.' },
    { level: 9, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "Het avondeten"', answer: ['das abendessen', 'abendessen'], explanation: 'Het avondeten = das Abendessen.' },

    // LEVEL 10
    { level: 10, category: 'grammar', type: 'mc', question: 'Wanneer gebruik je bij keuzevoorzetsels de 3e naamval?', options: ['Bij rust / positie (Waar? / Wo?)', 'Bij beweging / richting (Waarheen? / Wohin?)', 'Bij tijdstip', 'Altijd'], correct: 0, explanation: 'Rust/positie (Wo?) = 3e naamval. Richting/beweging (Wohin?) = 4e naamval.' },
    { level: 10, category: 'grammar', type: 'open', question: 'Vul in (rust): "Das Buch liegt auf ___ (der) Tisch (m)."', answer: ['dem'], explanation: 'Rust (Waar ligt het?) = 3e naamval mannelijk -> dem.' },
    { level: 10, category: 'words', type: 'mc', question: 'Wat is de juiste vertaling van "gevaarlijk"?', options: ['gefährlich', 'gemütlich', 'pünktlich', 'vorsichtig'], correct: 0, explanation: 'Gevaarlijk = gefährlich.' },
    { level: 10, category: 'grammar', type: 'open', question: 'Vul in (beweging): "Ich gehe in ___ (die) Schule (f)."', answer: ['die'], explanation: 'Richting/beweging (Waarheen?) = 4e naamval vrouwelijk -> die.' },
    { level: 10, category: 'words', type: 'mc', question: 'Wat betekent "hoffen"?', options: ['Hopen', 'Hopen op feest', 'Rennen', 'Wachten'], correct: 0, explanation: 'Hoffen = hopen.' }
];

/* Game State Objects */
let state = {
    category: 'mix',
    mode: 'classic',
    currentLevel: 1,
    currentQuestionIdx: 0,
    levelQuestions: [],
    coins: parseInt(localStorage.getItem('dm_coins') || '0'),
    lives: 3,
    maxLives: parseInt(localStorage.getItem('dm_max_lives') || '3'),
    streak: 0,
    correctAnswersCount: 0,
    timer: null,
    timeLeft: 15,
    activeAvatar: localStorage.getItem('dm_avatar') || 'flag',
    activeTheme: localStorage.getItem('dm_theme') || 'default',
    boughtAvatars: JSON.parse(localStorage.getItem('dm_bought_avatars') || '["flag"]'),
    boughtThemes: JSON.parse(localStorage.getItem('dm_bought_themes') || '["default"]'),
    customWords: JSON.parse(localStorage.getItem('dm_custom_words') || '[]'),
    // Canvas animation
    playerX: 40,
    playerY: 130,
    targetX: 40,
    isJumping: false,
    jumpVy: 0,
    gravity: 0.6
};

/* Uitgebreide Shop Catalogus met Docenten Avatars */
const shopCatalog = {
    avatars: [
        { id: 'flag', name: 'Duitse Vlag 🇩🇪', price: 0, icon: '🇩🇪' },
        { id: 'frau_eggel', name: 'Frau Eggel-Blitz ⚡', price: 75, icon: '⚡' },
        { id: 'herr_van_de_broek', name: 'Herr Van De Broek-Boss 🎩', price: 75, icon: '🎩' },
        { id: 'king', name: 'Koning Meister 👑', price: 100, icon: '👑' },
        { id: 'fox', name: 'Slimme Vos 🦊', price: 150, icon: '🦊' },
        { id: 'rocket', name: 'Grammatica Raket 🚀', price: 200, icon: '🚀' },
        { id: 'pretzel', name: 'Beierse Pretzel 🥨', price: 250, icon: '🥨' },
        { id: 'ball', name: 'Bundesliga Bal ⚽', price: 300, icon: '⚽' },
        { id: 'sausage', name: 'Wurst-König 🌭', price: 350, icon: '🌭' },
        { id: 'brain', name: 'Einstein Deutsch 🧠', price: 400, icon: '🧠' },
        { id: 'hero', name: 'Super-Schüler 🦸', price: 500, icon: '🦸' }
    ],
    hearts: [
        { id: 'heart_plus', name: '+1 Extra Leven Passief', price: 200, icon: '💖', type: 'heart' }
    ],
    themes: [
        { id: 'default', name: 'Standaard Donker', price: 0, color: 'bg-slate-900' },
        { id: 'bavaria', name: 'Beieren Blauw', price: 150, color: 'bg-blue-900' },
        { id: 'berlin', name: 'Berlijn Neon', price: 200, color: 'bg-purple-900' },
        { id: 'forest', name: 'Zwarte Woud', price: 250, color: 'bg-emerald-950' }
    ]
};

function getActiveAvatarIcon() {
    const found = shopCatalog.avatars.find(a => a.id === state.activeAvatar || a.icon === state.activeAvatar);
    return found ? found.icon : '🇩🇪';
}

function updateCoinsDisplay() {
    const el = document.getElementById('bank-coins-display');
    if (el) el.innerText = state.coins;
    localStorage.setItem('dm_coins', state.coins.toString());
}

function showScreen(screenId) {
    ['screen-welcome', 'screen-game', 'screen-result'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    const targetEl = document.getElementById(screenId);
    if (targetEl) targetEl.classList.remove('hidden');

    const headerStats = document.getElementById('header-stats');
    if (headerStats) {
        if (screenId === 'screen-game') {
            headerStats.classList.remove('hidden');
        } else {
            headerStats.classList.add('hidden');
        }
    }
}

function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
    if (id === 'modal-shop') switchShopTab('avatars');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}

function selectCategory(cat) {
    state.category = cat;
    document.querySelectorAll('.cat-btn').forEach(b => {
        b.classList.remove('border-amber-400', 'bg-amber-500/20');
        b.classList.add('border-slate-600', 'bg-slate-700/50');
    });
    const targetBtn = document.getElementById(`btn-cat-${cat}`);
    if (targetBtn) {
        targetBtn.classList.remove('border-slate-600', 'bg-slate-700/50');
        targetBtn.classList.add('border-amber-400', 'bg-amber-500/20');
    }
}

function selectMode(mode) {
    state.mode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.remove('border-amber-400', 'bg-amber-500/20');
        b.classList.add('border-slate-600', 'bg-slate-700/50');
    });
    const targetBtn = document.getElementById(`btn-mode-${mode}`);
    if (targetBtn) {
        targetBtn.classList.remove('border-slate-600', 'bg-slate-700/50');
        targetBtn.classList.add('border-amber-400', 'bg-amber-500/20');
    }
}

/* Custom Words Manager */
function addCustomWord(e) {
    if (e) e.preventDefault();
    const deInput = document.getElementById('custom-de-input');
    const nlInput = document.getElementById('custom-nl-input');
    if (!deInput || !nlInput) return;

    const de = deInput.value.trim();
    const nl = nlInput.value.trim();
    if (!de || !nl) return;

    state.customWords.push({ de, nl });
    localStorage.setItem('dm_custom_words', JSON.stringify(state.customWords));
    deInput.value = '';
    nlInput.value = '';
    renderCustomWordsList();
}

function removeCustomWord(idx) {
    state.customWords.splice(idx, 1);
    localStorage.setItem('dm_custom_words', JSON.stringify(state.customWords));
    renderCustomWordsList();
}

function clearAllCustomWords() {
    if (confirm('Weet je zeker dat je al je eigen woorden wilt wissen?')) {
        state.customWords = [];
        localStorage.setItem('dm_custom_words', JSON.stringify([]));
        renderCustomWordsList();
    }
}

function renderCustomWordsList() {
    const container = document.getElementById('custom-words-list');
    const countDisplay = document.getElementById('custom-words-count');
    if (countDisplay) countDisplay.innerText = `${state.customWords.length} woorden opgeslagen`;
    if (!container) return;

    if (state.customWords.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-500 text-center py-4">Nog geen eigen woorden toegevoegd.</p>`;
        return;
    }

    container.innerHTML = state.customWords.map((w, idx) => `
        <div class="flex justify-between items-center bg-slate-900/80 px-3 py-2 rounded-xl text-xs border border-slate-700/60">
            <div>
                <span class="font-bold text-amber-400">${w.de}</span>
                <span class="text-slate-400 mx-1.5">•</span>
                <span class="text-slate-200">${w.nl}</span>
            </div>
            <button onclick="removeCustomWord(${idx})" class="text-slate-500 hover:text-rose-400"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
}

/* Winkelsysteem */
function switchShopTab(tab) {
    document.querySelectorAll('.shop-tab-btn').forEach(b => {
        b.classList.remove('bg-amber-500/20', 'text-amber-400', 'border-amber-500/40');
        b.classList.add('bg-slate-700/60', 'text-slate-400', 'border-slate-600');
    });

    const activeTabBtn = document.getElementById(`shop-tab-${tab}`);
    if (activeTabBtn) {
        activeTabBtn.classList.remove('bg-slate-700/60', 'text-slate-400', 'border-slate-600');
        activeTabBtn.classList.add('bg-amber-500/20', 'text-amber-400', 'border-amber-500/40');
    }

    const container = document.getElementById('shop-items-container');
    if (!container) return;

    if (tab === 'avatars') {
        container.innerHTML = shopCatalog.avatars.map(item => {
            const owned = state.boughtAvatars.includes(item.id) || item.price === 0;
            const active = state.activeAvatar === item.id;
            return `
                <div class="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="text-3xl">${item.icon}</span>
                        <div>
                            <h4 class="text-sm font-bold text-white">${item.name}</h4>
                            <span class="text-xs text-amber-400 font-bold">${owned ? 'Gekocht' : item.price + ' munten'}</span>
                        </div>
                    </div>
                    <button onclick="buyOrEquipAvatar('${item.id}',${item.price})" 
                        class="px-3 py-1.5 rounded-xl text-xs font-bold transition ${active ? 'bg-emerald-500 text-white' : owned ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-900'}">
                        ${active ? 'Actief' : owned ? 'Kiezen' : 'Kopen'}
                    </button>
                </div>
            `;
        }).join('');
    } else if (tab === 'hearts') {
        container.innerHTML = shopCatalog.hearts.map(item => `
            <div class="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between col-span-1 sm:col-span-2">
                <div class="flex items-center gap-3">
                    <span class="text-3xl">${item.icon}</span>
                    <div>
                        <h4 class