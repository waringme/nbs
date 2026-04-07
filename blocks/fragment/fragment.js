/*
 * Fragment Block
 * Include content on a page as a fragment.
 * https://www.aem.live/developer/block-collection/fragment
 */

// eslint-disable-next-line import/no-cycle
import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadSections,
} from '../../scripts/aem.js';

/**
 * Parses plain HTML through the same decoration pipeline as fetched fragments.
 * @param {string} html Fragment body (no main wrapper)
 * @param {string} basePath Path without .plain.html (for resolving ./media_ URLs)
 * @returns {Promise<HTMLElement>} Root main element
 */
async function loadFragmentFromHtml(html, basePath) {
  const main = document.createElement('main');
  main.innerHTML = html;

  const resetAttributeBase = (tag, attr) => {
    main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
      elem[attr] = new URL(elem.getAttribute(attr), new URL(basePath, window.location)).href;
    });
  };
  resetAttributeBase('img', 'src');
  resetAttributeBase('source', 'srcset');

  decorateMain(main);
  await loadSections(main);
  return main;
}

/**
 * Loads a fragment from the code deployment (git), not the content path.
 * Same markup on dev, preview, and production when the file lives in the repo.
 * @param {string} relativePath Path without .plain.html (e.g. '/blocks/footer/footer')
 * @returns {Promise<HTMLElement|null>} Root element of the fragment
 */
export async function loadFragmentFromRepo(relativePath) {
  if (!relativePath || !relativePath.startsWith('/') || relativePath.startsWith('//')) {
    return null;
  }
  const base = window.hlx.codeBasePath || '';
  const url = `${base}${relativePath}.plain.html`.replace(/([^:]\/)\/+/g, '$1');
  const resp = await fetch(url);
  if (!resp.ok) {
    return null;
  }
  return loadFragmentFromHtml(await resp.text(), relativePath);
}

/**
 * Same as loadFragmentFromRepo but from an HTML string (e.g. bundled fallback when fetch fails).
 * @param {string} html Fragment body
 * @param {string} basePath Path without .plain.html (for media resolution)
 * @returns {Promise<HTMLElement>} Root main element
 */
export async function fragmentFromHtmlString(html, basePath) {
  return loadFragmentFromHtml(html, basePath);
}

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
export async function loadFragment(path) {
  if (path && path.startsWith('/') && !path.startsWith('//')) {
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      return loadFragmentFromHtml(await resp.text(), path);
    }
  }
  return null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (fragment) block.replaceChildren(...fragment.childNodes);
}
