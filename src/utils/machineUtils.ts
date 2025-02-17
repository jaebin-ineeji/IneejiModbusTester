export const getBackgroundColor = (machineName: string): string => {
  if (machineName.includes('OIL_MAIN')) return 'bg-gray-800';
  if (machineName.includes('CRW_TEMP')) return 'bg-green-600';
  if (machineName.includes('ID_FAN')) return 'bg-blue-600';
  if (machineName.match(/OIL_[1-5]L/)) return 'bg-red-600';
  if (machineName.match(/OIL_[1-4]R/)) return 'bg-blue-800';
  if (machineName.startsWith('OXY_')) return 'bg-purple-600';
  return 'bg-gray-600';
};

export const groupMachines = (machines: string[]) => {
  const oilMain = machines.find(m => m === 'OIL_MAIN');
  const oilLeft = machines.filter(m => m.match(/OIL_[1-5]L/)).sort();
  const oilRight = machines.filter(m => m.match(/OIL_[1-4]R/)).sort();
  const others = machines.filter(m => 
    !m.startsWith('OIL_') || (m.startsWith('OIL_') && !m.match(/OIL_(MAIN|[1-5]L|[1-4]R)/))
  );

  return {
    oilMain,
    oilLeft,
    oilRight,
    others
  };
}; 