import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type TournamentStatus = 'open' | 'full' | 'completed';

interface Tournament {
  id: number;
  title: string;
  game: string;
  description: string;
  entryFee: number;
  prizePool: number;
  startTime: string;
  maxParticipants: number;
  currentParticipants: number;
  status: TournamentStatus;
}

const AdminDashboard = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 1,
      title: 'Valorant Champions Cup',
      game: 'Valorant',
      description: 'Ultimate Valorant championship for skilled players',
      entryFee: 50,
      prizePool: 5000,
      startTime: '2024-06-15T18:00:00Z',
      maxParticipants: 64,
      currentParticipants: 32,
      status: 'open'
    },
    {
      id: 2,
      title: 'CS:GO Major Tournament',
      game: 'CS:GO',
      description: 'Professional CS:GO tournament with high stakes',
      entryFee: 75,
      prizePool: 7500,
      startTime: '2024-06-16T20:00:00Z',
      maxParticipants: 32,
      currentParticipants: 28,
      status: 'open'
    }
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    game: '',
    description: '',
    entryFee: '',
    prizePool: '',
    startTime: '',
    maxParticipants: '',
    status: 'open'
  });

  // Check if admin is logged in
  const isAdminLoggedIn = localStorage.getItem('adminAuth') === 'true';

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  const resetForm = () => {
    setFormData({
      title: '',
      game: '',
      description: '',
      entryFee: '',
      prizePool: '',
      startTime: '',
      maxParticipants: '',
      status: 'open'
    });
    setEditingTournament(null);
  };

  const handleCreate = () => {
    setIsCreateOpen(true);
    resetForm();
  };

  const handleEdit = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setFormData({
      title: tournament.title,
      game: tournament.game,
      description: tournament.description,
      entryFee: tournament.entryFee.toString(),
      prizePool: tournament.prizePool.toString(),
      startTime: tournament.startTime.slice(0, 16), // Format for datetime-local input
      maxParticipants: tournament.maxParticipants.toString(),
      status: tournament.status
    });
    setIsCreateOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTournament: Tournament = {
      id: editingTournament?.id || tournaments.length + 1,
      title: formData.title,
      game: formData.game,
      description: formData.description,
      entryFee: parseInt(formData.entryFee),
      prizePool: parseInt(formData.prizePool),
      startTime: formData.startTime,
      maxParticipants: parseInt(formData.maxParticipants),
      currentParticipants: editingTournament?.currentParticipants || 0,
      status: formData.status as TournamentStatus
    };

    if (editingTournament) {
      setTournaments(prev => prev.map(t => t.id === editingTournament.id ? newTournament : t));
    } else {
      setTournaments(prev => [...prev, newTournament]);
    }

    setIsCreateOpen(false);
    setFormData({
      title: '',
      game: '',
      description: '',
      entryFee: '',
      prizePool: '',
      startTime: '',
      maxParticipants: '',
      status: 'open' as TournamentStatus
    });
    setEditingTournament(null);
  };

  const handleDelete = (id: number) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
    toast.success('Tournament deleted successfully');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (tournament: Tournament) => {
    if (tournament.status === 'completed') {
      return <Badge variant="outline" className="border-gray-500 text-gray-500">Completed</Badge>;
    }
    if (tournament.status === 'full') {
      return <Badge variant="destructive">Full</Badge>;
    }
    if (tournament.currentParticipants / tournament.maxParticipants > 0.8) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Almost Full</Badge>;
    }
    return <Badge variant="outline" className="border-green-500 text-green-500">Open</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="border-b border-gray-800 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="text-xl sm:text-2xl font-bold text-blue-400">{tournaments.length}</div>
              <div className="text-sm sm:text-base text-gray-400">Total Tournaments</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="text-xl sm:text-2xl font-bold text-green-400">
                {tournaments.filter(t => t.status === 'open').length}
              </div>
              <div className="text-sm sm:text-base text-gray-400">Active Tournaments</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                {tournaments.reduce((sum, t) => sum + t.currentParticipants, 0)}
              </div>
              <div className="text-sm sm:text-base text-gray-400">Total Participants</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="text-xl sm:text-2xl font-bold text-purple-400">
                ₹{tournaments.reduce((sum, t) => sum + t.prizePool, 0)}
              </div>
              <div className="text-sm sm:text-base text-gray-400">Total Prize Pool</div>
            </CardContent>
          </Card>
        </div>

        {/* Tournament Management */}
        <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-white">Tournament Management</CardTitle>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={handleCreate}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Create Tournament
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      {editingTournament ? 'Edit Tournament' : 'Create New Tournament'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title" className="text-white">Tournament Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="bg-gray-800/50 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="game" className="text-white">Game</Label>
                        <Select value={formData.game} onValueChange={(value) => setFormData({ ...formData, game: value })}>
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                            <SelectValue placeholder="Select game" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="Valorant">Valorant</SelectItem>
                            <SelectItem value="CS:GO">CS:GO</SelectItem>
                            <SelectItem value="Apex Legends">Apex Legends</SelectItem>
                            <SelectItem value="Fortnite">Fortnite</SelectItem>
                            <SelectItem value="League of Legends">League of Legends</SelectItem>
                            <SelectItem value="Overwatch 2">Overwatch 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-white">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="entryFee" className="text-white">Entry Fee (Credits)</Label>
                        <Input
                          id="entryFee"
                          type="number"
                          min="1"
                          value={formData.entryFee}
                          onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                          className="bg-gray-800/50 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="prizePool" className="text-white">Prize Pool (₹)</Label>
                        <Input
                          id="prizePool"
                          type="number"
                          min="1"
                          value={formData.prizePool}
                          onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                          className="bg-gray-800/50 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxParticipants" className="text-white">Max Participants</Label>
                        <Input
                          id="maxParticipants"
                          type="number"
                          min="2"
                          value={formData.maxParticipants}
                          onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                          className="bg-gray-800/50 border-gray-600 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime" className="text-white">Start Time</Label>
                        <Input
                          id="startTime"
                          type="datetime-local"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                          className="bg-gray-800/50 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="status" className="text-white">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="border-gray-600 text-gray-400">
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        {editingTournament ? 'Update Tournament' : 'Create Tournament'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">{tournament.title}</h3>
                        {getStatusBadge(tournament)}
                      </div>
                      <div className="text-blue-400 font-medium mb-1">{tournament.game}</div>
                      <div className="text-gray-400 text-sm mb-3">{tournament.description}</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Entry Fee</div>
                          <div className="text-yellow-400 font-bold">{tournament.entryFee} Credits</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Prize Pool</div>
                          <div className="text-green-400 font-bold">₹{tournament.prizePool}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Participants</div>
                          <div className="text-white">{tournament.currentParticipants}/{tournament.maxParticipants}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Start Time</div>
                          <div className="text-white">{formatDate(tournament.startTime)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(tournament)}
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(tournament.id)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {/* Participants Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Participants</span>
                      <span>{Math.round((tournament.currentParticipants / tournament.maxParticipants) * 100)}% filled</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
