import { Routes, Route, useLocation, Link } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toasts from "./components/Toasts";
import { Backdrop, Button, ScrollProgress } from "./components/ui";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Book from "./pages/Book";
import MyBookings from "./pages/MyBookings";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Invoice from "./pages/Invoice";

const page = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

const Page = ({ children }) => <motion.main {...page}>{children}</motion.main>;

function NotFound() {
  return (
    <div className="px-5 pb-24 pt-44 text-center sm:px-8">
      <p className="font-display text-7xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink-900">
        This page does not exist
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-ink-600">
        The link may be out of date. Head back home and pick up from there.
      </p>
      <Button as={Link} to="/" className="mt-8">
        Back to home
      </Button>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <MotionConfig reducedMotion="user">
      <Backdrop />
      <ScrollProgress />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Page>
                <Home />
              </Page>
            }
          />
          <Route
            path="/services"
            element={
              <Page>
                <Services />
              </Page>
            }
          />
          <Route
            path="/about"
            element={
              <Page>
                <About />
              </Page>
            }
          />
          <Route
            path="/book"
            element={
              <Page>
                <Book />
              </Page>
            }
          />
          <Route
            path="/bookings"
            element={
              <Page>
                <MyBookings />
              </Page>
            }
          />
          <Route
            path="/invoice"
            element={
              <Page>
                <Invoice />
              </Page>
            }
          />
          <Route
            path="/invoice/:id"
            element={
              <Page>
                <Invoice />
              </Page>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Page>
                <Dashboard />
              </Page>
            }
          />
          <Route
            path="*"
            element={
              <Page>
                <NotFound />
              </Page>
            }
          />
        </Routes>
      </AnimatePresence>
      <Footer />
      <Toasts />
    </MotionConfig>
  );
}
