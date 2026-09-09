import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="h-screen overflow-hidden">
      <div className="flex h-full">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
