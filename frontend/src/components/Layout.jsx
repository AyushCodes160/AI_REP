import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 ml-64 p-8"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;

