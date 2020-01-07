import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { githubGist as theme } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface Props {
  language?: string;
  value: string;
}
const CodeBlock: React.FC<Props> = ({ language, value }) => {
  if (!language) language = 'text';
  return (
    <SyntaxHighlighter language={language} style={theme}>
      {value}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
