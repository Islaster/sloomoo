import ResponsiveQuestionForm from './components/textPrompt';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom'
import OpeningScreen from './components/openingScreen/openingScreen';
import TextPrompt from './components/textPrompt';

function App() {
  return (
    <Routes>
      <Route path='/' element={<TextPrompt />} />
    </Routes>
  );
}

export default App;
