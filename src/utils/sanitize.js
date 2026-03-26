// src/utils/sanitize.js
import DOMPurify from 'dompurify';

// Configure DOMPurify for news content
const configureDOMPurify = () => {
  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    // Allow certain HTML tags for rich text
    const allowedTags = [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4',
      'ul', 'ol', 'li', 'a', 'blockquote', 'pre', 'code',
      'img', 'figure', 'figcaption'
    ];
    
    if (!allowedTags.includes(data.tagName)) {
      node.remove();
    }
  });
  
  DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
    // Only allow safe attributes
    const allowedAttrs = ['href', 'src', 'alt', 'title', 'class'];
    if (!allowedAttrs.includes(data.attrName)) {
      data.keepAttr = false;
    }
    
    // Prevent javascript: URLs
    if (data.attrName === 'href' && data.attrValue.startsWith('javascript:')) {
      data.keepAttr = false;
    }
  });
};

configureDOMPurify();

export const sanitizeContent = (content) => {
  if (!content) return '';
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4',
      'ul', 'ol', 'li', 'a', 'blockquote', 'pre', 'code',
      'img', 'figure', 'figcaption'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target'],
    ALLOW_DATA_ATTR: false
  });
};

export const sanitizeInput = (input) => {
  if (!input) return '';
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};
