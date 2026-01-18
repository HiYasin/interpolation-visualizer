import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import { DataPoint, generateCurvePoints } from '@/lib/interpolation';

interface InterpolationChartProps {
  dataPoints: DataPoint[];
  activeMethods: {
    lagrange: boolean;
    newtonForward: boolean;
    newtonBackward: boolean;
    newtonDivided: boolean;
  };
  onChartClick?: (point: { x: number; y: number }) => void;
}

export function InterpolationChart({ 
  dataPoints, 
  activeMethods,
  onChartClick 
}: InterpolationChartProps) {
  const curves = useMemo(() => {
    if (dataPoints.length < 2) return { lagrange: [], newtonForward: [], newtonBackward: [], newtonDivided: [] };

    return {
      lagrange: activeMethods.lagrange ? generateCurvePoints(dataPoints, 'lagrange', 150) : [],
      newtonForward: activeMethods.newtonForward ? generateCurvePoints(dataPoints, 'newton-forward', 150) : [],
      newtonBackward: activeMethods.newtonBackward ? generateCurvePoints(dataPoints, 'newton-backward', 150) : [],
      newtonDivided: activeMethods.newtonDivided ? generateCurvePoints(dataPoints, 'newton-divided', 150) : [],
    };
  }, [dataPoints, activeMethods]);

  const chartData = useMemo(() => {
    const allX = new Set<number>();
    
    curves.lagrange.forEach(p => allX.add(p.x));
    curves.newtonForward.forEach(p => allX.add(p.x));
    curves.newtonBackward.forEach(p => allX.add(p.x));
    curves.newtonDivided.forEach(p => allX.add(p.x));

    const lagrangeMap = new Map(curves.lagrange.map(p => [p.x, p.y]));
    const newtonForwardMap = new Map(curves.newtonForward.map(p => [p.x, p.y]));
    const newtonBackwardMap = new Map(curves.newtonBackward.map(p => [p.x, p.y]));
    const newtonDividedMap = new Map(curves.newtonDivided.map(p => [p.x, p.y]));

    return Array.from(allX)
      .sort((a, b) => a - b)
      .map(x => ({
        x,
        lagrange: lagrangeMap.get(x),
        newtonForward: newtonForwardMap.get(x),
        newtonBackward: newtonBackwardMap.get(x),
        newtonDivided: newtonDividedMap.get(x),
      }));
  }, [curves]);

  const domain = useMemo(() => {
    if (dataPoints.length === 0) return { x: [-10, 10], y: [-10, 10] };
    
    const xs = dataPoints.map(p => p.x);
    const ys = dataPoints.map(p => p.y);
    const allYs = [
      ...ys,
      ...curves.lagrange.map(p => p.y),
      ...curves.newtonForward.map(p => p.y),
      ...curves.newtonBackward.map(p => p.y),
      ...curves.newtonDivided.map(p => p.y),
    ].filter(y => isFinite(y) && Math.abs(y) < 1e6);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...allYs);
    const maxY = Math.max(...allYs);

    const xPadding = (maxX - minX) * 0.2 || 2;
    const yPadding = (maxY - minY) * 0.2 || 2;

    return {
      x: [minX - xPadding, maxX + xPadding],
      y: [minY - yPadding, maxY + yPadding],
    };
  }, [dataPoints, curves]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (e: any) => {
    if (e && e.activePayload && onChartClick) {
      const x = e.activeLabel;
      onChartClick({ x, y: 0 });
    }
  };

  return (
    <div className="w-full h-full glass-panel rounded-xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          onClick={handleClick}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(222 47% 15%)" 
            strokeOpacity={0.5}
          />
          <XAxis 
            dataKey="x"
            type="number"
            domain={domain.x}
            stroke="hsl(215 20% 55%)"
            tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
            tickFormatter={(v) => v.toFixed(1)}
          />
          <YAxis 
            domain={domain.y}
            stroke="hsl(215 20% 55%)"
            tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
            tickFormatter={(v) => v.toFixed(1)}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(222 47% 10%)',
              border: '1px solid hsl(222 47% 18%)',
              borderRadius: '8px',
              color: 'hsl(210 40% 98%)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
            }}
            formatter={(value: number, name: string) => [
              value.toFixed(4),
              name === 'lagrange' ? 'Lagrange' :
              name === 'newtonForward' ? 'Newton Forward' :
              name === 'newtonBackward' ? 'Newton Backward' :
              'Newton Divided'
            ]}
            labelFormatter={(label) => `x = ${Number(label).toFixed(4)}`}
          />
          
          {activeMethods.lagrange && (
            <Line
              type="monotone"
              dataKey="lagrange"
              stroke="hsl(199 89% 48%)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(199 89% 48%)' }}
              connectNulls
            />
          )}
          
          {activeMethods.newtonForward && (
            <Line
              type="monotone"
              dataKey="newtonForward"
              stroke="hsl(142 70% 45%)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(142 70% 45%)' }}
              connectNulls
            />
          )}
          
          {activeMethods.newtonBackward && (
            <Line
              type="monotone"
              dataKey="newtonBackward"
              stroke="hsl(34 89% 55%)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(34 89% 55%)' }}
              connectNulls
            />
          )}
          
          {activeMethods.newtonDivided && (
            <Line
              type="monotone"
              dataKey="newtonDivided"
              stroke="hsl(280 65% 60%)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(280 65% 60%)' }}
              connectNulls
            />
          )}

          {dataPoints.map((point, index) => (
            <ReferenceDot
              key={index}
              x={point.x}
              y={point.y}
              r={6}
              fill="hsl(45 93% 58%)"
              stroke="hsl(45 93% 70%)"
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
