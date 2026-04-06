import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import BottomNav from "./BottomNav";

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  type: "tween",
  ease: [0.22, 1, 0.36, 1],
  duration: 0.32,
};

import Sidebar from "./Sidebar";

const hiddenHeaderRoutes = ["/", "/language"];
const hiddenSidebarRoutes = ["/", "/language", "/welcome"];

export default function Layout({ children, title, back }) {
  const location = useLocation();
  const showHeader = !hiddenHeaderRoutes.includes(location.pathname);
  const showSidebar = !hiddenSidebarRoutes.includes(location.pathname);

  return (
    <div style={{
      flex: 1,
      background: "var(--color-bg)",
      position: "relative",
      display: "flex",
      flexDirection: "row", // Desktop flex row
      width: "100%",
    }}>
      {showSidebar && <Sidebar />}

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}>
        {showHeader && <Header title={title} back={back} />}

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            style={{
              flex: 1,
              paddingBottom: showHeader ? 96 : 0,
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        <BottomNav />
      </div>
    </div>
  );
}
