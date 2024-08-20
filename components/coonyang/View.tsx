"use client";

import Conversation from "@/components/coonyang/Conversation";
import { SpeechingNowEnum } from "@/enums/coonyang";
import Dialog from "@/components/coonyang/Dialog";
import Main from "@/components/coonyang/Main";
import Touch from "@/components/coonyang/Touch";

interface ViewProps {}
export default function View({}: ViewProps) {
  return (
    <div id="coonyang_view" className={`type-${3}`}>
      {/* <Conversation speechingNow={SpeechingNowEnum.User} /> */}
      {/* <Main actCount={2} makeAvailableSeconds={0} /> */}
      <Touch />
    </div>
  );
}
