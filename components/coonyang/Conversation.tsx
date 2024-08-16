import { SpeechingNowEnum } from "@/enums/coonyang";
import Image from "next/image";

interface ConversationProps {
  speechingNow?: SpeechingNowEnum | null;
}
export default function Conversation({
  speechingNow = null,
}: ConversationProps) {
  return (
    <div className="cat-conversation">
      <div className="row row-speech">
        <div className="col">
          <Image
            id="coo_speech"
            src="/images/coonyang/conversation/speech_shout.png"
            alt="말풍선 이미지"
            width={180}
            height={96}
          />
        </div>
        <div className="col">
          <Image
            id="user_speech"
            src="/images/coonyang/conversation/speech_normal.png"
            alt="말풍선 이미지"
            width={120}
            height={96}
          />
        </div>
      </div>
      <div className="row row-cat">
        <div className="col">
          <Image
            id="coo_face"
            src="/images/coonyang/conversation/cookat_face_side.png"
            alt="고양이 얼굴"
            width={100}
            height={100}
            className={
              speechingNow === SpeechingNowEnum.Coo ? "speeching-now" : ""
            }
          />
        </div>
        <div className="col">
          <Image
            id="user_face"
            src="/images/coonyang/conversation/user_face_side.png"
            alt="고양이 얼굴"
            width={100}
            height={100}
            className={
              speechingNow === SpeechingNowEnum.User ? "speeching-now" : ""
            }
          />
        </div>
      </div>
    </div>
  );
}
