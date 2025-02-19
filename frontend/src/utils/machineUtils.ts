import { TagValue } from '@/types/monitoring';

interface TagHandler {
  format: (value: TagValue) => string;
  color: (value: TagValue) => string;
}

export const getBackgroundColor = (machineName: string): string => {
  if (machineName.includes('OIL_MAIN')) return 'bg-gray-800';
  if (machineName.includes('CRW_TEMP')) return 'bg-green-600';
  if (machineName.includes('ID_FAN')) return 'bg-blue-600';
  if (machineName.match(/OIL_[1-5]L/)) return 'bg-red-600';
  if (machineName.match(/OIL_[1-4]R/)) return 'bg-blue-800';
  if (machineName.startsWith('OXY_')) return 'bg-purple-600';
  return 'bg-gray-600';
};


export const getTagHandler = (tag: string): TagHandler => {
  switch (tag) {
    case 'RM':
      return {
        format: (v) => String(v),
        color: (v) => v === 'LOCAL' ? 'text-green-600' : 'text-yellow-600'
      };
    case 'AM':
      return {
        format: (v) => String(v),
        color: () => 'text-blue-600'
      };
    case 'RT':
      return {
        format: (v) => typeof v === 'number' ? v.toFixed(2) : String(v),
        color: () => 'text-black'
      };
    case 'MV':
      return {
        format: (v) => typeof v === 'number' ? v.toFixed(0) : String(v),
        color: () => 'text-orange-500'
      };
    default:
      return {
        format: (v) => typeof v === 'number' ? v.toFixed(0) : String(v),
        color: () => 'text-black'
      };
  }
};

export const renderTagValue = (tag: string, value: TagValue) => {
  if (value === undefined || value === null) {
    return {
      formattedValue: 'loading...',
      color: 'text-red-500'
    };
  }

  const handler = getTagHandler(tag);
  return {
    formattedValue: handler.format(value),
    color: handler.color(value)
  };
};