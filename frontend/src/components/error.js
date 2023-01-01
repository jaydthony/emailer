import Notiflix from "notiflix";
import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import NoAuthHeader from "./noAuthHeader";
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  useEffect(() => {
    Notiflix.Notify.info(error.message);
  }, []);
  return (
    <>
      <div id="error-page flex align-center justify-center p-12 text-center">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className="text-error">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </>
  );
}
