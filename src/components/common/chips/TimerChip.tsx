import React from 'react'
interface TimerChipProp{
  timer: string
}
const TimerChip = ({ timer }: TimerChipProp) => {
  return (
    <div className='min-w-[100px] flex justify-center items-center py-2 rounded text--label-large text-on-secondary-container bg-primary-dark '>
      {timer}
    </div>
  )
}

TimerChip.defaultProps = {
  timer: "8h 00m 00s"
}

export default TimerChip;
