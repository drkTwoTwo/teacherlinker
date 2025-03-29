
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  UserCheck, 
  ClipboardList, 
  BarChart, 
  AlertTriangle,
  BookOpen,
  LogOut,
  Menu,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

const Sidebar = ({ isMobile, isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const { logout, teacher } = useAuth();
  
  const sidebarItems: SidebarItem[] = [
    { title: 'Dashboard', icon: Home, path: '/dashboard' },
    { title: 'Attendance Marking', icon: UserCheck, path: '/attendance-marking' },
    { title: 'Attendance Reports', icon: ClipboardList, path: '/attendance-reports' },
    { title: 'NC-DC List', icon: AlertTriangle, path: '/nc-dc-list' },
    { title: 'Previous Reports', icon: BookOpen, path: '/previous-reports' },
  ];

  return (
    <>
      {isMobile && (
        <div className="flex items-center h-16 px-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">TeacherLinker</h1>
        </div>
      )}
      
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && "shadow-xl"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold">TeacherLinker</h1>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="flex flex-col items-center p-4 border-b border-sidebar-border">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-16 w-16 rounded-full bg-sidebar-accent flex items-center justify-center text-2xl font-bold">
              {teacher?.name.charAt(0)}
            </div>
            <div className="text-center">
              <h2 className="font-medium">{teacher?.name}</h2>
              <p className="text-sm opacity-80">{teacher?.department}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50"
              )}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="flex items-center w-full gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
