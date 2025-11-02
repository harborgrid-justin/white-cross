"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  RefreshCcw, 
  Home, 
  Bug, 
  Mail, 
  ExternalLink,
  Shield,
  Server,
  Wifi,
  Database
} from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global billing error:", error);
    
    // You could also send to a service like Sentry here
    // Sentry.captureException(error);
  }, [error]);

  const getErrorCategory = (error: Error) => {
    const message = error.message.toLowerCase();
    
    if (message.includes("network") || message.includes("fetch")) {
      return {
        category: "Network",
        icon: Wifi,
        description: "Connection or network-related issue",
        color: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800"
      };
    }
    
    if (message.includes("payment") || message.includes("billing")) {
      return {
        category: "Billing System",
        icon: Shield,
        description: "Payment processing or billing system error",
        color: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      };
    }
    
    if (message.includes("database") || message.includes("query")) {
      return {
        category: "Database",
        icon: Database,
        description: "Data storage or retrieval issue",
        color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800"
      };
    }
    
    return {
      category: "System",
      icon: Server,
      description: "General application error",
      color: "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800"
    };
  };

  const errorInfo = getErrorCategory(error);
  const IconComponent = errorInfo.icon;

  const handleReportBug = () => {
    const subject = encodeURIComponent(`Billing System Error: ${error.name}`);
    const body = encodeURIComponent(`
Error Details:
- Message: ${error.message}
- Stack: ${error.stack}
- Digest: ${error.digest || 'N/A'}
- Timestamp: ${new Date().toISOString()}
- User Agent: ${navigator.userAgent}
- URL: ${window.location.href}

Please describe what you were doing when this error occurred:
[Your description here]
    `);
    
    window.open(`mailto:support@whitecross.com?subject=${subject}&body=${body}`);
  };

  return (
    <html>
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-2xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-destructive/10 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Application Error
              </h1>
              <p className="text-muted-foreground">
                The billing system encountered an unexpected error
              </p>
            </div>

            {/* Error Details Card */}
            <Card className={errorInfo.color}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  {errorInfo.category} Error
                  <Badge variant="outline" className="ml-auto">
                    {error.name}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {errorInfo.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Error Message</h4>
                    <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                      {error.message}
                    </div>
                  </div>
                  
                  {error.digest && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Error ID</h4>
                      <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                        {error.digest}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recovery Options</CardTitle>
                  <CardDescription>
                    Try these steps to resolve the issue
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={reset} 
                    className="w-full justify-start"
                    variant="default"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Retry Operation
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.href = '/dashboard/billing'}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Return to Billing Home
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.reload()}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refresh Page
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Get Help</CardTitle>
                  <CardDescription>
                    Contact support if the problem persists
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={handleReportBug}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Bug className="h-4 w-4 mr-2" />
                    Report Bug
                  </Button>
                  
                  <Button 
                    onClick={() => window.open('mailto:support@whitecross.com')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                  
                  <Button 
                    onClick={() => window.open('/help/billing')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Documentation
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Information</CardTitle>
                <CardDescription>
                  Details for technical support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Timestamp:</span>
                      <div className="text-muted-foreground font-mono">
                        {new Date().toISOString()}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Session:</span>
                      <div className="text-muted-foreground font-mono">
                        {error.digest || 'No session ID'}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <span className="font-medium">Current URL:</span>
                    <div className="text-muted-foreground font-mono break-all">
                      {typeof window !== 'undefined' ? window.location.href : 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                If this error persists, please contact our technical support team.
              </p>
              <p className="mt-1">
                Error occurred at {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
