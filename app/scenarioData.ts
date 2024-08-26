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
    profileName: "user_close",
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
    profileName: "user_close",
    callback: () => {
      setSpeechingNow(SpeechingNowEnum.User);
    },
  },
];

export const tutorial = () => [
  {
    text: "그럼 이제 [딸기잼 만들기] 버튼을 눌러 네 꾹꾹이 실력을 보여줘!",
    profileName: "coo_normal",
    isLast: true,
  },
];
