import { Fragment } from 'react';
import { IDimensions, IPriorityLabelColors } from '../../helpers/types';
import { useDimensions } from '../../hooks/useDimensions';
import useWindowSize from '../../hooks/useWindowSize';
import { Backdrop } from '../Backdrop';
import { FlagSolidIcon } from '../Icons';

interface ISelectPriorityOptionProps {
  thisPriority: number;
  inputedPriority: number;
  setPriority: (priority: number) => void;
  closeSelect: () => void;
}

export const SelectPriorityOption = (
  props: ISelectPriorityOptionProps
): JSX.Element => {
  const { thisPriority, inputedPriority, setPriority, closeSelect } = props;

  const colors: IPriorityLabelColors[] = [
    'fill-red-600',
    'fill-orange-600',
    'fill-yellow-600',
    'fill-blue-600',
    null,
  ];

  const onClickPriority = () => {
    setPriority(thisPriority);
    // setPriorityLabelColor(colors[props.priority - 1] as IPriorityLabelColors);
    closeSelect();
  };

  return (
    <div
      onClick={onClickPriority}
      className='hover:bg-gray-200 flex items-center justify-between'
    >
      <span className='flex items-center justify-center px-4 py-2'>
        <FlagSolidIcon
          stroke={'black'}
          className={`${colors[thisPriority]} w-3 h-3`}
        />
      </span>
      <span className='text-sm whitespace-nowrap pr-4 py-2'>
        Priority {thisPriority + 1}
      </span>

      <span
        className={`${
          inputedPriority === thisPriority ? 'opacity-100' : 'opacity-0'
        } -translate-y-[1px] mx-1 mr-3 h-2 w-3 scale-75 -rotate-45 border-l-[2px] border-b-[2px] border-gray-700 duration-100 transition-opacity`}
      />
    </div>
  );
};

interface ISelectPriorityProps {
  inputedPriority: number;
  setPriority: (priority: number) => void;
  closeSelect: () => void;
  sizes: IDimensions;
}

export const SelectPriority = ({
  inputedPriority,
  closeSelect,
  setPriority,
  sizes,
}: ISelectPriorityProps) => {
  const [containerSizes, containerRef] = useDimensions();

  const { width } = useWindowSize();

  const resizeRight = containerSizes.width / 2 - (width - sizes.left);

  const resizeLeft = containerSizes.left;

  const resize =
    resizeRight > 0 ? resizeRight + 10 : resizeLeft < 0 ? -resizeLeft + 10 : 0;

  return (
    <Backdrop close={closeSelect} className='z-[2000]'>
      <div
        ref={containerRef}
        style={{
          left: sizes.left + sizes.width / 2 + resize,
          top: sizes.top + sizes.height,
        }}
        className='fixed -translate-x-1/2 z-[2001] shadow-3xl border-[1px] border-gray-200 overflow-hidden rounded-sm w-fit h-fit bg-white'
      >
        <div className='dropdown-select overflow-y-scroll h-fit w-full'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Fragment key={i}>
              <SelectPriorityOption
                thisPriority={i}
                inputedPriority={inputedPriority}
                setPriority={setPriority}
                closeSelect={closeSelect}
              />
            </Fragment>
          ))}
        </div>
      </div>
    </Backdrop>
  );
};
