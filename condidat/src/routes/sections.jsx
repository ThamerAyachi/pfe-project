/* eslint-disable */
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import RegisterView from 'src/sections/register/register-view';
import { AuthService } from 'src/services/authentication-service';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const LoadingComponent = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>
);

const PrivateRoute = ({ element, ...rest }) => {
  return AuthService.isAuthenticated() ? element : <Navigate to="/login" />;
};

const PublicRoute = ({ element, ...rest }) => {
  return !AuthService.isAuthenticated() ? element : <Navigate to="/" />;
};

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={<LoadingComponent />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <PrivateRoute element={<IndexPage />} />, index: true },
        { path: 'user', element: <PrivateRoute element={<UserPage />} /> },
        { path: 'products', element: <PrivateRoute element={<ProductsPage />} /> },
        { path: 'blog', element: <PrivateRoute element={<BlogPage />} /> },
      ],
    },
    {
      path: 'login',
      element: <PublicRoute element={<LoginPage />} />,
    },
    {
      path: 'register',
      element: <PublicRoute element={<RegisterView />} />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
