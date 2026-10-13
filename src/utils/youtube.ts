export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If iframe tag string was pasted
  if (trimmed.includes('<iframe')) {
    const match = trimmed.match(/src=["']([^"']+)["']/);
    if (match && match[1]) {
      return getYouTubeEmbedUrl(match[1]);
    }
  }

  // 1) short link: youtu.be/VIDEO_ID (e.g. https://youtu.be/qQwq0J8VQ48?si=7mGVDe8aFssNVvD0)
  const shortMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  // 2) standard watch link: youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // 3) shorts link: youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  // 4) embed link: youtube.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) {
    return `https://www.youtube.com/embed/${embedMatch[1]}`;
  }

  // 5) direct 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }

  return trimmed;
}

export function getYouTubeVideoId(url: string): string | null {
  const embedUrl = getYouTubeEmbedUrl(url);
  const match = embedUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}
