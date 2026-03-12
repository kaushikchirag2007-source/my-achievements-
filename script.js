document.addEventListener('DOMContentLoaded', () => {
    // 1. Visit Logging (Public Side - Sends to Supabase/API)
    async function logVisit() {
        // This is where you would send a ping to a database like Supabase
        // For now, it's a stub to keep the public site clean
        console.log("Visit logged (Read-only site)");
    }
    logVisit();

    // 2. Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

    // 3. GitHub Projects Fetching
    const gitHubUsername = 'kaushikchirag2007-source';
    const projectsContainer = document.getElementById('github-projects');

    async function fetchGitHubProjects() {
        try {
            const response = await fetch(`https://api.github.com/users/${gitHubUsername}/repos?sort=updated&per_page=6`);
            const repos = await response.json();

            projectsContainer.innerHTML = '';

            if (!repos || repos.length === 0 || repos.message === "Not Found") {
                projectsContainer.innerHTML = '<p>No public projects found.</p>';
                return;
            }

            repos.forEach(repo => {
                if (repo.name !== gitHubUsername) {
                    const card = document.createElement('div');
                    card.className = 'project-card glass';
                    card.innerHTML = `
                        <div class="project-info">
                            <span class="badge">${repo.language || 'Code'}</span>
                            <h3>${repo.name}</h3>
                            <p>${repo.description || 'Modern developer project.'}</p>
                            <a href="${repo.html_url}" target="_blank" class="btn-secondary">View Repo &rarr;</a>
                        </div>`;
                    projectsContainer.appendChild(card);
                }
            });
        } catch (e) {
            projectsContainer.innerHTML = '<p>Unable to load projects.</p>';
        }
    }
    fetchGitHubProjects();

    // 4. Achievement & Skill Loading (From JSON)
    const timeline = document.getElementById('achievements-timeline');
    const skillsGrid = document.getElementById('skills-grid');

    async function loadRemoteData() {
        // In production, these URLs would point to your raw GitHub JSON files
        // e.g., https://raw.githubusercontent.com/kaushikchirag2007-source/my-achievements-/main/data/skills.json
        const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? './data/' 
            : 'https://raw.githubusercontent.com/kaushikchirag2007-source/my-achievements-/main/data/';

        try {
            const [achsRes, skillsRes] = await Promise.all([
                fetch(`${baseUrl}achievements.json`),
                fetch(`${baseUrl}skills.json`)
            ]);

            const achs = await achsRes.json();
            const skills = await skillsRes.json();

            renderMainTimeline(achs);
            renderMainSkills(skills);
        } catch (e) {
            console.error("Error loading remote data:", e);
            timeline.innerHTML = '<p class="empty-msg">Unable to load achievements.</p>';
            skillsGrid.innerHTML = '<p class="empty-msg">Unable to load skills.</p>';
        }
    }

    function renderMainTimeline(achs) {
        timeline.innerHTML = achs.length ? '' : '<p class="empty-msg">No achievements added yet.</p>';
        achs.forEach(ach => {
            const item = document.createElement('div');
            item.className = 'timeline-item glass';
            item.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h3>${ach.title}</h3>
                    <span>${ach.date}</span>
                    <p>${ach.desc}</p>
                </div>`;
            timeline.appendChild(item);
        });
    }

    function renderMainSkills(skills) {
        skillsGrid.innerHTML = skills.length ? '' : '<p class="empty-msg">No skills added yet.</p>';
        skills.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'skill-card glass';
            card.innerHTML = `
                <i class="${skill.icon}"></i>
                <h3>${skill.name}</h3>
                <p>${skill.category}</p>`;
            skillsGrid.appendChild(card);
        });
    }

    // 5. Smooth Scrolling & Cursor
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const cursor = document.querySelector('.cursor-follow');
    document.addEventListener('mousemove', (e) => {
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });

    loadRemoteData();
});
