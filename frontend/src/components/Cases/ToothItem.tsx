import { FC } from 'react';

interface ToothProps {
  id: string;
  clientId: string;
  number: number;
  severity?: string;
  size?: number;
  handleToothClick: () => void;
}

const ToothItem: FC<ToothProps> = ({ id, clientId, number, severity, size = 40, handleToothClick}) => {
  const getToothColor = () => {
    switch (severity) {
      case 'High':
        return 'fill-red-500';
      case 'Medium':
        return 'fill-orange-500';
      case 'Low':
        return 'fill-yellow-500';
      case 'Healthy':
        return 'fill-green-500';
      case 'Missing':
        return 'fill-gray-600';
      default:
        return 'fill-gray-600';
    }
  };

  return (
    <div onClick={handleToothClick} className="flex flex-col items-center gap-1 border-2 col-span-1">
      <svg
        viewBox="0 0 1000 1000"
        className={`w-${1}px h-${1}px ${getToothColor()} transition-colors duration-200`}
        role="img"
        aria-label={`Tooth ${number}`}
      >
        <path d="M316.54,550.47q-.36-11.67-.49-23.35c-.32-29.6-3.9-54.78-20.56-80.11C267,403.74,257.7,355.76,259.33,304.82c2.28-71.37,41-119.16,106.45-129.85,27.08-4.43,53.58.75,77.24,13.22,39.56,20.84,77,20.66,116.95.4,36.4-18.44,75.57-21.17,113.88-4,49.7,22.24,68.94,64.74,72.32,115.8,3.4,51.34-5.7,100.28-34.33,144.21-15.55,23.86-22.15,49.18-21.54,78.24,1.56,74.77-2,149.53-26.7,221-7.93,22.95-21.69,44.37-35.56,64.59-8.61,12.55-22.56,22.56-40,16.29-18.35-6.58-21.13-23-24-40Q550.06,703.18,534.28,622c-2.4-12.27-7.56-24.4-13.58-35.43-4-7.3-11.45-14.23-18.13-18.78-26,23.21-34.19,59-40.75,91.83-8.53,42.71-13.64,86.1-20.28,129.19C439.2,804,435,818.11,418.83,824.61s-27.9-2.15-38.31-12.55c-28.2-28.15-41-64.47-47.69-102.06A1109.44,1109.44,0,0,1,316.54,550.47Z" />
        <path d="M373.39,245c24.16,1.24,8.7,24.67,1.95,35a66.12,66.12,0,0,0-10.54,31.47c-1.73,24,5.75,48.89,16.55,70,5.17,10.11,16.85,31.45-1.32,36.23-11.24,3-21.82-11-26.53-19.34-8.17-14.48-12.69-31-15.79-47.19a157.15,157.15,0,0,1,4.49-75.53c3.89-12.67,15.61-30.93,30.59-30.71Z" />
      </svg>
      <span className="text-xs font-medium">{number}</span>
    </div>
  );
};

export default ToothItem;