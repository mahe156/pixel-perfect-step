import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield, Ban, CheckCircle2, MoreHorizontal, Eye, Mail, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const mockUsers = [
  { id: "1", full_name: "Priya Sharma", email: "priya@example.com", role: "creator", is_active: true, is_suspended: false, created_at: "2026-01-15", kyc: "verified", campaigns: 12 },
  { id: "2", full_name: "Rahul Verma", email: "rahul@example.com", role: "creator", is_active: true, is_suspended: false, created_at: "2026-01-20", kyc: "submitted", campaigns: 8 },
  { id: "3", full_name: "Acme Fashion Pvt Ltd", email: "brand@acme.in", role: "brand", is_active: true, is_suspended: false, created_at: "2026-01-10", kyc: "verified", campaigns: 3 },
  { id: "4", full_name: "Vikash Mehta", email: "vikash@example.com", role: "creator", is_active: false, is_suspended: true, created_at: "2026-02-01", kyc: "rejected", campaigns: 2, suspension_reason: "Fake views detected" },
  { id: "5", full_name: "TrendyWear Inc", email: "hello@trendywear.in", role: "brand", is_active: true, is_suspended: false, created_at: "2026-02-10", kyc: "pending", campaigns: 0 },
  { id: "6", full_name: "Sneha Patel", email: "sneha@example.com", role: "creator", is_active: true, is_suspended: false, created_at: "2026-02-15", kyc: "verified", campaigns: 20 },
  { id: "7", full_name: "Arjun Das", email: "arjun@example.com", role: "creator", is_active: true, is_suspended: false, created_at: "2026-02-18", kyc: "pending", campaigns: 0 },
];

const kycBadge: Record<string, string> = {
  verified: "bg-success/20 text-success",
  submitted: "bg-info/20 text-info",
  pending: "bg-warning/20 text-warning",
  rejected: "bg-destructive/20 text-destructive",
};

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [suspendReason, setSuspendReason] = useState("");

  const filtered = mockUsers.filter((u) => {
    if (search && !u.full_name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground">{mockUsers.length} total users on the platform.</p>
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
                <TableHead>KYC</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Campaigns</TableHead>
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
                  <TableCell><Badge className={`${kycBadge[user.kyc]} text-xs capitalize`}>{user.kyc}</Badge></TableCell>
                  <TableCell>
                    {user.is_suspended ? (
                      <Badge className="bg-destructive/20 text-destructive text-xs gap-1"><Ban className="w-3 h-3" />Suspended</Badge>
                    ) : (
                      <Badge className="bg-success/20 text-success text-xs gap-1"><CheckCircle2 className="w-3 h-3" />Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{user.campaigns}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.created_at}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info(`Viewing ${user.full_name}'s profile`)}>
                          <Eye className="w-3.5 h-3.5 mr-2" />View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Email sent to ${user.email}`)}>
                          <Mail className="w-3.5 h-3.5 mr-2" />Send Email
                        </DropdownMenuItem>
                        {!user.is_suspended ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                <Ban className="w-3.5 h-3.5 mr-2" />Suspend User
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Suspend {user.full_name}</DialogTitle></DialogHeader>
                              <Textarea placeholder="Reason for suspension…" value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} />
                              <Button variant="destructive" onClick={() => { toast.success(`${user.full_name} suspended`); setSuspendReason(""); }}>
                                Confirm Suspension
                              </Button>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <DropdownMenuItem onClick={() => toast.success(`${user.full_name} unsuspended`)} className="text-success">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-2" />Unsuspend
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminUsers;
