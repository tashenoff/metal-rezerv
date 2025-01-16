import React, { useState, useEffect } from 'react';

const Steps = ({ steps, currentStep, onStepChange }) => {
    const [prevStep, setPrevStep] = useState(currentStep);

    useEffect(() => {
        if (prevStep !== currentStep) {
            setPrevStep(currentStep);
        }
    }, [currentStep, prevStep]);

    return (
        <div className="space-y-4">
            {/* Индикатор шагов, занимающий всю ширину */}
            <div className="steps steps-horizontal w-full justify-between mb-4">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`step ${currentStep === index ? 'step-primary' : ''}`}
                        onClick={() => onStepChange(index)}
                    >
                        {step.label}
                    </div>
                ))}
            </div>

            {/* Контент текущего шага с анимацией */}
            <div
                className={`steps-content transition-opacity duration-500 ease-in-out transform ${
                    prevStep < currentStep
                        ? 'opacity-0 scale-95'
                        : 'opacity-100 scale-100'
                }`}
            >
                {steps[currentStep].content}
            </div>
        </div>
    );
};

export default Steps;
