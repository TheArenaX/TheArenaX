import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArenaBackground } from '@/components/ArenaBackground';
import { toast } from 'sonner';

const Tournaments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [feeFilter, setFeeFilter] = useState('all');
  const [tournaments] = useState([
    { id: 1, name: 'Mock Tournament 1', start_time: '2024-06-15', participants: 10 },
    { id: 2, name: 'Mock Tournament 2', start_time: '2024-06-20', participants: 8 },
  ]);
  const [loading, setLoading] = useState(false);

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = gameFilter === 'all' || tournament.name.toLowerCase().includes(gameFilter.toLowerCase());
    const matchesFee = feeFilter === 'all' || 
                      (feeFilter === 'low' && tournament.participants <= 30) ||
                      (feeFilter === 'medium' && tournament.participants > 30 && tournament.participants <= 70) ||
                      (feeFilter === 'high' && tournament.participants > 70);
    
    return matchesSearch && matchesGame && matchesFee;
  });

  const handleJoinTournament = async (tournament: any) => {
    if (tournament.participants === 10) {
      toast.error('Tournament is full');
      return;
    }

    try {
      // Check if user is already registered
      const existingParticipant = tournaments.find(t => t.id === tournament.id);

      if (existingParticipant) {
        toast.error('You are already registered for this tournament');
        return;
      }

      // Join tournament
      const newTournament = { ...tournament, participants: tournament.participants + 1 };
      const updatedTournaments = [...tournaments, newTournament];

      toast.success(`Successfully joined ${tournament.name}!`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to join tournament');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (tournament: any) => {
    if (tournament.participants === 10) {
      return <Badge variant="destructive">Full</Badge>;
    }
    if (tournament.participants / 10 > 0.8) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Almost Full</Badge>;
    }
    return <Badge variant="outline" className="border-green-500 text-green-500">Open</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white relative overflow-hidden">
        <Navigation />
        <div className="pt-24 pb-12 px-4 relative z-10">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Loading tournaments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Active Tournaments
            </h1>
            <p className="text-xl text-gray-300">
              Join the competition and prove your skills
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1">
                <Input
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={gameFilter} onValueChange={setGameFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-gray-900/50 border-gray-700 text-white">
                    <SelectValue placeholder="All Games" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Games</SelectItem>
                    <SelectItem value="Valorant">Valorant</SelectItem>
                    <SelectItem value="CS:GO">CS:GO</SelectItem>
                    <SelectItem value="Apex Legends">Apex Legends</SelectItem>
                    <SelectItem value="Fortnite">Fortnite</SelectItem>
                    <SelectItem value="League of Legends">League of Legends</SelectItem>
                    <SelectItem value="Overwatch 2">Overwatch 2</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={feeFilter} onValueChange={setFeeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-gray-900/50 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by fee" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Fees</SelectItem>
                    <SelectItem value="low">Low (≤30)</SelectItem>
                    <SelectItem value="medium">Medium (31-70)</SelectItem>
                    <SelectItem value="high">High ({'>'}70)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tournament Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredTournaments.map((tournament) => (
              <Card key={tournament.id} className="bg-gray-900/50 border-gray-700 rounded-2xl hover:border-blue-500/50 transition-colors">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{tournament.name}</h3>
                    </div>
                    <Badge
                      variant={tournament.participants === 10 ? 'destructive' : tournament.participants / 10 > 0.8 ? 'outline' : 'outline'}
                      className="ml-2"
                    >
                      {tournament.participants === 10 ? 'Full' : tournament.participants / 10 > 0.8 ? 'Almost Full' : 'Open'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">Mock tournament description</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Participants</p>
                      <p className="text-sm font-medium text-white">
                        {tournament.participants}/{10}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Start Time</p>
                      <p className="text-sm font-medium text-white">
                        {formatDate(tournament.start_time)}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={() => handleJoinTournament(tournament)}
                    disabled={tournament.participants === 10}
                  >
                    {tournament.participants === 10 ? 'Tournament Closed' : 'Join Tournament'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTournaments.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No tournaments found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tournaments;
