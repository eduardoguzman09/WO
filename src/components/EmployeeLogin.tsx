import { useState, useRef, useEffect } from 'react';
import { User, MapPin, LogIn } from 'lucide-react';

export interface EmployeeSession {
  employeeNumber: string;
  workstation: string;
  loginTime: number;
}

interface EmployeeLoginProps {
  onLogin: (session: EmployeeSession) => void;
}

export function EmployeeLogin({ onLogin }: EmployeeLoginProps) {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [workstation, setWorkstation] = useState('');
  const employeeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    employeeInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeNumber.trim() && workstation.trim()) {
      onLogin({
        employeeNumber: employeeNumber.trim(),
        workstation: workstation.trim(),
        loginTime: Date.now(),
      });
    }
  };

  // Estaciones de trabajo predefinidas
  const workstations = [
    'Station 1 - Assembly',
  'Station 2 - Packaging',
  'Station 3 - Quality Control',
  'Station 4 - Preparation',
  'Station 5 - Finishing',
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <User className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <h1 className="text-center text-gray-800 mb-2">
            Work orders System
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Please sign in to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="employeeNumber" className="block text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Employee ID
                </div>
              </label>
              <input
                ref={employeeInputRef}
                id="employeeNumber"
                type="text"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
                placeholder="Ej: 1001, 1002, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="workstation" className="block text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Workstation
                </div>
              </label>
              <select
                id="workstation"
                value={workstation}
                onChange={(e) => setWorkstation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a workstation</option>
                {workstations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>

              <div className="mt-2">
                <input
                  type="text"
                  value={workstation && !workstations.includes(workstation) ? workstation : ''}
                  onChange={(e) => setWorkstation(e.target.value)}
                  placeholder="Or enter a custom workstation"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!employeeNumber.trim() || !workstation.trim()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Log in
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-center mb-2">
              Sample employees:
            </p>
            <div className="flex justify-center gap-2">
              {['1001', '1002', '1003'].map((num) => (
                <button
                  key={num}
                  onClick={() => setEmployeeNumber(num)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
