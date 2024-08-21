"use client";

import { Scenario } from "@/interfaces/coonyang";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

enum TypingStateEnum {
  Ready = 0,
  Progress = 1,
  End = 2,
}

interface DialogProps {
  scenario?: Scenario[];
  finishCallback?: () => void;
}
export default function Dialog({
  scenario = [],
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
  }, [currentScenarioIndex]);

  useEffect(() => {
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
    if (scenario.length === 0 || !scenario[currentScenarioIndex]) return;

    const {
      profileName,
      text,
      isLast = false,
      callback = () => {},
    } = scenario[currentScenarioIndex];

    setProfileName(profileName);
    setIsEnd(isLast);
    callback();

    if (typingState === TypingStateEnum.Ready) {
      typing();
    } else if (typingState === TypingStateEnum.Progress) {
      typingComplete();
    } else {
      if (currentScenarioIndex === scenario.length - 1) {
        finishCallback();
        return;
      }

      setCurrentScenarioIndex((prev) => prev + 1);
      setTypingState(TypingStateEnum.Ready);
    }
  };

  if (scenario.length === 0) return null;

  return (
    <div id="coonyang_dialog" className="dialog-box">
      <div className="dialog-content">
        <div className="dialog-profile">
          <Image
            src={`/images/coonyang/dialog/${profileName}.png`}
            alt="고양이 얼굴"
            width={117}
            height={117}
            key={profileName}
          />
        </div>
        <div ref={textRef} className="dialog-text"></div>
      </div>
      <button
        onClick={nextScenario}
        className={`dialog-next ${
          typingState === TypingStateEnum.End && !isEnd ? "to-next" : ""
        }`}
      >
        다음
      </button>
      {isEnd && <></>}
    </div>
  );
}
