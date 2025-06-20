import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Zap, Target } from 'lucide-react';

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent break-words">
              About TheArenaX
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300">
              Revolutionizing competitive gaming through cutting-edge technology and community
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="mb-12"
          >
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-white">Our Mission</h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                  TheArenaX was founded with a simple yet ambitious goal: to create the ultimate platform 
                  for competitive gaming where skill meets opportunity. We believe that every gamer deserves 
                  a fair chance to showcase their abilities and compete for meaningful rewards.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
                  Our platform brings together cutting-edge technology, secure payment systems, and a 
                  passionate community to deliver an unparalleled gaming experience. Whether you're a 
                  casual player or an aspiring professional, TheArenaX provides the tools and 
                  opportunities you need to succeed.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            {[
              {
                icon: Trophy,
                title: "Competitive Excellence",
                description: "We host tournaments with real prizes and professional-grade competition management."
              },
              {
                icon: Users,
                title: "Community First",
                description: "Building a inclusive community where gamers of all skill levels can connect and compete."
              },
              {
                icon: Zap,
                title: "Real-time Technology",
                description: "Lightning-fast infrastructure ensures smooth gameplay and instant updates."
              },
              {
                icon: Target,
                title: "Fair Play",
                description: "Advanced anti-cheat systems and skill-based matching for fair competition."
              }
            ].map((value, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700 backdrop-blur-sm rounded-2xl">
                <CardContent className="p-6">
                  <value.icon className="h-12 w-12 mb-4 text-blue-400" />
                  <h3 className="text-xl font-semibold mb-3 text-white">{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="mb-12"
          >
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-white">Our Story</h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                  Founded in 2024 by a team of passionate gamers and tech enthusiasts, TheArenaX 
                  emerged from the frustration of finding quality competitive gaming platforms. We 
                  experienced firsthand the challenges of unreliable tournament systems, unfair 
                  matchmaking, and lack of transparency in prize distribution.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
                  Today, TheArenaX serves thousands of gamers worldwide, offering tournaments 
                  across multiple popular games with secure payment processing, real-time updates, 
                  and a commitment to fair play that sets us apart from the competition.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white">Join Our Journey</h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-300">
                  Be part of the future of competitive gaming. Together, we're building something extraordinary.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
