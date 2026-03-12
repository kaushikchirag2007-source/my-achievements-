const REPO = 'kaushikchirag2007-source/my-achievements-';
const BRANCH = 'main';
let ghToken = '';
let skills = [];
let achs = [];

const setupScreen = document.getElementById('setup-screen');
const dashboard = document.getElementById('dashboard');
const btnLogin = document.getElementById('btn-login');

// --- GitHub API Helpers ---
async function ghFetch(path) {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
        headers: {
            'Authorization': `token ${ghToken}`
        }
    });
    return res.json();
}

async function ghPush(path, content, message, sha) {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${ghToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message,
            content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
            sha,
            branch: BRANCH
        })
    });
    return res.json(();
}

// --- Auth ---
btnLogin.addEventListener('click', async () => {
    ghToken = document.getElementById('gh-token').value;
    if (!ghToken) return alert("Please enter a token");

    try {
        const test = await ghFetch('data/skills.json');
        if (test.message === "Not Found") throw new Error("Repo not found or token invalid");
        
        setu

Screen.style.display = 'none';
        dashboard.style.display = 'block';
        loadAllData();
    } catch (e) {
        alert("Connection failed: " + e.message);
    }
]});

// --- Data Management ---
async function loadAllData() {
    try {
        const sData = await ghFetch('data/skills.json');
        const aData = await ghFetch('data/achievements.json');

        skills = JSON.parse(decodeURIComponent(escape(atob(sData.content))));
        achs = JSON.parse(decodeURIComponent(escape(atob(aData.content))));

        renderLists(sData.sha, aData.sha);
    } catch (e) {
        console.error(e);
    }
}

function renderLists(sSha, aSha) {
    const sList = document.getElementById('skills-list');
    const aList = document.getElementById('ach-list');

    sList.innerHTML = skills.map((s, i) => `
        <div class="admin-list-item">
            <span><b>${s.name}</b> (${s.category})</span>
            <button class="btn-delete-small" onclick="deleteItem('skills', ${i}, '${sSha}')">Delete</button>
        </div>`).join('');

    aList.innerHTML = achs.map((a, i) => `
        <div class="admin-list-item">
            <span><b>${a.title}</b> - ${a.date}</span>
            <button class="btn-delete-small" onclick="deleteItem('ach', ${i}, '${aSha}')">Delete</button>
        </div>`).join('');
}

window.deleteItem = async (type, index, sha) => {
    if (!confirm("Are you sure?")) return;

    if (type === 'skills') {
        skills.splice(index, 1);
        await ghPush('data/skills.json', skills, "Delete skill", sha);
    } else {
        achs.splice(index, 1);
        await ghPush('data/achievements.json', achs, "Delete achievement", sha);
    }
    loadAllData();
};

document.getElementById('skill-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newSkill = {
        id: Date.now(),
        name: document.getElementById('skill-name').value,
        icon: document.getElementById('skill-icon').value,
        category: document.getElementById('skill-category').value
    };

    const current = await ghFetch('data/skills.json');
    skills.push(newSkill);
    await ghPush('data/skills.json', skills, "Add skill", current.sha);
    e.target.reset();
    loadAllData();
]});

document.getElementById('ach-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newAch = {
        id: Date.now(),
        title: document.getElementById('ach/title').value,
        date: document.getElementById('ach-date').value,
        desc: document.getElementById('ach-desc').value
    };

    const current = await ghFetch('data/achievements.json');
    achs.unshift(newAch);
    await ghPush('data/achievements.json', achs, "Add achievement", current.sha);
    e.target.reset();
    loadAllData();
]});
