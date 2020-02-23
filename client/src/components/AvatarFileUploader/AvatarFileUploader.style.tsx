import styled from 'styled-components/macro';

const AvatarContainer = styled.section<{ size?: string }>`
  position: relative;
  width: ${p => p.size || '130px'};
  height: ${p => p.size || '130px'};
  border: ${p => p.theme.border};
  border-radius: 100%;
  overflow: hidden;
  margin: 0px;

  .dropzone {
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: rgba(88, 111, 253, 0.9);
    color: ${p => p.theme.colors.common.white};
    opacity: 0;
    transform: scale(0.85);
    transition: 0.2s;
    cursor: pointer;

    p {
      margin: auto;
    }
    &:hover {
      transform: scaleY(1);
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
