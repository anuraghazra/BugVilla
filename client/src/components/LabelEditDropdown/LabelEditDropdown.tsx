import React, { useState, useEffect } from 'react';
import { BulletLabel, BaseDropdown } from '@bug-ui';

interface DropdownProps {
  updateSelectedLabels: (labels: string[]) => void;
  trigger: (toggle: any) => any;
  defaultChecked: string[];
  className: string;
  children: any;
}

// initial data
let checkboxes: string[] = ['bug', 'feature', 'help wanted', 'enhancement'];

const LabelEditDropdown: React.FC<DropdownProps> = ({
  updateSelectedLabels,
  defaultChecked,
  className,
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
    <BaseDropdown className={className} trigger={trigger}>
      {(toggleDropdown: any) => (
        <>
          <div className="dropdown__items">
            {checkboxes.map(name => (
              <label
                key={name}
                className={`dropdown__item ${
                  checkedItems.includes(name) ? 'label__selected' : ''
                }`}
              >
                <input
                  className="dropdown__checkbox"
                  type="checkbox"
                  name={name}
                  checked={!!checkedItems.includes(name)}
                  onChange={handleChange}
                />
                <BulletLabel type={name}>{name}</BulletLabel>
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
