import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ErrorMessage } from 'react-hook-form';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Avatar from 'components/Avatar/Avatar';
import Flex from 'components/common/Flex';
import { InputWrapper } from 'components/common/Form/Input';
import CodeBlock from './CodeBlock';
import { useSelector } from 'react-redux';

interface EditorProps {
  inputRef?: any;
  errors?: any;
}
const Editor: React.FC<EditorProps> = ({ inputRef, errors }) => {
  const user = useSelector((state: any) => state.auth.user);
  const [markdown, setMarkdown] = useState<string>('');

  const handleMarkdown = (e: any) => {
    setMarkdown(e.target.value);
  };

  return (
    <>
      <Tabs>
        <Flex className="editor__header" align="center">
          <Avatar
            width="45px"
            height="45px"
            src={`/api/user/${user.username}/avatar/raw?size=45`}
          />
          <TabList>
            <Tab>Write</Tab>
            <Tab>Preview</Tab>
          </TabList>
        </Flex>
        <TabPanel>
          <InputWrapper>
            <textarea
              name="body"
              ref={inputRef}
              onChange={handleMarkdown}
              value={markdown}
              placeholder="Write Markdown"
              className="editor__tabpanel-area"
            />
          </InputWrapper>
        </TabPanel>
        <TabPanel>
          <ReactMarkdown
            className="editor__tabpanel-area markdown-preview"
            source={markdown}
            renderers={{ code: CodeBlock }}
          />
        </TabPanel>
      </Tabs>
      {/* textarea error */}
      {errors && (
        <div
          className={`text--error ${errors['body'] && 'show-error'}`}
          style={{ marginLeft: 0 }}
        >
          <ErrorMessage errors={errors} name={'body'} />
        </div>
      )}
    </>
  );
};

export default Editor;
