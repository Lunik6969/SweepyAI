let bots = {};
let dictionary = [];
let memory = {};
let currentBot = null;

// Load bots + dictionary
async function loadFiles() {
    bots = await fetch('bots.json').then(res => res.json());
    dictionary = await fetch('dictionary.json').then(res => res.json());
}
loadFiles();

// --- Show bots (index.html) ---
function showBots() {
    const botsList = document.getElementById('botsList');
    botsList.innerHTML = '';
    Object.keys(bots).forEach(botName => {
        const bot = bots[botName];
        const card = document.createElement('div');
        card.classList.add('botCard');
        card.innerHTML = `<b class="bot">${botName}</b><br>${bot.description} <i>(${bot.mood})</i>`;
        card.onclick = () => {
            localStorage.setItem('selectedBot', botName);
            window.location.href = 'chat.html';
        };
        botsList.appendChild(card);
    });
}

// If on index.html
if (document.getElementById('botsList')) {
    setTimeout(showBots, 200);
}

// --- Chat logic (chat.html) ---
if (document.getElementById('chatWindow')) {
    currentBot = localStorage.getItem('selectedBot') || Object.keys(bots)[0];
    const bot = bots[currentBot];
    document.getElementById('chatBotName').innerText = currentBot;
    document.getElementById('botDescription').innerText = `${bot.description} (${bot.mood})`;

    const chatWindow = document.getElementById('chatWindow');
    const msgInput = document.getElementById('msgInput');

    function sendMsg() {
        const msg = msgInput.value.trim();
        if (!msg) return;
        msgInput.value = '';
        chatWindow.innerHTML += `<p><b>You:</b> ${msg}</p>`;

        let reply = '';
        for (let key in bot.keywords) {
            if (msg.toLowerCase().includes(key.toLowerCase())) {
                reply = bot.keywords[key][Math.floor(Math.random() * bot.keywords[key].length)];
                break;
            }
        }
        if (!reply) {
            const word = dictionary[Math.floor(Math.random() * dictionary.length)];
            reply = `${bot.personality} vibe ${bot.mood}: "${word}" 💬`;
        }

        chatWindow.innerHTML += `<p><b class="bot">${currentBot}:</b> ${reply}</p>`;
        chatWindow.scrollTop = chatWindow.scrollHeight;

        if (!memory[currentBot]) memory[currentBot] = [];
        memory[currentBot].push(msg);
    }

    document.getElementById('sendBtn').addEventListener('click', sendMsg);
    msgInput.addEventListener('keydown', e => { if(e.key==='Enter') sendMsg(); });
    document.getElementById('backBtn').addEventListener('click', () => { window.location.href = 'index.html'; });
}
