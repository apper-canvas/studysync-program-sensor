import React, { useContext } from "react";
import { useSelector } from "react-redux";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";

const Header = ({ onMenuClick, title, actions, className = "" }) => {
  const { logout } = useContext(AuthContext);
  const user = useSelector((state) => state.user.user);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden p-2"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            {title && (
              <h1 className="text-2xl font-display font-bold text-gray-900">
                {title}
              </h1>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-sm">
                  <span className="text-gray-600">Welcome back, </span>
                  <span className="font-medium text-gray-900">
                    {user.firstName || user.name || 'Student'}
                  </span>
                </div>
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {(user.firstName || user.name || 'S').charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <ApperIcon name="LogOut" size={16} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;