import ResponsiveQuestionForm from './components/textPrompt';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/maddie' element={<ResponsiveQuestionForm />} />
    </Routes>
  );
}

export default App;
