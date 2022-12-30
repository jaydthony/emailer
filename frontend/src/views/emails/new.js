import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { motion } from "framer-motion";
import "react-quill/dist/quill.snow.css";
import DateTimePicker from "react-datetime-picker";
import { profileData, siteInfo } from "../../context";
import { Emailer } from "../../sdk/Emailer.sdk";
import { isArray, isEmpty } from "underscore";
import { alertMsg } from "../../helper/util";

function NewEmail() {
  const [websiteInfo] = siteInfo((state) => [state.info]);
  const [editorState, setEditorState] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [subject, setSubject] = React.useState("");
  const [user] = profileData((state) => [state.data]);
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
  const sendEmail = () => {
    setIsPending(true)
    if (isEmpty(subject) || isEmpty(editorState)) {
      alertMsg("Please fill up subject and message body");
      return false;
    }
    let data = {
      sitename: websiteInfo.name,
      subject,
      sender: user.email,
      body: editorState,
      unsubscribelink: `${websiteInfo.siteUrl}/unsubscribe`,
    };
    (async function () {
      let response = await Emailer.send(data);
      setIsPending(false)
      if(isArray(response) && response.length>0){
        alertMsg('Success','success')
      }
      console.log(response);
    })();
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="title">Enter email title</label>
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
        <label htmlFor="date">Schedule Message</label>
        <DateTimePicker onChange={setDate} value={date} />
      </div>
      <div className="form-group">
        <motion.button
          className={`${isPending?'loading':''} btn-ghost btn w-1/4 bg-slate-700 px-2 py-1 text-white`}
          onClick={sendEmail}
        >
          Send Email
        </motion.button>
      </div>
    </>
  );
}

export default NewEmail;
