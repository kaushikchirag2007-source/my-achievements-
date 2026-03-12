document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // 2. Fetch GitHub Projects
    const gitHubUsername = 'kaushikchirag2007-source';
    const projectsContainer = document.getElementById('github-projects');

    async function fetchGitHubProjects() {
        try {
            const response = await fetch(`https://api.github.com/users/${gitHubUsername}/repos?sort=updated&per_page=6`);
            const repos = await response.json();

            projectsContainer.innerHTML = ''; // Clear loader

            if (repos.length === 0 || repos.message === "Not Found") {
                showPlaceholderProjects();
                return;
            }

            repos.forEach(repo => {
                if (repo.name !== 'kaushikchirag2007-source') { // Skip profile repo if exists
                    const card = createProjectCard(repo.name, repo.description || 'No description available.', repo.html_url, repo.language);
                    projectsContainer.appendChild(card);
                }
            });
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            showPlaceholderProjects();
        }
    }

    function createProjectCard(title, desc, url, lang) {
        const div = document.createElement('div');
        div.className = 'project-card glass';
        div.innerHTML = `
            <div class="project-info">
                <span class="badge">${lang || 'Code'}</span>
                <h3>${title}</h3>
                <p>${desc}</p>
                <a href="${url}" target="_blank" class="btn-secondary">View Repo &rarr;</a>
            </div>
        `;
        return div;
    }

    function showPlaceholderProjects() {
        const placeholders = [
            { title: 'Project One', desc: 'A stunning web application built with modern technologies.', lang: 'JavaScript' },
            { title: 'Project Two', desc: 'An innovative solution for complex problems.', lang: 'Python' },
            { title: 'Project Three', desc: 'Elegant design meets high performance.', lang: 'React' }
        ];

        projectsContainer.innerHTML = '';
        placeholders.forEach(p => {
            const card = createProjectCard(p.title, p.desc, '#', p.lang);
            projectsContainer.appendChild(card);
        });
    }

    fetchGitHubProjects();

    // 3. Achievement Management
    const timeline = document.getElementById('achievements-timeline');
    const adminPanel = document.getElementById('admin-panel');
    const achForm = document.getElementById('add-achievement-form');
    let isAdmin = false;

    // Default achievements if none in localStorage
    const defaultAchievements = [
        { id: 1, title: 'Full Stack Developer (Freelance)', date: '2024 - Present', desc: 'Leading the development of modern web applications.' },
        { id: 2, title: 'Open Source Contributor', date: '2023 - 2024', desc: 'Contributed to various libraries on GitHub.' },
        { id: 3, title: 'Started Programming Journey', date: '2022', desc: 'Self-taught developer focusing on web technologies.' }
    ];

    function loadAchievements() {
        let achs = JSON.parse(localStorage.getItem('achievements')) || defaultAchievements;
        renderAchievements(achs);
    }

    function renderAchievements(achs) {
        timeline.innerHTML = '';
        achs.forEach(ach => {
            const item = document.createElement('div');
            item.className = 'timeline-item glass';
            item.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <button class="btn-delete" onclick="deleteAchievement(${ach.id})">Delete</button>
                    <h3>${ach.title}</h3>
                    <span>${ach.date}</span>
                    <p>${ach.desc}</p>
                </div>
            `;
            timeline.appendChild(item);
        });
    }

    window.deleteAchievement = (id) => {
        let achs = JSON.parse(localStorage.getItem('achievements')) || defaultAchievements;
        achs = achs.filter(a => a.id !== id);
        localStorage.setItem('achievements', JSON.stringify(achs));
        renderAchievements(achs);
    };

    achForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newAch = {
            id: Date.now(),
            title: document.getElementById('ach-title').value,
            date: document.getElementById('ach-date').value,
            desc: document.getElementById('ach-desc').value
        };
        let achs = JSON.parse(localStorage.getItem('achievements')) || defaultAchievements;
        achs.unshift(newAch);
        localStorage.setItem('achievements', JSON.stringify(achs));
        renderAchievements(achs);
        achForm.reset();
    });

    // 4. Admin Mode Toggle (Shift + A)
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'A') {
            isAdmin = !isAdmin;
            adminPanel.classList.toggle('hidden');
            document.body.classList.toggle('admin-active');
            console.log('Admin Mode:', isAdmin ? 'ON' : 'OFF');
        }
    });

    loadAchievements();

    // 5. Custom Cursor (Subtle trailing effect)
    const cursor = document.querySelector('.cursor-follow');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 6. Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
