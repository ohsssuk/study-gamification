import { ReactNode, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
interface RewardPopupProps {
  pickIndex?: number;
  callback?: () => void;
}
export default function RewardPopup({
  pickIndex = 0,
  callback = () => {},
}: RewardPopupProps) {
  const slotRef = useRef<HTMLDivElement>(null);

  const REWARD_CONFIG: { amount: number; text: ReactNode }[] = [
    {
      amount: 10,
      text: (
        <>
          도와줘서 고마워…!
          <br />
          여기 수고비를 받아줘!
        </>
      ),
    },
    {
      amount: 100,
      text: (
        <>
          이제 찹쌀떡을 만들 수 있겠군!
          <br />
          다음에도 도와줄 거지?
        </>
      ),
    },
    {
      amount: 500,
      text: (
        <>
          야호, 맛있는 잼이 완성됐어!
          <br />너 정말 꾹꾹이에 소질 있구나?!
        </>
      ),
    },
    {
      amount: 1000,
      text: (
        <>
          이렇게 맛있는 잼은 처음이야!
          <br />너 발바닥에 설탕 발랐니?
        </>
      ),
    },
    {
      amount: 30000,
      text: (
        <>
          이건… 정말 환상의 맛이야…!
          <br />
          제발 다음에 또 만들어줘!!
        </>
      ),
    },
  ];

  const createSlotItems = (
    pickIndex: number,
    repeatCount: number,
  ): JSX.Element[] => {
    const items: JSX.Element[] = [];
    let id = 0;

    for (let i = 1; i <= repeatCount; i++) {
      REWARD_CONFIG.forEach((item, index) => {
        id++;
        items.push(
          <div
            key={`${i}-${id}`}
            className={`item ${
              i === repeatCount && index === pickIndex ? "pick" : ""
            }`}
          >
            <span>{item.amount.toLocaleString()}</span>
            <span>원</span>
          </div>,
        );
      });
    }

    return items;
  };

  const items = useMemo(() => createSlotItems(pickIndex, 5), [pickIndex]);

  useEffect(() => {
    console.log(
      `완료 보상 팝업 오픈: ${REWARD_CONFIG[pickIndex].amount}원 당첨`,
    );
    const $slot = slotRef.current;
    if ($slot) {
      const $pickSlot = $slot.querySelector(".item.pick") as HTMLDivElement;
      if ($pickSlot) {
        const distance = $pickSlot.offsetTop * -1;

        $slot.style.transform = `translateY(${distance}px)`;
      }
    }
  }, [pickIndex]);

  const handleClickCTABtn = () => {
    callback();
  };

  return (
    <div id="coonyang_reward_popup" className="reward-full-popup">
      <div className="head">
        <p>{REWARD_CONFIG[pickIndex].text}</p>
      </div>
      <div className="content">
        <div>
          <h2>
            적립금 {REWARD_CONFIG[pickIndex].amount.toLocaleString()}원 획득
          </h2>
          <Image
            className="label-img"
            src="/images/coonyang/jam_label.png"
            alt="잼 완성"
            width={506}
            height={192}
          />
          <div className="shining-jam-bottle">
            <Image
              className="rotated-shine"
              src="/images/coonyang/rotated_shine_4x.png"
              alt="후광 효과"
              width={619}
              height={617}
            />
            <Image
              className="jam-img"
              src="/images/coonyang/jam_lv_4.png"
              alt="잼 병"
              width={173}
              height={250}
            />
            <div className="shining-effect">
              <Image
                className="effect effect-1"
                src="/images/coonyang/effect/effect_yellow_1.png"
                alt=""
                width={20}
                height={24}
              />
              <Image
                className="effect effect-2"
                src="/images/coonyang/effect/effect_yellow_3.png"
                alt=""
                width={20}
                height={24}
              />
              <Image
                className="effect effect-3"
                src="/images/coonyang/effect/effect_yellow_2.png"
                alt=""
                width={52}
                height={52}
              />
            </div>
          </div>
          <div className="reward-point">
            <Image
              className="point-img"
              src="/images/coonyang/gnb/gage_icon.png"
              alt="포인트"
              width={44}
              height={46}
            />
            <div className="point-slot">
              <div className="slot" ref={slotRef}>
                {items}
              </div>
            </div>
          </div>
          <div className="cta">
            <button onClick={handleClickCTABtn}>적립금 받기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
