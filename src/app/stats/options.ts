export const optionsHorizontal = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
    },
    scales: {
      x: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
        },
        title: {
          display: true,
          color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
        }
      },
      y: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
        },
        title: {
          display: true,
          color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
        }
      }
    }
  };
  

export const optionsR = {
  indexAxis: 'x',
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color') 
    }
  },
  scales: {
    x: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color') 
      }
    },
    y: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color') 
      }
    }
  }
}
}; 

export const optionsV = {
  indexAxis: 'x',
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
      }
    },
  },
  scales: {
    x: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
      },
      title: {
        display: true,
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
      }
    },
    y: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
      },
      title: {
        display: true,
        text: 'Cantidad',
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
      }
    }
  }
};

export const optionsVmb = {
  indexAxis: 'x',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color'),
        boxWidth: 12,
        font: {
          size: 0
        }
      }
    },
    tooltip: {
      enabled: true,
      bodyFont: {
        size: 10
      },
      titleFont: {
        size: 11
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color'),
        maxRotation: 45,
        minRotation: 30,
        font: {
          size: 10
        }
      },
      title: {
        display: false // menos ruido visual
      },
      grid: {
        display: false // oculta líneas de fondo
      }
    },
    y: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color'),
        font: {
          size: 10
        }
      },
      title: {
        display: true,
        text: 'Cantidad',
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color'),
        font: {
          size: 11
        }
      },
      grid: {
        display: false
      }
    }
  }
};