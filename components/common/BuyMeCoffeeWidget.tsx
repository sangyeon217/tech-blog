"use client";

import { useEffect } from "react";

export default function BmcWidget() {
  useEffect(() => {
    // 이미 위젯이 떠 있으면 중복 생성 방지
    if (document.querySelector('iframe[src*="buymeacoffee"]')) return;

    const script = document.createElement("script");
    script.id = "bmc-widget";
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
    script.async = true;

    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-cfasync", "false");
    script.setAttribute("data-id", "sangyeon217");
    script.setAttribute("data-description", "Support me on Buy me a coffee!");
    script.setAttribute("data-message", "콘텐츠가 도움이 되었다면 커피 한 잔으로 응원해주세요! ☕");
    script.setAttribute("data-color", "#5F7FFF");
    script.setAttribute("data-position", "Right");
    script.setAttribute("data-x_margin", "18");
    script.setAttribute("data-y_margin", "18");

    script.addEventListener("load", () => {
      // 로드 직후 위젯이 생성되지 않은 경우 DOMContentLoaded를 재발행해 초기화 트리거
      if (!document.querySelector('iframe[src*="buymeacoffee"]')) {
        window.dispatchEvent(new Event("DOMContentLoaded"));
      }
    });

    document.body.appendChild(script);
  }, []);

  return null;
}
