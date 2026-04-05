/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo. Base: cards.
 * Source: https://www.nationwide.co.uk/
 * Selector: [class*='CardsGrid__StyledCardsGrid']
 * Structure: 2-col table, each row = one card (col1=image, col2=heading+text+CTA)
 *
 * Note: Card images are CSS background-images (not <img> tags) on the live site.
 * The parser extracts the background-image URL and creates an <img> element.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('[class*="ActionCard__ActionCardOuter"]'));
  const cells = [];

  cards.forEach((card) => {
    // Try <img> first (works in cleaned HTML), then fall back to background-image
    let img = card.querySelector('[class*="AspectRatioWrapper"] img, [class*="ActionCardImage"] img, [class*="BackgroundImage"] img');

    if (!img) {
      // Look for background-image on container divs inside the card
      const bgCandidates = card.querySelectorAll('[class*="BackgroundImage"], [class*="ActionCardImage"], [class*="AspectRatio"] div');
      for (const el of bgCandidates) {
        const style = el.getAttribute('style') || '';
        const bgMatch = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
        if (bgMatch) {
          img = document.createElement('img');
          img.src = bgMatch[1];
          break;
        }
        // Also check computed style (works when JS has rendered)
        const computed = el.ownerDocument.defaultView
          ? el.ownerDocument.defaultView.getComputedStyle(el).backgroundImage
          : '';
        const computedMatch = computed.match(/url\(["']?([^"')]+)["']?\)/);
        if (computedMatch) {
          img = document.createElement('img');
          img.src = computedMatch[1];
          break;
        }
      }
    }

    // Extract heading
    const heading = card.querySelector('[class*="ActionCardContent"] h2, h2, h3');

    // Extract description paragraphs
    const richText = card.querySelector('[class*="passthru"], [class*="richText"]');
    const paragraphs = richText ? Array.from(richText.querySelectorAll('p')) : [];

    // Extract CTA link
    const ctaLink = card.querySelector('[class*="CardCTATextLinks"] a, [class*="InlineScLink"]');

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
