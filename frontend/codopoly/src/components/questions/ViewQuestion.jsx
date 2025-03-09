import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/home.module.css';

const ViewQuestion = () => {
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:3000/question'); // Added 'await'
                setQuestions(response.data.questions || []); // Ensuring it's an array
            } catch (error) {
                console.error('Failed to fetch questions:', error);
                setError('Failed to fetch questions.');
            }
        };
        fetchQuestions();
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Error Questions</h2>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <ul>
                    {questions.length > 0 ? (
                        questions.map((q, index) => (
                            <li key={index} className={styles.listItem}>
                                <strong>{q.title}</strong>
                                <pre className={styles.codeBlock}>
                                    {q.POC
                                        ? Object.entries(q.POC)
                                              .map(([key, value]) => `POC ${key}:\n${value}`)
                                              .join('\n\n')
                                        : 'No POCs available'}
                                </pre>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">No questions available.</p>
                    )}
                </ul>
            )}
        </div>
    );
    
    
    
};

export default ViewQuestion;