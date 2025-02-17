import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { machineApi } from '../services/api';
import { MachineConfig, Permission, TagConfig, TagType } from '../types/monitoring';

interface MachineFormData {
  name: string;
  ip: string;
  port: number;
  slave: number;
}

interface TagFormData {
  name: string;
  tag_type: TagType;
  logical_register: string;
  real_register: string;
  permission: Permission;
}

export function Settings() {
  const [machines, setMachines] = useState<string[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [machineConfig, setMachineConfig] = useState<MachineConfig | null>(null);
  const [isAddingMachine, setIsAddingMachine] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [machineForm, setMachineForm] = useState<MachineFormData>({
    name: '',
    ip: '',
    port: 502,
    slave: 1,
  });

  const [tagForm, setTagForm] = useState<TagFormData>({
    name: '',
    tag_type: TagType.ANALOG,
    logical_register: '',
    real_register: '',
    permission: Permission.READ,
  });

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    if (selectedMachine) {
      fetchMachineConfig();
    }
  }, [selectedMachine]);

  const fetchMachines = async () => {
    try {
      const response = await machineApi.getMachineList();
      setMachines(response);
      setError(null);
    } catch (err) {
      setError('기계 목록을 가져오는데 실패했습니다.');
    }
  };

  const fetchMachineConfig = async () => {
    try {
      const config = await machineApi.getMachineConfig(selectedMachine);
      setMachineConfig(config);
      setError(null);
    } catch (err) {
      setError('기계 설정을 가져오는데 실패했습니다.');
    }
  };

  const handleAddMachine = async () => {
    try {
      await machineApi.addMachine(machineForm.name, {
        ip: machineForm.ip,
        port: machineForm.port,
        slave: machineForm.slave,
        tags: {},
      });
      setIsAddingMachine(false);
      setMachineForm({
        name: '',
        ip: '',
        port: 502,
        slave: 1,
      });
      fetchMachines();
      setError(null);
    } catch (err) {
      setError('기계 추가에 실패했습니다.');
    }
  };

  const handleDeleteMachine = async () => {
    if (!selectedMachine) return;
    try {
      await machineApi.deleteMachine(selectedMachine);
      setSelectedMachine('');
      setMachineConfig(null);
      fetchMachines();
      setError(null);
    } catch (err) {
      setError('기계 삭제에 실패했습니다.');
    }
  };

  const handleAddTag = async () => {
    if (!selectedMachine) return;
    try {
      await machineApi.addMachineTag(selectedMachine, tagForm.name, {
        tag_type: tagForm.tag_type,
        logical_register: tagForm.logical_register,
        real_register: tagForm.real_register,
        permission: tagForm.permission,
      });
      setIsAddingTag(false);
      setTagForm({
        name: '',
        tag_type: TagType.ANALOG,
        logical_register: '',
        real_register: '',
        permission: Permission.READ,
      });
      fetchMachineConfig();
      setError(null);
    } catch (err) {
      setError('태그 추가에 실패했습니다.');
    }
  };

  const handleUpdateTag = async () => {
    if (!selectedMachine || !selectedTag) return;
    try {
      await machineApi.updateMachineTag(selectedMachine, selectedTag, {
        tag_type: tagForm.tag_type,
        logical_register: tagForm.logical_register,
        real_register: tagForm.real_register,
        permission: tagForm.permission,
      });
      setIsEditingTag(false);
      setSelectedTag('');
      setTagForm({
        name: '',
        tag_type: TagType.ANALOG,
        logical_register: '',
        real_register: '',
        permission: Permission.READ,
      });
      fetchMachineConfig();
      setError(null);
    } catch (err) {
      setError('태그 수정에 실패했습니다.');
    }
  };

  const handleDeleteTag = async (tagName: string) => {
    if (!selectedMachine) return;
    try {
      await machineApi.deleteMachineTag(selectedMachine, tagName);
      fetchMachineConfig();
      setError(null);
    } catch (err) {
      setError('태그 삭제에 실패했습니다.');
    }
  };

  const handleEditTag = (tagName: string, tagConfig: TagConfig) => {
    setSelectedTag(tagName);
    setTagForm({
      name: tagName,
      ...tagConfig,
    });
    setIsEditingTag(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">기계 설정</h1>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          모니터링으로 돌아가기
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-12 gap-4">
        {/* 기계 목록 */}
        <div className="col-span-3 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">기계 목록</h2>
            <button
              onClick={() => setIsAddingMachine(true)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              추가
            </button>
          </div>
          <div className="space-y-2">
            {machines.map(machine => (
              <div
                key={machine}
                className={`p-2 rounded cursor-pointer ${
                  selectedMachine === machine
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedMachine(machine)}
              >
                {machine}
              </div>
            ))}
          </div>
        </div>

        {/* 기계 설정 */}
        <div className="col-span-9 bg-white p-4 rounded-lg shadow">
          {selectedMachine ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">{selectedMachine} 설정</h2>
                <div className="space-x-2">
                  <button
                    onClick={() => setIsAddingTag(true)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    태그 추가
                  </button>
                  <button
                    onClick={handleDeleteMachine}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    기계 삭제
                  </button>
                </div>
              </div>

              {machineConfig && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">기본 정보</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-gray-600">IP:</span> {machineConfig.ip}
                    </div>
                    <div>
                      <span className="text-gray-600">Port:</span> {machineConfig.port}
                    </div>
                    <div>
                      <span className="text-gray-600">Slave:</span> {machineConfig.slave}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2">태그 목록</h3>
                <div className="grid grid-cols-1 gap-2">
                  {machineConfig &&
                    Object.entries(machineConfig.tags).map(([tagName, tagConfig]) => (
                      <div
                        key={tagName}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <span className="font-medium">{tagName}</span>
                          <div className="text-sm text-gray-600">
                            {tagConfig.tag_type} | {tagConfig.logical_register} |{' '}
                            {tagConfig.real_register} | {tagConfig.permission}
                          </div>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEditTag(tagName, tagConfig)}
                            className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tagName)}
                            className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">기계를 선택해주세요.</div>
          )}
        </div>
      </div>

      {/* 기계 추가 모달 */}
      {isAddingMachine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <h2 className="text-lg font-medium mb-4">기계 추가</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  기계 이름
                </label>
                <input
                  type="text"
                  value={machineForm.name}
                  onChange={(e) =>
                    setMachineForm({ ...machineForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IP 주소
                </label>
                <input
                  type="text"
                  value={machineForm.ip}
                  onChange={(e) =>
                    setMachineForm({ ...machineForm, ip: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port
                </label>
                <input
                  type="number"
                  value={machineForm.port}
                  onChange={(e) =>
                    setMachineForm({
                      ...machineForm,
                      port: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slave
                </label>
                <input
                  type="number"
                  value={machineForm.slave}
                  onChange={(e) =>
                    setMachineForm({
                      ...machineForm,
                      slave: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsAddingMachine(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                onClick={handleAddMachine}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 태그 추가/수정 모달 */}
      {(isAddingTag || isEditingTag) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <h2 className="text-lg font-medium mb-4">
              {isEditingTag ? '태그 수정' : '태그 추가'}
            </h2>
            <div className="space-y-4">
              {!isEditingTag && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    태그 이름
                  </label>
                  <input
                    type="text"
                    value={tagForm.name}
                    onChange={(e) =>
                      setTagForm({ ...tagForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  태그 타입
                </label>
                <select
                  value={tagForm.tag_type}
                  onChange={(e) =>
                    setTagForm({
                      ...tagForm,
                      tag_type: e.target.value as TagType,
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  {Object.values(TagType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  논리 레지스터
                </label>
                <input
                  type="text"
                  value={tagForm.logical_register}
                  onChange={(e) =>
                    setTagForm({
                      ...tagForm,
                      logical_register: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  실제 레지스터
                </label>
                <input
                  type="text"
                  value={tagForm.real_register}
                  onChange={(e) =>
                    setTagForm({
                      ...tagForm,
                      real_register: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  권한
                </label>
                <select
                  value={tagForm.permission}
                  onChange={(e) =>
                    setTagForm({
                      ...tagForm,
                      permission: e.target.value as Permission,
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  {Object.values(Permission).map((permission) => (
                    <option key={permission} value={permission}>
                      {permission}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsAddingTag(false);
                  setIsEditingTag(false);
                  setSelectedTag('');
                  setTagForm({
                    name: '',
                    tag_type: TagType.ANALOG,
                    logical_register: '',
                    real_register: '',
                    permission: Permission.READ,
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                onClick={isEditingTag ? handleUpdateTag : handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isEditingTag ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 