import { error } from '@sveltejs/kit';
import { flat } from '$lib/outline.js';

export const prerender = true;

export function entries() {
  return flat.map((s) => ({ slug: s.num }));
}

export function load({ params }) {
  const section = flat.find((s) => s.num === params.slug);
  if (!section) throw error(404, 'Not found');
  return { section };
}
