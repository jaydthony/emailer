import React, { useEffect } from "react";
import { isEmpty } from "underscore";

function Pop({ data, type }) {
  return <>{!isEmpty(data) && <div className={`text-center text-sm my-4 text-${type}`}>{data}</div>}</>;
}

export default Pop;
