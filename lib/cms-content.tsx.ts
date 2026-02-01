import React from 'react';
import { prisma } from './prisma';

/**
 * Fetch static content from CMS by key
 * Returns null if content doesn't exist
 */
export async function getStaticContent(key: string) {
  try {
    const content = await prisma.staticContent.findUnique({
      where: { key },
    });
    return content;
  } catch (error) {
    console.error(Error fetching static content for key "${key}":, error);
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
        key: { in: keys },
      },
    });

    const contentMap = new Map<string, (typeof contents)[0] | null>();

    keys.forEach((key) => {
      const content = contents.find((c) => c.key === key) || null;
      contentMap.set(key, content);
    });

    return contentMap;
  } catch (error) {
    console.error('Error fetching multiple static content:', error);
    return new Map<string, null>();
  }
}

/**
 * Render CMS HTML content or fallback JSX
 */
export function renderCMSContent(
  content: { content: string } | null,
  fallback: React.ReactNode
): React.ReactNode {
  if (content?.content) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: content.content,
        }}
      />
    );
  }
  return fallback;
}