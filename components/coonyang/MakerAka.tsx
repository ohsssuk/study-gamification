import { useEffect, useState } from "react";
import View from "./View";

interface MakeAkaProps {
  callback: (aka: string) => void;
}
export default function MakeAka({ callback }: MakeAkaProps) {
  const [akaIndex, setAkaIndex] = useState<number>(0);

  const aka = ["행복한", "멋진", "귀여운", "똑똑한", "용감한"];

  const changeAka = () => {
    setAkaIndex((prev) => (prev + 1) % aka.length);
  };

  const selectAka = () => {
    callback(aka[akaIndex] + " 냥");
  };

  return (
    <View>
      <div className="create-user-name-form">
        <div className="my-name-text">
          내 이름은 바로
          <br />
          {aka[akaIndex]} 냥이야!
        </div>
        <img
          className="face-icon speeching-now"
          src="/images/coonyang/conversation/user_face_side.png"
          alt="고양이 얼굴"
        />
        <div className="cta">
          <button className="select" onClick={selectAka}>
            마음에 들어요
          </button>
          <button className="other" onClick={changeAka}>
            랜덤 추천받기
          </button>
        </div>
      </div>
    </View>
  );
}
