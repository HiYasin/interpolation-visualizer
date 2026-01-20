import { useState, useCallback } from 'react';
import { DataPoint } from '@/lib/interpolation';
import { InterpolationChart } from '@/components/InterpolationChart';
import { DataPointsPanel } from '@/components/DataPointsPanel';
import { MethodsPanel } from '@/components/MethodsPanel';
import { InfoPanel } from '@/components/InfoPanel';
import { EvaluationPanel } from '@/components/EvaluationPanel';
import { TrendingUp } from 'lucide-react';
import SAMPLE_DATA from '../../interpolation-data.json';

export default function Index() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [activeMethods, setActiveMethods] = useState({
    lagrange: true,
    newtonForward: false,
    newtonBackward: false,
    newtonDivided: false,
  });

  const handleAddPoint = useCallback((point: DataPoint) => {
    setDataPoints((prev) => [...prev, point]);
  }, []);

  const handleRemovePoint = useCallback((index: number) => {
    setDataPoints((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearAll = useCallback(() => {
    setDataPoints([]);
  }, []);

  const handleLoadSample = useCallback(() => {
    setDataPoints(SAMPLE_DATA);
  }, []);

  const handleToggleMethod = useCallback(
    (method: 'lagrange' | 'newtonForward' | 'newtonBackward' | 'newtonDivided') => {
      setActiveMethods((prev) => ({
        ...prev,
        [method]: !prev[method],
      }));
    },
    []
  );

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      {/* Header */}
      <header className="mb-6 lg:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10 glow-primary">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Interpolation Visualizer
          </h1>
        </div>
        <p className="text-muted-foreground text-sm lg:text-base max-w-2xl">
          Explore and compare numerical interpolation techniques. Add data points, 
          toggle methods, and observe how different algorithms approximate your data.
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] gap-4 lg:gap-6 h-[calc(100vh-180px)] lg:h-[calc(100vh-200px)]">
        {/* Left Panel - Data Points */}
        <div className="order-2 lg:order-1 h-[300px] lg:h-full">
          <DataPointsPanel
            dataPoints={dataPoints}
            onAddPoint={handleAddPoint}
            onRemovePoint={handleRemovePoint}
            onClearAll={handleClearAll}
            onLoadSample={handleLoadSample}
          />
        </div>

        {/* Center - Chart */}
        <div className="order-1 lg:order-2 h-[400px] lg:h-full">
          <InterpolationChart
            dataPoints={dataPoints}
            activeMethods={activeMethods}
          />
        </div>

        {/* Right Panel - Methods, Evaluation & Info */}
        <div className="order-3 space-y-4 lg:space-y-6 lg:overflow-y-auto">
          <MethodsPanel
            dataPoints={dataPoints}
            activeMethods={activeMethods}
            onToggleMethod={handleToggleMethod}
          />
          <EvaluationPanel
            dataPoints={dataPoints}
            activeMethods={activeMethods}
          />
          <InfoPanel />
        </div>
      </div>
    </div>
  );
}
