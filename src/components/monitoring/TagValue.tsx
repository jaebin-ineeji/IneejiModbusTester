import { renderTagValue } from '@/utils/machineUtils';

interface TagValueProps {
  tag: string;
  value: string | number;
}

export const TagValue = ({ tag, value }: TagValueProps) => {
  const { formattedValue, color } = renderTagValue(tag, value);
  
  return (
    <div className="flex justify-between">
      <span>{tag}:</span>
      <span className={color}>{formattedValue}</span>
    </div>
  );
}; 