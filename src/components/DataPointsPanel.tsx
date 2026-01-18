import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataPoint } from '@/lib/interpolation';
import { Plus, Trash2, Upload, Download } from 'lucide-react';

interface DataPointsPanelProps {
  dataPoints: DataPoint[];
  onAddPoint: (point: DataPoint) => void;
  onRemovePoint: (index: number) => void;
  onClearAll: () => void;
  onLoadSample: () => void;
}

export function DataPointsPanel({
  dataPoints,
  onAddPoint,
  onRemovePoint,
  onClearAll,
  onLoadSample,
}: DataPointsPanelProps) {
  const [newX, setNewX] = useState('');
  const [newY, setNewY] = useState('');

  const handleAddPoint = () => {
    const x = parseFloat(newX);
    const y = parseFloat(newY);
    if (!isNaN(x) && !isNaN(y)) {
      onAddPoint({ x, y });
      setNewX('');
      setNewY('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPoint();
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(dataPoints, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interpolation-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel rounded-xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Data Points</h2>
        <span className="text-sm text-muted-foreground font-mono">
          {dataPoints.length} points
        </span>
      </div>

      {/* Add new point */}
      <div className="flex gap-2 mb-4">
        <Input
          type="number"
          placeholder="x"
          value={newX}
          onChange={(e) => setNewX(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-muted border-border font-mono text-sm"
        />
        <Input
          type="number"
          placeholder="y"
          value={newY}
          onChange={(e) => setNewY(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-muted border-border font-mono text-sm"
        />
        <Button
          onClick={handleAddPoint}
          size="icon"
          className="bg-primary hover:bg-primary/80 text-primary-foreground shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-4">
        <Button
          onClick={onLoadSample}
          variant="secondary"
          size="sm"
          className="flex-1 text-xs"
        >
          <Upload className="w-3 h-3 mr-1" />
          Sample
        </Button>
        <Button
          onClick={handleExport}
          variant="secondary"
          size="sm"
          className="flex-1 text-xs"
          disabled={dataPoints.length === 0}
        >
          <Download className="w-3 h-3 mr-1" />
          Export
        </Button>
        <Button
          onClick={onClearAll}
          variant="destructive"
          size="sm"
          className="text-xs"
          disabled={dataPoints.length === 0}
        >
          Clear
        </Button>
      </div>

      {/* Points list */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {dataPoints.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No data points yet</p>
            <p className="text-xs mt-1">Add points above or load a sample</p>
          </div>
        ) : (
          dataPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 group animate-fade-in"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-6">
                  {index + 1}
                </span>
                <span className="font-mono text-sm text-data-point">
                  ({point.x.toFixed(2)}, {point.y.toFixed(2)})
                </span>
              </div>
              <Button
                onClick={() => onRemovePoint(index)}
                variant="ghost"
                size="icon"
                className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
