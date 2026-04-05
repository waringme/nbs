var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const heroImg = element.querySelector('[class*="StyledHeroImage"], [class*="ImageColumn"] img, picture img');
    const heading = element.querySelector('[class*="StyledHeadingUi"], [class*="StyledEmphasisHeading"], h2, h1');
    const richText = element.querySelector('[class*="StyledRichText"], [class*="passthru"]');
    const paragraphs = richText ? Array.from(richText.querySelectorAll("p")) : [];
    const ctaLink = element.querySelector('[class*="StyledScLink"], [class*="LinkGroup"] a, a[class*="nel-Link-36"]');
    const cells = [];
    if (heroImg) {
      cells.push([heroImg]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    paragraphs.forEach((p) => contentCell.push(p));
    if (ctaLink) contentCell.push(ctaLink);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse2(element, { document }) {
    const items = Array.from(element.querySelectorAll('[class*="IconBlock__StyledLiCol"], li'));
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector('[class*="StyledImage"], img');
      const link = item.querySelector('[class*="ScLink"], a');
      const imageCell = img ? [img] : [];
      const textCell = link ? [link] : [];
      if (imageCell.length || textCell.length) {
        cells.push([imageCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll('[class*="ActionCard__ActionCardOuter"]'));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector('[class*="ActionCardImage"] img, [class*="BackgroundImage"] img, img');
      const heading = card.querySelector('[class*="ActionCardContent"] h2, h2, h3');
      const richText = card.querySelector('[class*="passthru"], [class*="richText"]');
      const paragraphs = richText ? Array.from(richText.querySelectorAll("p")) : [];
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
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse4(element, { document }) {
    const grid = element.closest('[class*="vertical-rhythm--image-with-content"]') || element.parentElement;
    const imgArea = grid.querySelector('[class*="ImageWithContent__StyledImageArea"], [class*="ImageUi__Container"]');
    const img = imgArea ? imgArea.querySelector('[class*="DesktopImage"] img, [class*="MobileImage"] img, img') : null;
    const contentArea = grid.querySelector('[class*="ImageWithContent__StyledContentArea"]') || grid.querySelector('[class*="StyledContentArea"]');
    const heading = contentArea ? contentArea.querySelector("h2, h3") : null;
    const description = contentArea ? contentArea.querySelector('[class*="RichText"] p, [class*="passthru"] p') : null;
    const listItems = contentArea ? Array.from(contentArea.querySelectorAll("ul li")) : [];
    const ul = document.createElement("ul");
    listItems.forEach((li) => {
      const newLi = document.createElement("li");
      const text = li.querySelector('[class*="passthru"] p, p');
      if (text) newLi.textContent = text.textContent;
      else newLi.textContent = li.textContent.trim();
      ul.appendChild(newLi);
    });
    const ctaLink = contentArea ? contentArea.querySelector('[class*="ButtonGroup"] a, a[class*="nel-Link-36"]') : null;
    const imageCell = img ? [img] : [];
    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    if (ul.children.length > 0) textCell.push(ul);
    if (ctaLink) textCell.push(ctaLink);
    const cells = [[imageCell, textCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-split.js
  function parse5(element, { document }) {
    const columns = Array.from(element.querySelectorAll(':scope > [class*="Col"]'));
    const cellRow = [];
    columns.forEach((col) => {
      const content = [];
      const heading = col.querySelector("h2, h3");
      if (heading) content.push(heading);
      const richTexts = col.querySelectorAll('[class*="RichText"] p, [class*="passthru"] p');
      richTexts.forEach((p) => content.push(p));
      const links = Array.from(col.querySelectorAll('[class*="ButtonGroup"] a, [class*="LinkGroup"] a'));
      links.forEach((link) => content.push(link));
      const linkList = col.querySelector('[class*="LinkList"], ul[class*="nel-List"]');
      if (linkList) {
        const listLinks = Array.from(linkList.querySelectorAll("a"));
        const ul = document.createElement("ul");
        listLinks.forEach((a) => {
          const li = document.createElement("li");
          li.appendChild(a.cloneNode(true));
          ul.appendChild(li);
        });
        if (ul.children.length > 0) content.push(ul);
      }
      cellRow.push(content);
    });
    const cells = [cellRow];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-ranking.js
  function parse6(element, { document }) {
    const columns = Array.from(element.querySelectorAll(':scope > [class*="Col"]'));
    const cellRow = [];
    columns.forEach((col) => {
      const content = [];
      const heading = col.querySelector("h3, h2");
      if (heading) content.push(heading);
      const img = col.querySelector('[class*="DesktopImage"] img, [class*="GenericImage"] img, img');
      if (img) content.push(img);
      const richTexts = col.querySelectorAll('[class*="RichText"] p, [class*="passthru"] p');
      richTexts.forEach((p) => content.push(p));
      const ctaLink = col.querySelector('[class*="ButtonGroup"] a, [class*="LinkGroup"] a');
      if (ctaLink) content.push(ctaLink);
      cellRow.push(content);
    });
    const cells = [cellRow];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-ranking", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/nationwide-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".onetrust-pc-dark-filter"
      ]);
      WebImporter.DOMUtils.remove(element, [
        '[class*="Overlay__OverlayContainer"]',
        '[class*="Drawer__StyledDrawer"]'
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        '[class*="SkipLinks__StyledSkip"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        '[class*="globalNavigation__BackgroundColour"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        'header[class*="BaseMasthead"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        '[class*="NavigationDesktop"]',
        '[class*="NavigationMobile"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        '[class*="footerContainer"]',
        '[class*="footerV2"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("data-analytics");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/nationwide-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const document = element.ownerDocument || element.getRootNode();
      const sectionMarkers = [
        // Section 1: Hero - [class*='HeroContainerInner']
        { selector: "[class*='HeroContainerInner']", style: null },
        // Section 2: Product Quick Links - contains EmphasisHeading "What are you looking for today?"
        { selector: "[class*='EmphasisHeadingRendering']", style: null },
        // Section 3: Promotional Cards - CardsGrid
        { selector: "[class*='CardsGrid__StyledCardsGrid']", style: null },
        // Section 4: Call Checker - ImageWithContent (dark section)
        { selector: "[class*='ImageWithContent__StyledImageArea']", style: "dark" },
        // Section 5: Internet Banking and Help - first SideBySideLayout
        { selector: "[class*='SideBySideLayout__SideBySideGrid']", style: null },
        // Section 6: Service Quality - ContentWithSidebar
        { selector: "[class*='ContentWithSidebar__ContentWithSideBarGrid']", style: null }
      ];
      const foundSections = [];
      for (const marker of sectionMarkers) {
        const el = document.querySelector(marker.selector) || element.querySelector(marker.selector);
        if (el) {
          foundSections.push({ el, style: marker.style });
        }
      }
      for (let i = foundSections.length - 1; i >= 0; i--) {
        const { el, style } = foundSections[i];
        if (style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style }
          });
          el.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          el.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "cards-icon": parse2,
    "cards-promo": parse3,
    "columns-feature": parse4,
    "columns-split": parse5,
    "columns-ranking": parse6
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Nationwide Building Society homepage with hero banner, product quick links, promotional cards, feature section, and regulatory content",
    urls: [
      "https://www.nationwide.co.uk/"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: ["[class*='HeroContainerInner']"]
      },
      {
        name: "cards-icon",
        instances: ["ol[class*='IconBlock__StyledOl']"]
      },
      {
        name: "cards-promo",
        instances: ["[class*='CardsGrid__StyledCardsGrid']"]
      },
      {
        name: "columns-feature",
        instances: ["[class*='ImageWithContent__StyledImageArea']"]
      },
      {
        name: "columns-split",
        instances: ["[class*='SideBySideLayout__SideBySideGrid']:first-of-type"]
      },
      {
        name: "columns-ranking",
        instances: ["[class*='ContentWithSidebar'] ~ [class*='SideBySideLayout__SideBySideGrid']"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "[class*='HeroContainerInner']",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Product Quick Links",
        selector: "[class*='EmphasisHeadingRendering']",
        style: null,
        blocks: ["cards-icon"],
        defaultContent: ["[class*='EmphasisHeadingRendering__StyledEmphasisHeading']"]
      },
      {
        id: "section-3",
        name: "Promotional Cards",
        selector: "[class*='CardsGrid__StyledCardsGrid']",
        style: null,
        blocks: ["cards-promo"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Call Checker Feature",
        selector: "[class*='ImageWithContent__StyledImageArea']",
        style: "dark",
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Internet Banking and Help",
        selector: "[class*='SideBySideLayout__SideBySideGrid']",
        style: null,
        blocks: ["columns-split"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Service Quality and Regulatory",
        selector: "[class*='ContentWithSidebar__ContentWithSideBarGrid']",
        style: null,
        blocks: ["columns-ranking"],
        defaultContent: ["[class*='ContentWithSidebar__ContentWithSideBarGrid']", "[class*='FullWidthLayout__ContainerWrapper']:last-of-type"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
