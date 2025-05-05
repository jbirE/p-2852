
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, BarChart, LineChart as LineChartIcon, PieChartIcon, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Données des finances mensuelles
const monthlyFinancialData = [
  { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
  { month: "Fév", revenue: 52000, expenses: 34000, profit: 18000 },
  { month: "Mar", revenue: 48000, expenses: 33000, profit: 15000 },
  { month: "Avr", revenue: 61000, expenses: 35000, profit: 26000 },
  { month: "Mai", revenue: 55000, expenses: 37000, profit: 18000 },
  { month: "Juin", revenue: 67000, expenses: 41000, profit: 26000 },
  { month: "Juil", revenue: 72000, expenses: 43000, profit: 29000 },
  { month: "Août", revenue: 70000, expenses: 45000, profit: 25000 },
  { month: "Sep", revenue: 81000, expenses: 46000, profit: 35000 },
  { month: "Oct", revenue: 75000, expenses: 48000, profit: 27000 },
  { month: "Nov", revenue: 83000, expenses: 47000, profit: 36000 },
  { month: "Déc", revenue: 92000, expenses: 50000, profit: 42000 },
];

// Données des dépenses par département
const departmentExpenseData = [
  { name: "Marketing", value: 80000 },
  { name: "R&D", value: 120000 },
  { name: "Opérations", value: 100000 },
  { name: "Ventes", value: 60000 },
  { name: "IT", value: 90000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const FinancialDashboards = () => {
  const [timeframe, setTimeframe] = useState("year");
  
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Tableau de bord</h1>
          <p className="text-secondary-foreground">Aperçu des budgets, allocations et dépenses de votre organisation</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Ce Mois</SelectItem>
              <SelectItem value="quarter">Ce Trimestre</SelectItem>
              <SelectItem value="year">Cette Année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Budget Total</p>
              <h2 className="text-2xl font-bold">510 000 DT</h2>
              <p className="text-xs flex items-center text-green-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> +12% depuis le mois dernier
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Dépenses</p>
              <h2 className="text-2xl font-bold">450 000 DT</h2>
              <p className="text-xs flex items-center text-red-500 mt-1">
                <TrendingDown className="h-3 w-3 mr-1" /> -8% depuis le mois dernier
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Projets</p>
              <h2 className="text-2xl font-bold">12</h2>
              <p className="text-xs flex items-center text-green-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> +2% depuis le mois dernier
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <BarChart className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alertes</p>
              <h2 className="text-2xl font-bold">3</h2>
              <p className="text-xs flex items-center text-muted-foreground mt-1">
                Alertes de budget
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <BarChart className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5" />
              Comparaison Budgets/Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyFinancialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString()} DT`} />
                  <Legend />
                  <Line name="Revenus" type="monotone" dataKey="revenue" stroke="#FFE600" strokeWidth={2} />
                  <Line name="Dépenses" type="monotone" dataKey="expenses" stroke="#1A1A24" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Dépenses par Département
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={departmentExpenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString()} DT`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Analyse des Profits Mensuels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={monthlyFinancialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()} DT`} />
                <Legend />
                <Bar name="Profit" dataKey="profit" fill="#FFE600" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboards;
