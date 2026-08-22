const riskFiles = [
  ["src/auth/service.ts", "91%"],
  ["src/payment/controller.ts", "84%"],
  ["src/user/repository.ts", "67%"],
  ["src/api/client.ts", "43%"],
];

export default function ProductPreview() {
  return (
    <section className="preview-section">
      <div className="container">
        <div className="dashboard-preview">
          <div className="preview-header">
            <div className="window-controls">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <p>Repository Intelligence</p>
          </div>

          <div className="metrics">
            <Metric title="Code Quality" value="86%" />
            <Metric title="Security" value="92%" />
            <Metric title="Bug Risk" value="18%" />
            <Metric title="Technical Debt" value="Low" />
          </div>

          <div className="preview-content">
            <div className="preview-panel">
              <h3>Highest Risk Files</h3>

              <div className="risk-list">
                {riskFiles.map(([file, risk]) => (
                  <div className="risk-item" key={file}>
                    <span>{file}</span>
                    <strong>{risk}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="preview-panel">
              <h3>Repository Health</h3>

              <div className="chart">
                {[45, 52, 48, 61, 57, 70, 68, 76, 82, 79, 88, 94].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                    ></div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="metric">
      <p>{title}</p>
      <strong>{value}</strong>
    </div>
  );
}
