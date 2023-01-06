import { Notify } from "notiflix";
import React, { useEffect, useRef, useState } from "react";
import { isEmpty } from "underscore";
import { settingsData } from "../../context";
import { Settings } from "../../sdk/Settings.sdk";
function Setting() {
  const form = useRef();
  const [defaultSettings, setDefaultSettings] = settingsData((state) => [
    state.data,
    state.setData,
  ]);
  const [useAbstract, setUseAbstract] = useState(false);
  const [emailTemplateUrl, setEmailTemplateUrl] = useState("");
  const [serviceProvider, setServiceProvider] = useState("");
  const [smtpPassowrd, setSmtpPassowrd] = useState("");
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [smtpUsername, setSmtpUsername] = useState("");

  useEffect(() => {
    console.log(defaultSettings);
    if ("siteName" in defaultSettings) setSiteName(defaultSettings.siteName);
    if ("siteUrl" in defaultSettings) setSiteUrl(defaultSettings.siteUrl);
    if ("useAbstract" in defaultSettings)
      setUseAbstract(defaultSettings.useAbstract);
    if ("emailTemplateUrl" in defaultSettings)
      setEmailTemplateUrl(defaultSettings.emailTemplateUrl);
    if ("serviceProvider" in defaultSettings)
      setServiceProvider(defaultSettings.serviceProvider);
    if ("smtpPassword" in defaultSettings)
      setSmtpPassowrd(defaultSettings.smtpPassword);
    if ("smtpUsername" in defaultSettings)
      setSmtpUsername(defaultSettings.smtpUsername);
  }, [defaultSettings]);
  const submitForm = async (e) => {
    e.preventDefault();
    let data = {};
    let err = [];

    let resp = new FormData(form.current);
    for (let key of resp.entries()) {
      if (isEmpty(key[1])) err.push(`${key[0]}`);
      data[key[0]] = key[1];
    }
    if (!isEmpty(err)) {
      let str = err.join(", ");
      Notify.warning(`These fields ${str} must not be empty`);
      return;
    }
    data.useAbstract = useAbstract;
    console.log(data);
    let response = await Settings.save(data);
    if (response.status == true) {
      Notify.success("Saved");
    } else {
      Notify.info(response.data);
    }
  };
  return (
    <>
      <form ref={form} action="#" method="post" onSubmit={(e) => submitForm(e)}>
        <div className="form-group">
          <label htmlFor="siteName">Site Name</label>
          <input
            type="text"
            name="siteName"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="siteUrl">
            Site URL e.g <span className="text-xs">https://mysite.com</span>
          </label>
          <input
            type="text"
            name="siteUrl"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="serviceProvider">Service Provider e.g Gmail</label>
          <input
            type="text"
            name="serviceProvider"
            value={serviceProvider}
            onChange={(e) => setServiceProvider(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="smtpUsername">SMTP Username</label>
          <input
            type="text"
            name="smtpUsername"
            className="input"
            value={smtpUsername}
            onChange={(e) => setSmtpUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="smtpPassword">SMTP Password</label>
          <input
            type="password"
            name="smtpPassword"
            className="input"
            value={smtpPassowrd}
            onChange={(e) => setSmtpPassowrd(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="emailTemplate">Email Template Url</label>
          <input
            type="url"
            name="emailTemplateUrl"
            className="input"
            value={emailTemplateUrl}
            onChange={(e) => setEmailTemplateUrl(e.target.value)}
            required
          />
        </div>
        <div className="form-group flex !flex-row gap-4">
          <label htmlFor="useAbstract">Use Abstractapi Validation:</label>
          <input
            type="checkbox"
            name="useAbstract"
            className="toggle ml-auto !bg-none"
            value={useAbstract}
            onChange={(e) =>
              e.target.checked ? setUseAbstract(true) : setUseAbstract(false)
            }
          />
        </div>

        <div className="form-group">
          <input
            type="submit"
            value="Submit"
            name="Submit"
            className="btn-secondary btn bg-slate-800"
          />
        </div>
      </form>
    </>
  );
}

export default Setting;
