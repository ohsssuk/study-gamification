"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface MainProps {
  actCount: number;
  makeAvailableSeconds: number;
}

export default function Main({
  actCount = 0,
  makeAvailableSeconds = 10,
}: MainProps) {
  const FULL_COUNT = 4;

  if (actCount > FULL_COUNT) {
    actCount = FULL_COUNT;
  }

  function formatTime(seconds: number) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  }

  return (
    <div className="jam-mission">
      <div>
        <div className="jam">
          <img
            className="bottle"
            src={`/images/coonyang/jam_lv_${actCount}.png`}
            alt={`잼 ${actCount}/${FULL_COUNT}`}
          />
          <img className="deco" src="/images/coonyang/berry_small.png" alt="" />
        </div>
        <div className="cta">
          <button
            className="to-make-jam"
            type="button"
            disabled={makeAvailableSeconds > 0}
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
  );
}
