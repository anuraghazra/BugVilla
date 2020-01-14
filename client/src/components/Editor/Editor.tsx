import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { ErrorMessage } from 'react-hook-form';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Flex from 'components/common/Flex';
import Avatar from 'components/Avatar/Avatar';
import { InputWrapper } from 'components/common/Form/Input';
import CodeBlock from './CodeBlock';

interface EditorProps {
  markdown: string;
  inputRef?: any;
  errors?: any;
}
const Editor: React.FC<EditorProps> = ({ markdown, inputRef, errors }) => {
  const user = useSelector((state: any) => state.auth.user);

  return (
    <>
      <Tabs forceRenderTabPanel={true}>
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
              defaultValue={markdown}
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
