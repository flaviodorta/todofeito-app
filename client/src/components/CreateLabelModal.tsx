import { Backdrop } from './Backdrop';
import { SelectColor } from './Selects/SelectColors';
import { useTodosStore } from '../zustand';
import { useEffect, useRef, useState } from 'react';
import { onKeyUpEnter } from '../helpers/functions';
import { ILabel } from '../helpers/types';
import { nanoid } from 'nanoid';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ICreateLabelModalProps {
  closeModal: () => void;
}

export const CreateLabelModal = ({ closeModal }: ICreateLabelModalProps) => {
  const { addLabel } = useTodosStore();
  const { t } = useTranslation();

  const [inputs, setInputs] = useState({
    title: '',
    color: {
      name: t('colors.stone'),
      class: 'fill-stone-600',
    },
  });

  const setColor = (color: { name: string; class: string }) =>
    setInputs((state) => ({ ...state, color }));

  const setTitle = (title: string) =>
    setInputs((state) => ({ ...state, title }));

  const createNewLabel = () => {
    if (!inputs.title) return;

    const label: ILabel = {
      id: nanoid(),
      type: 'label',
      title: inputs.title,
      color: inputs.color,
    };

    addLabel(label);

    closeModal();
  };

  const projectNameInputRef = useRef<HTMLInputElement>(null);

  const createNewProjectOnKeyEnterInputProjectName = onKeyUpEnter(
    createNewLabel,
    projectNameInputRef
  );

  useEffect(() => {
    projectNameInputRef?.current?.focus();
  }, []);

  return (
    <Backdrop close={closeModal} className='z-[1000] bg-black/50'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className='fixed left-1/2 top-40 w-[90%] sm:w-96 h-fit -translate-x-1/2 z-100 bg-white rounded-lg'
      >
        <div className='py-3 px-6 text-center'>
          <span className='text-lg font-medium'>
            {t('CreateLabelModal.addLabel')}
          </span>
        </div>

        <hr className='border-gray-300' />

        <div className='py-5 px-6'>
          <form className='w-full flex flex-col gap-1 mb-4'>
            <div className='flex justify-between'>
              <label htmlFor='label-name' className='text-sm font-medium'>
                {t('CreateLabelModal.labelTitle')}
              </label>
              {inputs.title.length >= 100 && (
                <span className='text-xs text-red-600 font-light'>
                  {t('CreateLabelModal.characterLimit')}: {inputs.title.length}
                  /120
                </span>
              )}
            </div>
            <input
              ref={projectNameInputRef}
              id='label-name'
              type='text'
              value={inputs.title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              onKeyUp={createNewProjectOnKeyEnterInputProjectName}
              className='outline-none text-sm h-7 rounded-[3px] py-1 px-2 border-gray-300 focus:border-gray-400 border-[1px] duration-150 transition-all'
            />
          </form>

          <form className='relative w-full flex flex-col gap-1 mb-8'>
            <label htmlFor='project-color' className='text-sm font-medium'>
              {t('CreateLabelModal.labelColor')}
            </label>

            <SelectColor inputedColor={inputs.color} setColor={setColor} />
          </form>

          <div className='flex justify-end gap-2'>
            <button
              onClick={closeModal}
              className='text-center select-none p-2 outline-none rounded-sm font-medium text-sm h-fit w-fit bg-gray-200 hover:bg-gray-300 hover:text-700 text-gray-600'
            >
              {t('CreateLabelModal.cancel')}
            </button>

            <button
              onClick={createNewLabel}
              onSubmit={(e) => {
                createNewLabel();
              }}
              className={`${
                !inputs.title
                  ? 'cursor-not-allowed bg-blue-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-center select-none py-2 px-4 outline-none rounded-sm font-medium text-sm h-fit w-fit text-white hover:text-gray-200`}
            >
              {t('CreateLabelModal.add')}
            </button>
          </div>
        </div>
      </motion.div>
    </Backdrop>
  );
};
