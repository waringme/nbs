import { decorateIcons } from '../../scripts/aem.js';
import { loadFragmentFromRepo } from '../fragment/fragment.js';

/**
 * Injects span.icon placeholders for app/play badges and social links, then runs decorateIcons.
 * @param {Element} footer Footer inner wrapper
 */
function decorateFooterIcons(footer) {
  const brand = footer.querySelector('.footer-brand');
  if (brand) {
    brand.querySelectorAll('a[href*="apps.apple.com"]').forEach((a) => {
      if (a.querySelector('span.icon')) return;
      const span = document.createElement('span');
      span.className = 'icon icon-app-store';
      span.setAttribute('aria-hidden', 'true');
      a.prepend(span);
    });
    brand.querySelectorAll('a[href*="play.google.com"]').forEach((a) => {
      if (a.querySelector('span.icon')) return;
      const span = document.createElement('span');
      span.className = 'icon icon-google-play';
      span.setAttribute('aria-hidden', 'true');
      a.prepend(span);
    });
  }

  const socialHosts = [
    ['facebook.com', 'facebook'],
    ['linkedin.com', 'linkedin'],
    ['twitter.com', 'twitter-x'],
    ['x.com', 'twitter-x'],
    ['youtube.com', 'youtube'],
    ['instagram.com', 'instagram'],
  ];

  footer.querySelectorAll('.footer-social a[href]').forEach((a) => {
    if (a.querySelector('span.icon')) return;
    const { href } = a;
    const match = socialHosts.find(([host]) => href.includes(host));
    if (!match) return;
    const [, iconName] = match;
    const label = a.textContent.trim();
    a.setAttribute('aria-label', label);
    a.textContent = '';
    const span = document.createElement('span');
    span.className = `icon icon-${iconName}`;
    span.setAttribute('aria-hidden', 'true');
    a.append(span);
  });

  decorateIcons(footer);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Footer markup comes only from git: blocks/footer/footer.plain.html (local, preview/staging, production).
  const fragment = await loadFragmentFromRepo('/blocks/footer/footer');
  if (!fragment) return;

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

  decorateFooterIcons(footer);
  block.append(footer);
}
