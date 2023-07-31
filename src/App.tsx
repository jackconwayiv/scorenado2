import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { Flex } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CreateProfile from "./components/CreateProfile";
import EditSession from "./components/EditSession";
import LandingPage from "./components/LandingPage";
import MyProfile from "./components/MyProfile";
import Navbar from "./components/Navbar";
import PlayerView from "./components/PlayerView";
import Scores from "./components/Scores";

const supabase = createClient(
  `https://zbmqjerscayutssmwkmm.supabase.co`,
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibXFqZXJzY2F5dXRzc213a21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM2NDc3NzAsImV4cCI6MTk5OTIyMzc3MH0.GAC_0ezrcWgIMlJKCm99UjChJpledSM1KKXCRLBqlPw`
);

function App() {
  const [session, setSession] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [user, setUser] = useState<any>({});

  useEffect(() => {
    console.log("firing top profile useeffect");
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data && data.session) {
          const fetchedUser = data.session.user || {};
          //also fetch profile here:

          let { data: profiles } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", fetchedUser.id);
          if (profiles && profiles.length > 0) {
            const profile = profiles[0];
            const userWithProfile = { ...fetchedUser, profile };
            setUser(userWithProfile);
          } else {
            setUser(fetchedUser);
          }
          let { data: mePlayer } = await supabase
            .from("players")
            .select("*")
            .eq("user_id", fetchedUser.id)
            .eq("profile_id", fetchedUser.id);
          if (mePlayer && mePlayer.length > 0) {
            setHasProfile(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        redirectTo={window.location.origin}
        appearance={{ theme: ThemeSupa }}
      />
    );
  } else {
    return (
      <Flex
        width="410px"
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <BrowserRouter>
          <Navbar user={user} />
          <Routes>
            <Route
              path="/"
              element={
                hasProfile ? (
                  <LandingPage supabase={supabase} user={user} />
                ) : (
                  <CreateProfile
                    supabase={supabase}
                    user={user}
                    setHasProfile={setHasProfile}
                  />
                )
              }
            />

            <Route
              path="session/:sessionId"
              element={<EditSession supabase={supabase} user={user} />}
            />
            <Route
              path="profile"
              element={<MyProfile supabase={supabase} user={user} />}
            />
            <Route
              path="players/:playerId"
              element={<PlayerView supabase={supabase} user={user} />}
            />
            <Route
              path="leaderboard"
              element={<Scores supabase={supabase} />}
            />
            <Route
              path="*"
              element={<LandingPage supabase={supabase} user={user} />}
            />
          </Routes>
        </BrowserRouter>
      </Flex>
    );
  }
}
export default App;
