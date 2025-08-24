import React, { useState } from 'react';
import { DestinationInfo } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface AdminViewProps {
  onGoBack: () => void;
  destinationData: DestinationInfo[];
  onAddDestination: (destination: DestinationInfo) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onGoBack, destinationData, onAddDestination }) => {
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '명소' as const, location: '', description: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.location || !newItem.description) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    onAddDestination({ ...newItem, id: Date.now().toString() }); // 임시 ID
    setNewItem({ name: '', category: '명소', location: '', description: '' });
    setError('');
    setShowForm(false);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm animate-fade-in">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>여행지 데이터 관리</CardTitle>
        <Button onClick={onGoBack} variant="outline">홈으로 돌아가기</Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? '폼 닫기' : '새 여행지 추가'}
          </Button>
          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-lg bg-slate-50 space-y-4">
              <h3 className="font-semibold text-lg">새 여행지 정보</h3>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">이름</label>
                <Input id="name" name="name" value={newItem.name} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700">카테고리</label>
                <select id="category" name="category" value={newItem.category} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option>명소</option>
                  <option>식당</option>
                  <option>숙소</option>
                  <option>활동</option>
                </select>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700">위치</label>
                <Input id="location" name="location" value={newItem.location} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">설명</label>
                <Input id="description" name="description" value={newItem.description} onChange={handleInputChange} required />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit">추가하기</Button>
            </form>
          )}
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">이름</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">카테고리</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">위치</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">설명</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {destinationData.map((item) => (
                <tr key={item.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.location}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminView;