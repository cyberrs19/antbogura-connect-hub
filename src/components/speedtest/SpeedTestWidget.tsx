import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Square, RotateCcw, Download, Upload, Gauge, Activity } from "lucide-react";

type TestState = "idle" | "testing" | "complete";

interface SpeedResults {
  download: number;
  upload: number;
  latency: number;
  jitter: number;
}

const SpeedTestWidget = () => {
  const { t } = useTranslation();
  const [testState, setTestState] = useState<TestState>("idle");
  const [results, setResults] = useState<SpeedResults>({
    download: 0,
    upload: 0,
    latency: 0,
    jitter: 0,
  });
  const [currentPhase, setCurrentPhase] = useState<string>("");
  const speedTestRef = useRef<any>(null);

  const startTest = useCallback(async () => {
    setTestState("testing");
    setCurrentPhase("Initializing...");
    setResults({ download: 0, upload: 0, latency: 0, jitter: 0 });

    try {
      const SpeedTest = (await import("@cloudflare/speedtest")).default;
      
      speedTestRef.current = new SpeedTest({
        autoStart: false,
        measurements: [
          { type: "latency", numPackets: 4 },
          { type: "download", bytes: 1e7, count: 4 },
          { type: "upload", bytes: 1e6, count: 4 },
        ],
      });

      speedTestRef.current.onRunningChange = (isRunning: boolean) => {
        if (!isRunning && testState === "testing") {
          setTestState("complete");
        }
      };

      speedTestRef.current.onResultsChange = ({ type }: { type: string }) => {
        const summary = speedTestRef.current.results.getSummary();
        
        if (type === "latency") {
          setCurrentPhase("Testing latency...");
        } else if (type === "download") {
          setCurrentPhase("Testing download...");
        } else if (type === "upload") {
          setCurrentPhase("Testing upload...");
        }

        setResults({
          download: summary.download ? Math.round(summary.download * 100) / 100 : 0,
          upload: summary.upload ? Math.round(summary.upload * 100) / 100 : 0,
          latency: summary.latency ? Math.round(summary.latency) : 0,
          jitter: summary.jitter ? Math.round(summary.jitter * 100) / 100 : 0,
        });
      };

      speedTestRef.current.onFinish = () => {
        setTestState("complete");
        setCurrentPhase("");
      };

      speedTestRef.current.play();
    } catch (error) {
      console.error("Speed test error:", error);
      setTestState("idle");
    }
  }, [testState]);

  const stopTest = useCallback(() => {
    if (speedTestRef.current) {
      speedTestRef.current.pause();
    }
    setTestState("idle");
    setCurrentPhase("");
  }, []);

  const resetTest = useCallback(() => {
    setTestState("idle");
    setResults({ download: 0, upload: 0, latency: 0, jitter: 0 });
    setCurrentPhase("");
  }, []);

  const getSpeedColor = (speed: number) => {
    if (speed >= 100) return "text-green-500";
    if (speed >= 50) return "text-emerald-500";
    if (speed >= 20) return "text-yellow-500";
    if (speed > 0) return "text-orange-500";
    return "text-muted-foreground";
  };

  const getSpeedGrade = (speed: number) => {
    if (speed >= 100) return "Excellent";
    if (speed >= 50) return "Great";
    if (speed >= 20) return "Good";
    if (speed >= 10) return "Fair";
    if (speed > 0) return "Poor";
    return "";
  };

  return (
    <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex flex-col items-center space-y-8">
        {/* Main Speed Display */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-8 border-muted/30" />
          
          {/* Progress Ring */}
          {testState === "testing" && (
            <div className="absolute inset-0 rounded-full border-8 border-primary/50 animate-pulse" />
          )}
          
          {/* Inner Content */}
          <div className="text-center z-10">
            {testState === "idle" ? (
              <div className="space-y-2">
                <Gauge className="w-16 h-16 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">{t("speedTest.ready")}</p>
              </div>
            ) : (
              <>
                <p className={`text-5xl font-bold ${getSpeedColor(results.download)}`}>
                  {results.download.toFixed(1)}
                </p>
                <p className="text-lg text-muted-foreground">{t("speedTest.mbps")}</p>
                {testState === "testing" && (
                  <p className="text-sm text-primary animate-pulse mt-2">{currentPhase}</p>
                )}
                {testState === "complete" && results.download > 0 && (
                  <p className={`text-sm font-medium mt-2 ${getSpeedColor(results.download)}`}>
                    {getSpeedGrade(results.download)}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div>
          {testState === "idle" && (
            <Button onClick={startTest} size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              {t("speedTest.startTest")}
            </Button>
          )}
          {testState === "testing" && (
            <Button onClick={stopTest} variant="destructive" size="lg" className="gap-2">
              <Square className="w-5 h-5" />
              {t("speedTest.stopTest")}
            </Button>
          )}
          {testState === "complete" && (
            <Button onClick={resetTest} variant="outline" size="lg" className="gap-2">
              <RotateCcw className="w-5 h-5" />
              {t("speedTest.testAgain")}
            </Button>
          )}
        </div>

        {/* Detailed Results */}
        {(testState === "testing" || testState === "complete") && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
            <Card className="p-4 text-center bg-background/50">
              <Download className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">{t("speedTest.download")}</p>
              <p className={`text-xl font-bold ${getSpeedColor(results.download)}`}>
                {results.download.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">{t("speedTest.mbps")}</p>
            </Card>
            
            <Card className="p-4 text-center bg-background/50">
              <Upload className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">{t("speedTest.upload")}</p>
              <p className={`text-xl font-bold ${getSpeedColor(results.upload)}`}>
                {results.upload.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">{t("speedTest.mbps")}</p>
            </Card>
            
            <Card className="p-4 text-center bg-background/50">
              <Gauge className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">{t("speedTest.ping")}</p>
              <p className="text-xl font-bold text-foreground">{results.latency}</p>
              <p className="text-xs text-muted-foreground">{t("speedTest.ms")}</p>
            </Card>
            
            <Card className="p-4 text-center bg-background/50">
              <Activity className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">{t("speedTest.jitter")}</p>
              <p className="text-xl font-bold text-foreground">{results.jitter.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">{t("speedTest.ms")}</p>
            </Card>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SpeedTestWidget;
