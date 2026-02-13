import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Landing } from '../pages/Landing';
import { About } from '../pages/About';
import { SignUp } from '../pages/SignUp';
import { Documentation } from '../pages/Documentation';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Landing />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'docs',
                element: <Documentation />,
            },
            {
                path: 'signup',
                element: <SignUp />,
            },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/app',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
