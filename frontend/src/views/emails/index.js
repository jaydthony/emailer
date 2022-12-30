import React, { useEffect, useState } from "react";
import Table, { SelectColumnFilter } from "../../components/table";
import { motion } from "framer-motion";
import { Emailer } from "../../sdk/Emailer.sdk";

function Emails() {
  const [emails, setEmails] = useState([]);
  useEffect(() => {
    async function getEmails() {
      let emails = await Emailer.getAll();
      setEmails(emails);
    }
    getEmails();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Sender",
        accessor: "sender",
        Filter: SelectColumnFilter, // new
        filter: "includes",
      },
      {
        Header: "Date",
        accessor: "createdAt",
      },
    ],
    []
  );

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="row"
      >
        <Table columns={columns} data={emails} />
      </motion.div>
    </>
  );
}
export default Emails;
export { default as NewEmail } from "./new";
