import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import Table, { SelectColumnFilter } from "../../components/table";
import { Subscriber } from "../../sdk/Subscriber.sdk";

function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  useEffect(() => {
    (async () => {
      let sub = await Subscriber.getSubscribers();
      sub.forEach((element) => {
        element.status =
          element.pauseSubscription == false ? "Active" : "Inactive";
      });
      setSubscribers(sub);
    })();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Status",
        accessor: "status",
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
      <h2 className="text-3xl">Subscribers</h2>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="row"
      >
        <Table columns={columns} data={subscribers} />
      </motion.div>
    </>
  );
}

export default Subscribers;
export { default as Unsubscribe } from "./unsubscribe";
