// GraphEngine.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { create, all } from 'mathjs';

const math = create(all);

// helpers
const linspace = (a, b, n) => {
  const out = [];
  if (n <= 1) return [a];
  const step = (b - a) / (n - 1);
  for (let i = 0; i < n; i++) out.push(a + i * step);
  return out;
};

const defaultReserved = new Set(['x', 'e', 'pi', 'sin', 'cos', 'tan', 'log', 'sqrt', 'abs', 'exp']);

// detect symbol nodes (parameters) except 'x' and reserved names
function detectParams(expr) {
  try {
    const node = math.parse(expr);
    const names = new Set();
    node.traverse((n) => {
      if (n.isSymbolNode) names.add(n.name);
    });
    const params = [...names].filter((n) => !defaultReserved.has(n) && n !== 'x');
    return params;
  } catch {
    return [];
  }
}

// vertex detection for quadratics
function findVertex(a, b, c) {
  if (a === 0) return null;
  const xv = -b / (2 * a);
  const yv = a * xv ** 2 + b * xv + c;
  return { x: xv, y: yv };
}

export default function GraphEngine({
  equations = [{ expr: 'a*x^2 + b*x + c', initialParams: { a: 1, b: 0, c: 0 } }],
  domain = [-10, 10],
  samples = 400,
  showGrid = true,
  showLegend = true,
}) {
  const [xMinState, setXMinState] = useState(domain[0]);
  const [xMaxState, setXMaxState] = useState(domain[1]);
  const [nSamples, setNSamples] = useState(samples);
  const [showTangent, setShowTangent] = useState(false);
  const [tangentX, setTangentX] = useState(0);
  const [showRoots, setShowRoots] = useState(true);
  const [error, setError] = useState(null);
const [equationStates, setEquationStates] = useState(
    equations.map((eq) => ({
      expr: eq.expr,
      paramValues: { ...eq.initialParams },
    }))
  );
  // Track each equation's state: expr and paramValues
  useEffect(() => {
  setEquationStates(
    equations.map((eq) => ({
      expr: eq.expr,
      paramValues: { ...eq.initialParams },
    }))
  );
}, [equations]);


  // Detect params for each equation
  const paramNamesArray = useMemo(() => equationStates.map((eq) => detectParams(eq.expr)), [equationStates]);

  // Compile each equation
  const compiledArray = useMemo(() => {
  return equationStates.map((eq, idx) => {
    try {
      return math.compile(eq.expr);
    } catch (e) {
      setError(`Equation ${idx + 1}: ${e.message}`);
      return null;
    }
  });
}, [equationStates]);


  // Evaluate y data for each equation
  const { xData, yDataArray } = useMemo(() => {
    const xs = linspace(xMinState, xMaxState, nSamples);
    const yArrays = compiledArray.map((compiled, idx) => {
      const ys = [];
      if (!compiled) return xs.map(() => null);
      const params = equationStates[idx].paramValues;
      for (const x of xs) {
        try {
          const val = compiled.evaluate({ x, ...params });
          if (typeof val !== 'number' || !isFinite(val)) ys.push(null);
          else ys.push(val);
        } catch {
          ys.push(null);
        }
      }
      return ys;
    });
    return { xData: xs, yDataArray: yArrays };
  }, [compiledArray, equationStates, xMinState, xMaxState, nSamples]);

  // Find roots for each equation
  const findRoots = useCallback(
    (yData) => {
      const roots = [];
      for (let i = 0; i < xData.length - 1; i++) {
        const y1 = yData[i];
        const y2 = yData[i + 1];
        if (y1 == null || y2 == null) continue;
        if (y1 === 0) roots.push(xData[i]);
        if (y1 * y2 < 0) {
          const xRoot = xData[i] - (y1 * (xData[i + 1] - xData[i])) / (y2 - y1);
          roots.push(xRoot);
        }
      }
      return roots;
    },
    [xData]
  );

  // Compute derivatives for tangents
  const derivativeArray = useMemo(() => {
    return equationStates.map((eq) => {
      try {
        return math.derivative(eq.expr, 'x');
      } catch {
        return null;
      }
    });
  }, [equationStates]);

  // slope at tangentX for first equation
  const slopeAt = useCallback(
    (x) => {
      const derivativeNode = derivativeArray[0];
      const params = equationStates[0].paramValues;
      if (derivativeNode) {
        try {
          const val = derivativeNode.evaluate({ x, ...params });
          if (typeof val === 'number' && isFinite(val)) return val;
        } catch {}
      }
      const h = (xMaxState - xMinState) / 1000 || 1e-3;
      const y1 = compiledArray[0]?.evaluate({ x: x + h, ...params });
      const y0 = compiledArray[0]?.evaluate({ x: x - h, ...params });
      if (y1 == null || y0 == null) return null;
      return (y1 - y0) / (2 * h);
    },
    [derivativeArray, compiledArray, equationStates, xMinState, xMaxState]
  );

  const tangentLine = useMemo(() => {
    if (!showTangent) return null;
    const m = slopeAt(tangentX);
    const y0 = compiledArray[0]?.evaluate({ x: tangentX, ...equationStates[0].paramValues });
    if (m == null || y0 == null) return null;
    const xs = [xMinState, xMaxState];
    const ys = xs.map((xx) => m * (xx - tangentX) + y0);
    return { xs, ys };
  }, [showTangent, slopeAt, tangentX, compiledArray, equationStates, xMinState, xMaxState]);

  // Build Plotly data
  const plotData = [];
  yDataArray.forEach((yData, idx) => {
    plotData.push({
      x: xData,
      y: yData,
      mode: 'lines',
      name: `f${idx + 1}(x)`,
      connectgaps: false,
      line: { width: 2 },
    });

    if (showRoots) {
      const roots = findRoots(yData);
      if (roots.length) {
        plotData.push({
          x: roots,
          y: roots.map((r) => compiledArray[idx]?.evaluate({ x: r, ...equationStates[idx].paramValues })),
          mode: 'markers',
          name: `Roots ${idx + 1}`,
          marker: { size: 8, symbol: 'x' },
        });
      }
    }

    // Quadratic vertex
    if (paramNamesArray[idx].includes('a') && paramNamesArray[idx].includes('b') && paramNamesArray[idx].includes('c')) {
      const a = equationStates[idx].paramValues.a ?? 1;
      const b = equationStates[idx].paramValues.b ?? 0;
      const c = equationStates[idx].paramValues.c ?? 0;
      const vertex = findVertex(a, b, c);
      if (vertex) {
        plotData.push({
          x: [vertex.x],
          y: [vertex.y],
          mode: 'markers+text',
          text: ['Vertex'],
          textposition: 'top center',
          name: `Vertex ${idx + 1}`,
          marker: { size: 10, symbol: 'diamond', color: 'orange' },
        });
      }
    }
  });

  if (tangentLine) {
    plotData.push({
      x: tangentLine.xs,
      y: tangentLine.ys,
      mode: 'lines',
      name: 'Tangent',
      line: { dash: 'dashdot' },
    });
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h3>Interactive 2D Grapher</h3>

      {equationStates.map((eqState, idx) => (
        <div key={idx} style={{ marginBottom: 16 }}>
          <label>Equation {idx + 1}: </label>
          <input
            style={{ width: '60%' }}
            value={eqState.expr}
            onChange={(e) => {
              const newStates = [...equationStates];
              newStates[idx].expr = e.target.value;
              setEquationStates(newStates);
            }}
          />

          {paramNamesArray[idx].length > 0 && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
              {paramNamesArray[idx].map((p) => (
                <div key={p} style={{ minWidth: 140 }}>
                  <label>{p}: </label>
                  <input
                    type="range"
                    min={-20}
                    max={20}
                    step={0.1}
                    value={eqState.paramValues[p] ?? 1}
                    onChange={(e) => {
                      const newStates = [...equationStates];
                      newStates[idx].paramValues[p] = Number(e.target.value);
                      setEquationStates(newStates);
                    }}
                  />
                  <div>{(eqState.paramValues[p] ?? 1).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <div>
          <label>Domain: </label>
          <input
            value={xMinState}
            onChange={(e) => setXMinState(Number(e.target.value))}
            style={{ width: 70 }}
          />
          <span> to </span>
          <input
            value={xMaxState}
            onChange={(e) => setXMaxState(Number(e.target.value))}
            style={{ width: 70 }}
          />
        </div>

        <div>
          <label>Samples: </label>
          <input
            value={nSamples}
            onChange={(e) => setNSamples(Number(e.target.value))}
            style={{ width: 70 }}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={showRoots}
              onChange={(e) => setShowRoots(e.target.checked)}
            />{' '}
            Show Roots
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={showTangent}
              onChange={(e) => setShowTangent(e.target.checked)}
            />{' '}
            Show Tangent
          </label>
          {showTangent && (
            <>
              <span> x0: </span>
              <input
                style={{ width: 70 }}
                value={tangentX}
                onChange={(e) => setTangentX(Number(e.target.value))}
              />
            </>
          )}
        </div>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <Plot
        data={plotData}
        layout={{
          width: 800,
          height: 450,
          title: 'Graph Engine',
          xaxis: { title: 'x', showgrid: showGrid },
          yaxis: { title: 'y', showgrid: showGrid },
          showlegend: showLegend,
        }}
        useResizeHandler
        style={{ width: '100%', height: '450px' }}
      />
    </div>
  );
}
