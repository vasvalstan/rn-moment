import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingData {
    purpose: string[];
    age: string;
    experience: string;
    practices: string[];
    sessionLength: number;
    practiceTime: string;
    reminders: boolean;
}

interface OnboardingContextType {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    resetData: () => void;
}

const defaultData: OnboardingData = {
    purpose: [],
    age: "",
    experience: "",
    practices: [],
    sessionLength: 20,
    practiceTime: "morning",
    reminders: true,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<OnboardingData>(defaultData);

    const updateData = (newData: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    const resetData = () => {
        setData(defaultData);
    };

    return (
        <OnboardingContext.Provider value={{ data, updateData, resetData }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
