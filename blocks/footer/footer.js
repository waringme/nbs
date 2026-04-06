import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Add section classes: brand, links, social
  const sections = ['footer-brand', 'footer-links', 'footer-social'];
  sections.forEach((cls, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(cls);
  });

  // Strip button classes from footer links
  footer.querySelectorAll('.button').forEach((button) => {
    button.className = '';
    const container = button.closest('.button-container');
    if (container) container.className = '';
  });

  block.append(footer);
}
