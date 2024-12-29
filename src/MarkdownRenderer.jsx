import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';  // Choose a theme for syntax highlighting

// Optionally import other Prism languages you might need
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
// Add other languages as needed

const MarkdownRenderer = ({ content }) => {
  const contentRef = useRef(null);
  var data = content?content:'';
  useEffect(() => {
    // Parse markdown to HTML
    const htmlContent = marked(data);
    
    // Insert the HTML into the component's div
    if (contentRef.current) {
      contentRef.current.innerHTML = htmlContent;

      // Syntax highlighting using Prism
      Prism.highlightAll();
    }
  }, [data]);

  return (
    <div ref={contentRef} className="markdown-content border-2 border-gray-300 h-[400px] w-[1200px] overflow-auto" />
  );
};

export default MarkdownRenderer;

