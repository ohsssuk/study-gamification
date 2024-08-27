interface LoadingProps {
  text?: string;
}
export default function Loading({ text = "젤리 예열 중..." }: LoadingProps) {
  return (
    <div id="during_loading" className="loading-state">
      <div className="foot-loading">
        <img
          src="https://crcf.cookatmarket.com/assets/mobile/img/coonyang/foot.png"
          alt={text}
        />
        {text ? <p>{text}</p> : null}
      </div>
    </div>
  );
}
