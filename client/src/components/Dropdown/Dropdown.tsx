import React, { useState } from 'react';
import styled from 'styled-components';
import Flex from 'components/common/Flex';

const StyledDropdown = styled.div`
  width: fit-content;
  padding: 15px 20px;
  border-radius: 5px;

  background-color: ${p => p.theme.colors.common.offwhite};

  .dropdown__items {
    .dropdown__item {
      margin: 5px 0;
      cursor: pointer;
    }
  }
`;

interface DropdownProps {
  options: any;
  renderItem: any;
}
const Dropdown: React.FC<DropdownProps> = ({ options, renderItem }) => {
  const [selected, setSelected] = useState<any>(0);

  // const handleSelected = (i: number) => {
  //   setSelected({ ...selected, [i]: true });
  // };
  const handleSelected = (e: any) => {
    setSelected(e.target.getAttribute('data-index') === selected);
  };
  return (
    <StyledDropdown>
      <div className="dropdown__items">
        {options.map((value: any, i: number) => (
          <div
            key={i}
            data-index={i}
            data-selected={i === selected}
            onClick={handleSelected}
            className="dropdown__item"
          >
            <Flex>
              {renderItem(value)}
              {/* {Object.keys(selected).map((s: any) => {
                console.log(s, i);
                return s == i ? '✅' : '';
              })} */}
              {/* {Object.keys(selected).map((s: any) => {
                console.log(s, i);
                return s == i ? '✅' : '';
              })} */}
            </Flex>
          </div>
        ))}
      </div>
    </StyledDropdown>
  );
};

export default Dropdown;
