
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Bell, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// Données d'exemple pour les notifications
const notifications = [
  {
    id: 1,
    date: "02/05/2025 à 09:15",
    notification: "Dépassement de budget",
    description: "Le département Ventes a dépassé son budget alloué de 10 000 DT.",
    type: "alerte",
    source: "Système de budget",
    isRead: false
  },
  {
    id: 2,
    date: "02/05/2025 à 08:30",
    notification: "Nouvelle allocation",
    description: "15 000 DT ont été alloués au projet 'Refonte Site Web'.",
    type: "info",
    source: "Allocation de budget",
    isRead: true
  },
  {
    id: 3,
    date: "01/05/2025 à 14:45",
    notification: "Approche de limite",
    description: "Le département Marketing approche 85% de son budget alloué.",
    type: "info",
    source: "Système de budget",
    isRead: false
  },
  {
    id: 4,
    date: "01/05/2025 à 10:20",
    notification: "Dépense approuvée",
    description: "La dépense de 12 500 DT pour 'Achat matériel de laboratoire' a été approuvée.",
    type: "success",
    source: "Système d'approbation",
    isRead: true
  },
  {
    id: 5,
    date: "30/04/2025 à 16:10",
    notification: "Approbation requise",
    description: "Une dépense de 8 500 DT pour 'Organisation webinaire' nécessite votre approbation.",
    type: "info",
    source: "Système d'approbation",
    isRead: false
  },
  {
    id: 6,
    date: "30/04/2025 à 11:05",
    notification: "Approche de limite",
    description: "Le département IT approche 90% de son budget alloué.",
    type: "info",
    source: "Système de budget",
    isRead: true
  },
];

const Notifications = () => {
  const [notifs, setNotifs] = useState(notifications);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Comptage des notifications par type
  const allCount = notifs.length;
  const unreadCount = notifs.filter(n => !n.isRead).length;
  const alertCount = notifs.filter(n => n.type === "alerte").length;
  const infoCount = notifs.filter(n => n.type === "info").length;

  // Filtrage des notifications selon l'onglet actif
  const filteredNotifications = notifs.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    if (activeTab === "alerts") return notification.type === "alerte";
    if (activeTab === "info") return notification.type === "info";
    return true;
  });

  // Marquer une notification comme lue
  const markAsRead = (id: number) => {
    setNotifs(notifs.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifs(notifs.map(notif => ({ ...notif, isRead: true })));
  };

  // Obtenir la bonne couleur pour le badge selon le type
  const getBadgeClass = (type: string) => {
    switch (type) {
      case "alerte":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "info":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "success":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Obtenir l'icône selon le type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "alerte":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  // Obtenir le texte selon le type
  const getTypeText = (type: string) => {
    switch (type) {
      case "alerte":
        return "Alerte";
      case "info":
        return "Info";
      case "success":
        return "Succès";
      default:
        return "Info";
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-primary">Notifications</h1>
          <p className="text-secondary-foreground">Alertes et informations concernant vos budgets et dépenses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>
          <Button variant="default" size="sm" className="flex items-center gap-2 bg-yellow-400 text-black hover:bg-yellow-500" onClick={markAllAsRead}>
            Tout marquer comme lu
          </Button>
        </div>
      </header>

      {unreadCount > 0 && (
        <Alert className="bg-blue-50 border-blue-100 text-blue-800">
          <AlertDescription>
            Vous avez {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}.
          </AlertDescription>
        </Alert>
      )}

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full max-w-md">
              <TabsTrigger value="all" className="flex-1">
                Toutes <Badge className="ml-1 bg-gray-200 text-gray-700">{allCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Non lues <Badge className="ml-1 bg-gray-200 text-gray-700">{unreadCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex-1">
                Alertes <Badge className="ml-1 bg-red-200 text-red-700">{alertCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="info" className="flex-1">
                Informations <Badge className="ml-1 bg-blue-200 text-blue-700">{infoCount}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Notification</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Aucune notification trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNotifications.map((notif) => (
                      <TableRow key={notif.id} className={cn(!notif.isRead && "bg-muted/20")}>
                        <TableCell className="font-medium">{notif.date}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{notif.notification}</div>
                            <div className="text-sm text-muted-foreground">{notif.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getBadgeClass(notif.type)} variant="outline">
                            <span className="flex items-center gap-1">
                              {getTypeIcon(notif.type)}
                              {getTypeText(notif.type)}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>{notif.source}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Checkbox 
                              checked={notif.isRead}
                              onCheckedChange={() => markAsRead(notif.id)}
                              id={`read-${notif.id}`}
                              className="mr-2"
                            />
                            <label htmlFor={`read-${notif.id}`} className="text-sm cursor-pointer">Lu</label>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
