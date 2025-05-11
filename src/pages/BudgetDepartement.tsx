
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import { Progress } from "@/components/ui/progress";

// Demo data
const budgetData = {
  totalBudget: 500000,
  remainingBudget: 200000,
  usedPercentage: 60,
  year: "2025",
};

const projectExpenses = [
  { name: "Audit Client XYZ 2025", allocated: 50000, spent: 30000 },
  { name: "Migration Système", allocated: 120000, spent: 95000 },
  { name: "Étude de Marché", allocated: 35000, spent: 25000 },
  { name: "Développement CRM", allocated: 80000, spent: 70000 },
  { name: "Formation Personnel", allocated: 45000, spent: 30000 },
];

const monthlyExpenses = [
  { name: "Jan", expenses: 25000 },
  { name: "Fév", expenses: 35000 },
  { name: "Mar", expenses: 40000 },
  { name: "Avr", expenses: 30000 },
  { name: "Mai", expenses: 45000 },
  { name: "Juin", expenses: 55000 },
  { name: "Juil", expenses: 60000 },
  { name: "Août", expenses: 50000 },
  { name: "Sep", expenses: 55000 },
  { name: "Oct", expenses: 45000 },
  { name: "Nov", expenses: 40000 },
  { name: "Déc", expenses: 20000 },
];

const COLORS = ["#FFE600", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const BudgetDepartement = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  
  const usedAmount = budgetData.totalBudget - budgetData.remainingBudget;
  
  // Data for the donut chart
  const budgetDistributionData = [
    { name: "Utilisé", value: usedAmount },
    { name: "Restant", value: budgetData.remainingBudget },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Budget Département</h1>
          <p className="text-secondary-foreground">Vue d'ensemble du budget départemental</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </header>

      {/* Card Principal */}
      <Card className="p-6 border bg-white shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Budget {selectedYear}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground mb-1">Budget Total</p>
                <p className="text-3xl font-bold">{budgetData.totalBudget.toLocaleString()} DT</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Budget Restant</p>
                <p className="text-3xl font-bold text-green-600">{budgetData.remainingBudget.toLocaleString()} DT</p>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span className="text-sm">Utilisation</span>
                <span className="text-sm font-medium">{budgetData.usedPercentage}%</span>
              </div>
              <Progress value={budgetData.usedPercentage} className="h-3" />
            </div>
          </div>
          
          <div className="w-full md:w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell key="cell-0" fill="#FFE600" />
                  <Cell key="cell-1" fill="#0088FE" />
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} DT`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Card Secondaire */}
      <Card className="p-6 border bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Répartition des Dépenses par Projet</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={projectExpenses}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `${value.toLocaleString()} DT`} />
              <Legend />
              <Bar name="Alloué" dataKey="allocated" fill="#0088FE" />
              <Bar name="Dépensé" dataKey="spent" fill="#FFE600" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Graphique 3: Tendances des dépenses sur l'année */}
      <Card className="p-6 border bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Tendances des Dépenses {selectedYear}</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyExpenses}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()} DT`} />
              <Legend />
              <Line
                type="monotone"
                name="Dépenses Mensuelles"
                dataKey="expenses"
                stroke="#FFE600"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <ReferenceLine
                y={41666}
                stroke="red"
                strokeDasharray="3 3"
                label="Budget Mensuel Moyen"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Liste détaillée des projets */}
      <Card className="p-6 border bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Détails des Projets</h2>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Voir tous les projets
          </Button>
        </div>
        <div className="space-y-4">
          {projectExpenses.map((project, index) => {
            const usedPercentage = Math.round((project.spent / project.allocated) * 100);
            return (
              <div key={index} className="p-4 border rounded-md">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{project.name}</h3>
                  <span className="text-sm font-bold">{usedPercentage}%</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Dépensé: {project.spent.toLocaleString()} DT</span>
                  <span>Alloué: {project.allocated.toLocaleString()} DT</span>
                </div>
                <Progress 
                  value={usedPercentage} 
                  className={`h-2 ${usedPercentage > 90 ? 'bg-red-200' : usedPercentage > 70 ? 'bg-yellow-200' : 'bg-green-200'}`}
                />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default BudgetDepartement;
