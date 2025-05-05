
import { Card } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const analyticsData = [
  { name: "Jan", value: 1200 },
  { name: "Fév", value: 2100 },
  { name: "Mar", value: 800 },
  { name: "Avr", value: 1600 },
  { name: "Mai", value: 900 },
  { name: "Juin", value: 1700 },
];

const Analytics = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Aperçu Analytique</h1>
        <p className="text-secondary-foreground">Suivez votre performance financière</p>
      </header>

      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Tendances de Performance</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData}>
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip formatter={(value) => `${value.toLocaleString()} DT`} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#FFE600"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
