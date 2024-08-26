"use client";
import { useEffect, useState } from "react";

import { GnbTypeEnum, NowStepEnum, SpeechingNowEnum } from "@/enums/coonyang";

import Header from "@/components/coonyang/Header";
import Wrap from "@/components/coonyang/Wrap";
import InitLoading from "@/components/coonyang/InitLoading";
import Touch from "@/components/coonyang/Touch";
import Dialog from "@/components/coonyang/Dialog";
import Main from "@/components/coonyang/Main";
import Conversation from "@/components/coonyang/Conversation";

import { useDialogStore, useInfoStore } from "@/stores/coonyangStore";

import { intro, story, tutorial } from "./scenarioData";

import "./coonyang.css";
import MakeAka from "@/components/coonyang/MakerAka";

export default function Home() {
  const { scenario, finishCallback, createDialog, destoryDialog } =
    useDialogStore();

  const {
    actCount,
    actTotalCount,
    fullCount,
    makeAvailableSeconds,
    makerAka,
    incrementActCount,
    setCompleteAct,
    setMakerAka,
  } = useInfoStore();

  const [dialogVersion, setDialogVersion] = useState<number>(0);
  const [nowStep, setNowStep] = useState<number>(NowStepEnum.Intro);

  const [speechingNow, setSpeechingNow] = useState<SpeechingNowEnum>(
    SpeechingNowEnum.Coo,
  );

  useEffect(() => {
    setDialogVersion((prev) => prev + 1);
  }, [scenario]);

  useEffect(() => {
    if (actCount === 0) {
      setNowStep(NowStepEnum.Intro);
    } else {
      setNowStep(NowStepEnum.Main);
    }
    // createDialog(intro(setSpeechingNow), () => {});
  }, [actCount]);

  useEffect(() => {
    if (nowStep === NowStepEnum.Intro) {
      createDialog(intro(setSpeechingNow), () => {
        destoryDialog();
        setNowStep(NowStepEnum.makeAka);
      });
    } else if (nowStep === NowStepEnum.Story) {
      createDialog(story(setSpeechingNow, makerAka), () => {
        setNowStep(NowStepEnum.Main);
      });
    } else if (nowStep === NowStepEnum.Main) {
      createDialog(tutorial(), () => {});
    }
  }, [nowStep]);

  const selectAka = (aka: string) => {
    setMakerAka(aka);
    setNowStep(NowStepEnum.Story);
  };

  return (
    <Wrap>
      {/* <InitLoading /> */}
      <Header actCount={actCount} type={GnbTypeEnum.All} />

      {nowStep === NowStepEnum.Intro || nowStep === NowStepEnum.Story ? (
        <Conversation speechingNow={speechingNow} />
      ) : nowStep === NowStepEnum.Touch ? (
        <Touch />
      ) : nowStep === NowStepEnum.makeAka ? (
        <MakeAka callback={selectAka} />
      ) : (
        <Main
          actCount={actCount}
          actTotalCount={actTotalCount}
          fullCount={fullCount}
          makeAvailableSeconds={makeAvailableSeconds}
          callback={() => setNowStep(NowStepEnum.Touch)}
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
