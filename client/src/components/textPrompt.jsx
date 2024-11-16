import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import axios from "axios"

const ResponsiveQuestionForm = () => {
  const [questions, setQuestions] = useState([
    { id: 1, question: 'Directed by', answer: '', name:"directedBy" },
    { id: 2, question: 'Email', answer: '', name:"email" },
    { id: 3, question: 'Subject', answer: '', name:'subject' },
    { id: 4, question: 'What does Sloomoo do? / How does Sloomoo react? ', answer: '', name:'prompt' },
  ]);

  const handleAnswerChange = (id, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, answer: value } : q
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: questions[0].answer,
      email: questions[1].answer,
      subject: questions[2].answer,
      prompt: questions[3].answer,
    }
    // Handle form submission logic
    axios.post('http://localhost:3001/maddie', formData);
  };

  return (
    <Container
      className="my-5 p-3"
      style={{
        maxWidth: '600px',
        fontSize: '1.1rem',
      }}
    >
      <h2 className="text-center mb-4" style={{ fontSize: '1.5rem' }}>
        Title
      </h2>
      <Form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <Card className="mb-3" key={q.id}>
            <Card.Body>
              <Form.Group controlId={`question-${q.id}`}>
                <Form.Label className="fw-bold" style={{ fontSize: '1.2rem' }}>
                  {q.question}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your answer"
                  value={q.answer}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  style={{
                    borderRadius: '5px',
                    fontSize: '1.1rem',
                    padding: '10px',
                  }}
                  name={q.name}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        ))}

        <Button
          type="submit"
          variant="primary"
          className="w-100 mt-3"
          style={{
            fontSize: '1.2rem',
            padding: '12px',
          }}
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default ResponsiveQuestionForm;
