import { Clock, Trash2, PlayCircle, User, MapPin } from 'lucide-react';
import { OrderProgress } from '../App';

interface PendingOrdersProps {
  pendingOrders: OrderProgress[];
  onContinue: (progress: OrderProgress) => void;
  onDelete: (orderNumber: string) => void;
}

export function PendingOrders({
  pendingOrders,
  onContinue,
  onDelete,
}: PendingOrdersProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-gray-800">Pending Orders</h2>
        </div>

        <div className="space-y-3">
          {pendingOrders
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((order) => (
              <div
                key={order.orderNumber}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      #{order.orderNumber}
                    </span>
                    <h3 className="text-gray-800">{order.productName}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-gray-600">
                    {order.employeeNumber && (
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Emp: {order.employeeNumber}
                      </span>
                    )}
                    {order.workstation && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {order.workstation.split('-')[0].trim()}
                      </span>
                    )}
                    <span>•</span>
                    <span>
                      Step: {order.currentStepIndex + 1}
                    </span>
                    <span>•</span>
                    <span>
                      Completed: {order.completedSteps.length}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(order.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onContinue(order)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Continue
                  </button>
                  <button
                    onClick={() => onDelete(order.orderNumber)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar orden"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-800">
            💡 Tip: You can work on several orders at once. Completing the same step across all orders helps optimize tool usage.
          </p>
        </div>
      </div>
    </div>
  );
}
