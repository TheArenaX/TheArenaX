import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Tournament {
  id: number;
  title: string;
  game: string;
  status: 'open' | 'full' | 'completed';
  entryFee: number;
  prizePool: number;
  description: string;
}

interface Testimonial {
  name: string;
  location: string;
  content: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredTournaments, setFeaturedTournaments] = useState<Tournament[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Fetch featured tournaments and testimonials
    // This is a placeholder and should be replaced with actual API calls
    setFeaturedTournaments([
      {
        id: 1,
        title: 'Valorant Championship',
        game: 'Valorant',
        status: 'open',
        entryFee: 100,
        prizePool: 10000,
        description: 'Join the biggest Valorant tournament of the season!'
      },
      {
        id: 2,
        title: 'CS:GO Masters',
        game: 'CS:GO',
        status: 'full',
        entryFee: 200,
        prizePool: 20000,
        description: 'Professional CS:GO tournament with top players.'
      },
      {
        id: 3,
        title: 'Apex Legends Showdown',
        game: 'Apex Legends',
        status: 'open',
        entryFee: 150,
        prizePool: 15000,
        description: 'Battle Royale tournament for Apex Legends players.'
      }
    ]);

    setTestimonials([
      {
        name: 'Rahul Sharma',
        location: 'Mumbai, India',
        content: 'TheArenaX has completely transformed my gaming experience. The tournaments are well-organized and the prize pools are amazing!'
      },
      {
        name: 'Priya Patel',
        location: 'Delhi, India',
        content: 'I love how easy it is to join tournaments and compete with players from all over India. The platform is incredibly user-friendly.'
      },
      {
        name: 'Arjun Singh',
        location: 'Bangalore, India',
        content: 'The community here is fantastic. I\'ve made so many friends and improved my skills through these tournaments.'
      },
      {
        name: 'Ananya Gupta',
        location: 'Chennai, India',
        content: 'The support team is always helpful, and the tournament scheduling is perfect for Indian players.'
      },
      {
        name: 'Vikram Reddy',
        location: 'Hyderabad, India',
        content: 'I\'ve won several tournaments and the prize distribution is always smooth. Highly recommended!'
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent break-words"
            >
              Welcome to TheArenaX
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Join the ultimate gaming tournament platform. Compete, win, and earn rewards in your favorite games.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => navigate('/tournaments')}
            >
              Browse Tournaments
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              onClick={() => navigate('/auth')}
            >
              Sign Up Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
          >
            Featured Tournaments
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-700 rounded-2xl hover:border-blue-500/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{tournament.title}</h3>
                        <p className="text-blue-400">{tournament.game}</p>
                      </div>
                      <Badge
                        variant={tournament.status === 'open' ? 'default' : tournament.status === 'full' ? 'secondary' : 'destructive'}
                      >
                        {tournament.status}
                      </Badge>
                    </div>
                    <p className="text-gray-400 mb-4 line-clamp-2">{tournament.description}</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Entry Fee</p>
                        <p className="text-lg font-medium text-white">{tournament.entryFee} Credits</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Prize Pool</p>
                        <p className="text-lg font-medium text-white">₹{tournament.prizePool}</p>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      onClick={() => navigate(`/tournaments/${tournament.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
          >
            What Players Say
          </motion.h2>

          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: [0, -1000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="min-w-[300px] sm:min-w-[400px] bg-gray-900/50 border-gray-700 rounded-2xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{testimonial.name}</h3>
                        <p className="text-sm text-gray-400">{testimonial.location}</p>
                      </div>
                    </div>
                    <p className="text-gray-300">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
 