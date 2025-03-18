
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
  { month: "Feb", actual: 52000, predicted: 51000 },
  { month: "Mar", actual: 48000, predicted: 49000 },
  { month: "Apr", actual: 61000, predicted: 58000 },
  { month: "May", actual: 55000, predicted: 57000 },
  { month: "Jun", actual: 67000, predicted: 66000 },
  { month: "Jul", actual: 72000, predicted: 70000 },
  { month: "Aug", actual: 70000, predicted: 74000 },
  { month: "Sep", actual: 81000, predicted: 78000 },
  { month: "Oct", actual: null, predicted: 82000 },
  { month: "Nov", actual: null, predicted: 85000 },
  { month: "Dec", actual: null, predicted: 90000 },
];

const anomalyDetection = [
  { id: 1, department: "IT", category: "Software Licenses", amount: 12000, typical: 5000, risk: "high" },
  { id: 2, department: "Marketing", category: "Digital Advertising", amount: 3500, typical: 4000, risk: "low" },
  { id: 3, department: "Sales", category: "Travel Expenses", amount: 7500, typical: 5000, risk: "medium" },
  { id: 4, department: "R&D", category: "Equipment", amount: 15000, typical: 15500, risk: "low" },
  { id: 5, department: "Operations", category: "Utilities", amount: 9800, typical: 6000, risk: "high" },
];

const riskColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const PredictiveAnalytics = () => {
  const [analysisType, setAnalysisType] = useState("forecast");
  
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Predictive Analytics</h1>
          <p className="text-secondary-foreground">Forecast financial trends and detect anomalies</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue={analysisType} onValueChange={setAnalysisType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="forecast">Budget Forecasting</SelectItem>
              <SelectItem value="anomalies">Anomaly Detection</SelectItem>
              <SelectItem value="optimization">Budget Optimization</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
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
              <p className="text-sm text-muted-foreground">Forecast Accuracy</p>
              <h2 className="text-2xl font-bold">94.2%</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI Predictions</p>
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
              <p className="text-sm text-muted-foreground">Detected Anomalies</p>
              <h2 className="text-2xl font-bold">5</h2>
            </div>
          </div>
        </Card>
      </div>

      {analysisType === "forecast" && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Budget Forecast (Next 3 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value?.toLocaleString() || 0}`} />
                  <Legend />
                  <ReferenceLine x="Sep" stroke="#888" label="Current" />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#0088FE" 
                    strokeWidth={2} 
                    dot={{ r: 5 }}
                    name="Actual Expenses"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#FF8042" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                    name="Predicted Expenses"
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
            <CardTitle>Anomaly Detection</CardTitle>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Analyze More
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Expense Category</TableHead>
                  <TableHead>Current Amount</TableHead>
                  <TableHead>Typical Amount</TableHead>
                  <TableHead>Difference</TableHead>
                  <TableHead>Risk Level</TableHead>
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
                      <TableCell>${item.amount.toLocaleString()}</TableCell>
                      <TableCell>${item.typical.toLocaleString()}</TableCell>
                      <TableCell className={difference > 0 ? 'text-red-500' : 'text-green-500'}>
                        {difference > 0 ? '+' : ''}{difference.toLocaleString()} ({percentDiff}%)
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskColors[item.risk as keyof typeof riskColors]}`}>
                          {item.risk.charAt(0).toUpperCase() + item.risk.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Investigate</Button>
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
            <CardTitle>Budget Optimization Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">IT Department</h3>
                <p className="text-sm text-blue-600 mb-3">Based on historical data, we recommend optimizing the following:</p>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                  <li>Reduce software license costs by consolidating vendors ($2,500 potential savings)</li>
                  <li>Optimize cloud infrastructure spending based on actual usage patterns ($3,800 potential savings)</li>
                  <li>Review hardware refresh cycle to extend lifecycle where possible ($1,200 potential savings)</li>
                </ul>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="bg-white">Apply Recommendations</Button>
                </div>
              </div>
              
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <h3 className="text-lg font-semibold text-green-700 mb-2">Marketing Department</h3>
                <p className="text-sm text-green-600 mb-3">Based on ROI analysis, we recommend the following budget adjustments:</p>
                <ul className="list-disc pl-5 space-y-1 text-green-700">
                  <li>Increase digital advertising budget by 15% based on positive conversion rates</li>
                  <li>Reduce print marketing budget by 30% and reallocate to social media campaigns</li>
                  <li>Consolidate marketing analytics tools to reduce redundancy ($1,800 potential savings)</li>
                </ul>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="bg-white">Apply Recommendations</Button>
                </div>
              </div>
              
              <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                <h3 className="text-lg font-semibold text-purple-700 mb-2">Operations Department</h3>
                <p className="text-sm text-purple-600 mb-3">Based on efficiency analysis, we recommend the following:</p>
                <ul className="list-disc pl-5 space-y-1 text-purple-700">
                  <li>Implement energy efficiency measures to reduce utility costs ($4,200 potential annual savings)</li>
                  <li>Renegotiate supplier contracts based on volume analysis ($3,500 potential savings)</li>
                  <li>Optimize inventory levels to reduce carrying costs ($2,100 potential savings)</li>
                </ul>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="bg-white">Apply Recommendations</Button>
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
