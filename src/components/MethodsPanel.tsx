import { Switch } from '@/components/ui/switch';
import { DataPoint, calculateError } from '@/lib/interpolation';

interface MethodsPanelProps {
  dataPoints: DataPoint[];
  activeMethods: {
    lagrange: boolean;
    newtonForward: boolean;
    newtonBackward: boolean;
    newtonDivided: boolean;
  };
  onToggleMethod: (method: 'lagrange' | 'newtonForward' | 'newtonBackward' | 'newtonDivided') => void;
}

const methods = [
  {
    id: 'lagrange' as const,
    name: 'Lagrange',
    description: 'Polynomial interpolation through all points',
    colorClass: 'bg-lagrange',
    glowClass: 'glow-lagrange',
  },
  {
    id: 'newtonForward' as const,
    name: "Newton's Forward",
    description: 'Forward difference formula (equally spaced)',
    colorClass: 'bg-newton-forward',
    glowClass: 'glow-newton-forward',
  },
  {
    id: 'newtonBackward' as const,
    name: "Newton's Backward",
    description: 'Backward difference formula (equally spaced)',
    colorClass: 'bg-newton-backward',
    glowClass: 'glow-newton-backward',
  },
  {
    id: 'newtonDivided' as const,
    name: "Newton's Divided",
    description: 'Divided difference for any spacing',
    colorClass: 'bg-newton-divided',
    glowClass: 'glow-newton-divided',
  },
];

export function MethodsPanel({ dataPoints, activeMethods, onToggleMethod }: MethodsPanelProps) {
  const getMethodKey = (id: 'lagrange' | 'newtonForward' | 'newtonBackward' | 'newtonDivided') => {
    return id === 'lagrange' ? 'lagrange' 
      : id === 'newtonForward' ? 'newton-forward'
      : id === 'newtonBackward' ? 'newton-backward'
      : 'newton-divided';
  };

  return (
    <div className="glass-panel rounded-xl p-5">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Interpolation Methods
      </h2>

      <div className="space-y-2">
        {methods.map((method) => {
          const isActive = activeMethods[method.id];
          const error = dataPoints.length >= 2 
            ? calculateError(dataPoints, getMethodKey(method.id))
            : null;

          return (
            <div
              key={method.id}
              className={`rounded-lg p-2 transition-all duration-300 ${
                isActive 
                  ? 'bg-secondary/80 ' + method.glowClass
                  : 'bg-muted/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${method.colorClass} ${
                    isActive ? 'animate-pulse-subtle' : 'opacity-40'
                  }`} />
                  <span className={`font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {method.name}
                  </span>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={() => onToggleMethod(method.id)}
                />
              </div>
              
              {/* <p className="text-xs text-muted-foreground mb-3 ml-6">
                {method.description}
              </p> */}

              {isActive && error && dataPoints.length >= 2 && (
                <div className="ml-6 pt-2 border-t border-border/50">
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-muted-foreground block">Max Err</span>
                      <span className="text-foreground">{error.maxError.toExponential(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Avg Err</span>
                      <span className="text-foreground">{error.avgError.toExponential(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">RMS</span>
                      <span className="text-foreground">{error.rmsError.toExponential(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {dataPoints.length < 2 && (
        <p className="text-xs text-muted-foreground text-center mt-4 p-3 bg-muted/30 rounded-lg">
          Add at least 2 points to see interpolation curves
        </p>
      )}
    </div>
  );
}
