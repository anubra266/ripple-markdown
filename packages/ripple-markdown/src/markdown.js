import { get } from 'ripple/internal/client';
import { effect } from 'ripple';
import { createProcessor, createFile, post } from './lib.js';
  
export function Markdown(anchor, props, block) {
    // Create a container element to hold all markdown content
    const container = document.createElement('div');
    container.style.display = 'contents'; // Make container transparent to layout
    anchor.before(container);
  
    effect(() => {
      // Access props reactively using get() for tracked values
      const { markdown, ...rest } = props || {};
      const markdownValue = get(markdown)
  
      // Also handle other props reactively
      const reactiveRest = {};
      for (const [key, value] of Object.entries(rest)) {
        reactiveRest[key] = get(value);
      }
  
      const processor = createProcessor(reactiveRest);
      const file = createFile(markdownValue);
      const result = post(processor.runSync(processor.parse(file), file), reactiveRest);
  
      // Clear container
      container.innerHTML = '';
  
      // Create a temporary anchor inside the container
      const tempAnchor = document.createTextNode('');
      container.appendChild(tempAnchor);
  
      // result is a JSX component function, call it to render the markdown
      if (typeof result === 'function') {
        result(tempAnchor, {}, block);
      } else {
        // If result is a string or other primitive, create a text node
        const textNode = document.createTextNode(String(result || ''));
        tempAnchor.before(textNode);
      }
  
      // Remove the temporary anchor
      tempAnchor.remove();
    });
  }
  