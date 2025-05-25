import React from 'react';
import { useUserStore } from '../lib/store';
import { Button } from './ui/Button';

export const StravaConnectButton: React.FC = () => {
  const { connectStrava, stravaConnected } = useUserStore();
  
  return (
    <Button
      onClick={connectStrava}
      disabled={stravaConnected}
      className="bg-[#FC4C02] hover:bg-[#E34000] text-white"
      fullWidth
    >
      {stravaConnected ? 'Connected to Strava' : 'Connect with Strava'}
    </Button>
  );
};