/**
 * Blog Page
 */

async function renderBlogPage() {
    let posts = [];

    try {
        const response = await fetch('content/posts.json');
        posts = await response.json();
    } catch (error) {
        console.log('No posts.json found, using sample data');
        posts = getSamplePosts();
    }

    const postsHtml = posts.map(post => `
        <article class="card">
            <div class="blog-meta">
                <span>${post.date}</span>
                ${post.category ? `<span>•</span><span>${post.category}</span>` : ''}
            </div>
            <h3 class="card-title">${post.title}</h3>
            <p class="card-description">${post.excerpt || ''}</p>
            <a href="#/blog/${post.slug}" class="btn btn-secondary mt-xl">Read More</a>
        </article>
    `).join('');

    return `
        <div class="container">
            <div class="section-header">
                <h1>Blog</h1>
                <p>Thoughts, ideas, and things I find interesting.</p>
            </div>
            
            <div class="blog-list">
                ${postsHtml}
            </div>
        </div>
    `;
}

async function renderBlogPostPage(params) {
    const slug = params.slug;
    let post = null;

    try {
        // First try to load from posts.json
        const response = await fetch('content/posts.json');
        const posts = await response.json();
        post = posts.find(p => p.slug === slug);

        // If post has a file reference, load the markdown
        if (post?.file) {
            const mdResponse = await fetch(post.file);
            const mdContent = await mdResponse.text();
            const { meta, content } = MarkdownService.extractFrontmatter(mdContent);
            post.content = MarkdownService.parse(content);
        }
    } catch (error) {
        console.log('Error loading post:', error);
    }

    if (!post) {
        // Try sample posts
        const samplePosts = getSamplePosts();
        post = samplePosts.find(p => p.slug === slug);
    }

    if (!post) {
        return `
            <div class="container">
                <h1>Post Not Found</h1>
                <p>The blog post you're looking for doesn't exist.</p>
                <a href="#/blog" class="btn btn-primary">Back to Blog</a>
            </div>
        `;
    }

    return `
        <div class="container">
            <article class="blog-post">
                <header class="blog-post-header">
                    <a href="#/blog" class="btn btn-secondary mb-xl">← Back to Blog</a>
                    <div class="blog-meta">
                        <span>${post.date}</span>
                        ${post.category ? `<span>•</span><span>${post.category}</span>` : ''}
                    </div>
                    <h1>${post.title}</h1>
                </header>
                <div class="blog-post-content">
                    ${post.content || `<p>${post.excerpt}</p><p><em>Full content coming soon...</em></p>`}
                </div>
            </article>
        </div>
    `;
}

function getSamplePosts() {
    return [
        {
            slug: 'welcome',
            title: 'Welcome to My Blog',
            date: 'December 2024',
            category: 'Personal',
            excerpt: 'This is a sample blog post. Add your real posts to content/posts.json or as markdown files.',
            content: `
                <p>This is a sample blog post to show you how the blog works.</p>
                <h2>How to Add Posts</h2>
                <p>You can add blog posts in two ways:</p>
                <ol>
                    <li>Add entries to <code>content/posts.json</code> with inline content</li>
                    <li>Create markdown files in <code>content/posts/</code> and reference them</li>
                </ol>
                <blockquote>Markdown files can include frontmatter for metadata!</blockquote>
                <p>Happy blogging!</p>
            `
        },
        {
            slug: 'thoughts-on-design',
            title: 'Thoughts on Design',
            date: 'December 2024',
            category: 'Design',
            excerpt: 'Exploring what makes great design and how to think about user experience.',
            content: '<p>Add your actual content here...</p>'
        }
    ];
}
