import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Participant {
  id: string;
  username: string;
  joinedAt: string;
}

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
  status: 'open' | 'full' | 'completed';
  participants?: Participant[];
}

const TournamentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tournament details
    // This is a placeholder and should be replaced with actual API call
    setTournament({
      id: 1,
      title: 'Valorant Championship',
      game: 'Valorant',
      description: 'Join the biggest Valorant tournament of the season! Compete with the best players and win amazing prizes.',
      entryFee: 100,
      prizePool: 10000,
      startTime: '2024-06-15T10:00:00Z',
      maxParticipants: 16,
      currentParticipants: 8,
      status: 'open',
      participants: [
        { id: '1', username: 'Player1', joinedAt: '2024-06-01T10:00:00Z' },
        { id: '2', username: 'Player2', joinedAt: '2024-06-01T11:00:00Z' },
        { id: '3', username: 'Player3', joinedAt: '2024-06-01T12:00:00Z' }
      ]
    });
    setLoading(false);
  }, [id]);

  const handleJoinTournament = () => {
    if (!profile) {
      toast.error('Please sign in to join tournaments');
      navigate('/auth');
      return;
    }

    if (profile.wallet_balance < (tournament?.entryFee || 0)) {
      toast.error('Insufficient credits');
      return;
    }

    // Join tournament logic here
    toast.success('Successfully joined the tournament!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Tournament not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Tournament Header */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Tournament Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <Badge
                  variant={tournament.status === 'open' ? 'default' : tournament.status === 'full' ? 'secondary' : 'destructive'}
                  className="text-sm"
                >
                  {tournament.status}
                </Badge>
                <span className="text-gray-400">{tournament.game}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{tournament.title}</h1>
              <p className="text-gray-300 mb-8">{tournament.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Entry Fee</p>
                  <p className="text-xl font-bold text-white">{tournament.entryFee} Credits</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Prize Pool</p>
                  <p className="text-xl font-bold text-white">₹{tournament.prizePool}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Participants</p>
                  <p className="text-xl font-bold text-white">
                    {tournament.currentParticipants}/{tournament.maxParticipants}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Start Time</p>
                  <p className="text-xl font-bold text-white">
                    {new Date(tournament.startTime).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={handleJoinTournament}
                disabled={tournament.status !== 'open'}
              >
                {tournament.status === 'open' ? 'Join Tournament' : 'Tournament Closed'}
              </Button>
            </div>

            {/* Tournament Rules */}
            <div className="lg:w-96">
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Tournament Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-400 text-sm">1</span>
                      </div>
                      <p className="text-gray-300">All participants must have a valid account and sufficient credits.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-400 text-sm">2</span>
                      </div>
                      <p className="text-gray-300">Players must join the tournament at least 15 minutes before the start time.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-400 text-sm">3</span>
                      </div>
                      <p className="text-gray-300">Any form of cheating or unfair play will result in immediate disqualification.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-400 text-sm">4</span>
                      </div>
                      <p className="text-gray-300">Tournament organizers reserve the right to modify rules if necessary.</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Participants List */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Participants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournament.participants?.map((participant) => (
              <Card key={participant.id} className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                      <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {participant.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{participant.username}</h3>
                      <p className="text-sm text-gray-400">Joined {new Date(participant.joinedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!tournament.participants || tournament.participants.length === 0) && (
              <p className="text-gray-400 col-span-full text-center py-8">No participants yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TournamentDetails; 