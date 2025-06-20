import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Tournament {
  id: number;
  title: string;
  game: string;
  status: 'open' | 'full' | 'completed';
  joinedAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  wallet_balance: number;
  tournaments: Tournament[];
}

const Profile = () => {
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: profile?.username || '',
    email: profile?.email || ''
  });

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the profile
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 mb-4">
                      <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {profile?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">{profile?.username || 'User'}</h2>
                    <p className="text-gray-400 mb-4">{profile?.email}</p>
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Credits</p>
                        <p className="text-xl font-bold text-white">{profile?.wallet_balance || 0}</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Tournaments</p>
                        <p className="text-xl font-bold text-white">0</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tournament History */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Tournament History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-400 text-center py-8">No tournaments joined yet.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
