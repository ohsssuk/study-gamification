interface LoadingProps {
  text?: string;
}
export default function Loading({ text = "젤리 식히는 중..." }: LoadingProps) {
  return (
    <div id="during_loading" className="loading-state">
      <div className="foot-loading">
        <img src="/imgages/coonyang/foot.png" alt={text} />
        {text ? <p>{text}</p> : null}
      </div>
    </div>
  );
}
