import Notiflix from "notiflix";
import React, { useEffect } from "react";
import { isEmpty } from "underscore";

function Pop({ data, type }) {
  useEffect(() => {
    Notiflix.Notify.info(data);
  }, []);
  return (
    <>
      {!isEmpty(data) && (
        <div className={`my-4 text-center text-sm text-${type}`}>{data}</div>
      )}
    </>
  );
}

export default Pop;
