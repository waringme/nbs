/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo. Base: cards.
 * Source: https://www.nationwide.co.uk/
 * Selector: [class*='CardsGrid__StyledCardsGrid']
 * Structure: 2-col table, each row = one card (col1=image, col2=heading+text+CTA)
 */
export default function parse(element, { document }) {
  // Each ActionCard is one promotional card
  const cards = Array.from(element.querySelectorAll('[class*="ActionCard__ActionCardOuter"]'));
  const cells = [];

  cards.forEach((card) => {
    // Extract card image
    const img = card.querySelector('[class*="ActionCardImage"] img, [class*="BackgroundImage"] img, img');

    // Extract heading
    const heading = card.querySelector('[class*="ActionCardContent"] h2, h2, h3');

    // Extract description paragraphs
    const richText = card.querySelector('[class*="passthru"], [class*="richText"]');
    const paragraphs = richText ? Array.from(richText.querySelectorAll('p')) : [];

    // Extract CTA link
    const ctaLink = card.querySelector('[class*="CardCTATextLinks"] a, [class*="InlineScLink"], a');

    const imageCell = img ? [img] : [];
    const textCell = [];
    if (heading) textCell.push(heading);
    paragraphs.forEach((p) => textCell.push(p));
    if (ctaLink) textCell.push(ctaLink);

    if (imageCell.length || textCell.length) {
      cells.push([imageCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
