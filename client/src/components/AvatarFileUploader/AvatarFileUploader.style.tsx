import styled from 'styled-components/macro';

const AvatarContainer = styled.section<{ size?: string; }>`
  position: relative;
  width: ${p => p.size || '130px'};
  height: ${p => p.size || '130px'};
  border: ${p => p.theme.border};
  border-radius: 100%;
  overflow: hidden;
  margin: 0px;

  .dropzone {
    position: absolute;
    width: 100%;
    height: 100%;
    line-height: 115px;
    text-align: center;
    background-color: rgba(88, 111, 253, 0.8);
    opacity: 0;
    cursor: pointer;
    color: ${p => p.theme.colors.common.white};

    &:hover {
      opacity: 1;
    }
  }

  .img__preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default AvatarContainer;
