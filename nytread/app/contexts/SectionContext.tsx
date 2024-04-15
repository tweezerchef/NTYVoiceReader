"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context state
interface SectionData {
  transcription: string;
  // Add other relevant fields based on what 'sectionData' contains
}

interface SectionContextType {
  sectionData: SectionData | null;
  setSectionData: React.Dispatch<React.SetStateAction<SectionData | null>>;
}

interface SectionProviderProps {
  children: ReactNode;
}

// Creating the context with undefined initial state but with explicit typing
const SectionContext = createContext<SectionContextType | undefined>(undefined);

// Custom hook to use the context
export const useSectionData = () => {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error("useSectionData must be used within a SectionProvider");
  }
  return context;
};

export const SectionProvider: React.FC<SectionProviderProps> = ({
  children,
}) => {
  const [sectionData, setSectionData] = useState<SectionData | null>(null);

  return (
    <SectionContext.Provider value={{ sectionData, setSectionData }}>
      {children}
    </SectionContext.Provider>
  );
};
