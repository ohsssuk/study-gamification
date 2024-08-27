"use client";
import { useEffect, useRef, useState } from "react";

import { GnbTypeEnum, NowStepEnum, SpeechingNowEnum } from "@/enums/coonyang"; // Enum

import { useDialogStore, useInfoStore } from "@/stores/coonyangStore"; // Store

import { intro, main, story, tutorialStart, tutorialEnd } from "./scenarioData"; // StaticData

import Header from "@/components/coonyang/Header";
import Wrap from "@/components/coonyang/Wrap";
import InitLoading from "@/components/coonyang/InitLoading";
import Loading from "@/components/coonyang/Loading";
import Touch from "@/components/coonyang/Touch";
import Dialog from "@/components/coonyang/Dialog";
import Main from "@/components/coonyang/Main";
import Conversation from "@/components/coonyang/Conversation";
import MakeAka from "@/components/coonyang/MakerAka";
import RewardPopup from "@/components/coonyang/RewardPopup";

import { delay, getRandomNumber } from "@/utils/common";
import "./coonyang.css";

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
    setTimer,
  } = useInfoStore();

  const [dialogVersion, setDialogVersion] = useState<number>(0);
  const [nowStep, setNowStep] = useState<NowStepEnum>(NowStepEnum.Loading);
  const [isRewordPopup, setIsRewordPopup] = useState<boolean>(false);
  const [speechingNow, setSpeechingNow] = useState<SpeechingNowEnum>(
    SpeechingNowEnum.Coo,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [headerType, setHeaderType] = useState<GnbTypeEnum>(GnbTypeEnum.All);
  const [pickIndex, setPickIndex] = useState<number>(0);

  const prevNowStepRef = useRef<NowStepEnum>();

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
    const runEffect = async () => {
      const prevNowStep = prevNowStepRef.current;

      console.log(
        `직전 단계:${prevNowStepRef.current}`,
        `진행 단계:${nowStep}`,
        `현재 잼 레벨:${actCount}`,
        `누적 완료 횟수:${actTotalCount}`,
      );

      if (nowStep === NowStepEnum.Intro) {
        // A-1. 대화 진행
        createDialog(intro(setSpeechingNow), () => {
          destoryDialog();
          setNowStep(NowStepEnum.makeAka);
        });
      } else if (nowStep === NowStepEnum.Story) {
        // A-2. 대화 진행
        createDialog(story(setSpeechingNow, makerAka), () => {
          setNowStep(NowStepEnum.Main);
        });
      } else if (nowStep === NowStepEnum.makeAka) {
        // B-2. 닉네임 정하기
        destoryDialog();
      } else if (nowStep === NowStepEnum.Touch) {
        // 터치 미션
        createDialog(tutorialStart());
      } else {
        // 메인 화면
        setTimer();

        // 미션 이후 진입이면 UX를 위한 강제 로딩화면 추가
        if (prevNowStep === NowStepEnum.Touch) {
          await loading(1200);
        }

        // 튜토리얼 종료인지 여부에 따라 다른 대사 출력
        if (prevNowStep === NowStepEnum.Touch && actTotalCount === 2) {
          createDialog(tutorialEnd());
        } else if (actTotalCount === 0) {
          createDialog(tutorialStart());
        } else {
          createDialog(main(actCount));
        }

        if (actCount >= fullCount) {
          await delay(1500);
          setIsRewordPopup(() => {
            setPickIndex(getRandomNumber(0, 4));
            return true;
          });
          setCompleteAct();
        }
      }
    };

    runEffect();

    prevNowStepRef.current = nowStep;
  }, [nowStep]);

  const selectAka = (aka: string) => {
    setMakerAka(aka);
    setNowStep(NowStepEnum.Story);
  };

  const completeTouch = () => {
    incrementActCount();
  };

  const completeFullJam = () => {
    setIsRewordPopup(false);
    destoryDialog();
    createDialog(main(actCount));
  };

  const loading = async (ms: number) => {
    setIsLoading(true);
    await delay(ms);
    setIsLoading(false);
  };

  return (
    <Wrap>
      {isRewordPopup && (
        <RewardPopup callback={completeFullJam} pickIndex={pickIndex} />
      )}
      {isLoading && <Loading />}

      <Header actCount={actCount} type={headerType} />

      {nowStep === NowStepEnum.Loading ? (
        <InitLoading />
      ) : nowStep === NowStepEnum.Intro ? (
        <Conversation speechingNow={speechingNow} />
      ) : nowStep === NowStepEnum.Story ? (
        <Conversation speechingNow={speechingNow} />
      ) : nowStep === NowStepEnum.makeAka ? (
        <MakeAka callback={selectAka} />
      ) : nowStep === NowStepEnum.Touch ? (
        <Touch makerAka={makerAka} callback={completeTouch} />
      ) : nowStep === NowStepEnum.Main ? (
        <Main
          actCount={actCount}
          actTotalCount={actTotalCount}
          fullCount={fullCount}
          nowStep={nowStep}
          makeAvailableSeconds={makeAvailableSeconds}
          callback={() => setNowStep(NowStepEnum.Touch)}
        />
      ) : null}

      <Dialog
        key={dialogVersion}
        scenario={scenario}
        finishCallback={finishCallback}
      />
    </Wrap>
  );
}
