import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function LectureToggle({ onToggle, isActive }) {
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    setIsToggled(isActive);
  }, [isActive]);

  const handleToggle = () => {
    const newToggleState = !isToggled;
    setIsToggled(newToggleState);
    onToggle(newToggleState);
  };

  return (
    <Switch.Group as="div" className="flex justify items-end flex-col mt-3">
      <span className="flex-grow flex flex-col">
        <Switch.Description as="span" className="text-sm text-gray-500 mb-2">
          강의를 시작하려면 토글을 켜세요.
        </Switch.Description>
      </span>
      <Switch
        checked={isToggled}
        onChange={handleToggle}
        className={classNames(
          isToggled ? 'bg-blue-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            isToggled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
