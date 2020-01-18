import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { ErrorMessage } from 'react-hook-form';
import { MentionsInput, Mention } from 'react-mentions';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import useFetch from 'hooks/useFetch';
import Flex from 'components/common/Flex';
import Avatar from 'components/Avatar/Avatar';
import { InputWrapper } from 'components/common/Form/Input';

import CodeBlock from './CodeBlock';
import MentionPlugin from './MentionPlugin';
import { StyledMentionList } from './Editor.style';

interface EditorProps {
  markdown: string;
  inputRef?: any;
  errors?: any;
  handleMarkdown?: (e: any) => void;
}

const Editor: React.FC<EditorProps> = ({
  markdown,
  inputRef,
  errors,
  handleMarkdown
}) => {
  const user = useSelector((state: any) => state.auth.user);
  const [references, setReferences] = useState<string[]>([]);

  // fetch mention suggetions
  const { data } = useFetch('/api/user');
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    if (data) {
      const users = data.data.map((user: any) => ({
        display: user.username,
        id: user.username
      }));
      setAllUsers(users);
    }
  }, [data]);

  const onMentionBug = (id: string) => {
    setReferences(() => {
      let refs = [id];
      return refs;
    });
  };

  return (
    <>
      <Tabs forceRenderTabPanel={true}>
        <Flex className="editor__header" align="center">
          <Avatar
            width="45px"
            height="45px"
            size={45}
            username={user.username}
          />
          <TabList>
            <Tab>Write</Tab>
            <Tab>Preview</Tab>
          </TabList>
        </Flex>
        <TabPanel>
          <InputWrapper>
            <StyledMentionList>
              <MentionsInput
                name="body"
                placeholder="Write Markdown"
                className="editor__tabpanel"
                inputRef={inputRef({ required: 'Body is required' })}
                value={markdown}
                onChange={handleMarkdown}
              >
                <Mention
                  className="mentions__item"
                  trigger="@"
                  displayTransform={(id: any) => `@${id} `}
                  data={allUsers}
                />
                <Mention
                  markup="{{__id__}} Yeah"
                  className="mentions__item"
                  trigger="#"
                  onAdd={onMentionBug}
                  displayTransform={(id: any) => `#${id} `}
                  data={allUsers}
                />
              </MentionsInput>
            </StyledMentionList>
          </InputWrapper>
        </TabPanel>
        <TabPanel>
          <ReactMarkdown
            className="editor__tabpanel markdown-preview"
            source={markdown}
            renderers={{
              code: CodeBlock,
              text: MentionPlugin
            }}
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
