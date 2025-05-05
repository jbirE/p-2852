
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Shield, Key, Lock, Settings, Plus, Pencil, Trash2, User } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Sample roles and permissions data
const initialRoles = [
  { 
    id: 1, 
    name: "Administrateur", 
    userCount: 3, 
    description: "Accès complet au système, y compris la gestion des utilisateurs", 
    permissions: ["read", "write", "approve", "configure", "manage_users"]
  },
  { 
    id: 2, 
    name: "Gestionnaire Financier", 
    userCount: 7, 
    description: "Gérer toutes les données financières et approuver les budgets", 
    permissions: ["read", "write", "approve"]
  },
  { 
    id: 3, 
    name: "Chef de Département", 
    userCount: 12, 
    description: "Gérer les budgets de leur département", 
    permissions: ["read", "write", "approve_departmental"]
  },
  { 
    id: 4, 
    name: "Employé", 
    userCount: 45, 
    description: "Soumettre des dépenses et consulter les données départementales", 
    permissions: ["read_limited", "write_limited"]
  },
  { 
    id: 5, 
    name: "Auditeur", 
    userCount: 2, 
    description: "Accès en lecture seule à toutes les données financières", 
    permissions: ["read"]
  },
];

// Sample users data
const initialUsers = [
  { id: 1, name: "John Smith", email: "john.smith@example.com", role: "Administrateur", status: "active", lastActive: "2023-10-23" },
  { id: 2, name: "Emma Watson", email: "emma.watson@example.com", role: "Gestionnaire Financier", status: "active", lastActive: "2023-10-22" },
  { id: 3, name: "James Brown", email: "james.brown@example.com", role: "Chef de Département", status: "active", lastActive: "2023-10-21" },
  { id: 4, name: "Sarah Johnson", email: "sarah.johnson@example.com", role: "Employé", status: "inactive", lastActive: "2023-10-15" },
  { id: 5, name: "Michael Davis", email: "michael.davis@example.com", role: "Auditeur", status: "active", lastActive: "2023-10-20" },
];

const permissionLabels = {
  read: "Voir les Données",
  read_limited: "Voir Données Limitées",
  write: "Modifier les Données",
  write_limited: "Soumettre des Dépenses",
  approve: "Approuver Tout",
  approve_departmental: "Approuver Départemental",
  configure: "Configurer le Système",
  manage_users: "Gérer les Utilisateurs",
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

const statusLabels = {
  active: "Actif",
  inactive: "Inactif",
};

// Schemas for forms
const roleFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Le nom du rôle est requis"),
  description: z.string().min(1, "La description est requise"),
  permissions: z.array(z.string()).min(1, "Au moins une permission est requise"),
});

const userFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Un email valide est requis"),
  role: z.string().min(1, "Le rôle est requis"),
  status: z.enum(["active", "inactive"]),
});

type RoleFormData = z.infer<typeof roleFormSchema>;
type UserFormData = z.infer<typeof userFormSchema>;

