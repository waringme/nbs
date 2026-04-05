/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature. Base: columns.
 * Source: https://www.nationwide.co.uk/
 * Selector: [class*='ImageWithContent__StyledImageArea']
 * Structure: 2-col table, col1=image, col2=heading+text+list+CTA
 * Note: selector targets image area; we go up to the grid parent for full content
 */
export default function parse(element, { document }) {
  // Navigate up to the grid container that holds both image and content columns
  const grid = element.closest('[class*="vertical-rhythm--image-with-content"]')
    || element.parentElement;

  // Extract image from the image area column
  const imgArea = grid.querySelector('[class*="ImageWithContent__StyledImageArea"], [class*="ImageUi__Container"]');
  const img = imgArea ? imgArea.querySelector('[class*="DesktopImage"] img, [class*="MobileImage"] img, img') : null;

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
