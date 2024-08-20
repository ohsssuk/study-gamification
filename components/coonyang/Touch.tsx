import { TouchStateEnum } from "@/enums/coonyang";
import { useDialogStore } from "@/stores/coonyangStore";
import { useCallback, useRef, useState } from "react";

export default function Touch() {
  const { createDialog, destoryDialog } = useDialogStore();

  const [touchedCount, setTouchedCount] = useState<number>(0);
  const [state, setState] = useState<TouchStateEnum>(TouchStateEnum.Start);

  const touchWrapRef = useRef<HTMLDivElement>(null);
  const berryImgRef = useRef<HTMLImageElement>(null);

  const handleTouch = (event: {
    nativeEvent: { offsetX: number; offsetY: number };
  }) => {
    touchEvent();
    touchEffect(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
  };

  const touchEvent = useCallback(() => {
    setTouchedCount((prevCount) => {
      const newCount = prevCount + 1;

      if (newCount > 30) {
        setState(TouchStateEnum.Complete);
      } else if (newCount > 20) {
        //
      } else if (newCount > 10) {
        createDialog([
          {
            text: "힘내 힘내",
            profileName: "coo_normal",
            callback: () => {},
          },
        ]);
      } else if (newCount > 0) {
        setState(TouchStateEnum.InProgress);
      }

      return newCount;
    });
  }, [createDialog]);

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
    <div ref={touchWrapRef} className="touch-wrap">
      <img
        ref={berryImgRef}
        className="berry-img"
        src="/images/coonyang/berry_xl.png"
        alt="딸기 클릭"
      />
      <button onClick={handleTouch} className="touch-berry" type="button">
        딸기 클릭(꾹꾹이)
      </button>
      {state !== TouchStateEnum.InProgress && (
        <div className={`touch-state-banner ${state}`}>
          ${state === TouchStateEnum.Start ? "터치" : "완료"}
        </div>
      )}
    </div>
  );
}
