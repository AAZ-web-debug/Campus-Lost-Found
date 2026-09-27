import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FinderMode from './pages/FinderMode';
import LoserMode from './pages/LoserMode';
import ClaimPage from './pages/ClaimPage';
import ReviewClaims from './pages/ReviewClaims';
import ReturnedItems from './pages/ReturnedItems';
import AdminPage from './pages/AdminPage';

import AdminRoute from './components/AdminRoute';
import { ToastProvider } from './components/Toast';
import MyClaims from "./pages/MyClaims";

function App() {
  return (
    <Router>

      <ToastProvider>

        <Routes>

          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/finder"
            element={<FinderMode />}
          />

          <Route
            path="/returned-items"
            element={<ReturnedItems />}
          />

          <Route
            path="/review-claims"
            element={<ReviewClaims />}
          />

          <Route
            path="/loser"
            element={<LoserMode />}
          />

          <Route
  path="/my-claims"
  element={<MyClaims />}
/>

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          <Route
            path="/claim/:id"
            element={<ClaimPage />}
          />

        </Routes>

      </ToastProvider>

    </Router>
  );
}

export default App;