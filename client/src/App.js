import ResponsiveQuestionForm from './components/textPrompt';
import CameraComponent from './components/picPrompt';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/maddie' element={<ResponsiveQuestionForm />} />
      <Route path='/brian' element={<CameraComponent />} />
    </Routes>
  );
}

export default App;
