
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/theme/ModeToggle';
import { Trophy, Users } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="border-b bg-background">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-md bg-gradient-to-r from-mtg-purple to-mtg-darkblue p-2">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-lg">Cube Draft Arena</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/players">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Players</span>
            </Button>
          </Link>
          <Link to="/draft">
            <Button variant="ghost" size="sm">Draft</Button>
          </Link>
          <Link to="/matches">
            <Button variant="ghost" size="sm">Matches</Button>
          </Link>
          <Link to="/rankings">
            <Button variant="ghost" size="sm">Rankings</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
