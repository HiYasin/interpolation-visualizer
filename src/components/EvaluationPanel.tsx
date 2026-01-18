import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataPoint, lagrangeInterpolation, newtonForwardInterpolation, newtonBackwardInterpolation, newtonDividedDifferenceInterpolation } from '@/lib/interpolation';
import { Calculator } from 'lucide-react';

interface EvaluationPanelProps {
  dataPoints: DataPoint[];
  activeMethods: {
    lagrange: boolean;
    newtonForward: boolean;
    newtonBackward: boolean;
    newtonDivided: boolean;
  };
}

export function EvaluationPanel({ dataPoints, activeMethods }: EvaluationPanelProps) {
  const [xInput, setXInput] = useState('');
  const [evaluatedX, setEvaluatedX] = useState<number | null>(null);

  const sortedPoints = useMemo(() => 
    [...dataPoints].sort((a, b) => a.x - b.x), 
    [dataPoints]
  );

  const results = useMemo(() => {
    if (evaluatedX === null || dataPoints.length < 2) return null;

    return {
      lagrange: lagrangeInterpolation(sortedPoints, evaluatedX),
      newtonForward: newtonForwardInterpolation(sortedPoints, evaluatedX),
      newtonBackward: newtonBackwardInterpolation(sortedPoints, evaluatedX),
      newtonDivided: newtonDividedDifferenceInterpolation(sortedPoints, evaluatedX),
    };
  }, [evaluatedX, sortedPoints, dataPoints.length]);

  const handleEvaluate = () => {
    const x = parseFloat(xInput);
    if (!isNaN(x) && isFinite(x)) {
      setEvaluatedX(x);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEvaluate();
    }
  };

  const canEvaluate = dataPoints.length >= 2;

  return (
    <div className="glass-panel rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Evaluate f(x)</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          type="number"
          placeholder="Enter x value"
          value={xInput}
          onChange={(e) => setXInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-muted border-border font-mono text-sm"
          disabled={!canEvaluate}
        />
        <Button
          onClick={handleEvaluate}
          disabled={!canEvaluate || xInput === ''}
          className="bg-primary hover:bg-primary/80 text-primary-foreground shrink-0"
        >
          Calculate
        </Button>
      </div>

      {!canEvaluate && (
        <p className="text-xs text-muted-foreground text-center p-3 bg-muted/30 rounded-lg">
          Add at least 2 data points to evaluate
        </p>
      )}

      {results && evaluatedX !== null && (
        <div className="space-y-3 animate-fade-in">
          <div className="text-center py-2 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground text-sm">Input: </span>
            <span className="font-mono text-data-point font-medium">x = {evaluatedX}</span>
          </div>

          <div className="space-y-2">
            {activeMethods.lagrange && (
              <div className="flex items-center justify-between bg-lagrange/10 rounded-lg px-3 py-2 border border-lagrange/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-lagrange" />
                  <span className="text-sm text-foreground">Lagrange</span>
                </div>
                <span className="font-mono text-sm text-lagrange font-medium">
                  {isFinite(results.lagrange) ? results.lagrange.toFixed(6) : 'undefined'}
                </span>
              </div>
            )}

            {activeMethods.newtonForward && (
              <div className="flex items-center justify-between bg-newton-forward/10 rounded-lg px-3 py-2 border border-newton-forward/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-newton-forward" />
                  <span className="text-sm text-foreground">Newton Forward</span>
                </div>
                <span className="font-mono text-sm text-newton-forward font-medium">
                  {isFinite(results.newtonForward) ? results.newtonForward.toFixed(6) : 'undefined'}
                </span>
              </div>
            )}

            {activeMethods.newtonBackward && (
              <div className="flex items-center justify-between bg-newton-backward/10 rounded-lg px-3 py-2 border border-newton-backward/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-newton-backward" />
                  <span className="text-sm text-foreground">Newton Backward</span>
                </div>
                <span className="font-mono text-sm text-newton-backward font-medium">
                  {isFinite(results.newtonBackward) ? results.newtonBackward.toFixed(6) : 'undefined'}
                </span>
              </div>
            )}

            {activeMethods.newtonDivided && (
              <div className="flex items-center justify-between bg-newton-divided/10 rounded-lg px-3 py-2 border border-newton-divided/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-newton-divided" />
                  <span className="text-sm text-foreground">Newton Divided</span>
                </div>
                <span className="font-mono text-sm text-newton-divided font-medium">
                  {isFinite(results.newtonDivided) ? results.newtonDivided.toFixed(6) : 'undefined'}
                </span>
              </div>
            )}

            {!activeMethods.lagrange && !activeMethods.newtonForward && !activeMethods.newtonBackward && !activeMethods.newtonDivided && (
              <p className="text-xs text-muted-foreground text-center py-2">
                Enable at least one method to see results
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
