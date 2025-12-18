/**
 * Resume Page
 */

async function renderResumePage() {
    let resume = null;

    try {
        const response = await fetch('content/resume.json');
        resume = await response.json();
    } catch (error) {
        console.log('No resume.json found, using sample data');
        resume = getSampleResume();
    }

    const experienceHtml = resume.experience?.map(job => `
        <div class="resume-item">
            <div class="resume-item-header">
                <div>
                    <span class="resume-title">${job.title}</span>
                    <span class="resume-company"> at ${job.company}</span>
                </div>
                <span class="resume-date">${job.startDate} - ${job.endDate || 'Present'}</span>
            </div>
            <div class="resume-description">
                ${job.description ? `<p>${job.description}</p>` : ''}
                ${job.highlights ? `
                    <ul>
                        ${job.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        </div>
    `).join('') || '';

    const educationHtml = resume.education?.map(edu => `
        <div class="resume-item">
            <div class="resume-item-header">
                <div>
                    <span class="resume-title">${edu.degree}</span>
                    <span class="resume-company"> - ${edu.school}</span>
                </div>
                <span class="resume-date">${edu.year}</span>
            </div>
            ${edu.description ? `<p class="resume-description">${edu.description}</p>` : ''}
        </div>
    `).join('') || '';

    const skillsHtml = resume.skills ? Object.entries(resume.skills).map(([category, skills]) => `
        <div class="skill-category">
            <h4>${category}</h4>
            <ul>
                ${skills.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
        </div>
    `).join('') : '';

    const activitiesHtml = resume.activities?.map(activity => `
        <div class="resume-item">
            <div class="resume-item-header">
                <div>
                    <span class="resume-title">${activity.title}</span>
                    <span class="resume-company"> - ${activity.organization}</span>
                </div>
                <span class="resume-date">${activity.period}</span>
            </div>
        </div>
    `).join('') || '';

    return `
        <div class="container">
            <div class="resume-header">
                <div>
                    <h1>${resume.name || 'Resume'}</h1>
                    <p>${resume.title || ''}</p>
                </div>
                ${resume.pdfUrl ? `
                    <a href="${resume.pdfUrl}" download class="btn btn-primary">
                        📄 Download PDF
                    </a>
                ` : ''}
            </div>
            
            ${resume.summary ? `
                <div class="resume-section">
                    <h3>About</h3>
                    <p>${resume.summary}</p>
                </div>
            ` : ''}
            
            ${experienceHtml ? `
                <div class="resume-section">
                    <h3>Experience</h3>
                    ${experienceHtml}
                </div>
            ` : ''}
            
            ${educationHtml ? `
                <div class="resume-section">
                    <h3>Education</h3>
                    ${educationHtml}
                </div>
            ` : ''}
            
            ${skillsHtml ? `
                <div class="resume-section">
                    <h3>Skills</h3>
                    <div class="skills-grid">
                        ${skillsHtml}
                    </div>
                </div>
            ` : ''}

            ${activitiesHtml ? `
                <div class="resume-section">
                    <h3>Activities</h3>
                    ${activitiesHtml}
                </div>
            ` : ''}
            
            ${resume.contact ? `
                <div class="resume-section">
                    <h3>Contact</h3>
                    <div class="flex flex-wrap gap-lg">
                        ${resume.contact.email ? `<a href="mailto:${resume.contact.email}">${resume.contact.email}</a>` : ''}
                        ${resume.contact.phone ? `<span>${resume.contact.phone}</span>` : ''}
                        ${resume.contact.github ? `<a href="${resume.contact.github}" target="_blank" rel="noopener">GitHub</a>` : ''}
                        ${resume.contact.linkedin ? `<a href="${resume.contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
                        ${resume.contact.website ? `<a href="${resume.contact.website}" target="_blank" rel="noopener">Website</a>` : ''}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function getSampleResume() {
    return {
        name: 'Samarth P',
        title: 'Developer & Photographer',
        pdfUrl: 'public/resume.pdf',
        summary: 'Add your professional summary to content/resume.json',
        experience: [
            {
                title: 'Software Developer',
                company: 'Your Company',
                startDate: 'Jan 2023',
                endDate: null,
                description: 'Update this with your real experience.',
                highlights: [
                    'Highlight 1',
                    'Highlight 2'
                ]
            }
        ],
        education: [
            {
                degree: 'Your Degree',
                school: 'Your University',
                year: '2022',
                description: 'Description here'
            }
        ],
        skills: {
            'Programming': ['JavaScript', 'Python', 'HTML/CSS'],
            'Tools': ['Git', 'VS Code', 'Figma']
        },
        contact: {
            email: 'your@email.com',
            github: 'https://github.com/yourusername'
        }
    };
}
