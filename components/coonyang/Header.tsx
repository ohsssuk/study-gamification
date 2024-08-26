import Image from "next/image";
import { GnbTypeEnum } from "@/enums/coonyang";

interface HeaderProps {
  actCount: number;
  type: GnbTypeEnum;
}
export default function Header({
  actCount = 0,
  type = GnbTypeEnum.All,
}: HeaderProps) {
  const goalPercent = `calc(${-100 + actCount * 25}%${
    actCount === 1 ? "" : " - 2px"
  })`;

  return (
    <nav id="coonyang_gnb">
      {type !== GnbTypeEnum.None && (
        <button className="back gnb-item">뒤로 가기</button>
      )}

      {type === GnbTypeEnum.All && (
        <>
          <div className="gage-wrap gnb-item">
            <div className="gage">
              <Image
                className="gage-icon"
                width={44}
                height={46}
                src="/images/coonyang/gnb/gage_icon.png"
                alt="아이콘 이미지"
              />
              <div className="gage-bar">
                <div
                  className="level"
                  style={{ transform: `translateX(${goalPercent})` }}
                ></div>
              </div>
            </div>
          </div>
          <button className="info gnb-item">설명 보기</button>
        </>
      )}
    </nav>
  );
}
