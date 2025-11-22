let bots = {};
let dictionary = [];
let memory = {};

// Load bots.json and dictionary.json
async function loadFiles() {
    bots = await fetch('bots.json').then(res => res.json());
    dictionary = await fetch('dictionary.json').then(res => res.json());

    // Populate bot selector
    const botSelect = document.getElementById('botSelect');
    Object.keys(bots).forEach(bot => {
        const option = document.createElement('option');
        option.value = bot;
        option.innerText = bot;
        botSelect.appendChild(option);
    });
}

// Chat logic
function botReply(botName, message) {
    const bot = bots[botName];
    message = message.toLowerCase();

    // keyword responses
    for (let keyword in bot.keywords) {
        if (message.includes(keyword.toLowerCase())) {
            return bot.keywords[keyword][Math.floor(Math.random() * bot.keywords[keyword].length)];
        }
    }

    // fallback: random dictionary word
    return `Fun fact: "${dictionary[Math.floor(Math.random() * dictionary.length)]}" exists.`;
}

// Sending messages
function sendMsg() {
    const botSelect = document.getElementById('botSelect');
    const botName = botSelect.value;
    const input = document.getElementById('msgInput');
    const chat = document.getElementById('chatWindow');

    const userMsg = input.value.trim();
    if (!userMsg) return;
    input.value = '';

    // Display user message
    chat.innerHTML += `<p><b>You:</b> ${userMsg}</p>`;

    // AI reply
    const reply = botReply(botName, userMsg);
    chat.innerHTML += `<p><b>${botName}:</b> ${reply}</p>`;
    chat.scrollTop = chat.scrollHeight;

    // Save to memory
    if (!memory[botName]) memory[botName] = [];
    memory[botName].push(userMsg);
}

// Event listeners
document.getElementById('sendBtn').addEventListener('click', sendMsg);
document.getElementById('msgInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMsg();
});

// Initialize
loadFiles();
