"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context state
interface SectionData {
  transcription: string;
  // Add other relevant fields based on what 'sectionData' contains
}

interface SectionContextType {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
}

interface SectionProviderProps {
  children: ReactNode;
}
interface Article {
  index: number;
  title: string;
  abstract: string;
  byline: string;
  audio: string; // Assuming this is a Base64 encoded string or URL
  url: string;
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
// export const useSection = () => {
//   const context = useContext(SectionContext);
//   if (!context) {
//     throw new Error('useSection must be used within a SectionProvider');
//   }
//   return context;
// };

// export const SectionProvider: React.FC<SectionProviderProps> = ({
//   children,
// }) => {
//   const [sectionData, setSectionData] = useState<SectionData | null>(null);

//   return (
//     <SectionContext.Provider value={{ sectionData, setSectionData }}>
//       {children}
//     </SectionContext.Provider>
//   );
// };
export const SectionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);

  return (
    <SectionContext.Provider value={{ articles, setArticles }}>
      {children}
    </SectionContext.Provider>
  );
};
