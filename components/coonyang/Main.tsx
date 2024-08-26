import View from "@/components/coonyang/View";

interface MainProps {
  actCount: number;
  actTotalCount: number;
  fullCount: number;
  makeAvailableSeconds: number;
  callback: () => void;
}

export default function Main({
  actCount = 0,
  actTotalCount = 0,
  fullCount = 4,
  callback = () => {},
  makeAvailableSeconds = 10,
}: MainProps) {
  function formatTime(seconds: number) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  }

  return (
    <View>
      <div className="jam-mission">
        <div>
          {actTotalCount === 0 && <div className="tutorial-dimmed"></div>}
          <div className="jam">
            <img
              className="bottle"
              src={`/images/coonyang/jam_lv_${actCount}.png`}
              alt={`잼 ${actCount}/${fullCount}`}
            />
            <img
              className="deco"
              src="/images/coonyang/berry_small.png"
              alt=""
            />
          </div>
          <div className={`cta ${actTotalCount === 0 ? "trace" : ""}`}>
            <button
              className="to-make-jam"
              type="button"
              disabled={makeAvailableSeconds > 0}
              onClick={callback}
            >
              {makeAvailableSeconds > 0 ? (
                <>
                  젤리 열 식히는 중 <br />{" "}
                  <span className="waiting-time">
                    {formatTime(makeAvailableSeconds)}
                  </span>
                </>
              ) : (
                "딸기잼 만들기"
              )}
            </button>
          </div>
        </div>
      </div>
    </View>
  );
}
