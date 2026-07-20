import React from 'react';
import { motion } from 'framer-motion';
import ClubCard from './ClubCard';

const ClubGrid = ({ 
  clubs, 
  joinedClubIds, 
  onJoinToggle, 
  onMoreClick, 
  joiningClubId 
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardWrapperVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-full items-stretch justify-items-stretch"
    >
      {clubs.map((club) => (
        <motion.div 
          key={club.id} 
          variants={cardWrapperVariants}
          className="flex h-full"
        >
          <ClubCard
            club={club}
            isJoined={joinedClubIds.includes(club.id)}
            isJoining={joiningClubId === club.id}
            onJoinToggle={() => onJoinToggle(club.id)}
            onMoreClick={() => onMoreClick(club)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ClubGrid;
