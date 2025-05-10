import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
const PickupLayout = () => {
  
  const step = useSelector((state: any) => state.pickup.step);

  const steps = [
    { number: 1, name: "Type", path: "/pickup" },
    { number: 2, name: "Address", path: "/pickup/address" },
    { number: 3, name: "Details", path: "/pickup/details" },
    { number: 4, name: "Review", path: "/pickup/review" },
    { number: 5, name: "Payment", path: "/pickup/payment" },
  ];

  const getCurrentStep = () => {
    return step;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="bg-gray-100 min-h-screen py-16">
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Schedule a Pickup
          </h1>

          {/* Stepper */}
          {currentStep > 0 && (
            <div className="w-full py-4 mb-8">
              <div className="relative flex items-center justify-between">
                <div className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-gray-200" />
                <div
                  className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-green-500 transition-all duration-300"
                  style={{ right: `${100 - (((currentStep - 1) / (steps.length - 1)) * 80 + 10)}%` }}
                />
                <div className="relative z-10 w-full flex justify-between">
                  {steps.map((step) => (
                    <div key={step.number} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                          border-2 transition-all duration-300 
                          ${step.number <= currentStep
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-300 bg-white text-gray-500"
                          }`}
                      >
                        {step.number}
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium
                          ${step.number <= currentStep ? "text-green-600" : "text-gray-500"}`}
                      >
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PickupLayout; 