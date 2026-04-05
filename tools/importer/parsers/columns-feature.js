/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature. Base: columns.
 * Source: https://www.nationwide.co.uk/
 * Selector: [class*='ImageWithContent__StyledImageArea']
 * Structure: 2-col table, col1=image, col2=heading+text+list+CTA
 * Note: selector targets image area; we go up to the grid parent for full content.
 * Images are rendered client-side by React and may not be in the DOM as <img> tags.
 */
export default function parse(element, { document }) {
  // Navigate up to the grid container that holds both image and content columns
  const grid = element.closest('[class*="vertical-rhythm--image-with-content"]')
    || element.parentElement;

  // Extract image - try multiple strategies across the full grid
  let img = null;

  // Strategy 1: Find any img in the grid (covers both image and content areas)
  img = grid.querySelector('img:not([src^="data:"])');

  // Strategy 2: Look specifically in image area descendants
  if (!img) {
    img = element.querySelector('img');
  }

  // Strategy 3: Extract from background-image computed styles on any div in image area
  if (!img) {
    const allDivs = element.querySelectorAll('*');
    for (const el of allDivs) {
      try {
        const computed = el.ownerDocument.defaultView
          ? el.ownerDocument.defaultView.getComputedStyle(el).backgroundImage
          : '';
        const match = computed.match(/url\(["']?([^"')]+)["']?\)/);
        if (match && !match[1].startsWith('data:')) {
          img = document.createElement('img');
          img.src = match[1];
          break;
        }
      } catch (e) { /* skip */ }
    }
  }

  // Strategy 4: Search the full grid for background images
  if (!img) {
    const allDivs = grid.querySelectorAll('*');
    for (const el of allDivs) {
      try {
        const computed = el.ownerDocument.defaultView
          ? el.ownerDocument.defaultView.getComputedStyle(el).backgroundImage
          : '';
        const match = computed.match(/url\(["']?([^"')]+)["']?\)/);
        if (match && !match[1].startsWith('data:')) {
          img = document.createElement('img');
          img.src = match[1];
          break;
        }
      } catch (e) { /* skip */ }
    }
  }

  // Extract content from the content area column
  const contentArea = grid.querySelector('[class*="ImageWithContent__StyledContentArea"]')
    || grid.querySelector('[class*="StyledContentArea"]');

  const heading = contentArea ? contentArea.querySelector('h2, h3') : null;
  const description = contentArea ? contentArea.querySelector('[class*="RichText"] p, [class*="passthru"] p') : null;

  // Extract checklist items
  const listItems = contentArea ? Array.from(contentArea.querySelectorAll('ul li')) : [];
  const ul = document.createElement('ul');
  listItems.forEach((li) => {
    const newLi = document.createElement('li');
    const text = li.querySelector('[class*="passthru"] p, p');
    if (text) newLi.textContent = text.textContent;
    else newLi.textContent = li.textContent.trim();
    ul.appendChild(newLi);
  });

  // Extract CTA link
  const ctaLink = contentArea ? contentArea.querySelector('[class*="ButtonGroup"] a, a[class*="nel-Link-36"]') : null;

  // Build 2-column cells: col1=image, col2=content
  const imageCell = img ? [img] : [];
  const textCell = [];
  if (heading) textCell.push(heading);
  if (description) textCell.push(description);
  if (ul.children.length > 0) textCell.push(ul);
  if (ctaLink) textCell.push(ctaLink);

  const cells = [[imageCell, textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
