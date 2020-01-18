import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateLabelCheckbox } from 'store/ducks/single-bug';

import Flex from 'components/common/Flex';
import { BulletLabel } from 'components/common/Label';
import BaseDropdown from 'components/common/BaseDropdown';

interface DropdownProps {
  trigger: (toggle: any) => any;
  defaultChecked: string[];
  className: string;
  children: any;
}

// initial data
let checkboxes = [
  { name: 'bug' },
  { name: 'feature' },
  { name: 'help wanted' },
  { name: 'enhancement' }
];
const LabelEditDropdown: React.FC<DropdownProps> = ({
  defaultChecked,
  className,
  children,
  trigger
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <BaseDropdown className={className} trigger={trigger}>
      {(toggleDropdown: any) => (
        <>
          <div className="dropdown__items">
            {checkboxes.map((item: any, i: number) => (
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
                <Flex>
                  <BulletLabel type={item.name}>{item.name}</BulletLabel>
                </Flex>
              </label>
            ))}
          </div>
          {children(toggleDropdown)}
        </>
      )}
    </BaseDropdown>
  );
};

export default LabelEditDropdown;
