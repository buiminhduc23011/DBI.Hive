import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18nStore } from '../stores/i18nStore';

interface OnboardingStep {
    titleKey: string;
    descriptionKey: string;
    targetSelector: string;
    position: 'top' | 'bottom' | 'left' | 'right';
    route?: string;
}

const steps: OnboardingStep[] = [
    {
        titleKey: 'onboarding.welcome',
        descriptionKey: 'onboarding.welcomeDesc',
        targetSelector: '[data-onboarding="sidebar"]',
        position: 'right',
    },
    {
        titleKey: 'onboarding.dashboardTitle',
        descriptionKey: 'onboarding.dashboardDesc',
        targetSelector: '[data-onboarding="nav-dashboard"]',
        position: 'right',
        route: '/',
    },
    {
        titleKey: 'onboarding.kanbanTitle',
        descriptionKey: 'onboarding.kanbanDesc',
        targetSelector: '[data-onboarding="nav-kanban"]',
        position: 'right',
        route: '/kanban',
    },
    {
        titleKey: 'onboarding.projectsTitle',
        descriptionKey: 'onboarding.projectsDesc',
        targetSelector: '[data-onboarding="nav-projects"]',
        position: 'right',
        route: '/projects',
    },
    {
        titleKey: 'onboarding.calendarTitle',
        descriptionKey: 'onboarding.calendarDesc',
        targetSelector: '[data-onboarding="nav-calendar"]',
        position: 'right',
        route: '/calendar',
    },
    {
        titleKey: 'onboarding.backlogTitle',
        descriptionKey: 'onboarding.backlogDesc',
        targetSelector: '[data-onboarding="nav-backlog"]',
        position: 'right',
        route: '/backlog',
    },
    {
        titleKey: 'onboarding.notificationsTitle',
        descriptionKey: 'onboarding.notificationsDesc',
        targetSelector: '[data-onboarding="notifications"]',
        position: 'bottom',
    },
    {
        titleKey: 'onboarding.projectSelectorTitle',
        descriptionKey: 'onboarding.projectSelectorDesc',
        targetSelector: '[data-onboarding="project-selector"]',
        position: 'bottom',
    },
    {
        titleKey: 'onboarding.settingsTitle',
        descriptionKey: 'onboarding.settingsDesc',
        targetSelector: '[data-onboarding="nav-settings"]',
        position: 'right',
        route: '/settings',
    },
];

interface InteractiveOnboardingProps {
    onComplete: () => void;
}

export const InteractiveOnboarding: React.FC<InteractiveOnboardingProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
    const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useI18nStore();

    const calculatePosition = useCallback(() => {
        const step = steps[currentStep];
        const element = document.querySelector(step.targetSelector);

        if (!element) {
            // Element not found, center the tooltip
            setTooltipStyle({
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            });
            setHighlightStyle({ display: 'none' });
            return;
        }

        const rect = element.getBoundingClientRect();
        const padding = 8;

        // Highlight style
        setHighlightStyle({
            position: 'fixed',
            top: rect.top - padding,
            left: rect.left - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
            borderRadius: '8px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
            pointerEvents: 'none',
            zIndex: 9998,
        });

        // Tooltip position
        const tooltipWidth = 320;
        const tooltipHeight = 180;
        let top = 0;
        let left = 0;

        switch (step.position) {
            case 'right':
                top = rect.top + rect.height / 2 - tooltipHeight / 2;
                left = rect.right + 16;
                break;
            case 'left':
                top = rect.top + rect.height / 2 - tooltipHeight / 2;
                left = rect.left - tooltipWidth - 16;
                break;
            case 'bottom':
                top = rect.bottom + 16;
                left = rect.left + rect.width / 2 - tooltipWidth / 2;
                break;
            case 'top':
                top = rect.top - tooltipHeight - 16;
                left = rect.left + rect.width / 2 - tooltipWidth / 2;
                break;
        }

        // Keep tooltip in viewport
        top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));
        left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

        setTooltipStyle({
            position: 'fixed',
            top,
            left,
            width: tooltipWidth,
        });
    }, [currentStep]);

    useEffect(() => {
        const step = steps[currentStep];
        if (step.route && location.pathname !== step.route) {
            navigate(step.route);
        }
    }, [currentStep, navigate, location.pathname]);

    useEffect(() => {
        // Wait for navigation and DOM update
        const timer = setTimeout(calculatePosition, 100);
        window.addEventListener('resize', calculatePosition);
        window.addEventListener('scroll', calculatePosition);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculatePosition);
            window.removeEventListener('scroll', calculatePosition);
        };
    }, [calculatePosition, location.pathname]);

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
        <>
            {/* Highlight element */}
            <div style={highlightStyle} className="transition-all duration-300" />

            {/* Tooltip */}
            <div
                style={tooltipStyle}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[9999] animate-fadeIn"
            >
                {/* Progress bar */}
                <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-t-xl overflow-hidden">
                    <div
                        className="h-full bg-dbi-primary transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                </div>

                {/* Close button */}
                <button
                    onClick={handleSkip}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <X size={16} />
                </button>

                {/* Content */}
                <div className="p-5">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {t('onboarding.step')} {currentStep + 1} {t('onboarding.of')} {steps.length}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{t(step.titleKey)}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{t(step.descriptionKey)}</p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-900 rounded-b-xl border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={handleSkip}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
                    >
                        {t('common.skip')}
                    </button>

                    <div className="flex items-center space-x-2">
                        {!isFirstStep && (
                            <button
                                onClick={handlePrev}
                                className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                            >
                                <ChevronLeft size={16} />
                                <span className="text-sm">{t('common.back')}</span>
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="flex items-center space-x-1 px-4 py-1.5 bg-dbi-primary text-white rounded-lg hover:bg-dbi-primary/90 transition-colors text-sm"
                        >
                            <span>{isLastStep ? t('common.finish') : t('common.next')}</span>
                            {!isLastStep && <ChevronRight size={16} />}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

// Hook to check if onboarding should be shown
export const useOnboarding = () => {
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const completed = localStorage.getItem('dbi_hive_onboarding_completed');
        if (!completed) {
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
