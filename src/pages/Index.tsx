
import { Card } from "@/components/ui/card";
import { DollarSign, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Jan", value: 2400 },
  { name: "Fév", value: 1398 },
  { name: "Mar", value: 9800 },
  { name: "Avr", value: 3908 },
  { name: "Mai", value: 4800 },
  { name: "Juin", value: 3800 },
];

const Index = () => {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Bonjour!</h1>
          <p className="text-secondary-foreground">Bienvenue sur votre aperçu financier</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="glass-card px-4 py-2 rounded-lg hover-scale">
            <DollarSign className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Solde Total</p>
              <h2 className="text-2xl font-bold">24 563,00 DT</h2>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Revenus Mensuels</p>
              <h2 className="text-2xl font-bold">8 350,00 DT</h2>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Dépenses Mensuelles</p>
              <h2 className="text-2xl font-bold">3 628,00 DT</h2>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Aperçu des Dépenses</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip formatter={(value) => `${value.toLocaleString()} DT`} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8989DE"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Transactions Récentes</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded-full">
                    <PieChart className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Achats</p>
                    <p className="text-sm text-muted-foreground">il y a 2 heures</p>
                  </div>
                </div>
                <p className="font-medium text-red-500">-150,00 DT</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
