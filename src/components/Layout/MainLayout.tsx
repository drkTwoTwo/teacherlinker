
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Home,
  UserCheck,
  ClipboardList,
  AlertTriangle,
  BookOpen,
  LogOut,
  LayoutGrid,
} from 'lucide-react';

const MainLayout = () => {
  const { isAuthenticated, loading, logout, teacher } = useAuth();

  // If still loading auth state, show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const sidebarItems = [
    { title: 'Dashboard', icon: Home, path: '/dashboard' },
    { title: 'Attendance Marking', icon: UserCheck, path: '/attendance-marking' },
    { title: 'Attendance Reports', icon: ClipboardList, path: '/attendance-reports' },
    { title: 'NC-DC List', icon: AlertTriangle, path: '/nc-dc-list' },
    { title: 'Previous Reports', icon: BookOpen, path: '/previous-reports' },
    { title: 'Exam Seat Plan', icon: LayoutGrid, path: '/exam-seating' },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="p-2">
              <div className="flex flex-col items-center space-y-2 py-2">
                <div className="h-16 w-16 rounded-full bg-sidebar-accent flex items-center justify-center text-2xl font-bold">
                  {teacher?.name?.charAt(0) || 'T'}
                </div>
                <div className="text-center">
                  <h2 className="font-medium">{teacher?.name || 'Teacher'}</h2>
                  <p className="text-sm opacity-80">{teacher?.department || 'Department'}</p>
                </div>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="p-2">
              <SidebarMenuButton onClick={logout}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1">
          <div className="container mx-auto p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
