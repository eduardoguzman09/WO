import { useState, useRef, useEffect } from 'react';
import { Scan, Keyboard, User, MapPin, LogOut } from 'lucide-react';
import { EmployeeSession } from './EmployeeLogin';

interface OrderScannerProps {
  onOrderScanned: (orderNumber: string) => void;
  employeeSession: EmployeeSession;
  onLogout: () => void;
}

export function OrderScanner({ onOrderScanned, employeeSession, onLogout }: OrderScannerProps) {
  const [orderNumber, setOrderNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus en el input para simular escáner
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setIsScanning(true);
      // Simular tiempo de escaneo
      setTimeout(() => {
        onOrderScanned(orderNumber.trim());
        setOrderNumber('');
        setIsScanning(false);
      }, 500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Info de sesión */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-blue-800">
                <User className="w-4 h-4" />
                <span>Employee: {employeeSession.employeeNumber}</span>
              </div>
              <button
                onClick={onLogout}
                className="text-red-600 hover:text-red-700 transition-colors"
                title="log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-blue-800">
              <MapPin className="w-4 h-4" />
              <span>{employeeSession.workstation}</span>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Scan className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <h1 className="text-center text-gray-800 mb-2">
            Scan the Work Order
          </h1>

          <p className="text-center text-gray-600 mb-8">
           Scan or type the order number to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="orderNumber" className="block text-gray-700 mb-2">
                Order Number
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="orderNumber"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Scan or type the number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  disabled={isScanning}
                  autoFocus
                />
                <Keyboard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={!orderNumber.trim() || isScanning}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isScanning ? 'Processing...' : 'Begin Order'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-center mb-2">
              Example orders for testing:
            </p>
            <div className="flex justify-center gap-2">
              {['001', '002', '003'].map((num) => (
                <button
                  key={num}
                  onClick={() => setOrderNumber(num)}
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
