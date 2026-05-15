import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { scanBillet } from "../services/api";
import { TopNav } from "./TopNav";
import { SubNav } from "./SubNav";

function TicketValidationPage() {
  const scannerId = "ticket-qr-reader";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanRef = useRef({ code: "", at: 0 });
  const continuousModeRef = useRef(false);
  const soundEnabledRef = useRef(true);
  const validatingRef = useRef(false);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [continuousMode, setContinuousMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    continuousModeRef.current = continuousMode;
  }, [continuousMode]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  function playScanBeep() {
    if (!soundEnabledRef.current) {
      return;
    }

    const AudioContextCtor =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextCtor) {
      return;
    }

    const audioCtx = new AudioContextCtor();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.11);

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.12);

    oscillator.onended = () => {
      audioCtx.close().catch(() => {
        // No-op.
      });
    };
  }

  async function validate(codeOverride?: string) {
    const valueToValidate = (codeOverride ?? code).trim();

    if (!valueToValidate) {
      setResult({
        type: "bad",
        title: "✗ BILLET INVALIDE",
        detail: "Please enter a ticket ID.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await scanBillet(valueToValidate);
      const res = (
        data.resultat ||
        data.etat ||
        data.etatBillet ||
        ""
      ).toUpperCase();

      if (res === "NON_UTILISE" || res === "VALIDE") {
        setResult({
          type: "ok",
          title: "✓ BILLET VALIDE",
          detail: "Le billet est valide.",
        });
      } else if (res === "UTILISE") {
        setResult({
          type: "used",
          title: "✗ BILLET DÉJÀ UTILISÉ",
          detail: "Ce billet a déjà été validé précédemment.",
        });
      } else if (res === "EXPIRE") {
        setResult({
          type: "exp",
          title: "✗ BILLET EXPIRÉ",
          detail: "La date de validité de ce billet est dépassée.",
        });
      } else {
        setResult({
          type: "bad",
          title: "✗ BILLET INVALIDE",
          detail: data.message || "Code non reconnu dans le système.",
        });
      }
    } catch (err: any) {
      setResult({
        type: "bad",
        title: "✗ BILLET INVALIDE",
        detail: err.message || "Ticket not found or invalid.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function stopCamera() {
    const scanner = scannerRef.current;
    if (!scanner) {
      setCameraActive(false);
      return;
    }

    if (scanner.isScanning) {
      await scanner.stop();
    }

    await scanner.clear();
    scannerRef.current = null;
    setCameraActive(false);
  }

  async function startCamera() {
    setCameraError("");
    setResult(null);

    try {
      if (scannerRef.current) {
        await stopCamera();
      }

      lastScanRef.current = { code: "", at: 0 };
      const scanner = new Html5Qrcode(scannerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          rememberLastUsedCamera: true,
        },
        async (decodedText) => {
          if (!decodedText) {
            return;
          }

          const now = Date.now();
          if (
            lastScanRef.current.code === decodedText &&
            now - lastScanRef.current.at < 2500
          ) {
            return;
          }

          if (validatingRef.current) {
            return;
          }

          validatingRef.current = true;
          lastScanRef.current = { code: decodedText, at: now };

          setCode(decodedText);
          playScanBeep();

          try {
            if (!continuousModeRef.current) {
              await stopCamera();
            }
            await validate(decodedText);
          } catch (err) {
            console.error(err);
          } finally {
            validatingRef.current = false;
          }
        },
        () => {
          // Ignore frame-by-frame decode errors while camera is active.
        },
      );

      setCameraActive(true);
    } catch (err: any) {
      setCameraError(
        err?.message ||
          "Impossible d'accéder à la caméra. Vérifie les permissions du navigateur (HTTPS ou localhost).",
      );
      setCameraActive(false);
    }
  }

  useEffect(() => {
    return () => {
      stopCamera().catch(() => {
        // Best effort cleanup when leaving the page.
      });
    };
  }, []);

  function resultClass(type: string) {
    if (type === "ok") return "res-ok";
    if (type === "used") return "res-used";
    if (type === "exp") return "res-exp";
    return "res-bad";
  }

  function iconStyle(type: string) {
    if (type === "ok") return { background: "#bbf7d0", color: "#166534" };
    if (type === "used") return { background: "#fde68a", color: "#b45309" };
    if (type === "exp") return { background: "#e5e7eb", color: "#6b7280" };
    return { background: "#fecaca", color: "#dc2626" };
  }

  function titleColor(type: string) {
    if (type === "ok") return "#166534";
    if (type === "used") return "#b45309";
    if (type === "exp") return "#6b7280";
    return "#dc2626";
  }

  return (
    <>
      <TopNav />
      <SubNav />

      <div className="pwrap">
        <h1 className="page-h">Ticket validation</h1>

        <div className="val-wrap">
          <div className="scan-area">
            <div id={scannerId} className="scan-reader" />

            {!cameraActive && <div className="scan-icon">▦</div>}

            <span className="scan-txt">
              {cameraActive
                ? "Caméra active: place le QR code dans le cadre."
                : "Scanner QR code: clique sur Activer la caméra."}
            </span>
            <span className="scan-txt2">
              Position the ticket QR code within the frame to scan automatically
            </span>

            <button
              className="btn-cam"
              onClick={() => (cameraActive ? stopCamera() : startCamera())}
              type="button"
            >
              {cameraActive ? "Stop caméra" : "Activer la caméra"}
            </button>

            <div className="scan-options">
              <label className="scan-opt">
                <input
                  type="checkbox"
                  checked={continuousMode}
                  onChange={(e) => setContinuousMode(e.target.checked)}
                />
                Scan continu
              </label>

              <label className="scan-opt">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
                Bip de confirmation
              </label>
            </div>

            {cameraError && <div className="scan-err">{cameraError}</div>}
          </div>

          <div className="man-title">Manual ticket validation</div>

          <div className="man-row">
            <input
              type="text"
              placeholder="Enter ticket ID e.g., TKT-2026-001234"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <button className="btn-val" onClick={validate}>
              {loading ? "Validating..." : "Validate"}
            </button>
          </div>

          {result && (
            <div className={resultClass(result.type)}>
              <div className="res-row">
                <div className="res-ic" style={iconStyle(result.type)}>
                  {result.type === "ok" ? "✓" : "✕"}
                </div>

                <div
                  className="res-title"
                  style={{ color: titleColor(result.type) }}
                >
                  {result.title}
                </div>
              </div>

              <div className="res-det">{result.detail}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default TicketValidationPage;
