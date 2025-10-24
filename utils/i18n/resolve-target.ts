import type { RouteLocationRaw } from 'vue-router';

type LocalePathResolver = (route: RouteLocationRaw) => string;

const EXTERNAL_PATTERN = /^(?:[a-z][a-z+.-]*:|\/\/)/i;

function toRouteName(path: string): string {
  const segments = path
    .replace(/^\/+/, '')
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    return 'index';
  }

  return segments.join('-');
}

function isExternal(target: string): boolean {
  return EXTERNAL_PATTERN.test(target);
}

export function resolveLocalizedRouteTarget(target: string, localePath: LocalePathResolver): string {
  let normalized = target.trim();

  if (!normalized) {
    return normalized;
  }

  if (normalized === '#') {
    return localePath({ name: 'index' });
  }

  if (normalized.startsWith('#')) {
    normalized = normalized.slice(1).trim();
  }

  if (!normalized) {
    return localePath({ name: 'index' });
  }

  if (isExternal(normalized)) {
    return normalized;
  }

  const hashIndex = normalized.indexOf('#');
  const queryIndex = normalized.indexOf('?');

  const pathEnd = Math.min(
    hashIndex === -1 ? normalized.length : hashIndex,
    queryIndex === -1 ? normalized.length : queryIndex,
  );

  const path = normalized.slice(0, pathEnd);
  const query =
    queryIndex !== -1 && (hashIndex === -1 || queryIndex < hashIndex)
      ? normalized.slice(queryIndex, hashIndex === -1 ? normalized.length : hashIndex)
      : '';
  const routeName = toRouteName(path);

  const resolvedPath = localePath({ name: routeName });

  return `${resolvedPath}${query}`;
}
