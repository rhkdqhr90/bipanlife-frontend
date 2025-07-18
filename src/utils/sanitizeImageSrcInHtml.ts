export function sanitizeImageSrcInHtml(html: string): string {
  return html.replace(/<img[^>]+src="([^"]+)"[^>]*>/g, match => {
    const srcMatch = match.match(/src="([^"]+)"/);
    if (!srcMatch) return match;

    const fullSrc = srcMatch[1];
    const filename = fullSrc.split("?")[0]; // Presigned URL 제거

    // src="post/..." 형태 유지
    const updated = match.replace(srcMatch[1], filename);
    return updated;
  });
}
