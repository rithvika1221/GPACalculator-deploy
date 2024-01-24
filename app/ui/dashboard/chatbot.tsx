'use client';

import React, { useState, ChangeEvent, KeyboardEvent, use } from 'react';
import axios from 'axios';
import { Semester, Student } from '@/app/lib/definitions';
import { string } from 'zod';


interface ChatbotModalProps {
  isMinimized: boolean;
  toggleMinimize: () => void;
  studentData: Student;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isMinimized, toggleMinimize , studentData}) => {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [student, setStudentData] = useState<Student>(studentData);



  const handleSubmit = async (): Promise<void> => {
    console.log('handleSubmit called'); // Debug log
    setLoading(true);
    updateStudentData(studentData);

    var  prompt= "This questions is from a Chatbot inside a GPA Calculator.\n\n ";
    prompt += "Limit the answer to 500 characters.\nn";
    prompt+= "-Please answer questions related to the following topics High School courses, High School and Collage  Education related questions and GPA Calculation.";
    prompt += "-Example: If the user aks questions about high schools answer that question \n\n "
    prompt += "-Example: If the Student ask's any topics other than High School courses, High School and Collage  Education related questions and GPA Calculation then give a message that this question falls out side of the context.";


    if (question.toLowerCase().includes("gpa"))
    {
      prompt += " \n\n-Example: Ff the user ask any questions related to GPA like \"How to improve my GPA\", then look at the GPA of the user which is provided below, and answer how  user can improve in subjects which he got less marks. \n\n";
      prompt += "\n\n-GPA of the user:\n"
      prompt = prompt + JSON.stringify(student, null,2);
    }

  
    const data = {
      model: "gpt-4-1106-preview",
      messages: [{ "role": "user", "content": question }, {"role": "system", "content":  prompt  }],
      max_tokens: 256
     };

    if (!question.trim()) return; // prevent empty submissions

    try {
      const body = data;
      const url = 'https://api.openai.com/v1/chat/completions';
      const headers = {
        'Content-type': 'application/json',
        'Authorization': `Bearer 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`
      };
  
      const response = await axios.post(url, data, { headers: headers });
      setLoading(false);
      console.log(response);
  
      const newResponse = response.data.choices[0].message.content;
      setResponse(newResponse);
      setMessages(messages => [...messages, `Q: ${question}`, `A: ${newResponse}`]);
      setQuestion(''); // clear the input after sending
    } catch (error: any) {
      console.log(error);
      
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };


    const updateStudentData =  (updatedStudent: Student) => {
        // Function to calculate weighted and unweighted GPA for a semester
        const calculateGPA = (semester: Semester) => {
            semester.course.forEach(course => {
              course.courseSemester  = null;
            });
        };

        // Calculate GPA for each semester
        updatedStudent.semester.forEach(semester => {
            calculateGPA(semester);
            semester.semesterStudent = null;
        });
        setStudentData(student);

    };
  

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end bg-white p-4 rounded-lg shadow-lg max-w-md z-50">
  {!isMinimized && (
    <div className="w-full flex flex-col max-h-[66vh] overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">GPA Bot</h2>
      <div className="flex-grow overflow-y-auto bg-gray-100 p-2 whitespace-pre-line">
        {messages.map((message, index) => (
          <div key={index} className="p-2 bg-blue-200 my-2 rounded">{message}</div>
        ))}
        {isLoading && <div className="flex justify-center items-center">
          {/* Example spinner animation */}
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>}
      </div>
      <div className="flex">
        <input
          type="text"
          value={question}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
          placeholder="Ask about GPA..."
          className="border-2 border-gray-300 rounded p-2 flex-grow mr-2"
          disabled={isLoading} // Disable when loading
          onKeyPress={handleKeyPress}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isLoading} // Disable when loading
        >
          Send
        </button>
      </div>
    </div>
  )}

  <button onClick={toggleMinimize} className="mt-2 text-sm underline">
    {isMinimized ? 'Open Chat' : 'Minimize Chat'}
  </button>
</div>
  
  );
};

export default ChatbotModal;
