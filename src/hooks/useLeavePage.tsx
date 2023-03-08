import { useEffect, useState } from "react";
import Router from "next/router";
import { useBeforeUnload } from "react-use";
import { CONFIRMATION_MESSAGE } from "constants/app";
import { useSelector } from "react-redux";

export const useLeavePageConfirm = (
  isConfirm = true,
  message = CONFIRMATION_MESSAGE,
) => {
  const { removeEventChangePage } = useSelector((state: any) => ({
    removeEventChangePage: state?.forceUpdating?.eventChangePage,
  }));

  useBeforeUnload(isConfirm, message);

  const beforeRouteHandler = (url: string) => {
    if (Router.pathname !== url && isConfirm && !window.confirm(message)) {
      throw "Route Canceled";
    }
  };

  const handleRemoveEventLeavePage = () => {
    Router.events.off("routeChangeStart", beforeRouteHandler);
  }

  useEffect(() => {
    if (removeEventChangePage) {
      handleRemoveEventLeavePage();
    } else {
      Router.events.on("routeChangeStart", beforeRouteHandler);
    }

    return () => {
      Router.events.off("routeChangeStart", beforeRouteHandler);
    };
  }, [isConfirm, message, removeEventChangePage]);
};
