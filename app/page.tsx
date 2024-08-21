"use client";

import Header from "@/components/coonyang/Header";
import Wrap from "@/components/coonyang/Wrap";
import { GnbTypeEnum, SpeechingNowEnum } from "@/enums/coonyang";

import "./coonyang.css";
import InitLoading from "@/components/coonyang/InitLoading";
import Touch from "@/components/coonyang/Touch";
import Dialog from "@/components/coonyang/Dialog";

import { useDialogStore } from "@/stores/coonyangStore";
import { useEffect, useState } from "react";
import Main from "@/components/coonyang/Main";
import Conversation from "@/components/coonyang/Conversation";

export default function Home() {
  const { scenario, finishCallback, createDialog, destoryDialog } =
    useDialogStore();

  const [dialogVersion, setDialogVersion] = useState<number>(0);

  useEffect(() => {
    setDialogVersion((prev) => prev + 1);
  }, [scenario]);

  // useEffect(() => {
  //   createDialog([
  //     {
  //       text: "안녕? 나는 쿠냥이야. 너의 이름은 뭐야?",
  //       profileName: "coo_normal",
  //       callback: () => {},
  //     },
  //     {
  //       text: "나?! 내 이름은...",
  //       profileName: "user_close",
  //       callback: () => {},
  //     },
  //     {
  //       text: "나?! 내 이름은...",
  //       profileName: "user_close",
  //       isLast: true,
  //     },
  //   ]);
  // }, [useDialogStore]);

  return (
    <Wrap>
      {/* <InitLoading /> */}
      <Header actCount={2} type={GnbTypeEnum.Back} />

      {/* <Conversation speechingNow={SpeechingNowEnum.User} /> */}
      {/* <Main actCount={2} makeAvailableSeconds={0} /> */}
      <Touch />

      <Dialog
        key={dialogVersion}
        scenario={scenario}
        finishCallback={finishCallback}
      />
    </Wrap>
  );
}
