import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, LayoutDashboard, FolderKanban, Calendar, ListTodo, Settings, Users } from 'lucide-react';

interface OnboardingStep {
    title: string;
    description: string;
    icon: React.ReactNode;
    highlight?: string;
}

const steps: OnboardingStep[] = [
    {
        title: 'Welcome to DBI.Hive! 🐝',
        description: 'Your collaborative task management platform. Let us show you around and help you get started quickly.',
        icon: <img src="/logo.svg" alt="DBI.Hive" className="w-16 h-16" onError={(e) => { e.currentTarget.style.display = 'none'; }} />,
    },
    {
        title: 'Dashboard Overview',
        description: 'Get a quick overview of your tasks, projects, and team activity. See deadlines, statistics, and recent updates at a glance.',
        icon: <LayoutDashboard size={48} className="text-dbi-primary" />,
        highlight: 'dashboard',
    },
    {
        title: 'Kanban Board',
        description: 'Organize your tasks visually with drag-and-drop functionality. Move tasks between columns as they progress through your workflow.',
        icon: <FolderKanban size={48} className="text-dbi-primary" />,
        highlight: 'kanban',
    },
    {
        title: 'Project Management',
        description: 'Create and manage multiple projects. Assign team members, set deadlines, and track progress across all your initiatives.',
        icon: <ListTodo size={48} className="text-dbi-primary" />,
        highlight: 'projects',
    },
    {
        title: 'Calendar View',
        description: 'View all your tasks and deadlines in a calendar format. Never miss an important date or deadline again.',
        icon: <Calendar size={48} className="text-dbi-primary" />,
        highlight: 'calendar',
    },
    {
        title: 'Team Collaboration',
        description: 'Work together with your team. Assign tasks, add comments, and get notified when things change.',
        icon: <Users size={48} className="text-dbi-primary" />,
    },
    {
        title: 'Customize Your Experience',
        description: 'Visit Settings to personalize your profile, notification preferences, and appearance settings.',
        icon: <Settings size={48} className="text-dbi-primary" />,
        highlight: 'settings',
    },
    {
        title: 'You\'re All Set! 🎉',
        description: 'You\'re ready to start using DBI.Hive. Create your first project or explore the dashboard to see what\'s waiting for you.',
        icon: <span className="text-5xl">🚀</span>,
    },
];

interface OnboardingGuideProps {
    onComplete: () => void;
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        localStorage.setItem('dbi_hive_onboarding_completed', 'true');
        setIsVisible(false);
        onComplete();
    };

    const handleSkip = () => {
        handleComplete();
    };

    if (!isVisible) return null;

    const step = steps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-fadeIn">
                {/* Progress bar */}
                <div className="h-1 bg-gray-200">
                    <div
                        className="h-full bg-dbi-primary transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                </div>

                {/* Close button */}
                <button
                    onClick={handleSkip}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="px-8 py-10 text-center">
                    <div className="mb-6 flex justify-center">
                        {step.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h2>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Step indicators */}
                <div className="flex justify-center space-x-2 pb-6">
                    {steps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                                ${index === currentStep
                                    ? 'bg-dbi-primary w-6'
                                    : index < currentStep
                                        ? 'bg-dbi-primary/50'
                                        : 'bg-gray-300'}`}
                        />
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between px-8 py-4 bg-gray-50 border-t border-gray-200">
                    <button
                        onClick={handleSkip}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                        Skip tour
                    </button>

                    <div className="flex items-center space-x-3">
                        {!isFirstStep && (
                            <button
                                onClick={handlePrev}
                                className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ChevronLeft size={18} />
                                <span>Back</span>
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="flex items-center space-x-1 px-6 py-2 bg-dbi-primary text-white rounded-lg hover:bg-dbi-primary/90 transition-colors"
                        >
                            <span>{isLastStep ? 'Get Started' : 'Next'}</span>
                            {!isLastStep && <ChevronRight size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Hook to check if onboarding should be shown
export const useOnboarding = () => {
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const completed = localStorage.getItem('dbi_hive_onboarding_completed');
        if (!completed) {
            // Small delay to let the app load
            const timer = setTimeout(() => setShowOnboarding(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const completeOnboarding = () => {
        setShowOnboarding(false);
    };

    const resetOnboarding = () => {
        localStorage.removeItem('dbi_hive_onboarding_completed');
        setShowOnboarding(true);
    };

    return { showOnboarding, completeOnboarding, resetOnboarding };
};
