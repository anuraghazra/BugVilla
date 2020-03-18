import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { BulletLabel, Dropdown } from '@bug-ui';

const StyledLabelEditDropdown = styled.div`
  .label__dropdown--content {
    position: absolute;
    text-align: center;
    top: 30px;
    left: 0;

    @media screen and (${p => p.theme.media.mobile}) {
      left: 30px;
    }
  }

  .dropdown__item {
    min-width: 150px;
    display: block;
    margin: 10px 0;
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid transparent;
    &:hover {
      background-color: ${p => p.theme.colors.offwhite};
    }
  }
  .label__selected {
    background-color: ${p => p.theme.colors.offwhite};
    border: 1px solid ${p => p.theme.colors.secondary};
  }

  .dropdown__checkbox {
    display: none;
  }
`;

interface LabelDropdownProps {
  trigger: any;
  defaultChecked: string[];
  updateSelectedLabels: (labels: string[]) => void;
  children(close: any): React.ReactElement;
}

// initial data
let checkboxes: string[] = ['bug', 'feature', 'help wanted', 'enhancement'];

const LabelEditDropdown: React.FC<LabelDropdownProps> = ({
  updateSelectedLabels,
  defaultChecked,
  children,
  trigger
}) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  useEffect(() => {
    if (defaultChecked) {
      setCheckedItems(defaultChecked);
    }
  }, []);

  useEffect(() => {
    updateSelectedLabels(checkedItems);
  }, [checkedItems]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.name;
    let newItems = checkedItems;
    if (newItems.includes(value)) {
      newItems.splice(newItems.indexOf(value), 1);
    } else {
      newItems = [...newItems, value];
    }
    setCheckedItems([...newItems]);
  };

  return (
    <StyledLabelEditDropdown>
      <Dropdown>
        <Dropdown.Toggle>{trigger}</Dropdown.Toggle>
        <Dropdown.Content className={'label__dropdown--content'}>
          {checkboxes.map(name => {
            let selectedClass = checkedItems.includes(name)
              ? 'label__selected'
              : '';

            return (
              <label key={name} className={`dropdown__item ${selectedClass}`}>
                <input
                  name={name}
                  type="checkbox"
                  onChange={handleChange}
                  checked={!!checkedItems.includes(name)}
                  className="dropdown__checkbox"
                />
                <BulletLabel type={name}>{name}</BulletLabel>
              </label>
            );
          })}
          <Dropdown.Toggle>
            {(_toggle, close) => children(close)}
          </Dropdown.Toggle>
        </Dropdown.Content>
      </Dropdown>
    </StyledLabelEditDropdown>
  );
};

export default LabelEditDropdown;
