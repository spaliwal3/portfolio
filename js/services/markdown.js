/**
 * Simple Markdown Parser
 * Converts markdown text to HTML
 */

const MarkdownService = {
    /**
     * Parse markdown to HTML
     * @param {string} markdown - Markdown text
     * @returns {string} HTML string
     */
    parse(markdown) {
        if (!markdown) return '';

        let html = markdown;

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

        // Links
        html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // Images
        html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1">');

        // Blockquotes
        html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

        // Inline code
        html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

        // Code blocks
        html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');

        // Horizontal rule
        html = html.replace(/^---$/gim, '<hr>');

        // Unordered lists
        html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/gim, '<ul>$&</ul>');

        // Paragraphs
        html = html.split('\n\n').map(para => {
            if (para.trim() &&
                !para.startsWith('<h') &&
                !para.startsWith('<ul') &&
                !para.startsWith('<blockquote') &&
                !para.startsWith('<pre') &&
                !para.startsWith('<hr')) {
                return `<p>${para.trim()}</p>`;
            }
            return para;
        }).join('\n');

        // Clean up line breaks
        html = html.replace(/\n/g, '');

        return html;
    },

    /**
     * Extract frontmatter from markdown
     * @param {string} markdown - Markdown with frontmatter
     * @returns {object} { meta: object, content: string }
     */
    extractFrontmatter(markdown) {
        const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

        if (!match) {
            return { meta: {}, content: markdown };
        }

        const frontmatter = match[1];
        const content = match[2];
        const meta = {};

        frontmatter.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length) {
                meta[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
            }
        });

        return { meta, content };
    }
};
