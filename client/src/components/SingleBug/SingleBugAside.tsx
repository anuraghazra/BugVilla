import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editLabels } from 'store/ducks/single-bug';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from 'components/Dropdown/Dropdown';
import Label, { BulletLabel } from 'components/common/Label';
import Flex from 'components/common/Flex';
import Avatar from 'components/Avatar/Avatar';
import Button from 'components/common/Button';
import Toast from 'components/common/Toast';

// get unique avatar images from all comments
const getParticipants = (bug: any): string[] => {
  if (bug && bug.comments) {
    return bug.comments
      .map((c: any) => `/api/user/${c.author.username}/avatar/raw?size=45`)
      .filter(
        (item: string, pos: number, array: string[]) =>
          array.indexOf(item) === pos
      );
  }
  return [];
};

interface SingleBugAsideProps {
  bugId: number | string;
  bug: any;
}
const SingleBugAside: React.FC<SingleBugAsideProps> = ({ bugId, bug }) => {
  const dispatch = useDispatch();
  const [isDropdownOpen, setDropdownState] = useState(false);

  const selectedLabels = useSelector(
    (state: any) => state.singlebug.labelsCheckbox
  );
  const [labelEditPending, labelEditError] = useSelector((state: any) => [
    state.loading['singlebug/EDIT_LABELS'],
    state.error['singlebug/EDIT_LABELS']
  ]);

  const openDropdown = () => {
    setDropdownState(true);
  };
  const closeDropdown = (e: any) => {
    if (e.target.closest('.label__header')) return;
    if (!e.target.closest('.label__dropdown')) {
      setDropdownState(false);
    }
  };

  const handleSaveLabel = () => {
    if (selectedLabels.length > 0) {
      dispatch(editLabels(bugId, selectedLabels));
    }
  };

  useEffect(() => {
    return document.body.addEventListener('click', closeDropdown);
  }, []);

  let participants: string[] = getParticipants(bug);

  // initial data
  let checkboxes = [
    { name: 'bug' },
    { name: 'feature' },
    { name: 'help wanted' },
    { name: 'enhancement' }
  ];

  return (
    <>
      <div>
        <Toast isVisible={!!labelEditError} message={labelEditError} />

        <h4 className="label__header color--gray">
          Labels{' '}
          <FontAwesomeIcon
            className="open_modal_btn"
            onClick={openDropdown}
            size="sm"
            icon="cog"
          />
          <Dropdown
            defaultChecked={bug.labels}
            className="label__dropdown"
            isOpen={isDropdownOpen}
            options={checkboxes}
            renderItem={(value: any) => (
              <BulletLabel type={value}>{value}</BulletLabel>
            )}
          >
            <Button
              icon="tag"
              size="sm"
              isLoading={labelEditPending}
              onClick={handleSaveLabel}
            >
              Update labels
            </Button>
          </Dropdown>
        </h4>
        <Flex>
          {bug.labels.length > 0 &&
            bug.labels.map((label: string, i: number) => (
              <Label className="mt-5" type={label} key={i}>
                {label}
              </Label>
            ))}
        </Flex>
      </div>
      <div>
        <h4 className="color--gray">{participants.length} participants</h4>
        <Flex>
          {participants.map((participant: any, i: number) => (
            <Avatar
              key={i}
              width="40px"
              height="40px"
              src={participant}
              style={{ marginRight: 10 }}
            />
          ))}
        </Flex>
      </div>
    </>
  );
};

export default SingleBugAside;
