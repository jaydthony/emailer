import React, { useEffect, useState } from "react";
import Table, { SelectColumnFilter } from "../../components/table";
import { motion } from "framer-motion";
import { Emailer } from "../../sdk/Emailer.sdk";
import { useNavigate } from "react-router-dom";

export async function emailLoader({ params }) {
  return await Emailer.getOne(params.mailId);
}

function Emails() {
  const navigate = useNavigate();
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
        Header: "Subject",
        accessor: "subject",
      },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter, // new
        filter: "includes",
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
        className="row email-table"
      >
        <Table
          columns={columns}
          data={emails}
          rowProps={(row) => ({
            onClick: () => navigate(`edit/${row.original.mailId}`),
            style: {
              cursor: "pointer",
            },
          })}
        />
      </motion.div>
    </>
  );
}
export default Emails;
export { default as NewEmail } from "./new";
