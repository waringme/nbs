/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.nationwide.co.uk/
 * Selector: [class*='HeroContainerInner']
 * Structure: Row 1 = background image, Row 2 = heading + text + CTA
 */
export default function parse(element, { document }) {
  // Extract hero image from picture element
  const heroImg = element.querySelector('[class*="StyledHeroImage"], [class*="ImageColumn"] img, picture img');

  // Extract heading - "A good way to bank" with emphasis
  const heading = element.querySelector('[class*="StyledHeadingUi"], [class*="StyledEmphasisHeading"], h2, h1');

  // Extract description paragraphs
  const richText = element.querySelector('[class*="StyledRichText"], [class*="passthru"]');
  const paragraphs = richText ? Array.from(richText.querySelectorAll('p')) : [];

  // Extract CTA link/button
  const ctaLink = element.querySelector('[class*="StyledScLink"], [class*="LinkGroup"] a, a[class*="nel-Link-36"]');

  // Build cells matching hero block library structure:
  // Row 1: background image (optional)
  // Row 2: heading + subheading/text + CTA
  const cells = [];

  if (heroImg) {
    cells.push([heroImg]);
  }

  const contentCell = [];
  if (heading) contentCell.push(heading);
  paragraphs.forEach((p) => contentCell.push(p));
  if (ctaLink) contentCell.push(ctaLink);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
