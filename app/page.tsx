"use client";
import { useEffect, useState } from "react";

import { GnbTypeEnum, NowStelEnum, SpeechingNowEnum } from "@/enums/coonyang";

import Header from "@/components/coonyang/Header";
import Wrap from "@/components/coonyang/Wrap";
import InitLoading from "@/components/coonyang/InitLoading";
import Touch from "@/components/coonyang/Touch";
import Dialog from "@/components/coonyang/Dialog";
import Main from "@/components/coonyang/Main";
import Conversation from "@/components/coonyang/Conversation";

import { useDialogStore, useInfoStore } from "@/stores/coonyangStore";

import { intro } from "./scenarioData";

import "./coonyang.css";

export default function Home() {
  const { scenario, finishCallback, createDialog, destoryDialog } =
    useDialogStore();

  const {
    actCount,
    actTotalCount,
    fullCount,
    makeAvailableSeconds,
    incrementActCount,
    setCompleteAct,
    setMakerAka,
  } = useInfoStore();

  const [dialogVersion, setDialogVersion] = useState<number>(0);
  const [nowStep, setNowStep] = useState<number>(0);

  const [speechingNow, setSpeechingNow] = useState<SpeechingNowEnum>(
    SpeechingNowEnum.Coo,
  );

  useEffect(() => {
    setDialogVersion((prev) => prev + 1);
  }, [scenario]);

  useEffect(() => {
    createDialog(
      intro((setSpeechingNow) => {
        console.log(setSpeechingNow);
      }),
    );
  }, []);

  return (
    <Wrap>
      {/* <InitLoading /> */}
      <Header actCount={actCount} type={GnbTypeEnum.All} />

      {nowStep === NowStelEnum.Touch ? (
        <Touch />
      ) : actTotalCount === 0 ? (
        <Conversation speechingNow={speechingNow} />
      ) : (
        <Main
          actCount={actCount}
          fullCount={fullCount}
          makeAvailableSeconds={makeAvailableSeconds}
        />
      )}

      <Dialog
        key={dialogVersion}
        scenario={scenario}
        finishCallback={finishCallback}
      />
    </Wrap>
  );
}
