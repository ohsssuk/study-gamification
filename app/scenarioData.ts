import { SpeechingNowEnum } from "@/enums/coonyang";

export const intro = (
  setSpeechingNow: (speechingNow: SpeechingNowEnum) => void,
) => [
  {
    text: "안녕? 나는 쿠냥이야. 너의 이름은 뭐야?",
    profileName: "coo_normal",
    callback: () => {
      setSpeechingNow(SpeechingNowEnum.Coo);
    },
  },
  {
    text: "나?! 내 이름은...",
    profileName: "user_close",
    callback: () => {
      setSpeechingNow(SpeechingNowEnum.User);
    },
  },
];

export const story = (
  setSpeechingNow: (speechingNow: SpeechingNowEnum) => void,
  userName: string,
) => [
  {
    text: `${userName}! 너 꾹꾹이 할 줄 알지? 찹쌀떡에 넣을 딸기잼 만드는 것 좀 도와줄래?`,
    profileName: "coo_normal",
    callback: () => {
      setSpeechingNow(SpeechingNowEnum.Coo);
    },
  },
  {
    text: "뭐? 내가 왜! 나 바쁜 고양이거든?!",
    profileName: "user_cynic",
    callback: () => {
      setSpeechingNow(SpeechingNowEnum.User);
    },
  },
  {
    text: "내가 지금 급해서 그래! 도와주면 수고비도 줄게!",
    profileName: "coo_normal",
    callback: () => {
      setSpeechingNow(SpeechingNowEnum.Coo);
    },
  },
  {
    text: "수고비...? 크흠! 그럼 뭐 한번 도와줘 볼까!",
    profileName: "user_normal",
    callback: () => {
      setSpeechingNow(SpeechingNowEnum.User);
    },
  },
];

export const tutorialStart = () => [
  {
    text: "그럼 이제 [딸기잼 만들기] 버튼을 눌러 네 꾹꾹이 실력을 보여줘!",
    profileName: "coo_normal",
    isLast: true,
  },
];

export const tutorialEnd = () => [
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
];

export const main = (actCount: number) => {
  const dialogComment = [
    "난 찹쌀떡을 팔아서 부자가 될거야!",
    "뭐해? 어서 실력 발휘 좀 해보라구!",
    "딸기가 싱싱한 게 아주 맛있는 잼이 되겠는걸?",
    "자, 거의 다 왔어! 마지막으로 힘내보자!",
    "오오, 드디어...!",
  ];

  return [
    {
      text: dialogComment[actCount],
      profileName: "coo_normal",
      isLast: true,
    },
  ];
};
