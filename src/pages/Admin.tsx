import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cable, MessageSquare, AlertTriangle, Clock, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  connectionRequests: { pending: number; total: number };
  contactMessages: { pending: number; total: number };
  problemReports: { pending: number; total: number };
}

const Admin = () => {
  const [stats, setStats] = useState<Stats>({
    connectionRequests: { pending: 0, total: 0 },
    contactMessages: { pending: 0, total: 0 },
    problemReports: { pending: 0, total: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch connection requests stats
        const { data: connectionData, error: connectionError } = await supabase
          .from("connection_requests")
          .select("status");
        
        if (connectionError) throw connectionError;
        
        // Fetch contact messages stats
        const { data: contactData, error: contactError } = await supabase
          .from("contact_messages")
          .select("status");
        
        if (contactError) throw contactError;
        
        // Fetch problem reports stats
        const { data: problemData, error: problemError } = await supabase
          .from("problem_reports")
          .select("status");
        
        if (problemError) throw problemError;

        setStats({
          connectionRequests: {
            pending: connectionData?.filter((r) => r.status === "pending").length || 0,
            total: connectionData?.length || 0,
          },
          contactMessages: {
            pending: contactData?.filter((m) => m.status === "pending").length || 0,
            total: contactData?.length || 0,
          },
          problemReports: {
            pending: problemData?.filter((r) => r.status === "pending").length || 0,
            total: problemData?.length || 0,
          },
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const cards = [
    {
      title: "Connection Requests",
      icon: Cable,
      pending: stats.connectionRequests.pending,
      total: stats.connectionRequests.total,
      href: "/admin/connection-requests",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Contact Messages",
      icon: MessageSquare,
      pending: stats.contactMessages.pending,
      total: stats.contactMessages.total,
      href: "/admin/contact-messages",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Problem Reports",
      icon: AlertTriangle,
      pending: stats.problemReports.pending,
      total: stats.problemReports.total,
      href: "/admin/problem-reports",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of all requests and messages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link key={card.title} to={card.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{card.total}</div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Clock className="w-4 h-4" />
                      {card.pending} pending
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      {card.total - card.pending} processed
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
