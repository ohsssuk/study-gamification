import Image from "next/image";
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
            text: "역시 내 눈은 틀리지 않았어! 앞으로도 계속 딸기잼을 만들어줄래?",
            profileName: "coo_normal",
          },
          {
            text: "싫어! 발바닥 젤리가 불타는 줄 알았다구...!",
            profileName: "user_cynic",
          },
          {
            text: "하핫...! 꾹꾹이 후엔 발바닥이 아플 테니 열 식히는 시간을 꼭 가지도록 해!",
            profileName: "coo_normal",
          },
          {
            text: "쉬는 동안 쿠캣을 둘러보고 와도 좋고!",
            profileName: "coo_normal",
          },
          {
            text: "(뭔가 단단히 잘못 걸린 것 같다...!)",
            profileName: "user_cynic",
          },
          {
            text: "딸기잼을 4번 만들면 한 병이 완성돼. 그때마다 최대 3만원의 적립금을 수고비로 줄게!",
            profileName: "coo_normal",
          },
          {
            text: "그렇다면...할만 할지도...?",
            profileName: "user_cynic",
          },
          {
            text: "하하하! 그럴 줄 알았어! 그럼 앞으로 잘 부탁해!",
            profileName: "coo_normal",
            isLast: true,
          },
        ]}
      />
    </div>
  );
}
