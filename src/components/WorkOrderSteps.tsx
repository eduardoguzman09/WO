import { useState, useEffect } from 'react';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Home, Pause, User, MapPin } from 'lucide-react';
import { WorkOrder, OrderProgress } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { EmployeeSession } from './EmployeeLogin';

interface WorkOrderStepsProps {
  workOrder: WorkOrder;
  initialProgress: OrderProgress | null;
  onComplete: (orderNumber: string) => void;
  onSavePending: (progress: OrderProgress) => void;
  employeeSession: EmployeeSession;
}

export function WorkOrderSteps({
  workOrder,
  initialProgress,
  onComplete,
  onSavePending,
  employeeSession,
}: WorkOrderStepsProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(
    initialProgress?.currentStepIndex || 0
  );
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set(initialProgress?.completedSteps || [])
  );

  const currentStep = workOrder.steps[currentStepIndex];
  const isLastStep = currentStepIndex === workOrder.steps.length - 1;
  const allStepsCompleted = completedSteps.size === workOrder.steps.length;

  // Actualizar progreso cuando cambia
  useEffect(() => {
    if (initialProgress) {
      setCurrentStepIndex(initialProgress.currentStepIndex);
      setCompletedSteps(new Set(initialProgress.completedSteps));
    }
  }, [initialProgress]);

  const handleNextStep = () => {
    // Marcar paso actual como completado
    setCompletedSteps((prev) => new Set([...prev, currentStep.id]));

    if (isLastStep) {
      // Si es el último paso, mostrar confirmación
      return;
    }

    // Ir al siguiente paso
    setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleFinishOrder = () => {
    if (window.confirm('Do you confirm that the order is complete?')) {
      onComplete(workOrder.orderNumber);
    }
  };

  const handleSaveAndPause = () => {
    const progress: OrderProgress = {
      orderNumber: workOrder.orderNumber,
      productName: workOrder.productName,
      currentStepIndex,
      completedSteps: Array.from(completedSteps),
      timestamp: Date.now(),
      employeeNumber: employeeSession.employeeNumber,
      workstation: employeeSession.workstation,
    };
    onSavePending(progress);
  };

  const progressPercentage =
    ((completedSteps.size + (allStepsCompleted ? 0 : 0)) /
      workOrder.steps.length) *
    100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Info de sesión */}
          <div className="flex items-center gap-4 mb-4 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4 text-blue-600" />
              <span>Employee: {employeeSession.employeeNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{employeeSession.workstation}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-800">
                Order #{workOrder.orderNumber}
              </h1>
              <p className="text-gray-600">{workOrder.productName}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveAndPause}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                title="Save and pause"
              >
                <Pause className="w-5 h-5" />
                Pause
              </button>
              <button
                onClick={() => onComplete(workOrder.orderNumber)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
                title="Return to home without saving"
              >
                <Home className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-gray-600 mt-2">
              Progress: {completedSteps.size} of {workOrder.steps.length} steps
              Completed
            </p>
          </div>
        </div>
      </div>

      {/* Steps sidebar */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lista de pasos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h3 className="text-gray-800 mb-4">Steps</h3>
              <div className="space-y-2">
                {workOrder.steps.map((step, index) => {
                  const isCompleted = completedSteps.has(step.id);
                  const isCurrent = index === currentStepIndex;

                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStepIndex(index)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 truncate">
                          {index + 1}. {step.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contenido del paso actual */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full mb-4">
                  Step {currentStepIndex + 1} of {workOrder.steps.length}
                </div>
                <h2 className="text-gray-800 mb-4">
                  {currentStep.title}
                </h2>
              </div>

              {/* Imagen del paso */}
              {currentStep.imageUrl && (
                <div className="mb-6 rounded-lg overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={currentStep.imageUrl}
                    alt={currentStep.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Indicador visual si está completado */}
              {completedSteps.has(currentStep.id) && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">Step Completed</span>
                </div>
              )}

              {/* Botones de navegación */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </button>

                {!isLastStep ? (
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishOrder}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Finish Order
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Mensaje de finalización */}
            {allStepsCompleted && (
              <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-green-800 mb-2">
                     All steps completed!
                    </h3>
                    <p className="text-green-700 mb-4">
                      You have completed all the steps for this work order.
                      Click “Finish Order” to complete it and start a new one
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
