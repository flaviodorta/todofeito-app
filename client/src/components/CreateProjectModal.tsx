import { Backdrop } from './Backdrop';
import { SelectColor } from './Selects/SelectColors';
import { useTodosStore } from '../zustand';
import { useEffect, useRef, useState } from 'react';
import { onKeyUpEnter } from '../helpers/functions';
import { IProject } from '../helpers/types';
import { nanoid } from 'nanoid';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ICreateProjectModalProps {
  closeModal: () => void;
}

export const CreateProjectModal = ({
  closeModal,
}: ICreateProjectModalProps) => {
  const { addProject } = useTodosStore();
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
    setInputs((state) => ({ ...state, title: title }));

  const createNewProject = () => {
    if (!inputs.title) return;

    const project: IProject = {
      id: nanoid(),
      type: 'project',
      title: inputs.title,
      color: inputs.color,
    };

    addProject(project);

    closeModal();
  };

  const projectNameInputRef = useRef<HTMLInputElement>(null);
  const createNewProjectOnKeyEnterInputProjectName = onKeyUpEnter(
    createNewProject,
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
            {t('CreateProjectModal.addProject')}
          </span>
        </div>

        <hr className='border-gray-300' />

        <div className='py-5 px-6'>
          <div className='w-full flex flex-col gap-1 mb-4'>
            <div className='flex justify-between'>
              <label htmlFor='project-name' className='text-sm font-medium'>
                {t('CreateProjectModal.title')}
              </label>
              {inputs.title.length >= 100 && (
                <span className='text-xs text-red-600 font-light'>
                  {t('CreateProjectModal.title')}: {inputs.title.length}/120
                </span>
              )}
            </div>
            <input
              ref={projectNameInputRef}
              id='project-name'
              type='text'
              value={inputs.title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              onKeyUp={createNewProjectOnKeyEnterInputProjectName}
              className='outline-none text-sm h-7 rounded-[3px] py-1 px-2 border-gray-300 focus:border-gray-400 border-[1px] duration-150 transition-all'
            />
          </div>

          <div className='relative w-full flex flex-col gap-1 mb-8'>
            <label htmlFor='project-color' className='text-sm font-medium'>
              {t('CreateProjectModal.color')}
            </label>

            <SelectColor inputedColor={inputs.color} setColor={setColor} />
          </div>

          <div className='flex justify-end gap-2'>
            <button
              onClick={closeModal}
              className='text-center select-none p-2 outline-none rounded-sm font-medium text-sm h-fit w-fit bg-gray-200 hover:bg-gray-300 hover:text-700 text-gray-600'
            >
              {t('CreateProjectModal.cancel')}
            </button>

            <button
              onClick={createNewProject}
              className={`${
                !inputs.title
                  ? 'cursor-not-allowed bg-blue-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-center select-none py-2 px-4 outline-none rounded-sm font-medium text-sm h-fit w-fit text-white hover:text-gray-200`}
            >
              {t('CreateProjectModal.add')}
            </button>
          </div>
        </div>
      </motion.div>
    </Backdrop>
  );
};
