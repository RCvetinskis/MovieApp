"use client";
import React, { useEffect } from "react";
import AddItems from "../../_components/steps/add-items";
import ChooseImage from "../../_components/steps/choose-image";
import SubmitList from "../../_components/steps/submit-list";
import EditList from "../../_components/steps/edit-list";
import { useWatchListStore } from "@/store/store-watchlist";

type Props = {
  navStep?: string;
};

const NewWatchlistContainer = ({ navStep }: Props) => {
  const { resetWatchListValues } = useWatchListStore();

  useEffect(() => {
    resetWatchListValues();
  }, []);

  return (
    <main>
      {navStep === "addItems" ? (
        <AddItems />
      ) : navStep === "chooseImage" ? (
        <ChooseImage />
      ) : navStep === "submit" ? (
        <SubmitList />
      ) : (
        <EditList />
      )}
    </main>
  );
};

export default NewWatchlistContainer;
