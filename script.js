document.getElementById("fireForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const salary = parseFloat(document.getElementById("salary").value);
  const bonus = parseFloat(document.getElementById("bonus").value);
  const expenses = parseFloat(document.getElementById("expenses").value);
  const monthlySavings = parseFloat(document.getElementById("monthlySavings").value);
  const returnRate = parseFloat(document.getElementById("returnRate").value) / 100;

  if ([salary, bonus, expenses, monthlySavings, returnRate].some(isNaN)) {
    alert("Please fill out all fields correctly.");
    return;
  }

  // Calculate FIRE values every 5 years
  let savings = 0;
  const data = [];
  const labels = [];
  const milestones = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  for (let year = 1; year <= 50; year++) {
    savings += bonus; // Add yearly bonus
    savings += monthlySavings * 12; // Add yearly savings
    savings *= (1 + returnRate); // Apply compound growth

    if (milestones.includes(year)) {
      labels.push(`Year ${year}`);
      data.push(Math.round(savings));
    }
  }

  // Show summary
  document.getElementById("summary").innerText =
    "Projected FIRE savings at each 5-year milestone:";

  // Destroy previous chart if exists
  const ctx = document.getElementById("fireChart").getContext("2d");
  if (window.fireChartInstance) {
    window.fireChartInstance.destroy();
  }

  // Draw new chart with Indian formatting
  window.fireChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Estimated FIRE Savings (₹)",
        data: data,
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              return '₹' + value.toLocaleString('en-IN');
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return '₹' + value.toLocaleString('en-IN');
            }
          }
        }
      }
    }
  });
});
