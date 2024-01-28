'use client';
import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import axios from 'axios';
import { Semester, Student } from '@/app/lib/definitions';

// Props interface for ChatbotModal component
interface ChatbotModalProps {
  isMinimized: boolean; // Indicates if the chatbot is minimized
  toggleMinimize: () => void; // Function to toggle the chatbot's minimized state
  studentData: Student; // Data of the student using the chatbot
}

// ChatbotModal component
// - This component is responsible for managing the state and UI of a chatbot.
// - It interacts with the OpenAI API to generate responses based on user queries.
const ChatbotModal: React.FC<ChatbotModalProps> = ({ isMinimized, toggleMinimize, studentData }) => {
  const [question, setQuestion] = useState<string>(''); // State to store the user's question
  const [response, setResponse] = useState<string>(''); // State to store the chatbot's response
  const [messages, setMessages] = useState<string[]>([]); // State to store the chat conversation history
  const [isLoading, setLoading] = useState<boolean>(false); // State to indicate if a request is in progress
  const [student, setStudentData] = useState<Student>(studentData); // State to store student data

  // handleSubmit function to handle the submission of the user's question
  const handleSubmit = async (): Promise<void> => {
    console.log('handleSubmit called'); // Debug log
    setLoading(true); // Set loading state to true
    updateStudentData(studentData); // Update student data

    // Constructing the prompt for the OpenAI API
    var prompt = "This question is from a Chatbot inside a GPA Calculator.\n\n";
    prompt += "-Please answer questions related to the following topics only: High School courses, High School and College Education related questions, and GPA Calculation.\n\n";
    //prompt += "-Example: If the user asks questions about high schools, answer that question.\n\n";
    prompt += "If the Student asks about topics other than the above mentioned topics, give a message that this question falls outside of the context. \n\n";

    // Adding specific instructions if the question includes "gpa"
    if (question.toLowerCase().includes("gpa")) {
      prompt += "\n\n-Example: If the user asks questions related to GPA like \"How to improve my GPA\", then look at the GPA of the user which is provided below, and answer how the user can improve in subjects where they have lower marks.\n\n";
      prompt += "\n\n-GPA of the user:\n";
      prompt += JSON.stringify(student, null, 2);

      prompt += "\n Limit the answer to 500 characters."
    }

    // Payload for the OpenAI API request
    const data = {
      model: "gpt-4-1106-preview",
      messages: [{ "role": "user", "content": question }, { "role": "system", "content": prompt }],
      max_tokens: 256
    };

    if (!question.trim()) return; // Prevent empty submissions

    // Sending the request to the OpenAI API
    try {
      const url = 'https://api.openai.com/v1/chat/completions';
      const headers = {
        'Content-type': 'application/json',
        //'Authorization': `Bearer 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` // Note: API Key should be secured
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      };

      const response = await axios.post(url, data, { headers: headers });
      setLoading(false); // Set loading to false after getting the response
      console.log(response); // Log the response

      // Process the response and update the chat history
      const newResponse = response.data.choices[0].message.content;
      setResponse(newResponse);
      setMessages(messages => [...messages, `Q: ${question}`, `A: ${newResponse}`]);
      setQuestion(''); // Clear the input after sending
    } catch (error: any) {
      console.error(error); // Log any errors
    }
  };

  // handleKeyPress function to submit the question when the Enter key is pressed
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // updateStudentData function to update the student data state
  const updateStudentData = (updatedStudent: Student) => {
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
        setStudentData(updatedStudent);

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
