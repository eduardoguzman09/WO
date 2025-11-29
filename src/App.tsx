import { useState, useEffect } from 'react';
import { OrderScanner } from './components/OrderScanner';
import { WorkOrderSteps } from './components/WorkOrderSteps';
import { PendingOrders } from './components/PendingOrders';
import { EmployeeLogin, EmployeeSession } from './components/EmployeeLogin';

export interface WorkOrder {
  orderNumber: string;
  productName: string;
  steps: {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
  }[];
}

export interface OrderProgress {
  orderNumber: string;
  productName: string;
  currentStepIndex: number;
  completedSteps: number[];
  timestamp: number;
  employeeNumber?: string;
  workstation?: string;
}

// Sample work order data
const workOrders: WorkOrder[] = [
  {
    orderNumber: '001',
    productName: 'Assembly of Chair Model A',
    steps: [
      {
        id: 1,
        title: 'Prepare components',
        description:
          'Verify that all components are present: 4 legs, 1 seat, 1 backrest, screws, and tools.',
        imageUrl:
          'https://images.unsplash.com/photo-1611841528417-6227ffbca5ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFpciUyMGFzc2VtYmx5JTIwcGFydHN8ZW58MXx8fHwxNzY0NDI3OTQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 2,
        title: 'Attach legs to seat',
        description:
          'Attach the 4 legs to the seat using the long screws. Tighten firmly with the hex key.',
        imageUrl:
          'https://images.unsplash.com/photo-1725916631418-7c000895345f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBhc3NlbWJseSUyMHRvb2xzfGVufDF8fHx8MTc2NDQwOTA5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 3,
        title: 'Install backrest',
        description:
          'Place the backrest on the rear of the seat and fasten with 4 screws. Check for stability.',
        imageUrl:
          'https://images.unsplash.com/photo-1700786032675-2e96774127c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFpciUyMGJhY2tyZXN0JTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc2NDQyNzk0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 4,
        title: 'Quality control',
        description:
          'Check that all screws are properly tightened. Verify that the chair is stable and free of defects.',
        imageUrl:
          'https://images.unsplash.com/photo-1599583863916-e06c29087f51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFsaXR5JTIwY29udHJvbCUyMGluc3BlY3Rpb258ZW58MXx8fHwxNzY0NDI3OTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
    ],
  },
  {
    orderNumber: '002',
    productName: 'Packaging of Electronics Model B',
    steps: [
      {
        id: 1,
        title: 'Initial inspection',
        description:
          'Verify that the electronic product works correctly. Check ports and buttons.',
        imageUrl:
          'https://images.unsplash.com/photo-1761497194591-9c8fb8a1fffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMHRlc3RpbmclMjBkZXZpY2V8ZW58MXx8fHwxNzY0NDI3OTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 2,
        title: 'Add protective packaging',
        description:
          'Wrap the product in bubble wrap. Pay special attention to the corners.',
        imageUrl:
          'https://images.unsplash.com/photo-1589322448752-5c05f2e9ca21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB3cmFwJTIwcGFja2FnaW5nfGVufDF8fHx8MTc2NDQyNzk0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 3,
        title: 'Include accessories',
        description:
          'Place the charging cable, user manual, and warranty card inside the box.',
        imageUrl:
          'https://images.unsplash.com/photo-1617220386709-8655b78f0974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwYm94JTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzY0NDI3OTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 4,
        title: 'Seal and label',
        description:
          'Seal the box with packing tape. Attach a label with the order number and destination.',
        imageUrl:
          'https://images.unsplash.com/photo-1631010231130-5c7828d9a3a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGlwcGluZyUyMGJveCUyMGxhYmVsfGVufDF8fHx8MTc2NDQyNzk0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 5,
        title: 'Final check',
        description:
          'Confirm that the label is correct and that the box is properly sealed.',
        imageUrl:
          'https://images.unsplash.com/photo-1627915589334-14a3c3e3a741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjB2ZXJpZmljYXRpb24lMjBjaGVja2xpc3R8ZW58MXx8fHwxNzY0NDI3OTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
    ],
  },
  {
    orderNumber: '003',
    productName: 'Assembly of Bicycle Model C',
    steps: [
      {
        id: 1,
        title: 'Unpack components',
        description:
          'Remove all components: frame, wheels, handlebar, seat, pedals, and tools.',
        imageUrl:
          'https://images.unsplash.com/photo-1763041821558-13fb6264be3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwcGFydHMlMjBjb21wb25lbnRzfGVufDF8fHx8MTc2NDQyNzk0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 2,
        title: 'Install front wheel',
        description:
          'Place the front wheel in the fork and secure it with the quick-release lever.',
        imageUrl:
          'https://images.unsplash.com/photo-1729025724213-45bbebd5e464?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwd2hlZWwlMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzY0NDI3OTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 3,
        title: 'Install handlebar',
        description:
          'Insert the handlebar into the steering tube. Adjust the height and tighten the bolts.',
        imageUrl:
          'https://images.unsplash.com/photo-1651393964104-25275d925a75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwaGFuZGxlYmFyJTIwYWRqdXN0bWVudHxlbnwxfHx8fDE3NjQ0Mjc5NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 4,
        title: 'Install pedals and seat',
        description:
          'Screw in the pedals (right and left). Adjust the seat height and secure it.',
        imageUrl:
          'https://images.unsplash.com/photo-1728071803369-abbd64729de6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwcGVkYWxzJTIwc2VhdHxlbnwxfHx8fDE3NjQ0Mjc5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 5,
        title: 'Adjust brakes and gears',
        description:
          'Check brake cable tension. Test gear shifting.',
        imageUrl:
          'https://images.unsplash.com/photo-1651393964104-25275d925a75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwYnJha2UlMjBhZGp1c3RtZW50fGVufDF8fHx8MTc2NDQyNzk0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 6,
        title: 'Final test',
        description:
          'Perform a test ride. Verify that all components are working correctly.',
        imageUrl:
          'https://images.unsplash.com/photo-1651551515013-a5cf8862b646?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwdGVzdGluZyUyMHJpZGV8ZW58MXx8fHwxNzY0NDI3OTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
    ],
  },
];

const STORAGE_KEY = 'work_orders_progress';
const SESSION_KEY = 'employee_session';

export default function App() {
  const [employeeSession, setEmployeeSession] = useState<EmployeeSession | null>(null);
  const [currentOrder, setCurrentOrder] = useState<WorkOrder | null>(null);
  const [currentProgress, setCurrentProgress] = useState<OrderProgress | null>(null);
  const [pendingOrders, setPendingOrders] = useState<OrderProgress[]>([]);

  // Load employee session from localStorage
  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      try {
        setEmployeeSession(JSON.parse(storedSession));
      } catch (e) {
        console.error('Error loading session:', e);
      }
    }
  }, []);

  // Load pending orders from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPendingOrders(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading pending orders:', e);
      }
    }
  }, []);

  // Save pending orders to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingOrders));
  }, [pendingOrders]);

  const handleLogin = (session: EmployeeSession) => {
    setEmployeeSession(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  };

  const handleOrderScanned = (orderNumber: string) => {
    const order = workOrders.find((wo) => wo.orderNumber === orderNumber);

    if (!order) {
      alert(`Order ${orderNumber} not found. Try 001, 002 or 003`);
      return;
    }

    // Check if the order is already in progress
    const existingProgress = pendingOrders.find(
      (p) => p.orderNumber === orderNumber
    );

    if (existingProgress) {
      if (
        window.confirm(
          `Order ${orderNumber} is already in progress. Do you want to continue it?`
        )
      ) {
        setCurrentOrder(order);
        setCurrentProgress(existingProgress);
      }
    } else {
      // New order
      const newProgress: OrderProgress = {
        orderNumber: order.orderNumber,
        productName: order.productName,
        currentStepIndex: 0,
        completedSteps: [],
        timestamp: Date.now(),
        employeeNumber: employeeSession?.employeeNumber,
        workstation: employeeSession?.workstation,
      };
      setCurrentOrder(order);
      setCurrentProgress(newProgress);
    }
  };

  const handleSavePending = (progress: OrderProgress) => {
    setPendingOrders((prev) => {
      const filtered = prev.filter((p) => p.orderNumber !== progress.orderNumber);
      return [...filtered, progress];
    });
    setCurrentOrder(null);
    setCurrentProgress(null);
  };

  const handleOrderComplete = (orderNumber: string) => {
    // Remove from pending
    setPendingOrders((prev) =>
      prev.filter((p) => p.orderNumber !== orderNumber)
    );
    setCurrentOrder(null);
    setCurrentProgress(null);
  };

  const handleContinueOrder = (progress: OrderProgress) => {
    const order = workOrders.find((wo) => wo.orderNumber === progress.orderNumber);
    if (order) {
      setCurrentOrder(order);
      setCurrentProgress(progress);
    }
  };

  const handleDeletePending = (orderNumber: string) => {
    if (window.confirm(`Do you want to remove order ${orderNumber} from pending?`)) {
      setPendingOrders((prev) =>
        prev.filter((p) => p.orderNumber !== orderNumber)
      );
    }
  };

  const handleLogout = () => {
    if (window.confirm('Do you want to log out?')) {
      setEmployeeSession(null);
      localStorage.removeItem(SESSION_KEY);
      setCurrentOrder(null);
      setCurrentProgress(null);
    }
  };

  // If there is no session, show login
  if (!employeeSession) {
    return <EmployeeLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!currentOrder ? (
        <>
          <OrderScanner
            onOrderScanned={handleOrderScanned}
            employeeSession={employeeSession}
            onLogout={handleLogout}
          />
          {pendingOrders.length > 0 && (
            <PendingOrders
              pendingOrders={pendingOrders}
              onContinue={handleContinueOrder}
              onDelete={handleDeletePending}
            />
          )}
        </>
      ) : (
        <WorkOrderSteps
          workOrder={currentOrder}
          initialProgress={currentProgress}
          onComplete={handleOrderComplete}
          onSavePending={handleSavePending}
          employeeSession={employeeSession}
        />
      )}
    </div>
  );
}
