"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

enum TypingStateEnum {
  Ready = 0,
  Progress = 1,
  End = 2,
}

interface Scenario {
  text: string;
  profileName: string;
  callback?: () => void;
  isLast?: boolean;
}

interface DialogProps {
  scenario: Scenario[];
  finishCallback?: () => void;
}

export default function Dialog({
  scenario,
  finishCallback = () => {},
}: DialogProps) {
  const TYPING_DELAY = 50;
  const textRef = useRef<HTMLDivElement>(null);
  const typingInterval = useRef<NodeJS.Timeout | null>(null);

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [profileName, setProfileName] = useState<string>("coo_normal");
  const [typingState, setTypingState] = useState<TypingStateEnum>(
    TypingStateEnum.Ready,
  );
  const [isEnd, setIsEnd] = useState<boolean>(false);

  useEffect(() => {
    nextScenario();

    return () => {
      if (typingInterval.current) {
        clearInterval(typingInterval.current);
      }
    };
  }, []);

  const typing = () => {
    if (!textRef.current) {
      if (typingInterval.current) clearInterval(typingInterval.current);
      return;
    }

    setTypingState(TypingStateEnum.Progress);

    const { text } = scenario[currentScenarioIndex];

    let index = 0;
    textRef.current.textContent = "";

    if (typingInterval.current) clearInterval(typingInterval.current);

    typingInterval.current = setInterval(() => {
      if (index < text.length) {
        if (textRef.current) {
          textRef.current.textContent += text.charAt(index);
        }
      } else {
        clearInterval(typingInterval.current as NodeJS.Timeout);
        setTypingState(TypingStateEnum.End);
      }
      index++;
    }, TYPING_DELAY);
  };

  const typingComplete = () => {
    if (typingInterval.current) clearInterval(typingInterval.current);
    if (textRef.current)
      textRef.current.textContent = scenario[currentScenarioIndex].text;
    setTypingState(TypingStateEnum.End);
  };

  const nextScenario = () => {
    setProfileName(scenario[currentScenarioIndex].profileName);

    if (typingState === TypingStateEnum.Ready) {
      typing();
    } else if (typingState === TypingStateEnum.Progress) {
      typingComplete();
    } else {
      console.log("next");
    }
  };

  return (
    <div id="coonyang_dialog" className="dialog-box">
      <div className="dialog-content">
        <div className="dialog-profile">
          <Image
            src={`/images/coonyang/dialog/${profileName}.png`}
            alt="고양이 얼굴"
            width={117}
            height={117}
          />
        </div>
        <div ref={textRef} className="dialog-text"></div>
      </div>
      <button
        onClick={nextScenario}
        className={`dialog-next ${
          typingState === TypingStateEnum.End ? "to-next" : ""
        }`}
      >
        다음
      </button>
      {isEnd && <></>}
    </div>
  );
}
