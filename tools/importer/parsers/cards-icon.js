/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-icon. Base: cards.
 * Source: https://www.nationwide.co.uk/
 * Selector: ol[class*='IconBlock__StyledOl']
 * Structure: 2-col table, each row = one card (col1=image, col2=text)
 */
export default function parse(element, { document }) {
  // Each li in the ordered list is one card item
  const items = Array.from(element.querySelectorAll('[class*="IconBlock__StyledLiCol"], li'));
  const cells = [];

  items.forEach((item) => {
    // Extract icon/illustration image
    const img = item.querySelector('[class*="StyledImage"], img');
    // Extract link text
    const link = item.querySelector('[class*="ScLink"], a');

    const imageCell = img ? [img] : [];
    const textCell = link ? [link] : [];

    if (imageCell.length || textCell.length) {
      cells.push([imageCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
