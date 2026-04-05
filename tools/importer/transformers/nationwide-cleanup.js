/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Nationwide cleanup.
 * Selectors from captured DOM of https://www.nationwide.co.uk/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie consent banner (OneTrust) - found at #onetrust-consent-sdk
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.onetrust-pc-dark-filter',
    ]);

    // Overlay containers that may block parsing
    WebImporter.DOMUtils.remove(element, [
      '[class*="Overlay__OverlayContainer"]',
      '[class*="Drawer__StyledDrawer"]',
    ]);
  }

  if (hookName === H.after) {
    // Skip links - found at [class*="SkipLinks__StyledSkip"]
    WebImporter.DOMUtils.remove(element, [
      '[class*="SkipLinks__StyledSkip"]',
    ]);

    // Global navigation bar (Personal/Business) - found at [class*="globalNavigation__BackgroundColour"]
    WebImporter.DOMUtils.remove(element, [
      '[class*="globalNavigation__BackgroundColour"]',
    ]);

    // Header/masthead - found at header[class*="BaseMasthead"]
    WebImporter.DOMUtils.remove(element, [
      'header[class*="BaseMasthead"]',
    ]);

    // Main navigation flyout menus - found at [class*="NavigationDesktop"]
    WebImporter.DOMUtils.remove(element, [
      '[class*="NavigationDesktop"]',
      '[class*="NavigationMobile"]',
    ]);

    // Footer - found at [class*="footerContainer__StyledFooterContainer"]
    WebImporter.DOMUtils.remove(element, [
      '[class*="footerContainer"]',
      '[class*="footerV2"]',
    ]);

    // Remove iframes, link tags, noscript
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
    ]);

    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('onclick');
    });
  }
}
