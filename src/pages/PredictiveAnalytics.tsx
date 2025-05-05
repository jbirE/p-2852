
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Search, Brain, AlertTriangle, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

// Sample data for predictive analytics
const forecastData = [
  { month: "Jan", actual: 45000, predicted: 45000 },
  { month: "Fév", actual: 52000, predicted: 51000 },
  { month: "Mar", actual: 48000, predicted: 49000 },
  { month: "Avr", actual: 61000, predicted: 58000 },
  { month: "Mai", actual: 55000, predicted: 57000 },
  { month: "Juin", actual: 67000, predicted: 66000 },
  { month: "Juil", actual: 72000, predicted: 70000 },
  { month: "Août", actual: 70000, predicted: 74000 },
  { month: "Sep", actual: 81000, predicted: 78000 },
  { month: "Oct", actual: null, predicted: 82000 },
  { month: "Nov", actual: null, predicted: 85000 },
  { month: "Déc", actual: null, predicted: 90000 },
];

const anomalyDetection = [
  { id: 1, department: "IT", category: "Licences Logiciels", amount: 12000, typical: 5000, risk: "high" },
  { id: 2, department: "Marketing", category: "Publicité Numérique", amount: 3500, typical: 4000, risk: "low" },
  { id: 3, department: "Ventes", category: "Frais de Déplacement", amount: 7500, typical: 5000, risk: "medium" },
  { id: 4, department: "R&D", category: "Équipement", amount: 15000, typical: 15500, risk: "low" },
  { id: 5, department: "Opérations", category: "Services", amount: 9800, typical: 6000, risk: "high" },
];

const riskColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const riskLabels = {
  high: "Élevé",
  medium: "Moyen",
  low: "Faible",
};

const PredictiveAnalytics = () => {
  const [analysisType, setAnalysisType] = useState("forecast");
  
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Analytique Prédictive</h1>
          <p className="text-secondary-foreground">Prévisions des tendances financières et détection d'anomalies</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue={analysisType} onValueChange={setAnalysisType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sélectionner le type d'analyse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="forecast">Prévisions Budgétaires</SelectItem>
              <SelectItem value="anomalies">Détection d'Anomalies</SelectItem>
              <SelectItem value="optimization">Optimisation Budgétaire</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Précision des Prévisions</p>
              <h2 className="text-2xl font-bold">94,2%</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prédictions IA</p>
              <h2 className="text-2xl font-bold">257</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Anomalies Détectées</p>
              <h2 className="text-2xl font-bold">5</h2>
            </div>
          </div>
        </Card>
      </div>

      {analysisType === "forecast" && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Prévisions Budgétaires (3 prochains mois)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value?.toLocaleString() || 0} DT`} />
                  <Legend />
                  <ReferenceLine x="Sep" stroke="#888" label="Actuel" />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#0088FE" 
                    strokeWidth={2} 
                    dot={{ r: 5 }}
                    name="Dépenses Réelles"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#FF8042" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                    name="Dépenses Prévues"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {analysisType === "anomalies" && (
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Détection d'Anomalies</CardTitle>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Analyser Plus
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Département</TableHead>
                  <TableHead>Catégorie de Dépense</TableHead>
                  <TableHead>Montant Actuel</TableHead>
                  <TableHead>Montant Typique</TableHead>
                  <TableHead>Différence</TableHead>
                  <TableHead>Niveau de Risque</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anomalyDetection.map((item) => {
                  const difference = item.amount - item.typical;
                  const percentDiff = Math.round((difference / item.typical) * 100);
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.department}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.amount.toLocaleString()} DT</TableCell>
                      <TableCell>{item.typical.toLocaleString()} DT</TableCell>
                      <TableCell className={difference > 0 ? 'text-red-500' : 'text-green-500'}>
                        {difference > 0 ? '+' : ''}{difference.toLocaleString()} ({percentDiff}%)
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskColors[item.risk as keyof typeof riskColors]}`}>
                          {riskLabels[item.risk as keyof typeof riskLabels]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Examiner</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {analysisType === "optimization" && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recommandations d'Optimisation Budgétaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Département IT</h3>
                <p className="text-sm text-blue-600 mb-3">Basé sur les données historiques, nous recommandons d'optimiser les éléments suivants :</p>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                  <li>Réduire les coûts de licences logicielles en consolidant les fournisseurs (économie potentielle de 2 500 DT)</li>
                  <li>Optimiser les dépenses d'infrastructure cloud en fonction des schémas d'utilisation réels (économie potentielle de 3 800 DT)</li>
                  <li>Revoir le cycle de renouvellement du matériel pour prolonger la durée de vie si possible (économie potentielle de 1 200 DT)</li>
                </ul>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="bg-white">Appliquer les Recommandations</Button>
                </div>
              </div>
              
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <h3 className="text-lg font-semibold text-green-700 mb-2">Département Marketing</h3>
                <p className="text-sm text-green-600 mb-3">Basé sur l'analyse ROI, nous recommandons les ajustements budgétaires suivants :</p>
                <ul className="list-disc pl-5 space-y-1 text-green-700">
                  <li>Augmenter le budget de publicité numérique de 15% en fonction des taux de conversion positifs</li>
                  <li>Réduire le budget marketing imprimé de 30% et réaffecter aux campagnes de médias sociaux</li>
                  <li>Consolider les outils d'analyse marketing pour réduire la redondance (économie potentielle de 1 800 DT)</li>
                </ul>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="bg-white">Appliquer les Recommandations</Button>
                </div>
              </div>
              
              <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                <h3 className="text-lg font-semibold text-purple-700 mb-2">Département Opérations</h3>
                <p className="text-sm text-purple-600 mb-3">Basé sur l'analyse d'efficacité, nous recommandons ce qui suit :</p>
                <ul className="list-disc pl-5 space-y-1 text-purple-700">
                  <li>Mettre en œuvre des mesures d'efficacité énergétique pour réduire les coûts des services publics (économie annuelle potentielle de 4 200 DT)</li>
                  <li>Renégocier les contrats fournisseurs sur la base d'une analyse de volume (économie potentielle de 3 500 DT)</li>
                  <li>Optimiser les niveaux d'inventaire pour réduire les coûts de stockage (économie potentielle de 2 100 DT)</li>
                </ul>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="bg-white">Appliquer les Recommandations</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredictiveAnalytics;
