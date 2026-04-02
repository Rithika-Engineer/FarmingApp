import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {

  const [lang, setLang] = useState("en");

  function changeLang(value){
    setLang(value);
    localStorage.setItem("lang", value);
  }

  return (
    <LanguageContext.Provider value={{ lang, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(){
  return useContext(LanguageContext);
}
