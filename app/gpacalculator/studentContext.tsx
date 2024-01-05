// contexts/StudentContext.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Student {
  studentId: number;
  studentName: string;
  // ... other student properties
}

const StudentContext = createContext<{
  student: Student | null;
  setStudent: (student: Student | null) => void;
} | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Student | null>(null);

  return (
    <StudentContext.Provider value={{ student, setStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
