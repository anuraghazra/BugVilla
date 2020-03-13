import React from 'react';

const TWEMOJIS: any = {
  ':+1:': '1f44d.svg',
  ':-1:': '1f44e.svg',
  ':heart:': '2764.svg',
  ':confused:': '1f615.svg',
  ':tada:': '1f389.svg',
  ':smile:': '1f604.svg'
};

const twemojiStyles = {
  width: '1em',
  height: '1em',
  margin: '0px 0.05em 0px 0.1em',
  verticalAlign: '-0.1em'
};
export const Twemoji: React.FC<{ emoji: string; [x: string]: any }> = ({
  emoji,
  ...props
}) => {
  return (
    <img
      src={`http://twemoji.maxcdn.com/2/svg/${TWEMOJIS[emoji]}`}
      alt={'emoji'}
      style={twemojiStyles}
      {...props}
    />
  );
};

export default React.memo(Twemoji);
