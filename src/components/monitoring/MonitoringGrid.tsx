import React, { useRef, useState } from 'react';
import { useMachineStore } from '../../store/machine';
import { MachinePosition, MonitoringData } from '../../types/monitoring';
import { MonitoringBox } from './MonitoringBox';

interface MonitoringGridProps {
  data: MonitoringData;
  isConnected: boolean;
  isLayoutMode: boolean;
}

export const MonitoringGrid = ({ data, isConnected, isLayoutMode }: MonitoringGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [draggingMachine, setDraggingMachine] = useState<string | null>(null);
  const { selectedMachines, machinePositions, updateMachinePosition } = useMachineStore();

  const handleDragStart = (e: React.DragEvent, machineName: string) => {
    if (!isLayoutMode) return;
    
    const element = e.currentTarget as HTMLDivElement;
    const rect = element.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    e.dataTransfer.setData('text/plain', JSON.stringify({
      machine: machineName,
      offsetX,
      offsetY
    }));
    
    setDraggingMachine(machineName);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isLayoutMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isLayoutMode) return;
    e.preventDefault();
    if (!gridRef.current || !draggingMachine) return;

    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { machine, offsetX, offsetY } = data;

    const gridRect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - gridRect.left - offsetX;
    const y = e.clientY - gridRect.top - offsetY;

    // 그리드 영역을 벗어나지 않도록 위치 조정
    const position: MachinePosition = {
      x: Math.max(0, Math.min(x, gridRect.width - 200)), // 200은 기계 박스의 예상 너비
      y: Math.max(0, Math.min(y, gridRect.height - 150)), // 150은 기계 박스의 예상 높이
      width: 150,
      height: 150
    };

    updateMachinePosition(machine, position);
    setDraggingMachine(null);
  };

  const renderMachineBox = (machineName: string) => {
    const machineData = data[machineName];
    if (!machineData) return null;

    const position = machinePositions[machineName] || {
      x: 0,
      y: 0,
      width: 150,
      height: 150
    };

    return (
      <div
        key={machineName}
        draggable={isLayoutMode}
        onDragStart={(e) => handleDragStart(e, machineName)}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: position.width,
          height: position.height,
          cursor: isLayoutMode ? 'move' : 'default',
          zIndex: draggingMachine === machineName ? 1000 : 1
        }}
      >
        <MonitoringBox
          machineName={machineName}
          machineData={machineData}
          isConnected={isConnected}
        />
      </div>
    );
  };

  return (
    <div
      ref={gridRef}
      className={`relative w-full h-[calc(100vh-200px)] rounded-lg p-4 overflow-hidden ${
        isLayoutMode ? 'bg-gray-100 border-2 border-dashed border-gray-300' : 'bg-gray-50'
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {selectedMachines.map(renderMachineBox)}
    </div>
  );
}; 