import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArenaBackground } from '@/components/ArenaBackground';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Tournaments = () => {
  const { isAuthenticated, profile, updateWalletBalance } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [feeFilter, setFeeFilter] = useState('all');
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching tournaments:', error);
        toast.error('Failed to load tournaments');
        return;
      }

      setTournaments(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = gameFilter === 'all' || tournament.game === gameFilter;
    const matchesFee = feeFilter === 'all' || 
                      (feeFilter === 'low' && tournament.entry_fee <= 30) ||
                      (feeFilter === 'medium' && tournament.entry_fee > 30 && tournament.entry_fee <= 70) ||
                      (feeFilter === 'high' && tournament.entry_fee > 70);
    
    return matchesSearch && matchesGame && matchesFee;
  });

  const handleJoinTournament = async (tournament: any) => {
    if (!isAuthenticated) {
      toast.error('Please login to join tournaments');
      return;
    }

    if (!profile || profile.wallet_balance < tournament.entry_fee) {
      toast.error('Insufficient credits');
      return;
    }

    if (tournament.status === 'full') {
      toast.error('Tournament is full');
      return;
    }

    try {
      // Check if user is already registered
      const { data: existingParticipant } = await supabase
        .from('tournament_participants')
        .select('id')
        .eq('tournament_id', tournament.id)
        .eq('user_id', profile.id)
        .single();

      if (existingParticipant) {
        toast.error('You are already registered for this tournament');
        return;
      }

      // Join tournament
      const { error: joinError } = await supabase
        .from('tournament_participants')
        .insert({
          tournament_id: tournament.id,
          user_id: profile.id
        });

      if (joinError) {
        console.error('Error joining tournament:', joinError);
        toast.error('Failed to join tournament');
        return;
      }

      // Update wallet balance
      const newBalance = profile.wallet_balance - tournament.entry_fee;
      const { error: walletError } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', profile.id);

      if (walletError) {
        console.error('Error updating wallet:', walletError);
        toast.error('Failed to update wallet');
        return;
      }

      // Create transaction record
      await supabase
        .from('wallet_transactions')
        .insert({
          user_id: profile.id,
          amount: -tournament.entry_fee,
          transaction_type: 'debit',
          description: `${tournament.title} Entry Fee`
        });

      updateWalletBalance(newBalance);
      toast.success(`Successfully joined ${tournament.title}!`);
      fetchTournaments(); // Refresh tournaments
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
    if (tournament.status === 'full') {
      return <Badge variant="destructive">Full</Badge>;
    }
    if (tournament.current_participants / tournament.max_participants > 0.8) {
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
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{tournament.title}</h3>
                      <p className="text-sm text-gray-400">{tournament.game}</p>
                    </div>
                    <Badge
                      variant={tournament.status === 'open' ? 'default' : tournament.status === 'full' ? 'secondary' : 'destructive'}
                      className="ml-2"
                    >
                      {tournament.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{tournament.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Entry Fee</p>
                      <p className="text-sm font-medium text-white">{tournament.entryFee} Credits</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Prize Pool</p>
                      <p className="text-sm font-medium text-white">₹{tournament.prizePool}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Participants</p>
                      <p className="text-sm font-medium text-white">
                        {tournament.currentParticipants}/{tournament.maxParticipants}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Start Time</p>
                      <p className="text-sm font-medium text-white">
                        {new Date(tournament.startTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={() => handleJoinTournament(tournament)}
                    disabled={tournament.status !== 'open'}
                  >
                    {tournament.status === 'open' ? 'Join Tournament' : 'Tournament Closed'}
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
