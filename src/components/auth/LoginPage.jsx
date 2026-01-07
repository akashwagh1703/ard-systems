import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SAMPLE_USERS } from '../../data/mockData';
import { User, Shield, Building, Users, Wheat } from 'lucide-react';

const LoginPage = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedUser) {
      const user = SAMPLE_USERS.find(u => u.id === parseInt(selectedUser));
      login(user);
      navigate('/dashboard');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin': return Shield;
      case 'district_officer': return Building;
      case 'block_officer': return Users;
      case 'field_user': return User;
      case 'farmer': return Wheat;
      default: return User;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'bg-red-50 border-red-200 text-red-800';
      case 'district_officer': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'block_officer': return 'bg-green-50 border-green-200 text-green-800';
      case 'field_user': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'farmer': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'super_admin': return 'Full system access • All microservices • State-level overview';
      case 'district_officer': return 'District-level access • Most microservices • CDVO operations';
      case 'block_officer': return 'Block-level operations • Operational services • BVO functions';
      case 'field_user': return 'Field operations • Service delivery • Technician access';
      case 'farmer': return 'Farmer interface • Service booking • Limited access';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-2xl w-full space-y-8 p-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white text-3xl font-bold">ARD</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Animal Resources Development
          </h2>
          <p className="text-lg text-gray-600 mb-2">Government of Odisha</p>
          <p className="text-sm text-gray-500">Microservices-Based Platform</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Your Role</h3>
              <p className="text-sm text-gray-600">Choose your user role to access the appropriate dashboard</p>
            </div>
            
            <div className="space-y-4">
              {SAMPLE_USERS.map(user => {
                const IconComponent = getRoleIcon(user.role);
                const isSelected = selectedUser === user.id.toString();
                
                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user.id.toString())}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-blue-100' : 'bg-white'
                      }`}>
                        <IconComponent className={`h-6 w-6 ${
                          isSelected ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{user.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                            {user.designation}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {user.district} District • {user.block} Block
                        </p>
                        <p className="text-xs text-gray-500">
                          {getRoleDescription(user.role)}
                        </p>
                      </div>
                      
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button
              type="submit"
              disabled={!selectedUser}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {selectedUser ? 'Access Dashboard' : 'Select a Role to Continue'}
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Demo System</span> - Select any role to explore the microservices platform
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>• Role-based Access Control</span>
              <span>• 10 Microservices</span>
              <span>• AI-Enabled Features</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;