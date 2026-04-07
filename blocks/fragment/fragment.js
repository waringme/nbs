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
  const main = document.createElement('main');
  main.innerHTML = await resp.text();

  const resetAttributeBase = (tag, attr) => {
    main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
      elem[attr] = new URL(elem.getAttribute(attr), new URL(relativePath, window.location)).href;
    });
  };
  resetAttributeBase('img', 'src');
  resetAttributeBase('source', 'srcset');

  decorateMain(main);
  await loadSections(main);
  return main;
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
      const main = document.createElement('main');
      main.innerHTML = await resp.text();

      // reset base path for media to fragment base
      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadSections(main);
      return main;
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
