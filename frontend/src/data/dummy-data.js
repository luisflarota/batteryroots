// src/data/dummy-data.js
export const commodities = ['Lithium', 'Cobalt', 'Nickel'];

export const SUPPLY_CHAIN_STEPS = ['Mining', 'Processing', 'Manufacturing', 'Distribution'];

export const supplyChainData = {
  Lithium: {
    nodes: [
      { id: 'Mining', name: 'Mining', type: 'source' },
      { id: 'Processing', name: 'Processing', type: 'process' },
      { id: 'Manufacturing', name: 'Manufacturing', type: 'process' },
      { id: 'Distribution', name: 'Distribution', type: 'target' }
    ],
    locations: {
      Mining: [
        { 
          country: 'AUS',
          coordinates: [133.7751, -25.2744],
          company: 'Pilbara Minerals',
          site: 'Pilgangoora Operation'
        },
        { 
          country: 'CHL',
          coordinates: [-71.5430, -35.6751],
          company: 'SQM',
          site: 'Salar de Atacama'
        }
      ],
      Processing: [
        { 
          country: 'CHN',
          coordinates: [104.1954, 35.8617],
          company: 'Ganfeng Lithium',
          site: 'Xinyu Processing Facility'
        },
        {
          country: 'USA',
          coordinates: [-95.7129, 37.0902],
          company: 'Albemarle',
          site: 'Silver Peak'
        }
      ],
      Manufacturing: [
        { 
          country: 'USA',
          coordinates: [-95.7129, 37.0902],
          company: 'Tesla',
          site: 'Gigafactory Nevada'
        },
        { 
          country: 'DEU',
          coordinates: [10.4515, 51.1657],
          company: 'BASF',
          site: 'Schwarzheide Plant'
        }
      ],
      Distribution: [
        { 
          country: 'USA',
          coordinates: [-95.7129, 37.0902],
          company: 'US Distribution',
          site: 'National Network'
        },
        {
          country: 'DEU',
          coordinates: [10.4515, 51.1657],
          company: 'EU Distribution',
          site: 'European Network'
        }
      ]
    },
    years: [2020, 2021, 2022, 2023, 2024],
    dataByYear: {
      2020: {
        links: [
          { source: "Mining", sourceCountry: "AUS", target: "Processing", targetCountry: "CHN", value: 1500 },
          { source: "Mining", sourceCountry: "CHL", target: "Processing", targetCountry: "CHN", value: 2000 },
          { source: "Processing", sourceCountry: "CHN", target: "Manufacturing", targetCountry: "USA", value: 1800 },
          { source: "Processing", sourceCountry: "CHN", target: "Manufacturing", targetCountry: "DEU", value: 1500 },
          { source: "Manufacturing", sourceCountry: "USA", target: "Distribution", targetCountry: "USA", value: 1600 },
          { source: "Manufacturing", sourceCountry: "DEU", target: "Distribution", targetCountry: "DEU", value: 1400 }
        ]
      },
      2021: {
        links: [
          { source: "Mining", sourceCountry: "AUS", target: "Processing", targetCountry: "CHN", value: 1800 },
          { source: "Mining", sourceCountry: "CHL", target: "Processing", targetCountry: "USA", value: 1200 },
          { source: "Processing", sourceCountry: "CHN", target: "Manufacturing", targetCountry: "USA", value: 1600 },
          { source: "Processing", sourceCountry: "USA", target: "Manufacturing", targetCountry: "DEU", value: 1000 },
          { source: "Manufacturing", sourceCountry: "USA", target: "Distribution", targetCountry: "USA", value: 1400 },
          { source: "Manufacturing", sourceCountry: "DEU", target: "Distribution", targetCountry: "DEU", value: 1200 }
        ]
      },
      2022: {
        links: [
          { source: "Mining", sourceCountry: "AUS", target: "Processing", targetCountry: "USA", value: 2000 },
          { source: "Mining", sourceCountry: "CHL", target: "Processing", targetCountry: "CHN", value: 1800 },
          { source: "Processing", sourceCountry: "USA", target: "Manufacturing", targetCountry: "USA", value: 1900 },
          { source: "Processing", sourceCountry: "CHN", target: "Manufacturing", targetCountry: "DEU", value: 1700 },
          { source: "Manufacturing", sourceCountry: "USA", target: "Distribution", targetCountry: "USA", value: 1800 },
          { source: "Manufacturing", sourceCountry: "DEU", target: "Distribution", targetCountry: "DEU", value: 1600 }
        ]
      },
      2023: {
        links: [
          { source: "Mining", sourceCountry: "AUS", target: "Processing", targetCountry: "USA", value: 2200 },
          { source: "Mining", sourceCountry: "CHL", target: "Processing", targetCountry: "USA", value: 2000 },
          { source: "Processing", sourceCountry: "USA", target: "Manufacturing", targetCountry: "USA", value: 2100 },
          { source: "Processing", sourceCountry: "USA", target: "Manufacturing", targetCountry: "DEU", value: 1900 },
          { source: "Manufacturing", sourceCountry: "USA", target: "Distribution", targetCountry: "USA", value: 2000 },
          { source: "Manufacturing", sourceCountry: "DEU", target: "Distribution", targetCountry: "DEU", value: 1800 }
        ]
      },
      2024: {
        links: [
          { source: "Mining", sourceCountry: "AUS", target: "Processing", targetCountry: "USA", value: 2500 },
          { source: "Mining", sourceCountry: "CHL", target: "Processing", targetCountry: "USA", value: 2300 },
          { source: "Processing", sourceCountry: "USA", target: "Manufacturing", targetCountry: "USA", value: 2400 },
          { source: "Processing", sourceCountry: "USA", target: "Manufacturing", targetCountry: "DEU", value: 2200 },
          { source: "Manufacturing", sourceCountry: "USA", target: "Distribution", targetCountry: "USA", value: 2300 },
          { source: "Manufacturing", sourceCountry: "DEU", target: "Distribution", targetCountry: "DEU", value: 2100 }
        ]
      }
    }
  },
  Cobalt: {
    nodes: [
      { id: 'Mining', name: 'Mining', type: 'source' },
      { id: 'Processing', name: 'Processing', type: 'process' },
      { id: 'Manufacturing', name: 'Manufacturing', type: 'process' },
      { id: 'Distribution', name: 'Distribution', type: 'target' }
    ],
    locations: {
      Mining: [
        { 
          country: 'COD',
          coordinates: [21.7587, -4.0383],
          company: 'Glencore',
          site: 'Mutanda Mining'
        },
        {
          country: 'ZMB',
          coordinates: [27.8493, -13.1339],
          company: 'ZCCM',
          site: 'Chambishi Mine'
        }
      ],
      Processing: [
        { 
          country: 'CHN',
          coordinates: [104.1954, 35.8617],
          company: 'Huayou Cobalt',
          site: 'Tongxiang Facility'
        },
        {
          country: 'FIN',
          coordinates: [25.7482, 61.9241],
          company: 'Umicore',
          site: 'Kokkola Plant'
        }
      ],
      Manufacturing: [
        { 
          country: 'JPN',
          coordinates: [138.2529, 36.2048],
          company: 'Panasonic',
          site: 'Kasai Plant'
        },
        {
          country: 'KOR',
          coordinates: [127.7669, 35.9078],
          company: 'Samsung SDI',
          site: 'Ulsan Plant'
        }
      ],
      Distribution: [
        { 
          country: 'JPN',
          coordinates: [138.2529, 36.2048],
          company: 'Asian Distribution',
          site: 'Regional Network'
        },
        {
          country: 'DEU',
          coordinates: [10.4515, 51.1657],
          company: 'EU Distribution',
          site: 'European Network'
        }
      ]
    },
    years: [2020, 2021, 2022, 2023, 2024],
    dataByYear: {
      2020: {
        links: [
          { source: "Mining", sourceCountry: "COD", target: "Processing", targetCountry: "CHN", value: 1600 },
          { source: "Mining", sourceCountry: "ZMB", target: "Processing", targetCountry: "CHN", value: 1400 },
          { source: "Processing", sourceCountry: "CHN", target: "Manufacturing", targetCountry: "JPN", value: 1500 },
          { source: "Processing", sourceCountry: "CHN", target: "Manufacturing", targetCountry: "KOR", value: 1300 },
          { source: "Manufacturing", sourceCountry: "JPN", target: "Distribution", targetCountry: "JPN", value: 1400 },
          { source: "Manufacturing", sourceCountry: "KOR", target: "Distribution", targetCountry: "DEU", value: 1200 }
        ]
      },
      2021: {
        links: [
          { source: "Mining", sourceCountry: "COD", target: "Processing", targetCountry: "FIN", value: 1800 },
          { source: "Mining", sourceCountry: "ZMB", target: "Processing", targetCountry: "CHN", value: 1500 },
          { source: "Processing", sourceCountry: "FIN", target: "Manufacturing", targetCountry: "JPN", value: 1700 },
          { source: "Processing", sourceCountry: "CHN", target: "Manufacturing", targetCountry: "KOR", value: 1400 },
          { source: "Manufacturing", sourceCountry: "JPN", target: "Distribution", targetCountry: "JPN", value: 1600 },
          { source: "Manufacturing", sourceCountry: "KOR", target: "Distribution", targetCountry: "DEU", value: 1300 }
        ]
      },
      2022: {
        links: [
          { source: "Mining", sourceCountry: "COD", target: "Processing", targetCountry: "FIN", value: 2000 },
          { source: "Mining", sourceCountry: "ZMB", target: "Processing", targetCountry: "FIN", value: 1700 },
          { source: "Processing", sourceCountry: "FIN", target: "Manufacturing", targetCountry: "KOR", value: 1900 },
          { source: "Processing", sourceCountry: "FIN", target: "Manufacturing", targetCountry: "JPN", value: 1600 },
          { source: "Manufacturing", sourceCountry: "KOR", target: "Distribution", targetCountry: "DEU", value: 1800 },
          { source: "Manufacturing", sourceCountry: "JPN", target: "Distribution", targetCountry: "JPN", value: 1500 }
        ]
      },
      2023: {
        links: [
          { source: "Mining", sourceCountry: "COD", target: "Processing", targetCountry: "FIN", value: 2200 },
          { source: "Mining", sourceCountry: "ZMB", target: "Processing", targetCountry: "FIN", value: 1900 },
          { source: "Processing", sourceCountry: "FIN", target: "Manufacturing", targetCountry: "KOR", value: 2100 },
          { source: "Processing", sourceCountry: "FIN", target: "Manufacturing", targetCountry: "JPN", value: 1800 },
          { source: "Manufacturing", sourceCountry: "KOR", target: "Distribution", targetCountry: "DEU", value: 2000 },
          { source: "Manufacturing", sourceCountry: "JPN", target: "Distribution", targetCountry: "JPN", value: 1700 }
        ]
      },
      2024: {
        links: [
          { source: "Mining", sourceCountry: "COD", target: "Processing", targetCountry: "FIN", value: 2400 },
          { source: "Mining", sourceCountry: "ZMB", target: "Processing", targetCountry: "FIN", value: 2100 },
          { source: "Processing", sourceCountry: "FIN", target: "Manufacturing", targetCountry: "KOR", value: 2300 },
          { source: "Processing", sourceCountry: "FIN", target: "Manufacturing", targetCountry: "JPN", value: 2000 },
          { source: "Manufacturing", sourceCountry: "KOR", target: "Distribution", targetCountry: "DEU", value: 2200 },
          { source: "Manufacturing", sourceCountry: "JPN", target: "Distribution", targetCountry: "JPN", value: 1900 }
        ]
      }
    }
  },
  Nickel: {
    nodes: [
      { id: 'Mining', name: 'Mining', type: 'source' },
      { id: 'Processing', name: 'Processing', type: 'process' },
      { id: 'Manufacturing', name: 'Manufacturing', type: 'process' },
      { id: 'Distribution', name: 'Distribution', type: 'target' }
    ],
    locations: {
      Mining: [
        { 
          country: 'IDN',
          coordinates: [113.9213, -0.7893],
          company: 'Vale Indonesia',
          site: 'Sorowako Mine'
        },
        {
          country: 'PHL',
          coordinates: [121.7740, 12.8797],
          company: 'Nickel Asia',
          site: 'Taganito Mine'
        }
      ],
      Processing: [
        { 
          country: 'CHN',
          coordinates: [104.1954, 35.8617],
          company: 'Tsingshan',
          site: 'Morowali Industrial Park'
        },
        {
          country: 'JPN',
          coordinates: [138.2529, 36.2048],
          company: 'Sumitomo Metal',
          site: 'Niihama Refinery'
        }
      ],
      Manufacturing: [
        { 
          country: 'KOR',
          coordinates: [127.7669, 35.9078],
          company: 'LG Chem',
          site: 'Ochang Plant'
        },
        {
          country: 'CHN',
          coordinates: [104.1954, 35.8617],
          company: 'CATL',
          site: 'Ningde Factory'
        }
      ],
      Distribution: [
        { 
          country: 'KOR',
          coordinates: [127.7669, 35.9078],
          company: 'Asian Distribution',
          site: 'Regional Network'
        },
        {
          country: 'USA',
          coordinates: [-95.7129, 37.0902],
          company: 'US Distribution',
          site: 'National Network'
        }
      ]
    },
    years: [2020, 2021, 2022, 2023, 2024],
    dataByYear: {
      2020: {
        links: [
          { source: "Mining", sourceCountry: "IDN", target: "Processing", targetCountry: "CHN", value: 1700 },
          { source: "Mining", sourceCountry: "PHL", target: "Processing", targetCountry: "JPN", value: 1500 },
          { source: "Processing", sourceCountry: "CHN", target: "Manufacturing", targetCountry: "CHN", value: 1600 },
          { source: "Processing", sourceCountry: "JPN", target: "Manufacturing", targetCountry: "KOR", value: 1400 },
          { source: "Manufacturing", sourceCountry: "CHN", target: "Distribution", targetCountry: "USA", value: 1500 },
          { source: "Manufacturing", sourceCountry: "KOR", target: "Distribution", targetCountry: "KOR", value: 1300 }
        ]
      },
      2021: {
        links: [
          { source: "Mining", sourceCountry: "IDN", target: "Processing", targetCountry: "CHN", value: 1900 },
          { source: "Mining", sourceCountry: "PHL", target: "Processing", targetCountry: "JPN", value: 1600 },
          { source: "Processing", sourceCountry: "CHN", target: "Manufacturing", targetCountry: "CHN", value: 1800 },
          { source: "Processing", sourceCountry: "JPN", target: "Manufacturing", targetCountry: "KOR", value: 1500 },
          { source: "Manufacturing", sourceCountry: "CHN", target: "Distribution", targetCountry: "USA", value: 1700 },
          { source: "Manufacturing", sourceCountry: "KOR", target: "Distribution", targetCountry: "KOR", value: 1400 }
        ]
      },
      2022: {
        links: [
          { source: "Mining", sourceCountry: "IDN", target: "Processing", targetCountry: "JPN", value: 2100 },
          { source: "Mining", sourceCountry: "PHL", target: "Processing", targetCountry: "JPN", value: 1800 },
          { source: "Processing", sourceCountry: "JPN", target: "Manufacturing", targetCountry: "KOR", value: 2000 },
          { source: "Processing", sourceCountry: "JPN", target: "Manufacturing", targetCountry: "CHN", value: 1700 },
          { source: "Manufacturing", sourceCountry: "KOR", target: "Distribution", targetCountry: "KOR", value: 1900 },
          { source: "Manufacturing", sourceCountry: "CHN", target: "Distribution", targetCountry: "USA", value: 1600 }
        ]
      },
      2023: {
        links: [
          { source: "Mining", sourceCountry: "IDN", target: "Processing", targetCountry: "JPN", value: 2300 },
          { source: "Mining", sourceCountry: "PHL", target: "Processing", targetCountry: "JPN", value: 2000 },
          { source: "Processing", sourceCountry: "JPN", target: "Manufacturing", targetCountry: "KOR", value: 2200 },
          { source: "Processing", sourceCountry: "JPN", target: "Manufacturing", targetCountry: "CHN", value: 1900 },
          { source: "Manufacturing", sourceCountry: "KOR", target: "Distribution", targetCountry: "KOR", value: 2100 },
          { source: "Manufacturing", sourceCountry: "CHN", target: "Distribution", targetCountry: "USA", value: 1800 }
        ]
      },
      2024: {
        links: [
          { source: "Mining", sourceCountry: "IDN", target: "Processing", targetCountry: "JPN", value: 2500 },
          { source: "Mining", sourceCountry: "PHL", target: "Processing", targetCountry: "JPN", value: 2200 },
          { source: "Processing", sourceCountry: "JPN", target: "Manufacturing", targetCountry: "KOR", value: 2400 },
          { source: "Processing", sourceCountry: "JPN", target: "Manufacturing", targetCountry: "CHN", value: 2100 },
          { source: "Manufacturing", sourceCountry: "KOR", target: "Distribution", targetCountry: "KOR", value: 2300 },
          { source: "Manufacturing", sourceCountry: "CHN", target: "Distribution", targetCountry: "USA", value: 2000 }
        ]
      }
    }
  }
};