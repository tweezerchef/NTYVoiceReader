"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Article {
  articleText: string;
}
interface ArticleContextType {
  article: Article;
  setArticle: (article: Article) => void;
}
const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const useArticleData = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error("useArticleData must be used within a ArticleProvider");
  }
  return context;
};
export const ArticleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [article, setArticle] = useState<Article>({ articleText: "" });
  return (
    <ArticleContext.Provider value={{ article, setArticle }}>
      {children}
    </ArticleContext.Provider>
  );
};
