import { prisma } from './prisma';

/**
 * Fetch static content from CMS by key
 * Returns null if content doesn't exist
 * This allows pages to use CMS content with fallback to hardcoded content
 */
export async function getStaticContent(key: string) {
  try {
    const content = await prisma.staticContent.findUnique({
      where: { key },
    });
    return content;
  } catch (error) {
    console.error(`Error fetching static content for key "${key}":`, error);
    return null;
  }
}

/**
 * Get multiple static content items by keys
 * Returns a map of key -> content
 */
export async function getMultipleStaticContent(keys: string[]) {
  try {
    const contents = await prisma.staticContent.findMany({
      where: {
        key: {
          in: keys,
        },
      },
    });
    
    const contentMap = new Map<string, typeof contents[0] | null>();
    keys.forEach((key) => {
      const content = contents.find((c) => c.key === key);
      contentMap.set(key, content || null);
    });
    
    return contentMap;
  } catch (error) {
    console.error('Error fetching multiple static content:', error);
    return new Map<string, null>();
  }
}

/**
 * Helper to render CMS content or fallback
 * Usage: {renderCMSContent('homepage-seo-section', <div>Fallback content</div>)}
 */
export function renderCMSContent(
  content: { content: string } | null,
  fallback: React.ReactNode
): React.ReactNode {
  if (content && content.content) {
    return <div dangerouslySetInnerHTML={{ __html: content.content }} />;
  }
  return fallback;
}
