/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsPromoParser from './parsers/cards-promo.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import columnsSplitParser from './parsers/columns-split.js';
import columnsRankingParser from './parsers/columns-ranking.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/nationwide-cleanup.js';
import sectionsTransformer from './transformers/nationwide-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-icon': cardsIconParser,
  'cards-promo': cardsPromoParser,
  'columns-feature': columnsFeatureParser,
  'columns-split': columnsSplitParser,
  'columns-ranking': columnsRankingParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Nationwide Building Society homepage with hero banner, product quick links, promotional cards, feature section, and regulatory content',
  urls: [
    'https://www.nationwide.co.uk/'
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ["[class*='HeroContainerInner']"]
    },
    {
      name: 'cards-icon',
      instances: ["ol[class*='IconBlock__StyledOl']"]
    },
    {
      name: 'cards-promo',
      instances: ["[class*='CardsGrid__StyledCardsGrid']"]
    },
    {
      name: 'columns-feature',
      instances: ["[class*='ImageWithContent__StyledImageArea']"]
    },
    {
      name: 'columns-split',
      instances: ["[class*='SideBySideLayout__SideBySideGrid']:first-of-type"]
    },
    {
      name: 'columns-ranking',
      instances: ["[class*='ContentWithSidebar'] ~ [class*='SideBySideLayout__SideBySideGrid']"]
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: "[class*='HeroContainerInner']",
      style: null,
      blocks: ['hero-banner'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Product Quick Links',
      selector: "[class*='EmphasisHeadingRendering']",
      style: null,
      blocks: ['cards-icon'],
      defaultContent: ["[class*='EmphasisHeadingRendering__StyledEmphasisHeading']"]
    },
    {
      id: 'section-3',
      name: 'Promotional Cards',
      selector: "[class*='CardsGrid__StyledCardsGrid']",
      style: null,
      blocks: ['cards-promo'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Call Checker Feature',
      selector: "[class*='ImageWithContent__StyledImageArea']",
      style: 'dark',
      blocks: ['columns-feature'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Internet Banking and Help',
      selector: "[class*='SideBySideLayout__SideBySideGrid']",
      style: null,
      blocks: ['columns-split'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Service Quality and Regulatory',
      selector: "[class*='ContentWithSidebar__ContentWithSideBarGrid']",
      style: null,
      blocks: ['columns-ranking'],
      defaultContent: ["[class*='ContentWithSidebar__ContentWithSideBarGrid']", "[class*='FullWidthLayout__ContainerWrapper']:last-of-type"]
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
