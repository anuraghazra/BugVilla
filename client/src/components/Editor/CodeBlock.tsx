import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism as theme } from 'react-syntax-highlighter/dist/esm/styles/prism';

// import md from 'react-syntax-highlighter/dist/esm/languages/hljs/markdown';
// import html from 'react-syntax-highlighter/dist/esm/languages/hljs/htmlbars';
// import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';

// SyntaxHighlighter.registerLanguage('md', md);
// SyntaxHighlighter.registerLanguage('html', html);
// SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('jsx', jsx);

interface CodeBlockProps {
  language?: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value = '' }) => {
  if (!language) language = 'text';
  console.log({language})
  return (
    <SyntaxHighlighter language={language} style={theme}>
      {value}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
