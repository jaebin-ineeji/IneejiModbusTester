import { MonitoringData } from '../../types/monitoring';
import { groupMachines } from '../../utils/machineUtils';
import { MonitoringBox } from './MonitoringBox';

interface MonitoringGridProps {
  selectedMachines: string[];
  data: MonitoringData;
  isConnected: boolean;
}

export const MonitoringGrid = ({ selectedMachines, data, isConnected }: MonitoringGridProps) => {
  const { oilMain, oilLeft, oilRight, others } = groupMachines(selectedMachines);

  const renderMachineBox = (machineName: string) => {
    const machineData = data[machineName];
    if (!machineData) return null;

    return (
      <MonitoringBox
        key={machineName}
        machineName={machineName}
        machineData={machineData}
        isConnected={isConnected}
      />
    );
  };

  return (
    <div className="grid grid-cols-12 gap-2">
      {/* Left Section */}
      {oilMain && (
        <div className="col-span-3">
          {renderMachineBox(oilMain)}
        </div>
      )}

      {/* Middle Left Section */}
      {oilLeft.length > 0 && (
        <div className="col-span-3">
          <div className="grid grid-cols-1 gap-2">
            {oilLeft.map(name => (
              <div key={name}>{renderMachineBox(name)}</div>
            ))}
          </div>
        </div>
      )}

      {/* Middle Right Section */}
      {oilRight.length > 0 && (
        <div className="col-span-3">
          <div className="grid grid-cols-1 gap-2">
            {oilRight.map(name => (
              <div key={name}>{renderMachineBox(name)}</div>
            ))}
          </div>
        </div>
      )}

      {/* Right Section */}
      {others.length > 0 && (
        <div className="col-span-3">
          <div className="grid grid-cols-1 gap-2">
            {others.map(name => (
              <div key={name}>{renderMachineBox(name)}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 