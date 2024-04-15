"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Article {
  recording: string;
}

const ArticleContext = createContext<Article | undefined>(undefined);

const useArticleData = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error("useArticleData must be used within a ArticleProvider");
  }
  return context;
};
export const ArticleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [recording, setRecording] = useState<string>("");
  return (
    <ArticleContext.Provider value={{ recording }}>
      {children}
    </ArticleContext.Provider>
  );
};
