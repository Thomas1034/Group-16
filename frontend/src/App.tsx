import Homepage from './homepage/homepage.tsx'
import { Routes, Route, Outlet, Link, BrowserRouter} from "react-router-dom";
import ReviewPage from './reviewpage/reviewpage.tsx';
import CreatePage from './createpage/createpage.tsx'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<Homepage />}/>
        <Route path="/reviews" element={<ReviewPage />}/>
        <Route path="/create" element={<CreatePage />}/>
        <Route path="*" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
