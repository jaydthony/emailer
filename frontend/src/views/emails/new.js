import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import { motion } from "framer-motion";
import "react-quill/dist/quill.snow.css";
import DateTimePicker from "react-datetime-picker";
import { profileData } from "../../context";
import { Emailer } from "../../sdk/Emailer.sdk";
import { isEmpty, isObject } from "underscore";
import moment from "moment";
import * as timezone from "moment-timezone";
import Notiflix, { Report } from "notiflix";

function NewEmail() {
  const [editorState, setEditorState] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);
  const [timezone, setTimezone] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [subject, setSubject] = React.useState("");
  const [user] = profileData((state) => [state.data]);
  const [utcTime, setUtc] = React.useState("");
  const [iso, setIso] = React.useState("");
  const [err, setErr] = React.useState("");
  const [status, setStatus] = React.useState("draft");
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
      ["link"],
      ["clean"],
    ],
  };
  useEffect(() => {
    setUtc(moment(date).utc().toString());
    setTimezone(moment.tz.guess());
    setIso(moment(date).utc().toISOString());
  }, [date]);
  const sendEmail = async () => {
    setErr("");
    setIsPending(true);
    if (isEmpty(subject) || isEmpty(editorState)) {
      Notiflix.Notify.warning("Please fill up subject and message body");
      setIsPending(false);
      return false;
    }
    let data = {
      subject,
      sender: user.email,
      body: editorState,
      schedule: iso,
      status,
    };
    try{
      let response = await Emailer.process(data);
      if (isObject(response)) {
        Notiflix.Notify.success("Email sent");
      } else {
        Notiflix.Notify.info(response);
      }
      setIsPending(false);
    } catch (error) {
      console.log(error);
      Report.failure("An error occured", `${error}`);
      setIsPending(false);
    }
  };

  return (
    <>
      {err && (
        <>
          <span className="text-error">{err}</span>
        </>
      )}
      <div className="form-group">
        <label htmlFor="title" className="text-lg font-semibold">
          Enter email subject
        </label>
        <input
          type="text"
          name="title"
          id=""
          className="input w-full"
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="form-group">
        <ReactQuill
          modules={modules}
          theme="snow"
          placeholder="Content goes here..."
          onChange={setEditorState}
        />
      </div>

      <div className="form-group">
        <label htmlFor="date" className="text-lg font-semibold">
          Schedule Message
        </label>
        <div className="tabs">
          <a
            className={`tab  ${status == "draft" ? "tab-active" : ""}`}
            onClick={(e) => setStatus("draft")}
          >
            Draft
          </a>
          <a
            className={`tab  ${status == "immediate" ? "tab-active" : ""}`}
            onClick={(e) => setStatus("immediate")}
          >
            Send Now
          </a>
          <a
            className={`tab  ${status == "schedule" ? "tab-active" : ""}`}
            onClick={(e) => setStatus("schedule")}
          >
            Schedule
          </a>
        </div>
        {status == "draft" && (
          <>
            <p>Your message will be saved to draft.</p>
          </>
        )}
        {status == "immediate" && (
          <>
            <p>Your message will be sent immediately.</p>
          </>
        )}
        {status == "schedule" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 100,
              opacity: 1,
              transition: {
                type: "spring",
                duration: 1.15,
                ease: "circOut",
              },
            }}
            className="gap-2"
          >
            <p>Your current timezone: {timezone}</p>
            <DateTimePicker
              disableClock={true}
              monthPlaceholder={"M"}
              dayPlaceholder={"D"}
              yearPlaceholder={"Y"}
              minutePlaceholder={"Min"}
              yearAriaLabel={"Year"}
              format={"dd-MM-y h:mm a"}
              secondPlaceholder={"S"}
              hourPlaceholder={"Hr"}
              minDate={new Date()}
              onChange={setDate}
              value={date}
            />
            <p className="text-sm ">
              <span className="text-error">
                The selected date is converted to UTC time.{" "}
              </span>
              <br />
              {!isEmpty(timezone) && (
                <>Selected date converted to UTC:&nbsp;{utcTime}</>
              )}
            </p>
          </motion.div>
        )}
      </div>
      <div className="form-group">
        <motion.button
          className={`${
            isPending ? "loading" : ""
          } btn-ghost btn w-1/4 bg-slate-700 px-2 py-1 text-white`}
          onClick={sendEmail}
        >
          Submit
        </motion.button>
      </div>
    </>
  );
}

export default NewEmail;
