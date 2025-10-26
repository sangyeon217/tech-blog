"use client";

import { useEffect } from "react";
import ClipboardJS from "clipboard";

type UseClipboardProps = {
  btnRef: { current: HTMLButtonElement | null };
  getText: () => string;
  onCopied?: () => void;
  onError?: () => void;
};

export function useClipboard({ btnRef, getText, onCopied, onError }: UseClipboardProps) {
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const clipboard = new ClipboardJS(btn, { text: getText });

    clipboard.on("success", () => onCopied?.());
    clipboard.on("error", () => onError?.());

    return () => clipboard.destroy();
  }, [btnRef, getText, onCopied, onError]);
}
