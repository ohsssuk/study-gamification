interface RewardPopupProps {
  rewordText?: string;
  reword?: number;
}
export default function RewardPopup({
  rewordText = "",
  reword = 0,
}: RewardPopupProps) {
  const points = [
    {
      amount: 10,
      text: "도와줘서 고마워…!<br>여기 수고비를 받아줘!",
    },
    {
      amount: 100,
      text: "이제 찹쌀떡을 만들 수 있겠군!<br>다음에도 도와줄 거지?",
    },
    {
      amount: 500,
      text: "야호, 맛있는 잼이 완성됐어!<br>너 정말 꾹꾹이에 소질 있구나?!",
    },
    {
      amount: 1000,
      text: "이렇게 맛있는 잼은 처음이야!<br>너 발바닥에 설탕 발랐니?",
    },
    {
      amount: 30000,
      text: "이건… 정말 환상의 맛이야…!<br>제발 다음에 또 만들어줘!!",
    },
  ];

  const createSlotItems = (
    pickIndex: number,
    repeatCount: number,
  ): JSX.Element[] => {
    const items: JSX.Element[] = [];

    for (let i = 1; i <= repeatCount; i++) {
      points.forEach((item, index) => {
        items.push(
          <div
            key={`${i}-${index}`}
            className={`item ${
              i === repeatCount && index === pickIndex ? "pick" : ""
            }`}
          >
            <span>{item.amount}</span>
            <span>원</span>
          </div>,
        );
      });
    }

    return items;
  };

  return (
    <div id="coonyang_reward_popup" className="reward-full-popup">
      <div className="head">
        <p>{rewordText}</p>
      </div>
      <div className="content">
        <div>
          <h2>적립금 {reword}원 획득</h2>
          <img
            className="label-img"
            src="/images/coonyang/jam_label.png"
            alt="잼 완성"
          />
          <div className="shining-jam-bottle">
            <img
              className="rotated-shine"
              src="/images/coonyang/rotated_shine_4x.png"
              alt="후광 효과"
            />
            <img
              className="jam-img"
              src="/images/coonyang/jam_lv_4.png"
              alt="잼 병"
            />
            <div className="shining-effect">
              <img
                className="effect effect-1"
                src="/images/coonyang/effect/effect_yellow_1.png"
                alt=""
              />
              <img
                className="effect effect-2"
                src="/images/coonyang/effect/effect_yellow_3.png"
                alt=""
              />
              <img
                className="effect effect-3"
                src="/images/coonyang/effect/effect_yellow_2.png"
                alt=""
              />
            </div>
          </div>
          <div className="reward-point">
            <img
              className="point-img"
              src="/images/coonyang/gnb/gage_icon.png"
              alt="포인트"
            />
            <div className="point-slot">
              <div className="slot spinning">{createSlotItems(3, 22)}</div>
            </div>
          </div>
          <div className="cta">
            <button type="button">적립금 받기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
