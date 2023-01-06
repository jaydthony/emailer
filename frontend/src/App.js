import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header, Footer, Sidebar } from "./components";
import { useNavigate } from "react-router-dom";
import { authToken, profileData, settingsData, siteInfo } from "./context";
import { isEmpty } from "underscore";
import { Settings } from "./sdk/Settings.sdk";
import { FiInfo } from "react-icons/fi";

function App() {
  const navigate = useNavigate();
  const [token] = authToken((state) => [state.token]);
  const [profile] = profileData((state) => [state.data]);
  const [setSiteInfo] = siteInfo((state) => [state.setInfo]);
  const [appSettings, setSettings] = settingsData((state) => [
    state.data,
    state.setData,
  ]);
  const [logged, setLoggedIn] = useState(false);
  const [notification, setNotification] = useState("");
  let required = [
    "emailTemplateUrl",
    "serviceProvider",
    "smtpPassword",
    "smtpUsername",
    "useAbstract",
  ];
  useEffect(() => {
    // Can be set from DB
    (async () => {
      let settings = await Settings.getSettings();
      if (!isEmpty(settings)) {
        setSettings(settings[0]);
        let needed = [];
        required.forEach((element) => {
          if (settings[0] != undefined && settings[0][element] == undefined) {
            needed.push(element);
          }
        });
        if (!isEmpty(needed)) {
          let str = needed.join(", ").toUpperCase();
          setNotification(
            `${str} not set. Please set them from the settings page`
          );
        }
      } else {
        setNotification("App not initialised");
      }
    })();
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
                {!isEmpty(notification) && (
                  <>
                    <div className="alert alert-info mb-4 text-sm">
                      <FiInfo />
                      <span>{notification}</span>
                    </div>
                  </>
                )}
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
