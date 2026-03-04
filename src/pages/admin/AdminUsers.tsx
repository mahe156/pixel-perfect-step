import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Shield, Ban, CheckCircle2, MoreHorizontal, Eye, UserCog, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  is_suspended: boolean;
  suspension_reason: string | null;
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [suspendDialog, setSuspendDialog] = useState<UserRow | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [detailDialog, setDetailDialog] = useState<UserRow | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<any>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("users")
      .select("id, full_name, email, role, is_active, is_suspended, suspension_reason, created_at")
      .order("created_at", { ascending: false });
    setUsers((data as UserRow[]) || []);
    setLoading(false);
  };

  const handleSuspend = async () => {
    if (!suspendDialog) return;
    const { error } = await supabase
      .from("users")
      .update({ is_suspended: true, is_active: false, suspension_reason: suspendReason })
      .eq("id", suspendDialog.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`${suspendDialog.full_name} suspended`);
    setSuspendDialog(null);
    setSuspendReason("");
    fetchUsers();
  };

  const handleUnsuspend = async (user: UserRow) => {
    const { error } = await supabase
      .from("users")
      .update({ is_suspended: false, is_active: true, suspension_reason: null })
      .eq("id", user.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`${user.full_name} unsuspended`);
    fetchUsers();
  };

  const viewProfile = async (user: UserRow) => {
    setDetailDialog(user);
    if (user.role === "creator") {
      const { data } = await supabase.from("creator_profiles").select("*").eq("user_id", user.id).single();
      setCreatorProfile(data);
    } else {
      setCreatorProfile(null);
    }
  };

  const filtered = users.filter((u) => {
    if (search && !u.full_name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">{users.length} total users on the platform.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Tabs value={roleFilter} onValueChange={setRoleFilter}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="creator" className="text-xs">Creators</TabsTrigger>
            <TabsTrigger value="brand" className="text-xs">Brands</TabsTrigger>
            <TabsTrigger value="admin" className="text-xs">Admins</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="glass border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id} className="border-border/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">{user.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground text-sm">{user.full_name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-xs">{user.role}</Badge></TableCell>
                  <TableCell>
                    {user.is_suspended ? (
                      <Badge className="bg-destructive/20 text-destructive text-xs gap-1"><Ban className="w-3 h-3" />Suspended</Badge>
                    ) : (
                      <Badge className="bg-success/20 text-success text-xs gap-1"><CheckCircle2 className="w-3 h-3" />Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewProfile(user)}>
                          <Eye className="w-3.5 h-3.5 mr-2" />View Profile
                        </DropdownMenuItem>
                        {!user.is_suspended ? (
                          <DropdownMenuItem className="text-destructive" onClick={() => setSuspendDialog(user)}>
                            <Ban className="w-3.5 h-3.5 mr-2" />Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-success" onClick={() => handleUnsuspend(user)}>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-2" />Unsuspend
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No users found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Suspend Dialog */}
      <Dialog open={!!suspendDialog} onOpenChange={(o) => !o && setSuspendDialog(null)}>
        <DialogContent className="glass border-border">
          <DialogHeader><DialogTitle>Suspend {suspendDialog?.full_name}</DialogTitle></DialogHeader>
          <Textarea placeholder="Reason for suspension…" value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} />
          <Button variant="destructive" onClick={handleSuspend}>Confirm Suspension</Button>
        </DialogContent>
      </Dialog>

      {/* Profile Detail Dialog */}
      <Dialog open={!!detailDialog} onOpenChange={(o) => !o && setDetailDialog(null)}>
        <DialogContent className="glass border-border max-w-lg">
          <DialogHeader><DialogTitle>{detailDialog?.full_name} — Profile Details</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{detailDialog?.email}</span></div>
              <div><span className="text-muted-foreground">Role:</span> <Badge variant="outline" className="capitalize text-xs">{detailDialog?.role}</Badge></div>
              <div><span className="text-muted-foreground">Status:</span> {detailDialog?.is_suspended ? <span className="text-destructive">Suspended</span> : <span className="text-success">Active</span>}</div>
              <div><span className="text-muted-foreground">Joined:</span> {detailDialog?.created_at && new Date(detailDialog.created_at).toLocaleDateString()}</div>
            </div>
            {detailDialog?.suspension_reason && (
              <div className="bg-destructive/10 p-2 rounded text-destructive text-xs">Reason: {detailDialog.suspension_reason}</div>
            )}
            {creatorProfile && (
              <div className="glass rounded-lg p-3 space-y-2">
                <h4 className="font-display font-bold text-foreground">Creator Profile</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>KYC: <Badge className="text-xs capitalize">{creatorProfile.kyc_status}</Badge></div>
                  <div>Reliability: <span className="font-mono">{creatorProfile.reliability_score}</span></div>
                  <div>Total Earned: <span className="font-mono text-success">₹{Number(creatorProfile.total_earned).toLocaleString()}</span></div>
                  <div>Wallet: <span className="font-mono">₹{Number(creatorProfile.wallet_balance).toLocaleString()}</span></div>
                  <div>Submissions: {creatorProfile.total_submissions}</div>
                  <div>Approved: {creatorProfile.approved_submissions}</div>
                  <div>Campaigns Done: {creatorProfile.campaigns_completed}</div>
                  <div>Views Generated: {Number(creatorProfile.total_views_generated).toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminUsers;
