import { BLOG_COVER_SLUGS } from './illustrations';

const COVER_BASE = '/images/blog/covers';

export function getBlogCoverPng(slug) {
    return `${COVER_BASE}/${slug}.png`;
}

export function getBlogCoverWebp(slug) {
    return `${COVER_BASE}/${slug}.webp`;
}

export function getBlogCoverAlt(title) {
    return title ? `${title}: article cover illustration` : 'Article cover illustration';
}

export function withBlogCoverMeta(post) {
    if (!post) return post;
    return {
        ...post,
        coverImage: getBlogCoverPng(post.slug),
        coverWebp: getBlogCoverWebp(post.slug),
    };
}

export function hasBlogCover(slug) {
    return BLOG_COVER_SLUGS.includes(slug);
}
