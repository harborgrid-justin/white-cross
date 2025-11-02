"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, TrendingDown, Calendar, DollarSign, Users, Clock, Target } from "lucide-react";

export default function AnalyticsSlot() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Billing Analytics
          </h2>
          <p className="text-muted-foreground">
            Comprehensive insights into billing performance and trends
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Last 30 days
        </Badge>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$184,295</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  +12.5% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Invoice Value</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,847</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  +8.2% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.7%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  -2.1% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  +5.8% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue breakdown by service type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Primary Care</span>
                    <span className="font-medium">$89,247 (48.4%)</span>
                  </div>
                  <Progress value={48} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Specialty Care</span>
                    <span className="font-medium">$52,891 (28.7%)</span>
                  </div>
                  <Progress value={29} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Procedures</span>
                    <span className="font-medium">$31,456 (17.1%)</span>
                  </div>
                  <Progress value={17} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Laboratory</span>
                    <span className="font-medium">$10,701 (5.8%)</span>
                  </div>
                  <Progress value={6} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Days Sales Outstanding (DSO)</CardTitle>
                <CardDescription>Average time to collect payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">32.4 days</div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                  -1.8 days from last month (improved)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aging Analysis</CardTitle>
                <CardDescription>Outstanding receivables by age</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">0-30 days</span>
                    <Badge variant="secondary">$45,892</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">31-60 days</span>
                    <Badge variant="outline">$18,234</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">61-90 days</span>
                    <Badge variant="destructive">$8,912</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">90+ days</span>
                    <Badge variant="destructive">$4,567</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>First Pass Resolution Rate</CardTitle>
                <CardDescription>Claims processed successfully on first submission</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">87.3%</div>
                <Progress value={87} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Target: 90%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Denial Rate</CardTitle>
                <CardDescription>Percentage of claims denied by payers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8.7%</div>
                <Progress value={13} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Industry average: 12.6%
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecast</CardTitle>
              <CardDescription>Projected revenue for next 3 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">December 2024</p>
                    <p className="text-sm text-muted-foreground">Based on current trends</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">$192,400</p>
                    <p className="text-xs text-green-600">+4.4% growth</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">January 2025</p>
                    <p className="text-sm text-muted-foreground">Seasonal adjustment applied</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">$178,200</p>
                    <p className="text-xs text-red-600">-7.4% seasonal dip</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">February 2025</p>
                    <p className="text-sm text-muted-foreground">Recovery expected</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">$186,800</p>
                    <p className="text-xs text-green-600">+4.8% recovery</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