const AccessControl = () => {
  const [tab, setTab] = useState<'roles' | 'users'>('roles');
  const [roles, setRoles] = useState(initialRoles);
  const [users, setUsers] = useState(initialUsers);
  
  // State for forms
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Role form
  const roleForm = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    }
  });
  
  // User form
  const userForm = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      status: "active",
    }
  });
  
  // Role CRUD functions
  const handleAddRole = () => {
    setCurrentRole(null);
    roleForm.reset({
      name: "",
      description: "",
      permissions: [],
    });
    setIsRoleFormOpen(true);
  };
  
  const handleEditRole = (role: any) => {
    setCurrentRole(role);
    roleForm.reset({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setIsRoleFormOpen(true);
  };
  
  const handleDeleteRole = (id: number) => {
    setRoles(roles.filter(role => role.id !== id));
    toast.success("Rôle supprimé avec succès");
  };
  
  const handleSaveRole = (data: RoleFormData) => {
    if (data.id) {
      // Update existing role
      setRoles(roles.map(role => 
        role.id === data.id ? { ...role, ...data } : role
      ));
      toast.success("Rôle mis à jour avec succès");
    } else {
      // Add new role
      const newId = Math.max(0, ...roles.map(role => role.id)) + 1;
      setRoles([...roles, { 
        id: newId, 
        name: data.name, 
        description: data.description, 
        permissions: data.permissions,
        userCount: 0
      }]);
      toast.success("Rôle ajouté avec succès");
    }
    setIsRoleFormOpen(false);
  };
  
  // User CRUD functions
  const handleAddUser = () => {
    setCurrentUser(null);
    userForm.reset({
      name: "",
      email: "",
      role: "",
      status: "active",
    });
    setIsUserFormOpen(true);
  };
  
  const handleEditUser = (user: any) => {
    setCurrentUser(user);
    userForm.reset({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsUserFormOpen(true);
  };
  
  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("Utilisateur supprimé avec succès");
  };
  
  const handleSaveUser = (data: UserFormData) => {
    const today = new Date().toISOString().split('T')[0];
    
    if (data.id) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === data.id ? { ...user, ...data } : user
      ));
      toast.success("Utilisateur mis à jour avec succès");
    } else {
      // Add new user
      const newId = Math.max(0, ...users.map(user => user.id)) + 1;
      setUsers([...users, { 
        id: newId, 
        name: data.name, 
        email: data.email,
        role: data.role,
        status: data.status,
        lastActive: today
      }]);
      
      // Update role user count
      setRoles(roles.map(role => 
        role.name === data.role ? { ...role, userCount: role.userCount + 1 } : role
      ));
      
      toast.success("Utilisateur ajouté avec succès");
    }
    setIsUserFormOpen(false);
  };
  
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Contrôle d'Accès</h1>
          <p className="text-secondary-foreground">Gérer les rôles, permissions et accès utilisateurs</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setTab('roles')} className={tab === 'roles' ? 'bg-primary text-white' : ''}>
            <Shield className="h-4 w-4 mr-2" />
            Rôles
          </Button>
          <Button variant="outline" onClick={() => setTab('users')} className={tab === 'users' ? 'bg-primary text-white' : ''}>
            <Users className="h-4 w-4 mr-2" />
            Utilisateurs
          </Button>
          <Button className="flex items-center gap-2" onClick={tab === 'roles' ? handleAddRole : handleAddUser}>
            <Plus className="h-4 w-4" />
            Nouveau {tab === 'roles' ? 'Rôle' : 'Utilisateur'}
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
              <p className="text-sm text-muted-foreground">Total Rôles</p>
              <h2 className="text-2xl font-bold">{roles.length}</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Utilisateurs</p>
              <h2 className="text-2xl font-bold">{users.length}</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Événements de Sécurité</p>
              <h2 className="text-2xl font-bold">12</h2>
            </div>
          </div>
        </Card>
      </div>

      {tab === 'roles' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Rôles & Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du Rôle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Utilisateurs</TableHead>
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
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteRole(role.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
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

      {tab === 'users' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Utilisateurs Système</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière Activité</TableHead>
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
                        {statusLabels[user.status as keyof typeof statusLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
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

      {/* Role Form Dialog */}
      <Dialog open={isRoleFormOpen} onOpenChange={() => setIsRoleFormOpen(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentRole ? "Modifier Rôle" : "Nouveau Rôle"}</DialogTitle>
          </DialogHeader>
          <Form {...roleForm}>
            <form onSubmit={roleForm.handleSubmit(handleSaveRole)} className="space-y-6">
              <FormField
                control={roleForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du Rôle</FormLabel>
                    <FormControl>
                      <Input placeholder="Administrateur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={roleForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description du rôle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={roleForm.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(permissionLabels).map(([key, label]) => (
                        <FormField
                          key={key}
                          control={roleForm.control}
                          name="permissions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={key}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(key)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, key])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== key
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsRoleFormOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {currentRole ? "Mettre à jour" : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* User Form Dialog */}
      <Dialog open={isUserFormOpen} onOpenChange={() => setIsUserFormOpen(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentUser ? "Modifier Utilisateur" : "Nouvel Utilisateur"}</DialogTitle>
          </DialogHeader>
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(handleSaveUser)} className="space-y-6">
              <FormField
                control={userForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom Complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="jean.dupont@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsUserFormOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {currentUser ? "Mettre à jour" : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessControl;
