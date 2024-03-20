import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function Layout({ children }) {
  const location = useLocation();
  const isNavbarAndFooterVisible = location.pathname !== "/" && location.pathname !== "/register";

  return (
    <div>
      {isNavbarAndFooterVisible && <Navbar />}
      {children}
      {isNavbarAndFooterVisible && <Footer />}
    </div>
  );
}

export default Layout;
