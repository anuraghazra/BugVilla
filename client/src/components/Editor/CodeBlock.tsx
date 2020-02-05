import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { githubGist as theme } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeBlockProps {
  language?: string;
  value: string;
}

// not sure if it's a good idea
const htmlDecode = (input: string) => {
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value = '' }) => {
  if (!language) language = 'text';

  return (
    <SyntaxHighlighter language={language} style={theme}>
      {htmlDecode(value)}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
