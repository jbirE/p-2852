
import { 
  Home, 
  PieChart, 
  Settings, 
  User, 
  CreditCard, 
  Bell, 
  DollarSign, 
  FileText, 
  LayoutDashboard, 
  TrendingUp, 
  Lock,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: PieChart, label: "Analytics", path: "/analytics" },
  { icon: CreditCard, label: "Transactions", path: "/transactions" },
  { icon: DollarSign, label: "Budget Management", path: "/budget-management" },
  { icon: FileText, label: "Expense Reports", path: "/expense-reports" },
  { icon: LayoutDashboard, label: "Financial Dashboards", path: "/financial-dashboards" },
  { icon: TrendingUp, label: "Predictive Analytics", path: "/predictive-analytics" },
  { icon: Lock, label: "Access Control", path: "/access-control" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-primary text-white border-r border-gray-700">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="h-6 w-6 mr-2 bg-secondary rounded-sm flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-sm">EY</span>
            </div>
            <h2 className="text-xl font-bold text-white">ConnectSpace</h2>
          </div>
        </div>
        
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-sm transition-all duration-200",
                      "hover:bg-gray-700",
                      isActive ? "bg-gray-700 text-white" : "text-gray-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700 mt-auto">
          <div className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-sm cursor-pointer">
            <LogOut className="h-4 w-4 mr-3" />
            <span className="text-sm">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
