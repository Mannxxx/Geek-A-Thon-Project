import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useAuthContext } from './context';
import { Footer, Navbar } from './components';

import {
    LoginPage, LogoutPage, CallBackPage, NotFoundPage,
    HomePage, UserPage,
    PredictPage, SentimentAnalysisPage,
    CountryStatsPage, PlayerStatsPage, SeasonStatsPage, SportsStatsPage, StatsPage, YearStatsPage, EventsPage
} from './pages';
import { ChatBot } from './components/ChatBot';
import { CreateEventPage } from './pages/event/CreateEventPage';
import { EventPage } from './pages/event/EventPage';
import { PlayerPage } from './pages/player/PlayerPage';
import { SportPage } from './pages/sport/SportPage';
import { SportsPage } from './pages/sport/SportsPage';
import { CreateSportPage } from './pages/sport/CreateEventPage';
import { EventStreamPage } from './pages/event/EventStreamPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {

    const { isLoading } = useAuthContext();

    return (
        <BrowserRouter>
            <div className="App">
                <Navbar />
                <div
                    style={{
                        marginTop: 100
                    }}
                    id='app-content'
                >
                    {!isLoading &&
                        <Routes>
                            <Route path='/' element={<HomePage />} />

                            {/* Auth Routes */}
                            <Route path='/login' element={<LoginPage />} />
                            <Route path='/callback' element={<CallBackPage />} />
                            <Route path='/logout' element={<LogoutPage />} />

                            {/* User Routes */}
                            <Route path='/create-event' element={<CreateEventPage />} />
                            <Route path='/create-sport' element={<CreateSportPage />} />
                            <Route path='/events' element={<EventsPage />} />
                            <Route path='/event/:id' element={<EventPage />} />
                            <Route path='/sports' element={<SportsPage />} />
                            <Route path='/sport/:id' element={<SportPage />} />

                            <Route path='/player/:id' element={<PlayerPage />} />

                            <Route path='/event-stream/:id' element={<EventStreamPage />} />

                            <Route path='/stats-analysis' >
                                <Route index element={<StatsPage />} />
                                <Route path='/stats-analysis/stats/sports' element={<SportsStatsPage />} />
                                <Route path='/stats-analysis/stats/season' element={<SeasonStatsPage />} />
                                <Route path='/stats-analysis/stats/country' element={<CountryStatsPage />} />
                                <Route path='/stats-analysis/stats/year' element={<YearStatsPage />} />
                                <Route path='/stats-analysis/stats/player' element={<PlayerStatsPage />} />
                                <Route path='/stats-analysis/predict' element={<PredictPage />} />
                                <Route path='/stats-analysis/sentiment-analysis' element={<SentimentAnalysisPage />} />
                            </Route>
                            <Route path='/user' element={<UserPage />} />
                            <Route path='/about' element={<AboutPage />} />
                            <Route path='*' element={<NotFoundPage />} />
                        </Routes>
                    }
                </div>
                <ChatBot />
                <Footer />
            </div>
        </BrowserRouter>
    );
}