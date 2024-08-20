"use client";

import Header from "@/components/coonyang/Header";
import Wrap from "@/components/coonyang/Wrap";
import { GnbTypeEnum } from "@/enums/coonyang";

import "./coonyang.css";
import InitLoading from "@/components/coonyang/InitLoading";
import View from "@/components/coonyang/View";
import Dialog from "@/components/coonyang/Dialog";

import { useDialogStore } from "@/stores/coonyangStore";
import { useEffect } from "react";

export default function Home() {
  const { createDialog, destoryDialog } = useDialogStore();

  useEffect(() => {
    createDialog(
      [
        {
          text: "안녕? 나는 쿠냥이야. 너의 이름은 뭐야?",
          profileName: "coo_normal",
          callback: () => {},
        },
        {
          text: "나?! 내 이름은...",
          profileName: "user_close",
          callback: () => {},
        },
      ],
      () => {
        destoryDialog();
        console.log("finish");
      },
    );
  }, [useDialogStore]);

  return (
    <Wrap>
      {/* <InitLoading /> */}
      <Header actCount={2} type={GnbTypeEnum.Back} />
      <View />
      <Dialog />
    </Wrap>
  );
}
