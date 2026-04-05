/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-split. Base: columns.
 * Source: https://www.nationwide.co.uk/
 * Selector: [class*='SideBySideLayout__SideBySideGrid']:first-of-type
 * Structure: 2-col table, col1=Internet Banking content, col2=Search for Help content
 */
export default function parse(element, { document }) {
  // The SideBySideGrid has two Col children as the two columns
  const columns = Array.from(element.querySelectorAll(':scope > [class*="Col"]'));

  const cellRow = [];

  columns.forEach((col) => {
    const content = [];

    // Extract heading
    const heading = col.querySelector('h2, h3');
    if (heading) content.push(heading);

    // Extract paragraphs/rich text
    const richTexts = col.querySelectorAll('[class*="RichText"] p, [class*="passthru"] p');
    richTexts.forEach((p) => content.push(p));

    // Extract CTA buttons/links
    const links = Array.from(col.querySelectorAll('[class*="ButtonGroup"] a, [class*="LinkGroup"] a'));
    links.forEach((link) => content.push(link));

    // Extract link lists (popular searches)
    const linkList = col.querySelector('[class*="LinkList"], ul[class*="nel-List"]');
    if (linkList) {
      const listLinks = Array.from(linkList.querySelectorAll('a'));
      const ul = document.createElement('ul');
      listLinks.forEach((a) => {
        const li = document.createElement('li');
        li.appendChild(a.cloneNode(true));
        ul.appendChild(li);
      });
      if (ul.children.length > 0) content.push(ul);
    }

    cellRow.push(content);
  });

  const cells = [cellRow];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-split', cells });
  element.replaceWith(block);
}
