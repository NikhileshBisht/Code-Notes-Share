import React, { createContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

interface NameContextType {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}

// Correct default value with matching type
const defaultValue: NameContextType = {
  name: '',
  setName: () => {}, 
};

export const NameContext = createContext<NameContextType>(defaultValue);

export const NameProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState('');

  return (
    <NameContext.Provider value={{ name, setName }}>
      {children}
    </NameContext.Provider>
  );
};
