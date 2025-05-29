import { useRoutes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "components/Loaders/SuspenseLoader/LoadingScreen";
import DashboardLayout from "layouts/DashboardLayout";

const Loadable = (Component) => (myProps) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      {myProps?.hidden?.() ? (
        <Navigate to="/" replace />
      ) : (
        <Component {...myProps} />
      )}
    </Suspense>
  );
};

const HomePage = Loadable(lazy(() => import("pages/HomePage")));
const RegistrationPage = Loadable(lazy(() => import("pages/RegistrationPage")));
const AboutUsPage = Loadable(lazy(() => import("pages/AboutUsPage")));
const LoginPage = Loadable(lazy(() => import("pages/LoginPage")));
const DashboardPage = Loadable(lazy(() => import("pages/DashboardPage")));
const ServicePage = Loadable(lazy(() => import("pages/servicepage")));
const SingleServicePage = Loadable(lazy(() => import("pages/singleService")));
const SingleProviderPage = Loadable(lazy(() => import("pages/singleProvider")));
const CostCalculatorPage = Loadable(lazy(() => import("pages/CostCalculator")));
const SupportPage = Loadable(lazy(() => import("pages/SupportPage")));
const TypingPage = Loadable(lazy(() => import("pages/Typing")));

const CostInvoice = Loadable(
  lazy(() => import("../components/CostCaculator/CostInvoice"))
);
const CompareServicePage = Loadable(
  lazy(() => import("pages/CompareServicePage"))
);
const OnboardingPage = Loadable(lazy(() => import("pages/OnboardingPage")));
const FeedbackPage = Loadable(lazy(() => import("pages/FeedbackPage")));

const AppRoutes = () => {
  const routes = [
    {
      path: "/costinvoice",
      element: <CostInvoice />,
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/registration", element: <RegistrationPage /> },
        { path: "/aboutus", element: <AboutUsPage /> },
        { path: "/login-to-dashboard", element: <LoginPage /> },
        { path: "/login-to-register", element: <LoginPage /> },
        { path: "/dashboard", element: <DashboardPage /> },
        { path: "/services", element: <ServicePage /> },
        { path: "/singleservices/:fileName", element: <SingleServicePage /> },
        { path: "/aboutus/:fileName", element: <SingleProviderPage /> },
        { path: "/costcalculator", element: <CostCalculatorPage /> },
        { path: "/support", element: <SupportPage /> },
        { path: "/onboarding", element: <OnboardingPage /> },
        { path: "/feedback", element: <FeedbackPage /> },
        { path: "/costInvoice", element: <CostInvoice /> },
        { path: "/compare-service", element: <CompareServicePage /> },
      ],
    },
    {
      path: "*",
      element: <h1 style={{ color: "red" }}> 404: Page Not Found</h1>,
    }, // Catch-all route
  ];

  return useRoutes(routes);
};

export default AppRoutes;
