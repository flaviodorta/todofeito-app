import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { onKeyUpEnter } from '../helpers/functions';
import { ISection } from '../helpers/types';
// import { useTodosStore } from '../zustand';

interface IEditSectionProps {
  section: ISection;
  editSection: (section: ISection) => void;
  setSectionInputOpenById: (id: string | null) => void;
}

export const EditSection = ({
  section,
  editSection,
  setSectionInputOpenById,
}: IEditSectionProps) => {
  // const { editSection } = useTodosStore();
  const [inputs, setInputs] = useState({
    title: section.title,
  });

  const close = () => setSectionInputOpenById(null);

  const sendEditedSection = () => {
    editSection({
      ...section,
      title: inputs.title,
    });

    close();
  };

  const sectionNameInputRef = useRef<HTMLInputElement>(null);

  const createNewSectionOnKeyEnterInputSectionName = onKeyUpEnter(
    sendEditedSection,
    sectionNameInputRef
  );

  const { t } = useTranslation();

  return (
    <div className='w-full flex flex-col gap-2'>
      <input
        ref={sectionNameInputRef}
        id='project-name'
        type='text'
        value={inputs.title}
        placeholder='Name this section'
        maxLength={120}
        onChange={(e) => setInputs({ title: e.target.value })}
        onKeyUp={createNewSectionOnKeyEnterInputSectionName}
        className='placeholder:font-bold placeholder:text-gray-500 outline-none text-sm h-7 rounded-[3px] py-1 px-2 border-gray-300 focus:border-gray-400 border-[1px] duration-150 transition-all'
      />

      <div className='flex gap-2'>
        <button
          onClick={sendEditedSection}
          className={`${
            !inputs.title
              ? 'cursor-not-allowed bg-blue-400'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-center w-fit select-none p-2 outline-none rounded-sm font-medium text-sm h-fit text-white hover:text-gray-200`}
        >
          {t('EditSection.addSection')}
        </button>

        <div className='flex gap-2'>
          <button
            onClick={close}
            className='text-center select-none p-2 outline-none rounded-sm font-medium text-sm h-fit w-fit bg-gray-200 hover:bg-gray-300 hover:text-700 text-gray-600'
          >
            {t('EditSection.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
