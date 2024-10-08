import Image from "next/image";
import { TouchStateEnum } from "@/enums/coonyang";
import { useDialogStore } from "@/stores/coonyangStore";
import { useEffect, useRef, useState } from "react";
import View from "@/components/coonyang/View";

interface TouchProps {
  makerAka: string;
  callback: () => void;
}
export default function Touch({ makerAka, callback }: TouchProps) {
  const { createDialog, destoryDialog } = useDialogStore();

  const [touchedCount, setTouchedCount] = useState<number>(0);
  const [state, setState] = useState<TouchStateEnum>(TouchStateEnum.Start);

  const touchWrapRef = useRef<HTMLDivElement>(null);
  const berryImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (touchedCount === 0) {
      createDialog([
        {
          text: "뭐 하는 거야? 어서 딸기에 꾹꾹이 진행시켜!",
          profileName: "coo_normal",
          isLast: true,
        },
      ]);
    } else if (touchedCount === 1) {
      createDialog([
        {
          text: "조금 더 빨리! 딸기가 산더미처럼 쌓여있다구!",
          profileName: "coo_normal",
          isLast: true,
        },
      ]);
      setState(TouchStateEnum.InProgress);
    } else if (touchedCount === 5) {
      createDialog([
        {
          text: "아직 부족해! 발바닥 젤리에 불이 날 때까지 누르란 말이야!",
          profileName: "coo_normal",
          isLast: true,
        },
      ]);
    } else if (touchedCount === 10) {
      createDialog([
        {
          text: `조금만 더...! 거의 다왔어 ${makerAka} 냥!`,
          profileName: "coo_normal",
          isLast: true,
        },
      ]);
    } else if (touchedCount === 15) {
      createDialog([
        {
          text: `아... 나의 발바닥 젤리에 불이 나는군...!`,
          profileName: "user_close",
          isLast: true,
        },
      ]);
      setState(TouchStateEnum.Complete);

      setTimeout(() => {
        console.log("미션 완료: TEST를 위해 완료횟수를 2로 조정");
        callback();
      }, 2500);
    }
  }, [touchedCount, createDialog]);

  const handleTouch = (event: {
    nativeEvent: { offsetX: number; offsetY: number };
  }) => {
    touchEvent();
    touchEffect(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
  };

  const touchEvent = () => {
    setTouchedCount((prevCount) => prevCount + 1);
  };

  const touchEffect = (offsetX: number, offsetY: number) => {
    if (state === TouchStateEnum.Complete) return;

    if (berryImgRef.current) {
      berryImgRef.current.classList.add("touching");

      setTimeout(() => {
        berryImgRef.current?.classList.remove("touching");
      }, 500);
    }

    const offset = [offsetX, offsetY];

    const touchEffect = document.createElement("div");
    touchEffect.className = "touch-effect";

    function getRandomPoint() {
      const randomNum = Math.floor(Math.random() * 100);
      return randomNum - 50;
    }

    touchEffect.style.left = `${offset[0]}px`;
    touchEffect.style.top = `${offset[1]}px`;
    touchEffect.style.transform = `translateY(${
      getRandomPoint() - 50
    }%) translateX(${getRandomPoint() - 50}%) rotate(${getRandomPoint()}deg)`;

    if (touchWrapRef.current) {
      touchWrapRef.current.appendChild(touchEffect);
    }

    setTimeout(() => {
      if (touchWrapRef.current) {
        touchWrapRef.current.removeChild(touchEffect);
      }
    }, 2000);
  };

  return (
    <View viewType={3}>
      <div ref={touchWrapRef} className="touch-wrap">
        <Image
          ref={berryImgRef}
          className="berry-img"
          src="/images/coonyang/berry_xl.png"
          alt="딸기 클릭"
          width={316}
          height={299}
        />
        <button onClick={handleTouch} className="touch-berry" type="button">
          딸기 클릭(꾹꾹이)
        </button>
        {state !== TouchStateEnum.InProgress && (
          <div className={`touch-state-banner ${state}`}>
            ${state === TouchStateEnum.Start ? "터치" : "완료"}$
            {state === TouchStateEnum.Complete && (
              <div className="twinkling-effect">
                <Image
                  className="effect effect-1"
                  src="/images/coonyang/effect/effect_white_1.png"
                  alt=""
                  width={41}
                  height={48}
                />
                <Image
                  className="effect effect-2"
                  src="/images/coonyang/effect/effect_white_2.png"
                  alt=""
                  width={75}
                  height={92}
                />
                <Image
                  className="effect effect-3"
                  src="/images/coonyang/effect/effect_white_3.png"
                  alt=""
                  width={105}
                  height={104}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </View>
  );
}
