const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    try {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'correct') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
            osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start(); osc.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'wrong') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(220, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc.start(); osc.stop(audioCtx.currentTime + 0.25);
        } else if (type === 'jump') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(300, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start(); osc.stop(audioCtx.currentTime + 0.1);
        }
    } catch (e) {}
}

/* Fisher-Yates Shuffle algorithm for true randomness */
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const questionBank = [
    // LEVEL 1: Basiswoorden & werkwoorden sein/haben
    { level: 1, category: 'grammar', type: 'mc', question: 'Vul in: "Du ___ (heißen) Mark."', options: ['heißt', 'heißest', 'heißen', 'heiß'], correct: 0, explanation: 'Na een s-klank (ß) komt bij "du" alleen een -t.' },
    { level: 1, category: 'grammar', type: 'open', question: 'Vul in: "Wir ___ (sein) in der Schule."', answer: ['sind'], explanation: 'Het werkwoord sein: wir sind = wij zijn.' },
    { level: 1, category: 'words', type: 'mc', question: 'Wat betekent het Duitse woord "bellen"?', options: ['Blaffen', 'Opbellen', 'Aanbellen', 'Schreeuwen'], correct: 0, explanation: '"Bellen" betekent blaffen! Opbellen is anrufen.' },
    { level: 1, category: 'grammar', type: 'open', question: 'Vul in: "Er ___ (haben) zwei Brüder."', answer: ['hat'], explanation: 'Haben vervoegen: er/sie/es hat.' },
    { level: 1, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "De dag"', answer: ['der tag', 'tag'], explanation: 'De dag = der Tag.' },

    // LEVEL 2: Regelm. werkwoorden, pers. voornaamwoorden & basis lidwoorden
    { level: 2, category: 'grammar', type: 'mc', question: 'Welke uitgang krijgt "ihr" bij regelmatige werkwoorden?', options: ['-t', '-st', '-en', '-e'], correct: 0, explanation: 'Bij "ihr" krijgt de stam de uitgang -t (ihr spielt).' },
    { level: 2, category: 'grammar', type: 'open', question: 'Vul in: "Ich ___ (wohnen) in Berlin."', answer: ['wohne'], explanation: 'Bij "ich" is de uitgang altijd -e (wohne).' },
    { level: 2, category: 'words', type: 'mc', question: 'Wat is de Duitse vertaling van "het station"?', options: ['der Bahnhof', 'die Station', 'der Flugsteig', 'das Gleis'], correct: 0, explanation: 'Het treinstation is "der Bahnhof".' },
    { level: 2, category: 'grammar', type: 'mc', question: 'Welk lidwoord hoort bij "Schule"?', options: ['die', 'der', 'das', 'dem'], correct: 0, explanation: 'Schule is vrouwelijk: die Schule.' },
    { level: 2, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "De trein"', answer: ['der zug', 'zug'], explanation: 'De trein = der Zug.' },

    // LEVEL 3: Falsche freunde & Basiszinnen
    { level: 3, category: 'words', type: 'mc', question: 'Wat betekent "das Meer" in het Nederlands?', options: ['De zee', 'Het meer', 'Een plas', 'Rivier'], correct: 0, explanation: '"Das Meer" is de zee. Het meer is "der See".' },
    { level: 3, category: 'grammar', type: 'mc', question: 'Welke naamval is het onderwerp van de zin?', options: ['1e naamval', '3e naamval', '4e naamval', '2e naamval'], correct: 0, explanation: 'Het onderwerp staat altijd in de 1e naamval (Nominativ).' },
    { level: 3, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "De doos" (Falsche Freund!)', answer: ['die schachtel', 'schachtel'], explanation: 'De doos = die Schachtel (geen Dose!).' },
    { level: 3, category: 'words', type: 'mc', question: 'Wat betekent het woord "klingeln"?', options: ['Aanbellen', 'Klinken', 'Klimmen', 'Zingen'], correct: 0, explanation: 'Klingeln = aanbellen.' },
    { level: 3, category: 'grammar', type: 'open', question: 'Vul in: "Ihr ___ (machen) Hausaufgaben."', answer: ['macht'], explanation: 'Ihr maakt: ihr macht.' },

    // LEVEL 4: Nominativ vs Akkusativ (1e nv vs 4e nv) & der/ein-groep
    { level: 4, category: 'grammar', type: 'mc', question: 'Vul in: "Ich habe ___ (ein) Hund (m)." (4e nv)', options: ['einen', 'ein', 'einem', 'einer'], correct: 0, explanation: 'Lijdend voorwerp (4e naamval) mannelijk is "einen".' },
    { level: 4, category: 'grammar', type: 'mc', question: 'Welke vraag stel je om het lijdend voorwerp (4e nv) te vinden?', options: ['Wen oder was?', 'Wer oder was?', 'Wem?', 'Wo?'], correct: 0, explanation: '4e naamval vraag je met: Wen oder was?' },
    { level: 4, category: 'grammar', type: 'open', question: 'Vul in (4e nv): "Wir sehen ___ (der) Lehrer (m)."', answer: ['den'], explanation: 'Mannelijk in de 4e naamval verandert van der naar den.' },
    { level: 4, category: 'words', type: 'mc', question: 'Wat is "waarschijnlijk" in het Duits?', options: ['wahrscheinlich', 'vielleicht', 'unbedingt', 'sicherlich'], correct: 0, explanation: 'Waarschijnlijk = wahrscheinlich.' },
    { level: 4, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "Het bagage"', answer: ['das gepäck', 'gepäck'], explanation: 'Het bagage = das Gepäck.' },

    // LEVEL 5: Feesttentenregel & Modaal werkwoorden
    { level: 5, category: 'grammar', type: 'open', question: 'Vul in (Feesttentenregel): "Er ___ (arbeiten) viel."', answer: ['arbeitet'], explanation: 'Na een stam op -t of -d komt er een extra "e" voor de uitgang: arbeitet.' },
    { level: 5, category: 'grammar', type: 'mc', question: 'Vul in: "Ich ___ (können) gut Deutsch sprechen."', options: ['kann', 'könne', 'kannst', 'können'], correct: 0, explanation: 'Modaal werkwoord kunnen: ich kann, du kannst, er/sie/es kann.' },
    { level: 5, category: 'grammar', type: 'mc', question: 'Der-groep: "___ (Dieser) Mann (m) hilft mir." (Onderwerp)', options: ['Dieser', 'Diesen', 'Diesem', 'Diese'], correct: 0, explanation: 'Onderwerp = 1e naamval mannelijk -> Dieser.' },
    { level: 5, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "De schoolreis"', answer: ['die klassenfahrt', 'klassenfahrt'], explanation: 'De schoolreis = die Klassenfahrt.' },
    { level: 5, category: 'words', type: 'mc', question: 'Wat betekent "bekommen"?', options: ['Krijgen', 'Komen', 'Worden', 'Slaag behalen'], correct: 0, explanation: '"Bekommen" betekent krijgen (Falsche Freund!). Worden is werden.' },

    // LEVEL 6: Dativ (3e naamval) basis & Meewerkend voorwerp
    { level: 6, category: 'grammar', type: 'mc', question: 'Welke naamval is het meewerkend voorwerp?', options: ['3e naamval', '4e naamval', '1e naamval', '2e naamval'], correct: 0, explanation: 'Het meewerkend voorwerp staat in de 3e naamval (Dativ).' },
    { level: 6, category: 'grammar', type: 'mc', question: 'Ein-groep: "Er hilft ___ (seine) Mutter (f)." (3e nv)', options: ['seiner', 'seine', 'seinem', 'seinen'], correct: 0, explanation: 'Helfen eist de 3e naamval. Vrouwelijk 3e nv = seiner.' },
    { level: 6, category: 'grammar', type: 'open', question: 'Vul in: "Ich gebe ___ (der) Mann (m) ein Buch." (3e nv)', answer: ['dem'], explanation: 'Mannelijk 3e naamval verandert van der naar dem.' },
    { level: 6, category: 'words', type: 'mc', question: 'Wat betekent "erfolgreich"?', options: ['Succesvol', 'Gevaarlijk', 'Rijk', 'Eerlijk'], correct: 0, explanation: 'Erfolgreich = succesvol.' },
    { level: 6, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "Het uitje / de uitstap"', answer: ['der ausflug', 'ausflug'], explanation: 'Het uitje = der Ausflug.' },

    // LEVEL 7: Falsche Freunde advanced & Klas 3 Woordenschat
    { level: 7, category: 'words', type: 'mc', question: 'Wat betekent "brav" in het Duits?', options: ['Braaf / gehoorzaam', 'Dapper / moedig', 'Druk', 'Stil'], correct: 0, explanation: '"Brav" betekent braaf. Dapper is "mutig"!' },
    { level: 7, category: 'grammar', type: 'open', question: 'Vul in (Der-groep): "Ich sehe ___ (jeder) Schüler (m)." (4e nv)', answer: ['jeden'], explanation: 'Lijdend voorwerp = 4e nv. Mannelijk krijgt -en (jeden).' },
    { level: 7, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "Het cijfer op school"', answer: ['die note', 'note'], explanation: 'Het cijfer = die Note.' },
    { level: 7, category: 'grammar', type: 'mc', question: 'Vul in: "Wir ___ (wollen) nach Hause gehen."', options: ['wollen', 'willen', 'wollt', 'will'], correct: 0, explanation: 'Wir wollen = wij willen.' },
    { level: 7, category: 'words', type: 'mc', question: 'Wat betekent "schlimm"?', options: ['Erg / erg ernstig', 'Slim / pienter', 'Slecht', 'Vies'], correct: 0, explanation: 'Schlimm = erg. Slim in het Duits is "schlau"!' },

    // LEVEL 8: Voorzetsels met de 4e naamval (bis, durch, für, gegen, ohne, um)
    { level: 8, category: 'grammar', type: 'mc', question: 'Welke voorzetsels eisen ALTIJD de 4e naamval?', options: ['bis, durch, für, gegen, ohne, um', 'aus, bei, mit, nach, seit, von, zu', 'an, auf, hinter, in, neben', 'mit, ohne, nach, vor'], correct: 0, explanation: 'Ezelsbruggetje: DOGFU (durch, ohne, gegen, für, um + bis) = 4e naamval!' },
    { level: 8, category: 'grammar', type: 'open', question: 'Vul in: "Das Geschenk ist für ___ (der) Vater (m)."', answer: ['den'], explanation: '"Für" heeft de 4e naamval. Mannelijk 4e nv = den.' },
    { level: 8, category: 'words', type: 'mc', question: 'Wat betekent "verstehen"?', options: ['Begrijpen', 'Verstaan', 'Verstoppen', 'Vertellen'], correct: 0, explanation: 'Verstehen = begrijpen.' },
    { level: 8, category: 'grammar', type: 'mc', question: 'Vul in: "Wir fahren ohne ___ (unsere) Eltern (pl)."', options: ['unsere', 'unserer', 'unseren', 'unserem'], correct: 0, explanation: '"Ohne" + 4e naamval meervoud = onze -> unsere.' },
    { level: 8, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "Onmiddellijk / meteen"', answer: ['sofort'], explanation: 'Onmiddellijk = sofort.' },

    // LEVEL 9: Voorzetsels met de 3e naamval (aus, bei, mit, nach, seit, von, zu)
    { level: 9, category: 'grammar', type: 'mc', question: 'Welke voorzetsels eisen ALTIJD de 3e naamval?', options: ['aus, bei, mit, nach, seit, von, zu', 'bis, durch, für, gegen, ohne, um', 'über, unter, vor, tussen', 'an, auf, in, neben'], correct: 0, explanation: 'Ezelsbrugje: "aus, bei, mit, nach, seit, von, zu" eisen altijd de 3e naamval!' },
    { level: 9, category: 'grammar', type: 'open', question: 'Vul in: "Ich wohne bei ___ (mein) Onkel (m)."', answer: ['meinem'], explanation: '"Bei" + 3e naamval mannelijk = meinem.' },
    { level: 9, category: 'words', type: 'mc', question: 'Wat betekent "angst haben"?', options: ['Bang zijn', 'Boos zijn', 'Honger hebben', 'Ziek zijn'], correct: 0, explanation: 'Angst haben = bang zijn.' },
    { level: 9, category: 'grammar', type: 'mc', question: 'Vul in: "Sie geht zu ___ (die) Oma (f)."', options: ['der', 'die', 'dem', 'den'], correct: 0, explanation: '"Zu" + 3e naamval vrouwelijk = der.' },
    { level: 9, category: 'words', type: 'open', question: 'Vertaal naar het Duits: "Het avondeten"', answer: ['das abendessen', 'abendessen'], explanation: 'Het avondeten = das Abendessen.' },

    // LEVEL 10: Master Mix & Keuzevoorzetsels (an, auf, hinter, in, neben, über, unter, vor, zwischen)
    { level: 10, category: 'grammar', type: 'mc', question: 'Wanneer gebruik je bij keuzevoorzetsels de 3e naamval?', options: ['Bij rust / positie (Waar? / Wo?)', 'Bij beweging / richting (Waarheen? / Wohin?)', 'Bij tijdstip', 'Altijd'], correct: 0, explanation: 'Rust/positie (Wo?) = 3e naamval. Richting/beweging (Wohin?) = 4e naamval.' },
    { level: 10, category: 'grammar', type: 'open', question: 'Vul in (rust): "Das Buch liegt auf ___ (der) Tisch (m)."', answer: ['dem'], explanation: 'Rust (Waar ligt het?) = 3e naamval mannelijk -> dem.' },
    { level: 10, category: 'words', type: 'mc', question: 'Wat is de juiste vertaling van "gevaarlijk"?', options: ['gefährlich', 'gemütlich', 'pünktlich', 'vorsichtig'], correct: 0, explanation: 'Gevaarlijk = gefährlich.' },
    { level: 10, category: 'grammar', type: 'open', question: 'Vul in (beweging): "Ich gehe in ___ (die) Schule (f)."', answer: ['die'], explanation: 'Richting/beweging (Waarheen?) = 4e naamval vrouwelijk -> die.' },
    { level: 10, category: 'words', type: 'mc', question: 'Wat betekent "hoffen"?', options: ['Hopen', 'Hopen op feest', 'Rennen', 'Wachten'], correct: 0, explanation: 'Hoffen = hopen.' }
];

/* Game State */
let state = {
    category: 'mix',
    mode: 'classic',
    currentLevel: 1,
    currentQuestionIdx: 0,
    levelQuestions: [],
    coins: parseInt(localStorage.getItem('dm_coins') || '0'),
    lives: 3,
    maxLives: 3,
    streak: 0,
    correctAnswersCount: 0,
    timer: null,
    timeLeft: 15,
    activeAvatar: localStorage.getItem('dm_avatar') || '🇩🇪',
    activeTheme: localStorage.getItem('dm_theme') || 'default',
    boughtAvatars: JSON.parse(localStorage.getItem('dm_bought_avatars') || '["🇩🇪"]'),
    boughtThemes: JSON.parse(localStorage.getItem('dm_bought_themes') || '["default"]'),
    customWords: JSON.parse(localStorage.getItem('dm_custom_words') || '[]'),
    // Obby Canvas Animation variables
    playerX: 40,
    playerY: 130,
    targetX: 40,
    isJumping: false,
    jumpVy: 0,
    gravity: 0.6,
    blocks: []
};

const shopCatalog = {
    avatars: [
        { id: '🇩🇪', name: 'Duitse Vlag', price: 0, icon: '🇩🇪' },
        { id: '👑', name: 'Koning Meister', price: 100, icon: '👑' },
        { id: '🦊', name: 'Slimme Vos', price: 150, icon: '🦊' },
        { id: '🚀', name: 'Grammatica Raket', price: 200, icon: '🚀' },
        { id: '🥨', name: 'Beierse Pretzel', price: 250, icon: '🥨' },
        { id: '⚽', name: 'Bundesliga Bal', price: 300, icon: '⚽' }
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

/* Initialize UI */
window.addEventListener('DOMContentLoaded', () => {
    updateCoinsDisplay();
    applyTheme(state.activeTheme);
    document.getElementById('avatar-display').innerText = state.activeAvatar;
    renderCustomWordsList();
    initCanvas();
});

function updateCoinsDisplay() {
    document.getElementById('bank-coins-display').innerText = state.coins;
    localStorage.setItem('dm_coins', state.coins.toString());
}

function showScreen(screenId) {
    ['screen-welcome', 'screen-game', 'screen-result'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
    if (screenId === 'screen-game') {
        document.getElementById('header-stats').classList.remove('hidden');
    } else {
        document.getElementById('header-stats').classList.add('hidden');
    }
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
    if (id === 'modal-shop') switchShopTab('avatars');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function selectCategory(cat) {
    state.category = cat;
    document.querySelectorAll('.cat-btn').forEach(b => {
        b.classList.remove('border-amber-400', 'bg-amber-500/20');
        b.classList.add('border-slate-600', 'bg-slate-700/50');
    });
    document.getElementById(`btn-cat-${cat}`).classList.remove('border-slate-600', 'bg-slate-700/50');
    document.getElementById(`btn-cat-${cat}`).classList.add('border-amber-400', 'bg-amber-500/20');
}

function selectMode(mode) {
    state.mode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.remove('border-amber-400', 'bg-amber-500/20');
        b.classList.add('border-slate-600', 'bg-slate-700/50');
    });
    document.getElementById(`btn-mode-${mode}`).classList.remove('border-slate-600', 'bg-slate-700/50');
    document.getElementById(`btn-mode-${mode}`).classList.add('border-amber-400', 'bg-amber-500/20');
}

/* Custom Words Manager */
function addCustomWord(e) {
    e.preventDefault();
    const de = document.getElementById('custom-de-input').value.trim();
    const nl = document.getElementById('custom-nl-input').value.trim();
    if (!de || !nl) return;

    state.customWords.push({ de, nl });
    localStorage.setItem('dm_custom_words', JSON.stringify(state.customWords));
    document.getElementById('custom-de-input').value = '';
    document.getElementById('custom-nl-input').value = '';
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
    countDisplay.innerText = `${state.customWords.length} woorden opgeslagen`;

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

/* Shop System */
function switchShopTab(tab) {
    document.querySelectorAll('.shop-tab-btn').forEach(b => {
        b.classList.remove('bg-amber-500/20', 'text-amber-400', 'border-amber-500/40');
        b.classList.add('bg-slate-700/60', 'text-slate-400', 'border-slate-600');
    });
    document.getElementById(`shop-tab-${tab}`).classList.remove('bg-slate-700/60', 'text-slate-400', 'border-slate-600');
    document.getElementById(`shop-tab-${tab}`).classList.add('bg-amber-500/20', 'text-amber-400', 'border-amber-500/40');

    const container = document.getElementById('shop-items-container');
    if (tab === 'avatars') {
        container.innerHTML = shopCatalog.avatars.map(item => {
            const owned = state.boughtAvatars.includes(item.id);
            const active = state.activeAvatar === item.id;
            return `
                <div class="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="text-3xl">${item.icon}</span>
                        <div>
                            <h4 class="text-sm font-bold text-white">${item.name}</h4>
                            <span class="text-xs text-amber-400 font-bold">${owned ? 'Bezit' : item.price + ' munten'}</span>
                        </div>
                    </div>
                    <button onclick="buyOrEquipAvatar('${item.id}', ${item.price})" 
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
                        <h4 class="text-sm font-bold text-white">${item.name}</h4>
                        <span class="text-xs text-slate-400">Verhoogt je startlevens in Klassiek van 3 naar 4!</span>
                    </div>
                </div>
                <button onclick="buyMaxHearts(${item.price})" class="px-3 py-1.5 rounded-xl text-xs font-bold transition ${state.maxLives > 3 ? 'bg-emerald-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-900'}">
                    ${state.maxLives > 3 ? 'Gekocht' : item.price + ' Munten'}
                </button>
            </div>
        `).join('');
    } else if (tab === 'themes') {
        container.innerHTML = shopCatalog.themes.map(item => {
            const owned = state.boughtThemes.includes(item.id);
            const active = state.activeTheme === item.id;
            return `
                <div class="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-6 h-6 rounded-full ${item.color} border border-slate-500"></div>
                        <div>
                            <h4 class="text-sm font-bold text-white">${item.name}</h4>
                            <span class="text-xs text-amber-400 font-bold">${owned ? 'Bezit' : item.price + ' munten'}</span>
                        </div>
                    </div>
                    <button onclick="buyOrEquipTheme('${item.id}', ${item.price})" 
                        class="px-3 py-1.5 rounded-xl text-xs font-bold transition ${active ? 'bg-emerald-500 text-white' : owned ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-900'}">
                        ${active ? 'Actief' : owned ? 'Kiezen' : 'Kopen'}
                    </button>
                </div>
            `;
        }).join('');
    }
}

function buyOrEquipAvatar(id, price) {
    if (state.boughtAvatars.includes(id)) {
        state.activeAvatar = id;
        localStorage.setItem('dm_avatar', id);
        document.getElementById('avatar-display').innerText = id;
        switchShopTab('avatars');
    } else if (state.coins >= price) {
        state.coins -= price;
        state.boughtAvatars.push(id);
        state.activeAvatar = id;
        localStorage.setItem('dm_bought_avatars', JSON.stringify(state.boughtAvatars));
        localStorage.setItem('dm_avatar', id);
        document.getElementById('avatar-display').innerText = id;
        updateCoinsDisplay();
        switchShopTab('avatars');
    } else {
        alert('Niet genoeg munten!');
    }
}

function buyMaxHearts(price) {
    if (state.maxLives > 3) return;
    if (state.coins >= price) {
        state.coins -= price;
        state.maxLives = 4;
        localStorage.setItem('dm_max_lives', '4');
        updateCoinsDisplay();
        switchShopTab('hearts');
    } else {
        alert('Niet genoeg munten!');
    }
}

function buyOrEquipTheme(id, price) {
    if (state.boughtThemes.includes(id)) {
        state.activeTheme = id;
        localStorage.setItem('dm_theme', id);
        applyTheme(id);
        switchShopTab('themes');
    } else if (state.coins >= price) {
        state.coins -= price;
        state.boughtThemes.push(id);
        state.activeTheme = id;
        localStorage.setItem('dm_bought_themes', JSON.stringify(state.boughtThemes));
        localStorage.setItem('dm_theme', id);
        applyTheme(id);
        updateCoinsDisplay();
        switchShopTab('themes');
    } else {
        alert('Niet genoeg munten!');
    }
}

function applyTheme(theme) {
    document.body.className = "bg-slate-900 text-slate-100 min-h-screen flex flex-col justify-between selection:bg-rose-500 selection:text-white";
    if (theme !== 'default') {
        document.body.classList.add(`theme-${theme}`);
    }
}

/* Obby Canvas Game Loop & Graphics */
let canvas, ctx;
function initCanvas() {
    canvas = document.getElementById('obby-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(updateCanvas);
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}

function triggerJump(e) {
    if (e) e.preventDefault();
    if (!state.isJumping) {
        state.isJumping = true;
        state.jumpVy = -9;
        playSound('jump');
    }
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (document.getElementById('screen-game').classList.contains('hidden')) return;
        triggerJump();
    }
});

function updateCanvas() {
    if (canvas && ctx) {
        // Update player jump physics
        if (state.isJumping) {
            state.playerY += state.jumpVy;
            state.jumpVy += state.gravity;
            if (state.playerY >= 130) {
                state.playerY = 130;
                state.isJumping = false;
            }
        }

        // Smooth player X progression toward targetX
        if (state.playerX < state.targetX) {
            state.playerX += 2;
        }

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Track / Ground
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 165, canvas.width, 35);
        ctx.fillStyle = '#475569';
        ctx.fillRect(0, 165, canvas.width, 4);

        // Draw Blocks / Obstacles (5 per level)
        const blockWidth = 30;
        const totalDist = canvas.width - 100;
        const step = totalDist / 5;

        for (let i = 0; i < 5; i++) {
            const bx = 80 + i * step;
            const isPassed = i < state.currentQuestionIdx;
            const isCurrent = i === state.currentQuestionIdx;

            ctx.fillStyle = isPassed ? '#10b981' : isCurrent ? '#f59e0b' : '#64748b';
            ctx.fillRect(bx, 125, blockWidth, 40);

            // Draw block question number
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Fredoka, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${i + 1}`, bx + blockWidth / 2, 150);
        }

        // Draw Player Avatar
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(state.activeAvatar, state.playerX, state.playerY + 25);
    }
    requestAnimationFrame(updateCanvas);
}

/* Game Mechanics Logic */
function startGame() {
    state.currentLevel = 1;
    state.correctAnswersCount = 0;
    state.lives = state.mode === 'timed' ? 5 : (parseInt(localStorage.getItem('dm_max_lives') || '3'));
    state.streak = 0;

    prepareLevelQuestions();
    showScreen('screen-game');
    loadQuestion();
}

function prepareLevelQuestions() {
    state.currentQuestionIdx = 0;
    state.playerX = 40;
    state.targetX = 40;

    let pool = [];
    if (state.category === 'custom') {
        if (state.customWords.length < 5) {
            alert('Voeg minimaal 5 woorden toe aan "Mijn Woorden" om met je eigen lijst te spelen!');
            showScreen('screen-welcome');
            return;
        }
        pool = state.customWords.map(w => ({
            level: state.currentLevel,
            category: 'custom',
            type: 'open',
            question: `Vertaal naar het Duits: "${w.nl}"`,
            answer: [w.de.toLowerCase().trim()],
            explanation: `Juiste Duitse vertaling van "${w.nl}" is "${w.de}".`
        }));
    } else {
        pool = questionBank.filter(q => {
            if (q.level !== state.currentLevel) return false;
            if (state.category === 'mix') return true;
            return q.category === state.category;
        });

        if (pool.length < 5) {
            pool = questionBank.filter(q => q.level === state.currentLevel);
        }
    }

    state.levelQuestions = shuffleArray(pool).slice(0, 5);
    updateStatsUI();
}

function updateStatsUI() {
    document.getElementById('stat-lives').innerText = state.lives;
    document.getElementById('stat-streak').innerText = state.streak;
    document.getElementById('sub-level-badge').innerText = `LEVEL ${state.currentLevel}/10 • VRAAG ${state.currentQuestionIdx + 1}/5`;
}

function loadQuestion() {
    if (state.timer) clearInterval(state.timer);

    const q = state.levelQuestions[state.currentQuestionIdx];
    if (!q) return;

    document.getElementById('question-badge').innerText = q.category === 'grammar' ? 'Grammatica' : q.category === 'words' ? 'Falsche Freunde' : 'Eigen Woord';
    document.getElementById('question-title').innerText = q.question;
    
    document.getElementById('explanation-card').classList.add('hidden');
    document.getElementById('next-btn').disabled = true;
    document.getElementById('next-btn').classList.add('cursor-not-allowed', 'opacity-50');

    const mcContainer = document.getElementById('mc-container');
    const openContainer = document.getElementById('open-container');

    if (q.type === 'mc') {
        openContainer.classList.add('hidden');
        mcContainer.classList.remove('hidden');
        mcContainer.innerHTML = '';

        // Randomize multiple choice options safely
        const options = q.options.map((opt, i) => ({ opt, isCorrect: i === q.correct }));
        const shuffledOpts = shuffleArray(options);

        shuffledOpts.forEach(o => {
            const btn = document.createElement('button');
            btn.className = 'p-3 rounded-xl bg-slate-700/70 hover:bg-slate-600 border border-slate-600 text-left font-bold text-sm text-white transition active:scale-95';
            btn.innerText = o.opt;
            btn.onclick = () => checkMCAnswer(o.isCorrect, btn);
            mcContainer.appendChild(btn);
        });
    } else {
        mcContainer.classList.add('hidden');
        openContainer.classList.remove('hidden');
        const openInput = document.getElementById('open-input');
        openInput.value = '';
        openInput.disabled = false;
        openInput.focus();
    }

    if (state.mode === 'timed') {
        document.getElementById('timer-text').classList.remove('hidden');
        state.timeLeft = 15;
        document.getElementById('timer-text').innerHTML = `<i class="fa-solid fa-clock"></i> ${state.timeLeft}s`;
        state.timer = setInterval(() => {
            state.timeLeft--;
            document.getElementById('timer-text').innerHTML = `<i class="fa-solid fa-clock"></i> ${state.timeLeft}s`;
            if (state.timeLeft <= 0) {
                clearInterval(state.timer);
                handleWrongAnswer('Tijd is om!');
            }
        }, 1000);
    } else {
        document.getElementById('timer-text').classList.add('hidden');
    }
}

function checkMCAnswer(isCorrect, btnElement) {
    if (state.timer) clearInterval(state.timer);
    
    // Disable option buttons
    document.querySelectorAll('#mc-container button').forEach(b => b.disabled = true);

    if (isCorrect) {
        btnElement.classList.add('bg-emerald-600', 'border-emerald-400');
        handleCorrectAnswer();
    } else {
        btnElement.classList.add('bg-rose-600', 'border-rose-400');
        handleWrongAnswer('Helaas, dat is niet juist.');
    }
}

function checkOpenAnswer() {
    if (state.timer) clearInterval(state.timer);
    const input = document.getElementById('open-input');
    const given = input.value.trim().toLowerCase();
    const q = state.levelQuestions[state.currentQuestionIdx];

    input.disabled = true;

    if (q.answer.includes(given)) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer(`Fout! Het juiste antwoord is: "${q.answer[0]}".`);
    }
}

function handleCorrectAnswer() {
    playSound('correct');
    state.streak++;
    state.correctAnswersCount++;
    state.coins += 10;
    updateCoinsDisplay();

    // Progress character jump & move forward on canvas
    triggerJump();
    const canvasWidth = canvas.width - 100;
    const step = canvasWidth / 5;
    state.targetX = 40 + (state.currentQuestionIdx + 1) * step;

    showExplanation(true, 'Uitstekend! Gut gemacht!');
}

function handleWrongAnswer(msg) {
    playSound('wrong');
    state.streak = 0;
    state.lives--;
    updateStatsUI();

    showExplanation(false, msg);

    if (state.lives <= 0) {
        setTimeout(() => finishGame(false), 1500);
    }
}

function showExplanation(isCorrect, headerText) {
    const q = state.levelQuestions[state.currentQuestionIdx];
    const header = document.getElementById('explanation-header');
    const text = document.getElementById('explanation-text');
    const expCard = document.getElementById('explanation-card');

    if (isCorrect) {
        header.className = 'flex items-center gap-2 font-bold text-base sm:text-lg text-emerald-400';
        header.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${headerText}`;
    } else {
        header.className = 'flex items-center gap-2 font-bold text-base sm:text-lg text-rose-400';
        header.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${headerText}`;
    }

    text.innerText = q.explanation || '';
    expCard.classList.remove('hidden');

    const nextBtn = document.getElementById('next-btn');
    nextBtn.disabled = false;
    nextBtn.classList.remove('cursor-not-allowed', 'opacity-50');
    nextBtn.className = 'w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition shadow';
    nextBtn.innerHTML = `Volgende Vraag <i class="fa-solid fa-arrow-right ml-1"></i>`;
}

function nextQuestion() {
    if (state.lives <= 0) return;

    state.currentQuestionIdx++;
    if (state.currentQuestionIdx >= 5) {
        // Level completed!
        if (state.currentLevel < 10) {
            state.currentLevel++;
            state.coins += 50; // Bonus for level clear
            updateCoinsDisplay();
            alert(`Gefeliciteerd! Je hebt Level ${state.currentLevel - 1} overleefd! Start Level ${state.currentLevel}!`);
            prepareLevelQuestions();
            loadQuestion();
        } else {
            finishGame(true);
        }
    } else {
        updateStatsUI();
        loadQuestion();
    }
}

function finishGame(win) {
    if (state.timer) clearInterval(state.timer);
    showScreen('screen-result');

    const iconContainer = document.getElementById('result-icon-container');
    const title = document.getElementById('result-title');
    const subtitle = document.getElementById('result-subtitle');
    const gradeDisplay = document.getElementById('result-grade');
    const coinsEarnedDisplay = document.getElementById('result-coins-earned');

    const totalAsked = (state.currentLevel - 1) * 5 + state.currentQuestionIdx + (win ? 0 : 1);
    const scorePercent = totalAsked > 0 ? (state.correctAnswersCount / totalAsked) : 0;
    const grade = (scorePercent * 9 + 1).toFixed(1);

    const earnedCoins = state.correctAnswersCount * 10 + (win ? 200 : 0);

    gradeDisplay.innerText = grade;
    coinsEarnedDisplay.innerText = `+${earnedCoins}`;

    if (win) {
        iconContainer.innerText = '🏆';
        title.innerText = 'Meister Obby Voltooid!';
        subtitle.innerText = 'Fantastisch! Je hebt alle 10 niveaus van de Obby overleefd!';
    } else {
        iconContainer.innerText = '💀';
        title.innerText = 'Game Over!';
        subtitle.innerText = `Je bent gestrand in Level ${state.currentLevel}. Oefen nog eens en probeer opnieuw!`;
    }
}

function quitGame() {
    if (state.timer) clearInterval(state.timer);
    showScreen('screen-welcome');
}