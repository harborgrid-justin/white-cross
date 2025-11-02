"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Send, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  Download, 
  Upload, 
  Settings, 
  RefreshCcw,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter
} from "lucide-react";

export default function ActionsSlot() {
  const quickActions = [
    {
      title: "Create Invoice",
      description: "Generate new patient invoice",
      icon: FileText,
      action: "create-invoice",
      variant: "default" as const,
      urgent: false
    },
    {
      title: "Process Payments",
      description: "Submit pending claims",
      icon: Send,
      action: "process-payments",
      variant: "default" as const,
      urgent: false
    },
    {
      title: "Generate Report",
      description: "Monthly billing summary",
      icon: Download,
      action: "generate-report",
      variant: "outline" as const,
      urgent: false
    },
    {
      title: "Import Data",
      description: "Upload patient billing data",
      icon: Upload,
      action: "import-data",
      variant: "outline" as const,
      urgent: false
    }
  ];

  const pendingActions = [
    {
      id: "PA001",
      title: "Review Denied Claims",
      description: "15 claims require attention",
      priority: "high",
      deadline: "Today",
      type: "review"
    },
    {
      id: "PA002", 
      title: "Follow-up Outstanding",
      description: "32 invoices over 60 days",
      priority: "medium",
      deadline: "This week",
      type: "followup"
    },
    {
      id: "PA003",
      title: "Insurance Verification",
      description: "8 patients need verification",
      priority: "low",
      deadline: "Next week",
      type: "verification"
    },
    {
      id: "PA004",
      title: "Payment Reconciliation",
      description: "Monthly reconciliation due",
      priority: "medium",
      deadline: "End of month",
      type: "reconciliation"
    }
  ];

  const recentActivities = [
    {
      id: "RA001",
      action: "Invoice #INV-2024-1847 created",
      user: "Dr. Sarah Johnson",
      timestamp: "2 minutes ago",
      status: "completed"
    },
    {
      id: "RA002",
      action: "Payment of $2,450 processed",
      user: "System",
      timestamp: "15 minutes ago", 
      status: "completed"
    },
    {
      id: "RA003",
      action: "Claim #CLM-5789 submitted",
      user: "Mary Chen",
      timestamp: "1 hour ago",
      status: "pending"
    },
    {
      id: "RA004",
      action: "Insurance verification failed",
      user: "System",
      timestamp: "2 hours ago",
      status: "failed"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Billing Actions
          </h2>
          <p className="text-muted-foreground">
            Quick actions and pending tasks
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Frequently used billing operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button 
                  key={action.action}
                  variant={action.variant}
                  className="h-auto p-4 justify-start"
                >
                  <div className="flex items-center gap-3 w-full">
                    <IconComponent className="h-5 w-5 shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Pending Actions
            <Badge variant="destructive" className="ml-auto">
              {pendingActions.filter(a => a.priority === "high").length} urgent
            </Badge>
          </CardTitle>
          <CardDescription>
            Tasks requiring your attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {pendingActions.map((action) => (
                <div 
                  key={action.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{action.title}</h4>
                      <Badge variant={getPriorityColor(action.priority)} className="text-xs">
                        {action.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {action.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {action.deadline}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activities
          </CardTitle>
          <CardDescription>
            Latest billing system activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>by {activity.user}</span>
                        <span>•</span>
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={activity.status === "completed" ? "secondary" : 
                              activity.status === "pending" ? "outline" : "destructive"}
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  {index < recentActivities.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Claims Processing</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Payment Gateway</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Insurance API</p>
                <p className="text-xs text-muted-foreground">Slow</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
