/**
 * Projects Page
 */

async function renderProjectsPage() {
    let projects = [];

    try {
        const response = await fetch('content/projects.json');
        projects = await response.json();
    } catch (error) {
        console.log('No projects.json found, using sample data');
        projects = getSampleProjects();
    }

    const tagsSet = new Set();
    projects.forEach(p => p.tags?.forEach(t => tagsSet.add(t)));
    const allTags = Array.from(tagsSet);

    const tagsHtml = allTags.map(tag =>
        `<span class="tag" onclick="filterProjects('${tag}')">${tag}</span>`
    ).join('');

    const projectsHtml = projects.map(project => `
        <div class="card project-card" data-tags="${project.tags?.join(',') || ''}">
            ${project.image ? `<img src="${project.image}" alt="${project.title}" class="card-image">` : ''}
            <h3 class="card-title">${project.title}</h3>
            <p class="card-description">${project.description}</p>
            ${project.tags ? `
                <div class="tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="flex gap-md mt-xl">
                ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener" class="btn btn-primary">View Project</a>` : ''}
                ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="btn btn-secondary">GitHub</a>` : ''}
            </div>
        </div>
    `).join('');

    return `
        <div class="container">
            <div class="section-header">
                <h1>Projects</h1>
                <p>A collection of my work, side projects, and experiments.</p>
            </div>
            
            ${allTags.length > 0 ? `
                <div class="tags mb-xl" style="justify-content: center;">
                    <span class="tag active" onclick="filterProjects('all')">All</span>
                    ${tagsHtml}
                </div>
            ` : ''}
            
            <div class="grid grid-3" id="projects-grid">
                ${projectsHtml}
            </div>
        </div>
    `;
}

function filterProjects(tag) {
    const cards = document.querySelectorAll('.project-card');
    const tags = document.querySelectorAll('.tags .tag');

    tags.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    cards.forEach(card => {
        if (tag === 'all') {
            card.style.display = 'block';
        } else {
            const cardTags = card.dataset.tags.split(',');
            card.style.display = cardTags.includes(tag) ? 'block' : 'none';
        }
    });
}

function getSampleProjects() {
    return [
        {
            id: 'sample-1',
            title: 'Sample Project',
            description: 'This is a sample project. Add your real projects to content/projects.json',
            tags: ['web', 'javascript'],
            link: '#',
            github: '#'
        },
        {
            id: 'sample-2',
            title: 'Another Project',
            description: 'Replace this with your actual project descriptions.',
            tags: ['design', 'ui'],
            link: '#'
        }
    ];
}
