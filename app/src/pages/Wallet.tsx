import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Wallet: React.FC = () => {
  const { profile, updateWalletBalance } = useAuth();
  const [addAmount, setAddAmount] = useState('');
  const [isAddingCredits, setIsAddingCredits] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: 1, amount: 100, type: 'credit', date: '2024-06-10' },
    { id: 2, amount: 50, type: 'debit', date: '2024-06-09' },
  ]);
  const [loading, setLoading] = useState(true);

  const handleAddCredits = async () => {
    const amount = parseInt(addAmount);
    if (!amount || amount < 10) {
      toast.error('Minimum amount is ₹10');
      return;
    }

    if (!profile) {
      toast.error('Please login first');
      return;
    }

    setIsAddingCredits(true);

    try {
      // In a real app, this would integrate with Stripe
      // For now, we'll simulate the payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update wallet balance in database
      const newBalance = profile.wallet_balance + amount;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', profile.id);

      if (updateError) {
        console.error('Error updating wallet:', updateError);
        toast.error('Failed to add credits');
        return;
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: profile.id,
          amount: amount,
          transaction_type: 'credit',
          description: 'Credits Purchase'
        });

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
      }

      // Update local state
      updateWalletBalance(newBalance);
      toast.success(`Successfully added ${amount} credits!`);
      setAddAmount('');
      fetchTransactions(); // Refresh transactions
    } catch (error) {
      console.error('Error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsAddingCredits(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Wallet
            </h1>
            <p className="text-xl text-gray-300">
              Manage your credits and view transaction history
            </p>
          </div>

          {/* Balance Card */}
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 mb-8 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-white">Current Balance</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
                {profile?.wallet_balance || 0}
              </div>
              <div className="text-xl text-gray-300">Credits</div>
              <div className="text-sm text-gray-400 mt-2">≈ ₹{profile?.wallet_balance || 0}</div>
            </CardContent>
          </Card>

          {/* Add Credits Section */}
          <Card className="bg-gray-900/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">Add Credits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300 mb-4">
                Add credits to your wallet to join tournaments. Rate: ₹1 = 1 Credit
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="amount" className="text-white">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="10"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Enter amount (min. ₹10)"
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleAddCredits}
                    disabled={isAddingCredits || !addAmount || parseInt(addAmount) < 10}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    {isAddingCredits ? 'Processing...' : 'Add Credits'}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                {[100, 250, 500, 1000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setAddAmount(amount.toString())}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-400">
                  Loading transactions...
                </div>
              ) : transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${transaction.type === 'credit' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <div className="text-white font-medium">{transaction.type === 'credit' ? 'Credit' : 'Debit'}</div>
                          <div className="text-sm text-gray-400">{formatDate(transaction.date)}</div>
                        </div>
                      </div>
                      <div className={`font-bold ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.type === 'credit' ? '+' : ''}{transaction.amount} Credits
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No transactions yet. Add credits to get started!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
