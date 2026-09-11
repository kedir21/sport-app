import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Live from '@/pages/Live';
import MatchDetails from '@/pages/MatchDetails';
import Leagues from '@/pages/Leagues';
import Teams from '@/pages/Teams';
import Favorites from '@/pages/Favorites';
import Search from '@/pages/Search';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="live" element={<Live />} />
          <Route path="match/:id" element={<MatchDetails />} />
          <Route path="leagues" element={<Leagues />} />
          <Route path="teams" element={<Teams />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="search" element={<Search />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
