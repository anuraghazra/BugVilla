import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { githubGist as theme } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import md from 'react-syntax-highlighter/dist/esm/languages/hljs/markdown';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('md', md);
SyntaxHighlighter.registerLanguage('css', css);

interface CodeBlockProps {
  language?: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value = '' }) => {
  if (!language) language = 'text';

  return (
    <SyntaxHighlighter language={language} style={theme}>
      {value}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
