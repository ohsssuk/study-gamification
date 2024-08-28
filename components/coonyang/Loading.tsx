import Image from "next/image";
interface LoadingProps {
  text?: string;
}
export default function Loading({ text = "젤리 식히는 중..." }: LoadingProps) {
  return (
    <div id="during_loading" className="loading-state">
      <div className="foot-loading">
        <Image
          src="/images/coonyang/foot.png"
          alt={text}
          width={179}
          height={178}
        />
        {text ? <p>{text}</p> : null}
      </div>
    </div>
  );
}
