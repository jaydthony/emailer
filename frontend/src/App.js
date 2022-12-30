import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header, Footer, Sidebar } from "./components";
import { useNavigate } from "react-router-dom";
import { authToken, profileData, siteInfo } from "./context";
import { isEmpty } from "underscore";

function App() {
  const navigate = useNavigate();
  const [token] = authToken((state) => [state.token]);
  const [profile] = profileData((state) => [state.data]);
  const [setSiteInfo] = siteInfo((state) => [state.setInfo]);
  const [logged, setLoggedIn] = useState(false);
  useEffect(() => {
    // Can be set from DB
    setSiteInfo({ name: "Emailer", siteUrl: "https://site.com" });
  }, []);

  useEffect(() => {
    if (isEmpty(profile) || isEmpty(token)) {
      navigate("/login");
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, [token, profile]);
  return (
    <>
      {logged && (
        <div className="drawer-mobile drawer">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <Sidebar />
          <div className="drawer-content flex flex-col items-start justify-start">
            <Header />
            <div className="main h-full w-full overflow-auto bg-slate-50 p-8">
              <>
                <Outlet />
                <Footer />
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default App;
