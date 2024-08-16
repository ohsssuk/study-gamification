"use client";

import Conversation from "@/components/coonyang/Conversation";
import { SpeechingNowEnum } from "@/enums/coonyang";
import Dialog from "./Dialog";

interface MainProps {}
export default function Main({}: MainProps) {
  return (
    <div id="coonyang_view" className={`type-${1}`}>
      <Conversation speechingNow={SpeechingNowEnum.User} />
      <Dialog
        scenario={[
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
        ]}
        finishCallback={() => {
          console.log("finish");
        }}
      />
    </div>
  );
}
