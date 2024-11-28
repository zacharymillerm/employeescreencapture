import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import DangerZone from './pages/DangerZone';
import EmployeeDetail from './pages/EmployeeDetail';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow p-4">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dangerzone" element={<DangerZone />} />
                        <Route path="/details/:employeeId" element={<EmployeeDetail />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
