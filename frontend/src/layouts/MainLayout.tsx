import React from "react";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <Navbar />
    <main>{children}</main>
  </div>
);

export default MainLayout;
