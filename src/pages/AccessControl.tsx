
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Shield, Key, Lock, Settings, Plus } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sample roles and permissions data
const roles = [
  { 
    id: 1, 
    name: "Admin", 
    userCount: 3, 
    description: "Full system access including user management", 
    permissions: ["read", "write", "approve", "configure", "manage_users"]
  },
  { 
    id: 2, 
    name: "Finance Manager", 
    userCount: 7, 
    description: "Manage all financial data and approve budgets", 
    permissions: ["read", "write", "approve"]
  },
  { 
    id: 3, 
    name: "Department Manager", 
    userCount: 12, 
    description: "Manage budgets for their department", 
    permissions: ["read", "write", "approve_departmental"]
  },
  { 
    id: 4, 
    name: "Employee", 
    userCount: 45, 
    description: "Submit expenses and view departmental data", 
    permissions: ["read_limited", "write_limited"]
  },
  { 
    id: 5, 
    name: "Auditor", 
    userCount: 2, 
    description: "View-only access to all financial data", 
    permissions: ["read"]
  },
];

// Sample users data
const users = [
  { id: 1, name: "John Smith", email: "john.smith@example.com", role: "Admin", status: "active", lastActive: "2023-10-23" },
  { id: 2, name: "Emma Watson", email: "emma.watson@example.com", role: "Finance Manager", status: "active", lastActive: "2023-10-22" },
  { id: 3, name: "James Brown", email: "james.brown@example.com", role: "Department Manager", status: "active", lastActive: "2023-10-21" },
  { id: 4, name: "Sarah Johnson", email: "sarah.johnson@example.com", role: "Employee", status: "inactive", lastActive: "2023-10-15" },
  { id: 5, name: "Michael Davis", email: "michael.davis@example.com", role: "Auditor", status: "active", lastActive: "2023-10-20" },
];

const permissionLabels = {
  read: "View Data",
  read_limited: "View Limited Data",
  write: "Edit Data",
  write_limited: "Submit Expenses",
  approve: "Approve All",
  approve_departmental: "Approve Departmental",
  configure: "Configure System",
  manage_users: "Manage Users",
};

const permissionColors = {
  read: "bg-blue-100 text-blue-800",
  read_limited: "bg-sky-100 text-sky-800",
  write: "bg-green-100 text-green-800",
  write_limited: "bg-emerald-100 text-emerald-800",
  approve: "bg-purple-100 text-purple-800",
  approve_departmental: "bg-indigo-100 text-indigo-800",
  configure: "bg-orange-100 text-orange-800",
  manage_users: "bg-red-100 text-red-800",
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
};

const AccessControl = () => {
  const [tab, setTab] = useState<'roles' | 'users'>('roles');
  
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Access Control</h1>
          <p className="text-secondary-foreground">Manage roles, permissions and user access</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setTab('roles')} className={tab === 'roles' ? 'bg-primary text-white' : ''}>
            <Shield className="h-4 w-4 mr-2" />
            Roles
          </Button>
          <Button variant="outline" onClick={() => setTab('users')} className={tab === 'users' ? 'bg-primary text-white' : ''}>
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New {tab === 'roles' ? 'Role' : 'User'}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Roles</p>
              <h2 className="text-2xl font-bold">5</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <h2 className="text-2xl font-bold">69</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Security Events</p>
              <h2 className="text-2xl font-bold">12</h2>
            </div>
          </div>
        </Card>
      </div>

      {tab === 'roles' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Roles & Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>{role.userCount}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission) => (
                          <Badge 
                            key={permission}
                            variant="outline" 
                            className={permissionColors[permission as keyof typeof permissionColors]}
                          >
                            {permissionLabels[permission as keyof typeof permissionLabels]}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === 'users' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>System Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={statusColors[user.status as keyof typeof statusColors]}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Key className="h-4 w-4 mr-2" />
                          Permissions
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccessControl;
