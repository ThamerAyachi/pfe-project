/* eslint-disable */
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import { AuthService } from 'src/services/authentication-service';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const SetPasswordPage = lazy(() => import('src/pages/rest_password/set_password'));
export const EmailRestPasswordPage = lazy(() =>
  import('src/pages/rest_password/email_rest_password')
);
export const OffersPage = lazy(() => import('src/pages/offers'));
export const OfferPage = lazy(() => import('src/pages/offer'));
export const OfferUpdatePage = lazy(() => import('src/pages/offer-update'));
export const OfferDetailsPage = lazy(() => import('src/pages/offer-details'));

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
        { path: 'profile', element: <PrivateRoute element={<ProfilePage />} /> },
        { path: 'user', element: <PrivateRoute element={<UserPage />} /> },
        { path: 'products', element: <PrivateRoute element={<ProductsPage />} /> },
        { path: 'blog', element: <PrivateRoute element={<BlogPage />} /> },
        { path: 'offers', element: <PrivateRoute element={<OffersPage />} /> },
        { path: 'offer', element: <PrivateRoute element={<OfferPage />} /> },
        { path: 'offer/:id/update', element: <PrivateRoute element={<OfferUpdatePage />} /> },
        { path: 'offer/:id', element: <PrivateRoute element={<OfferDetailsPage />} /> },
      ],
    },
    {
      path: 'login',
      element: <PublicRoute element={<LoginPage />} />,
    },
    {
      path: 'register',
      element: <PublicRoute element={<RegisterPage />} />,
    },
    {
      path: 'reset_password',
      element: <PublicRoute element={<EmailRestPasswordPage />} />,
    },
    {
      path: 'set_password',
      element: <PublicRoute element={<SetPasswordPage />} />,
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
