import React from 'react';
import Button from 'components/common/Button';

const CloseReopenButton = ({
  handleRequst,
  isOpen,
  isLoading
}: {
  handleRequst: any;
  isOpen: boolean;
  isLoading: boolean;
}) => (
  <Button
    isLoading={isLoading}
    danger={isOpen}
    success={!isOpen}
    icon={isOpen ? 'times' : 'history'}
    onClick={(e: any) => {
      e.preventDefault();
      handleRequst(isOpen ? 'close' : 'open');
    }}
  >
    {isOpen ? 'Close' : 'Reopen'}
  </Button>
);

export default CloseReopenButton;
