/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-ranking. Base: columns.
 * Source: https://www.nationwide.co.uk/
 * Selector: [class*='ContentWithSidebar'] ~ [class*='SideBySideLayout__SideBySideGrid']
 * Structure: 2-col table, col1=GB ranking, col2=NI ranking
 */
export default function parse(element, { document }) {
  // The SideBySideGrid has two Col children as the two columns
  const columns = Array.from(element.querySelectorAll(':scope > [class*="Col"]'));

  const cellRow = [];

  columns.forEach((col) => {
    const content = [];

    // Extract heading (e.g. "Overall service quality – Great Britain")
    const heading = col.querySelector('h3, h2');
    if (heading) content.push(heading);

    // Extract ranking image (desktop version preferred)
    const img = col.querySelector('[class*="DesktopImage"] img, [class*="GenericImage"] img, img');
    if (img) content.push(img);

    // Extract description text
    const richTexts = col.querySelectorAll('[class*="RichText"] p, [class*="passthru"] p');
    richTexts.forEach((p) => content.push(p));

    // Extract CTA link
    const ctaLink = col.querySelector('[class*="ButtonGroup"] a, [class*="LinkGroup"] a');
    if (ctaLink) content.push(ctaLink);

    cellRow.push(content);
  });

  const cells = [cellRow];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-ranking', cells });
  element.replaceWith(block);
}
