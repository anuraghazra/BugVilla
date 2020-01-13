import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateLabelCheckbox } from 'store/ducks/single-bug';

import Flex from 'components/common/Flex';
import StyledDropdown from './Dropdown.style';

interface DropdownProps {
  isOpen?: boolean;
  options: any;
  renderItem: any;
  defaultChecked: any;
  className: string;
  children: React.ReactElement;
}
const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  options,
  renderItem,
  defaultChecked,
  className,
  children
}) => {
  const dispatch = useDispatch();
  const [checkedItems, setCheckedItems] = useState<any>({});

  useEffect(() => {
    // convert ['bug, 'feature] -> {bug: true, feature: true}
    if (defaultChecked) {
      let defaultCheckedItems = defaultChecked.reduce(
        (obj: any, item: any) => Object.assign(obj, { [item]: true }),
        {}
      );
      setCheckedItems(defaultCheckedItems);
    }
  }, []);

  const handleChange = (event: any) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked
    });
  };

  useEffect(() => {
    let labels = Object.entries(checkedItems)
      .map((e: any) => {
        return e[1] === true && e[0];
      })
      .filter(Boolean);
    dispatch(updateLabelCheckbox(labels));
  }, [checkedItems]);

  return (
    <StyledDropdown className={className} isOpen={isOpen}>
      <div className="dropdown__items">
        {options.map((item: any, i: number) => {
          return (
            <label
              key={i}
              className={`dropdown__item ${
                checkedItems[item.name] ? 'label__selected' : ''
              }`}
            >
              <input
                className="dropdown__checkbox"
                type="checkbox"
                name={item.name}
                checked={!!checkedItems[item.name]}
                onChange={handleChange}
              />
              <Flex>{renderItem(item.name)}</Flex>
            </label>
          );
        })}
      </div>
      {children}
    </StyledDropdown>
  );
};

export default Dropdown;
