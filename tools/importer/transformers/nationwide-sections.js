/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Nationwide section breaks and section metadata.
 * Runs in afterTransform only.
 * Uses content-based selectors from captured DOM of https://www.nationwide.co.uk/
 * to find section boundaries and insert <hr> breaks and Section Metadata blocks.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const document = element.ownerDocument || element.getRootNode();

    // Define section boundaries using reliable content-based selectors
    // Each entry: { selector, style } where style is null or a string
    const sectionMarkers = [
      // Section 1: Hero - [class*='HeroContainerInner']
      { selector: "[class*='HeroContainerInner']", style: null },
      // Section 2: Product Quick Links - contains EmphasisHeading "What are you looking for today?"
      { selector: "[class*='EmphasisHeadingRendering']", style: null },
      // Section 3: Promotional Cards - CardsGrid
      { selector: "[class*='CardsGrid__StyledCardsGrid']", style: null },
      // Section 4: Call Checker - ImageWithContent (dark section)
      { selector: "[class*='ImageWithContent__StyledImageArea']", style: 'dark' },
      // Section 5: Internet Banking and Help - first SideBySideLayout
      { selector: "[class*='SideBySideLayout__SideBySideGrid']", style: null },
      // Section 6: Service Quality - ContentWithSidebar
      { selector: "[class*='ContentWithSidebar__ContentWithSideBarGrid']", style: null },
    ];

    // Find all section elements (from document, fall back to element)
    const foundSections = [];
    for (const marker of sectionMarkers) {
      const el = document.querySelector(marker.selector) || element.querySelector(marker.selector);
      if (el) {
        foundSections.push({ el, style: marker.style });
      }
    }

    // Process in reverse order to avoid shifting DOM positions
    for (let i = foundSections.length - 1; i >= 0; i--) {
      const { el, style } = foundSections[i];

      // Add section-metadata block if section has a style
      if (style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style },
        });
        el.after(sectionMetadata);
      }

      // Add section break (hr) before section (skip for first section)
      if (i > 0) {
        const hr = document.createElement('hr');
        el.before(hr);
      }
    }
  }
}
