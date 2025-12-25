import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, Eye, Check, X, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type ContactMessage = Tables<"contact_messages">;
type RequestStatus = "pending" | "in_progress" | "complete" | "cancelled";

const statusColors: Record<RequestStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  in_progress: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  complete: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      let query = supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus as RequestStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch contact messages.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filterStatus]);

  const updateStatus = async (id: string, status: RequestStatus) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Message status changed to ${status}.`,
      });

      fetchMessages();
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status.",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Contact Messages</h1>
            <p className="text-muted-foreground mt-1">
              View and respond to customer inquiries
            </p>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {messages.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No contact messages found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {messages.map((message) => (
              <Card key={message.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{message.name}</h3>
                        <Badge variant="outline" className={statusColors[message.status as RequestStatus]}>
                          {message.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{message.phone}</p>
                      <p className="text-sm line-clamp-1">{message.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(message.created_at), "PPp")}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMessage(message)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Contact Message Details</DialogTitle>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedMessage.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedMessage.email || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Message</p>
                  <p className="font-medium whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">
                    {format(new Date(selectedMessage.created_at), "PPpp")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => updateStatus(selectedMessage.id, "pending")}
                    >
                      <Clock className="w-4 h-4" /> Pending
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => updateStatus(selectedMessage.id, "in_progress")}
                    >
                      <Loader2 className="w-4 h-4" /> In Progress
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => updateStatus(selectedMessage.id, "complete")}
                    >
                      <Check className="w-4 h-4" /> Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-destructive"
                      onClick={() => updateStatus(selectedMessage.id, "cancelled")}
                    >
                      <X className="w-4 h-4" /> Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ContactMessages;
