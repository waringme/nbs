export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-split-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-split-img-col');
        }
      }
    });
  });

  // Style standalone links as buttons (links that are the only child of their parent div)
  block.querySelectorAll(':scope > div > div > p > a:only-child').forEach((link, index) => {
    const p = link.parentElement;
    // Only style links that look like CTAs (not inline links within text)
    if (p && p.childNodes.length === 1) {
      p.classList.add('button-container');
      link.classList.add('button');
      if (index === 0) link.classList.add('primary');
    }
  });
}
