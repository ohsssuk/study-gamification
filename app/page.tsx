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

import { intro, main, story, tutorialStart, tutorialEnd } from "./scenarioData";

import "./coonyang.css";
import MakeAka from "@/components/coonyang/MakerAka";
import RewardPopup from "@/components/coonyang/RewardPopup";

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
  const [nowStep, setNowStep] = useState<number>(NowStepEnum.Loading);
  const [view, setView] = useState<JSX.Element | null>(null);
  const [isRewordPopup, setIsRewordPopup] = useState<boolean>(false);
  const [speechingNow, setSpeechingNow] = useState<SpeechingNowEnum>(
    SpeechingNowEnum.Coo,
  );
  const [headerType, setHeaderType] = useState<GnbTypeEnum>(GnbTypeEnum.All);

  useEffect(() => {
    setDialogVersion((prev) => prev + 1);
  }, [scenario]);

  useEffect(() => {
    if (actTotalCount === 0) {
      setNowStep(NowStepEnum.Intro);
    } else {
      setNowStep(NowStepEnum.Main);
    }
  }, [actTotalCount, actCount]);

  useEffect(() => {
    console.log(
      `진행 단계:${nowStep}`,
      `현재 잼 레벨:${actCount}`,
      `누적 완료 횟수:${actTotalCount}`,
    );

    if (nowStep === NowStepEnum.Intro) {
      // A-1. 대화 진행
      setView(<Conversation speechingNow={speechingNow} />);

      createDialog(intro(setSpeechingNow), () => {
        destoryDialog();
        setNowStep(NowStepEnum.makeAka);
      });
    } else if (nowStep === NowStepEnum.Story) {
      // A-2. 대화 진행
      setView(<Conversation speechingNow={speechingNow} />);

      createDialog(story(setSpeechingNow, makerAka), () => {
        setNowStep(NowStepEnum.Main);
      });
    } else if (nowStep === NowStepEnum.makeAka) {
      // B-2. 닉네임 정하기
      setView(<MakeAka callback={selectAka} />);
      destoryDialog();
    } else if (nowStep === NowStepEnum.Touch) {
      // 터치 미션
      setView(<Touch makerAka={makerAka} callback={completeTouch} />);

      createDialog(tutorialStart());
    } else {
      // 메인 화면
      setView(
        <Main
          actCount={actCount}
          actTotalCount={actTotalCount}
          fullCount={fullCount}
          nowStep={nowStep}
          makeAvailableSeconds={makeAvailableSeconds}
          callback={() => setNowStep(NowStepEnum.Touch)}
        />,
      );

      if (actCount >= fullCount) {
        setTimeout(() => {
          setIsRewordPopup(true);
        }, 2000);
      }

      // 튜토리얼 종료인지 여부에 따라 다른 대사 출력
      if (nowStep === NowStepEnum.TutorialEnd) {
        createDialog(tutorialEnd());
      } else if (actTotalCount === 0) {
        createDialog(tutorialStart());
      } else {
        createDialog(main(actCount));
      }
    }
  }, [nowStep]);

  const selectAka = (aka: string) => {
    setMakerAka(aka);
    setNowStep(NowStepEnum.Story);
  };

  const completeTouch = () => {
    incrementActCount();
    setNowStep(NowStepEnum.TutorialEnd);
  };

  const completeFullJam = () => {
    setIsRewordPopup(false);
    setCompleteAct();
    setNowStep(NowStepEnum.Main);
  };

  return (
    <Wrap>
      {isRewordPopup && <RewardPopup callback={completeFullJam} />}
      {/* <InitLoading /> */}
      <Header actCount={actCount} type={headerType} />

      {view}

      <Dialog
        key={dialogVersion}
        scenario={scenario}
        finishCallback={finishCallback}
      />
    </Wrap>
  );
}
