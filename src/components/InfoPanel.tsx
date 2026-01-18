import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function InfoPanel() {
  return (
    <div className="glass-panel rounded-xl p-5">
      <h2 className="text-lg font-semibold text-foreground mb-4">Documentation</h2>
      
      <Tabs defaultValue="lagrange" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="lagrange" className="text-xs data-[state=active]:bg-lagrange/20">
            Lagrange
          </TabsTrigger>
          <TabsTrigger value="newton-forward" className="text-xs data-[state=active]:bg-newton-forward/20">
            N. Fwd
          </TabsTrigger>
          <TabsTrigger value="newton-backward" className="text-xs data-[state=active]:bg-newton-backward/20">
            N. Bwd
          </TabsTrigger>
          <TabsTrigger value="newton-divided" className="text-xs data-[state=active]:bg-newton-divided/20">
            N. Div
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lagrange" className="mt-4 text-sm text-muted-foreground space-y-3">
          <p>
            <strong className="text-lagrange">Lagrange Interpolation</strong> constructs a polynomial 
            that passes through all given data points.
          </p>
          <div className="bg-muted/30 rounded-lg p-3 font-mono text-xs overflow-x-auto">
            P(x) = Σ yᵢ · Πⱼ≠ᵢ (x - xⱼ)/(xᵢ - xⱼ)
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Works for any set of distinct x values</li>
            <li>Unique polynomial of degree n-1 for n points</li>
            <li>Can oscillate wildly between points (Runge's phenomenon)</li>
          </ul>
        </TabsContent>

        <TabsContent value="newton-forward" className="mt-4 text-sm text-muted-foreground space-y-3">
          <p>
            <strong className="text-newton-forward">Newton's Forward Difference</strong> uses 
            a difference table to build the interpolating polynomial incrementally.
          </p>
          <div className="bg-muted/30 rounded-lg p-3 font-mono text-xs overflow-x-auto">
            P(x) = f₀ + uΔf₀ + u(u-1)Δ²f₀/2! + ...
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Best for equally spaced data points</li>
            <li>Efficient for adding new points</li>
            <li>Uses forward differences from first point</li>
          </ul>
        </TabsContent>

        <TabsContent value="newton-backward" className="mt-4 text-sm text-muted-foreground space-y-3">
          <p>
            <strong className="text-newton-backward">Newton's Backward Difference</strong> uses 
            backward differences from the last point for interpolation.
          </p>
          <div className="bg-muted/30 rounded-lg p-3 font-mono text-xs overflow-x-auto">
            P(x) = fₙ + u∇fₙ + u(u+1)∇²fₙ/2! + ...
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Best for equally spaced data points</li>
            <li>Ideal for interpolating near the end of data</li>
            <li>Uses backward differences from last point</li>
          </ul>
        </TabsContent>

        <TabsContent value="newton-divided" className="mt-4 text-sm text-muted-foreground space-y-3">
          <p>
            <strong className="text-newton-divided">Newton's Divided Difference</strong> generalizes 
            forward differences to work with any x-spacing.
          </p>
          <div className="bg-muted/30 rounded-lg p-3 font-mono text-xs overflow-x-auto">
            P(x) = f[x₀] + f[x₀,x₁](x-x₀) + f[x₀,x₁,x₂](x-x₀)(x-x₁) + ...
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Works for any spacing of x values</li>
            <li>Easy to add/remove points</li>
            <li>More numerically stable than Lagrange</li>
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
