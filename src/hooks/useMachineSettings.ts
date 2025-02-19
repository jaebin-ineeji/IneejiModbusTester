import { machineApi } from '@/services/api';
import { useMachineStore } from '@/store/machine';
import { MachineConfig, TagConfig } from '@/types/monitoring';
import { useCallback, useState } from 'react';

interface MachineFormData {
  name: string;
  ip: string;
  port: number;
  slave: number;
}

export function useMachineSettings() {
  const [machines, setMachines] = useState<string[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [machineConfig, setMachineConfig] = useState<MachineConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { deleteMachineTagConfig, deleteMachineConfig, updateMachineConfig, setSelectedMachines, selectedMachines, removeMachine } = useMachineStore();

  const fetchMachines = useCallback(async () => {
    try {
      const response = await machineApi.getMachineList();
      setMachines(response);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('기계 목록을 가져오는데 실패했습니다.');
    }
  }, []);

  const fetchMachineConfig = useCallback(async () => {
    if (!selectedMachine) return;
    try {
      const config = await machineApi.getMachineConfig(selectedMachine);
      setMachineConfig(config);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('기계 설정을 가져오는데 실패했습니다.');
    }
  }, [selectedMachine]);

  const addMachine = useCallback(async (formData: MachineFormData) => {
    try {
      await machineApi.addMachine(formData.name, {
        ip: formData.ip,
        port: formData.port,
        slave: formData.slave,
        tags: {},
      });
      await fetchMachines();
      setError(null);
      return true;
    } catch (err) {
      console.error(err);
      setError('기계 추가에 실패했습니다.');
      return false;
    }
  }, [fetchMachines]);

  const deleteMachine = useCallback(async () => {
    if (!selectedMachine) return false;
    try {
      const machineToDelete = selectedMachine;
      await machineApi.deleteMachine(machineToDelete);
      
      // 상태 업데이트를 한 번에 처리
      setSelectedMachine('');
      // 선택된 기계 목록에서 삭제
      setSelectedMachines(selectedMachines.filter(machine => machine !== machineToDelete));
      setMachineConfig(null);
      deleteMachineConfig(machineToDelete);
      removeMachine(machineToDelete);
      // 기계 목록 새로고침
      const updatedMachines = await machineApi.getMachineList();
      setMachines(updatedMachines);
      
      setError(null);
      return true;
    } catch (err) {
      console.error(err);
      setError('기계 삭제에 실패했습니다.');
      return false;
    }
  }, [selectedMachine, deleteMachineConfig]);

  const addTag = useCallback(async (tagName: string, tagConfig: TagConfig) => {
    if (!selectedMachine) return false;
    try {
      await machineApi.addMachineTag(selectedMachine, tagName, tagConfig);
      const newConfig = await machineApi.getMachineConfig(selectedMachine);
      // 선택된 기계가 있는지 확인
      const condition = selectedMachines.some(machine => machine === selectedMachine);

      updateMachineConfig(selectedMachine, newConfig, condition);
      setMachineConfig(newConfig);
      setError(null);
      return true;
    } catch (err) {
      console.error(err);
      setError('태그 추가에 실패했습니다.');
      return false;
    }
  }, [selectedMachine, updateMachineConfig]);

  const updateTag = useCallback(async (tagName: string, tagConfig: TagConfig) => {
    if (!selectedMachine) return false;
    try {
      await machineApi.updateMachineTag(selectedMachine, tagName, tagConfig);
      const newConfig = await machineApi.getMachineConfig(selectedMachine);
      setMachineConfig(newConfig);
      setError(null);
      return true;
    } catch (err) {
      console.error(err);
      setError('태그 수정에 실패했습니다.');
      return false;
    }
  }, [selectedMachine]);

  const deleteTag = useCallback(async (tagName: string) => {
    if (!selectedMachine) return false;
    try {
      await machineApi.deleteMachineTag(selectedMachine, tagName);
      const newConfig = await machineApi.getMachineConfig(selectedMachine);
      deleteMachineTagConfig(selectedMachine, newConfig);
      setMachineConfig(newConfig);
      setError(null);
      return true;
    } catch (err) {
      console.error(err);
      setError('태그 삭제에 실패했습니다.');
      return false;
    }
  }, [selectedMachine, deleteMachineTagConfig]);

  return {
    machines,
    selectedMachine,
    machineConfig,
    error,
    setSelectedMachine,
    fetchMachines,
    fetchMachineConfig,
    addMachine,
    deleteMachine,
    addTag,
    updateTag,
    deleteTag,
  };
} 