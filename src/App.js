import React, { useEffect } from 'react';
import { Connect } from '@stacks/connect-react';
import { Router } from '@reach/router';
import Auth from './components/Auth';
import { userDataState, userSessionState, useConnect } from './lib/auth';
import { useAtom } from 'jotai';
import Landing from './pages/Landing';
import Intro from './pages/Intro';
import StacksSwaps from './pages/StacksSwaps';
import { ProfileSmall } from './components/ProfileSmall';

export default function App(props) {
  const { authOptions } = useConnect();
  const [userSession] = useAtom(userSessionState);
  const [, setUserData] = useAtom(userDataState);

  useEffect(() => {
    if (userSession?.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn();
    }
  }, [userSession, setUserData]);

  return (
    <Connect authOptions={authOptions}>
      <header className="d-flex flex-wrap justify-content-between align-items-center mx-3 py-3 mb-4 border-bottom">
        <div>
          <a
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
          >
            <img src="/android-icon-72x72.png" width="75" alt="Stacks Swaps Logo" />
          </a>
        </div>
        <div>
          <span className="h1">Stacks Swaps</span>
        </div>
        <div className="btn-group btn-group-lg" role="group" aria-label="Basic outlined example">
          <ProfileSmall userSession={userSession} />
          <a
            href="https://app.sigle.io/friedger.id/A-l0d8h0Bq7uEGTWl004B"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary"
          >
            Docs
          </a>
          <Auth />
        </div>
      </header>

      <Content userSession={userSession} />
    </Connect>
  );
}

function AppBody(props) {
  return <div>{props.children}</div>;
}
function Content({ userSession }) {
  const authenticated = userSession && userSession.isUserSignedIn();
  const decentralizedID =
    userSession && userSession.isUserSignedIn() && userSession.loadUserData().decentralizedID;
  return (
    <>
      <Router>
        <AppBody path="/">
          {!authenticated && <Landing path="/" />}
          {decentralizedID && (
            <>
              <Intro path="/" default />
              <StacksSwaps
                path="/nft/:trait"
                type="nft"
                decentralizedID={decentralizedID}
                userSession={userSession}
              />
              <StacksSwaps
                path="/nft"
                type="nft"
                decentralizedID={decentralizedID}
                userSession={userSession}
              />
              <StacksSwaps
                path="/ft/:trait"
                type="ft"
                decentralizedID={decentralizedID}
                userSession={userSession}
              />
              <StacksSwaps
                path="/ft"
                type="ft"
                decentralizedID={decentralizedID}
                userSession={userSession}
              />
              <StacksSwaps
                path="/stx"
                type="stx"
                decentralizedID={decentralizedID}
                userSession={userSession}
              />
            </>
          )}
        </AppBody>
      </Router>
    </>
  );
}
