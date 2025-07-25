
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Users, MoreHorizontal, Trash2, ShieldCheck, UserCheck, Eye, Edit, KeyRound, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ViewUserDialog } from './components/view-user-dialog';
import { EditUserDialog } from './components/edit-user-dialog';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    status: 'active' | 'blocked';
    createdAt: string;
}

export default function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [admins, setAdmins] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            
            const allUsers: User[] = data.users;
            setAdmins(allUsers.filter(u => u.role === 'admin'));
            setUsers(allUsers.filter(u => u.role === 'user'));

        } catch (error) {
            toast({ title: 'Error', description: 'Could not fetch users.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdate = async (userId: string, data: Partial<User>) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update user');
            }
            const action = data.role ? `role updated to ${data.role}` : `status updated to ${data.status}`;
            toast({ title: 'Success', description: `User ${action}.` });
            fetchUsers();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    };
    
    const handleResetPassword = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}/reset-password`, { method: 'POST' });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to send reset link');
            }
            toast({ title: 'Success', description: 'Password reset link sent to the user.' });
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete user');
            
            toast({ title: 'Success', description: 'User deleted successfully.' });
            fetchUsers(); // Refresh list
        } catch (error) {
            toast({ title: 'Error', description: 'Could not delete the user.', variant: 'destructive' });
        }
    };
    
    const renderUserRows = (userList: User[]) => {
        return userList.map((user) => (
            <TableRow key={user._id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                    </Badge>
                </TableCell>
                <TableCell>
                    <Badge variant={user.status === 'active' ? 'outline' : 'destructive'}>
                        {user.status}
                    </Badge>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <ViewUserDialog userId={user._id}>
                                <Button variant="ghost" className="w-full justify-start p-2 font-normal text-sm">
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                </Button>
                            </ViewUserDialog>
                            <EditUserDialog userId={user._id} onUserUpdate={fetchUsers}>
                                <Button variant="ghost" className="w-full justify-start p-2 font-normal text-sm">
                                    <Edit className="mr-2 h-4 w-4" /> Edit User
                                </Button>
                            </EditUserDialog>
                            <DropdownMenuSeparator />
                            {user.role === 'user' ? (
                                <DropdownMenuItem onClick={() => handleUpdate(user._id, { role: 'admin' })}>
                                    <ShieldCheck className="mr-2 h-4 w-4" /> Make Admin
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => handleUpdate(user._id, { role: 'user' })}>
                                    <UserCheck className="mr-2 h-4 w-4" /> Make User
                                </DropdownMenuItem>
                            )}
                            {user.status === 'active' ? (
                                <DropdownMenuItem onClick={() => handleUpdate(user._id, { status: 'blocked' })}>
                                    <Ban className="mr-2 h-4 w-4" /> Block User
                                </DropdownMenuItem>
                            ) : (
                                 <DropdownMenuItem onClick={() => handleUpdate(user._id, { status: 'active' })}>
                                    <UserCheck className="mr-2 h-4 w-4" /> Unblock User
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleResetPassword(user._id)}>
                                <KeyRound className="mr-2 h-4 w-4" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the user and all their associated data.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteUser(user._id)} className="bg-destructive hover:bg-destructive/90">
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        ));
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users /> Manage Users
                </CardTitle>
                <CardDescription>
                    View, manage roles, and delete users from this panel.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined On</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderUserRows(admins)}
                                {renderUserRows(users)}
                            </TableBody>
                        </Table>
                        {users.length === 0 && admins.length === 0 && !loading && (
                            <div className="text-center py-16 text-muted-foreground">
                                <p>No users found.</p>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
