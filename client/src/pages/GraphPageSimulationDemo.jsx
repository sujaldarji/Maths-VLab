// src/pages/GraphPage.jsx
import React, { useState, useEffect } from "react";
import GraphEngine from "../components/GraphEngine";
const exercises = [
  {
    title: "Linear Equation: y = mx + c",
    description: "Explore how slope (m) and intercept (c) change the line.",
    config: {
      equation: "m*x + c",
      initialParams: { m: 1, c: 0 },
      domain: [-10, 10],
      samples: 400,
    },
  },
  {
    title: "Quadratic Equation: y = ax^2 + bx + c",
    description: "Adjust coefficients to see roots and vertex of a parabola.",
    config: {
      equation: "a*x^2 + b*x + c",
      initialParams: { a: 1, b: 0, c: 0 },
      domain: [-10, 10],
      samples: 400,
    },
  },
  {
    title: "Cubic Equation: y = ax^3 + bx^2 + cx + d",
    description: "See how cubic curves behave with different coefficients.",
    config: {
      equation: "a*x^3 + b*x^2 + c*x + d",
      initialParams: { a: 1, b: 0, c: 0, d: 0 },
      domain: [-5, 5],
      samples: 400,
    },
  },
  {
    title: "Sine Wave: y = A*sin(Bx)",
    description: "Change amplitude (A) and frequency (B) to explore wave behavior.",
    config: {
      equation: "A*sin(B*x)",
      initialParams: { A: 1, B: 1 },
      domain: [-10, 10],
      samples: 600,
    },
  },
  {
    title: "Cosine Wave: y = A*cos(Bx)",
    description: "Modify amplitude and frequency to see cosine wave effects.",
    config: {
      equation: "A*cos(B*x)",
      initialParams: { A: 1, B: 1 },
      domain: [-10, 10],
      samples: 600,
    },
  },
  {
    title: "Exponential Function: y = A*e^(Bx)",
    description: "Visualize exponential growth and decay.",
    config: {
      equation: "A*exp(B*x)",
      initialParams: { A: 1, B: 0.5 },
      domain: [-5, 5],
      samples: 400,
    },
  },
  {
    title: "Logarithmic Function: y = A*log(B*x)",
    description: "Explore the shape of logarithmic curves (x > 0).",
    config: {
      equation: "A*log(B*x)",
      initialParams: { A: 1, B: 1 },
      domain: [0.1, 10],
      samples: 400,
    },
  },
  {
    title: "Tangent Line Demo: y = x^2",
    description: "Use the tangent line feature to explore slope at a point.",
    config: {
      equation: "x^2",
      initialParams: {},
      domain: [-5, 5],
      samples: 400,
    },
  },
];


export default function GraphPage() {
  const [graphConfig, setGraphConfig] = useState(exercises[0].config);

  // Wrap single equation into array for new GraphEngine
  const equations = [
    {
      expr: graphConfig.equation,
      initialParams: graphConfig.initialParams,
    },
  ];

  useEffect(() => {
    console.log("Exercises loaded:", exercises.length);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Graph Engine (Tutorial)</h1>

      <section style={{ marginBottom: 20 }}>
        <h2>📘 Try These Exercises</h2>

        {exercises.length === 0 && (
          <div style={{ color: "red" }}>No exercises found</div>
        )}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {exercises.map((ex, idx) => (
            <li
              key={`${ex.title}-${idx}`}
              style={{
                marginBottom: 12,
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div>
                <strong>{ex.title}</strong>
                <div style={{ marginTop: 6 }}>{ex.description}</div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setGraphConfig(ex.config)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  Load Exercise
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <GraphEngine
        equations={equations}
        domain={graphConfig.domain}
        samples={graphConfig.samples}
        showGrid={true}
        showLegend={true}
      />
    </div>
  );
}
