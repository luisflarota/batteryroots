// src/data/dummy-data.js
export const commodities = ['Lithium', 'Cobalt', 'Nickel'];

export const SUPPLY_CHAIN_STEPS = ['Mining', 'Processing', 'Cathode', 'EV'];

export const supplyChainData = {
  Lithium: {
    nodes: [
      { id: 'Mining', name: 'Mining', type: 'source' },
      { id: 'Processing', name: 'Processing', type: 'process' },
      { id: 'Cathode', name: 'Cathode', type: 'process' },
      { id: 'EV', name: 'EV', type: 'target' }
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
      Cathode: [
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
      EV: [
        { 
          country: 'USA',
          coordinates: [-95.7129, 37.0902],
          company: 'US EV',
          site: 'National Network'
        },
        {
          country: 'DEU',
          coordinates: [10.4515, 51.1657],
          company: 'EU EV',
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
          { source: "Processing", sourceCountry: "CHN", target: "Cathode", targetCountry: "USA", value: 1800 },
          { source: "Processing", sourceCountry: "CHN", target: "Cathode", targetCountry: "DEU", value: 1500 },
          { source: "Cathode", sourceCountry: "USA", target: "EV", targetCountry: "USA", value: 1600 },
          { source: "Cathode", sourceCountry: "DEU", target: "EV", targetCountry: "DEU", value: 1400 }
        ]
      },
      2021: {
        links: [
          { source: "Mining", sourceCountry: "AUS", target: "Processing", targetCountry: "CHN", value: 1800 },
          { source: "Mining", sourceCountry: "CHL", target: "Processing", targetCountry: "USA", value: 1200 },
          { source: "Processing", sourceCountry: "CHN", target: "Cathode", targetCountry: "USA", value: 1600 },
          { source: "Processing", sourceCountry: "USA", target: "Cathode", targetCountry: "DEU", value: 1000 },
          { source: "Cathode", sourceCountry: "USA", target: "EV", targetCountry: "USA", value: 1400 },
          { source: "Cathode", sourceCountry: "DEU", target: "EV", targetCountry: "DEU", value: 1200 }
        ]
      },
      2022: {
        links: [
          { source: "Mining", sourceCountry: "AUS", target: "Processing", targetCountry: "USA", value: 2000 },
          { source: "Mining", sourceCountry: "CHL", target: "Processing", targetCountry: "CHN", value: 1800 },
          { source: "Processing", sourceCountry: "USA", target: "Cathode", targetCountry: "USA", value: 1900 },
          { source: "Processing", sourceCountry: "CHN", target: "Cathode", targetCountry: "DEU", value: 1700 },
          { source: "Cathode", sourceCountry: "USA", target: "EV", targetCountry: "USA", value: 1800 },
          { source: "Cathode", sourceCountry: "DEU", target: "EV", targetCountry: "DEU", value: 1600 }
        ]
      },
      2023: {
        links: [
          { source: "Mining", sourceCountry: "AUS", target: "Processing", targetCountry: "USA", value: 2200 },
          { source: "Mining", sourceCountry: "CHL", target: "Processing", targetCountry: "USA", value: 2000 },
          { source: "Processing", sourceCountry: "USA", target: "Cathode", targetCountry: "USA", value: 2100 },
          { source: "Processing", sourceCountry: "USA", target: "Cathode", targetCountry: "DEU", value: 1900 },
          { source: "Cathode", sourceCountry: "USA", target: "EV", targetCountry: "USA", value: 2000 },
          { source: "Cathode", sourceCountry: "DEU", target: "EV", targetCountry: "DEU", value: 1800 }
        ]
      },
      2024: {
        links: [
          { source: "Mining", sourceCountry: "AUS", target: "Processing", targetCountry: "USA", value: 2500 },
          { source: "Mining", sourceCountry: "CHL", target: "Processing", targetCountry: "USA", value: 2300 },
          { source: "Processing", sourceCountry: "USA", target: "Cathode", targetCountry: "USA", value: 2400 },
          { source: "Processing", sourceCountry: "USA", target: "Cathode", targetCountry: "DEU", value: 2200 },
          { source: "Cathode", sourceCountry: "USA", target: "EV", targetCountry: "USA", value: 2300 },
          { source: "Cathode", sourceCountry: "DEU", target: "EV", targetCountry: "DEU", value: 2100 }
        ]
      }
    }
  },
  Cobalt: {
    nodes: [
      { id: 'Mining', name: 'Mining', type: 'source' },
      { id: 'Processing', name: 'Processing', type: 'process' },
      { id: 'Cathode', name: 'Cathode', type: 'process' },
      { id: 'EV', name: 'EV', type: 'target' }
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
      Cathode: [
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
      EV: [
        { 
          country: 'JPN',
          coordinates: [138.2529, 36.2048],
          company: 'Asian EV',
          site: 'Regional Network'
        },
        {
          country: 'DEU',
          coordinates: [10.4515, 51.1657],
          company: 'EU EV',
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
          { source: "Processing", sourceCountry: "CHN", target: "Cathode", targetCountry: "JPN", value: 1500 },
          { source: "Processing", sourceCountry: "CHN", target: "Cathode", targetCountry: "KOR", value: 1300 },
          { source: "Cathode", sourceCountry: "JPN", target: "EV", targetCountry: "JPN", value: 1400 },
          { source: "Cathode", sourceCountry: "KOR", target: "EV", targetCountry: "DEU", value: 1200 }
        ]
      },
      2021: {
        links: [
          { source: "Mining", sourceCountry: "COD", target: "Processing", targetCountry: "FIN", value: 1800 },
          { source: "Mining", sourceCountry: "ZMB", target: "Processing", targetCountry: "CHN", value: 1500 },
          { source: "Processing", sourceCountry: "FIN", target: "Cathode", targetCountry: "JPN", value: 1700 },
          { source: "Processing", sourceCountry: "CHN", target: "Cathode", targetCountry: "KOR", value: 1400 },
          { source: "Cathode", sourceCountry: "JPN", target: "EV", targetCountry: "JPN", value: 1600 },
          { source: "Cathode", sourceCountry: "KOR", target: "EV", targetCountry: "DEU", value: 1300 }
        ]
      },
      2022: {
        links: [
          { source: "Mining", sourceCountry: "COD", target: "Processing", targetCountry: "FIN", value: 2000 },
          { source: "Mining", sourceCountry: "ZMB", target: "Processing", targetCountry: "FIN", value: 1700 },
          { source: "Processing", sourceCountry: "FIN", target: "Cathode", targetCountry: "KOR", value: 1900 },
          { source: "Processing", sourceCountry: "FIN", target: "Cathode", targetCountry: "JPN", value: 1600 },
          { source: "Cathode", sourceCountry: "KOR", target: "EV", targetCountry: "DEU", value: 1800 },
          { source: "Cathode", sourceCountry: "JPN", target: "EV", targetCountry: "JPN", value: 1500 }
        ]
      },
      2023: {
        links: [
          { source: "Mining", sourceCountry: "COD", target: "Processing", targetCountry: "FIN", value: 2200 },
          { source: "Mining", sourceCountry: "ZMB", target: "Processing", targetCountry: "FIN", value: 1900 },
          { source: "Processing", sourceCountry: "FIN", target: "Cathode", targetCountry: "KOR", value: 2100 },
          { source: "Processing", sourceCountry: "FIN", target: "Cathode", targetCountry: "JPN", value: 1800 },
          { source: "Cathode", sourceCountry: "KOR", target: "EV", targetCountry: "DEU", value: 2000 },
          { source: "Cathode", sourceCountry: "JPN", target: "EV", targetCountry: "JPN", value: 1700 }
        ]
      },
      2024: {
        links: [
          { source: "Mining", sourceCountry: "COD", target: "Processing", targetCountry: "FIN", value: 2400 },
          { source: "Mining", sourceCountry: "ZMB", target: "Processing", targetCountry: "FIN", value: 2100 },
          { source: "Processing", sourceCountry: "FIN", target: "Cathode", targetCountry: "KOR", value: 2300 },
          { source: "Processing", sourceCountry: "FIN", target: "Cathode", targetCountry: "JPN", value: 2000 },
          { source: "Cathode", sourceCountry: "KOR", target: "EV", targetCountry: "DEU", value: 2200 },
          { source: "Cathode", sourceCountry: "JPN", target: "EV", targetCountry: "JPN", value: 1900 }
        ]
      }
    }
  },
  Nickel: {
    nodes: [
      { id: 'Mining', name: 'Mining', type: 'source' },
      { id: 'Processing', name: 'Processing', type: 'process' },
      { id: 'Cathode', name: 'Cathode', type: 'process' },
      { id: 'EV', name: 'EV', type: 'target' }
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
      Cathode: [
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
      EV: [
        { 
          country: 'KOR',
          coordinates: [127.7669, 35.9078],
          company: 'Asian EV',
          site: 'Regional Network'
        },
        {
          country: 'USA',
          coordinates: [-95.7129, 37.0902],
          company: 'US EV',
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
          { source: "Processing", sourceCountry: "CHN", target: "Cathode", targetCountry: "CHN", value: 1600 },
          { source: "Processing", sourceCountry: "JPN", target: "Cathode", targetCountry: "KOR", value: 1400 },
          { source: "Cathode", sourceCountry: "CHN", target: "EV", targetCountry: "USA", value: 1500 },
          { source: "Cathode", sourceCountry: "KOR", target: "EV", targetCountry: "KOR", value: 1300 }
        ]
      },
      2021: {
        links: [
          { source: "Mining", sourceCountry: "IDN", target: "Processing", targetCountry: "CHN", value: 1900 },
          { source: "Mining", sourceCountry: "PHL", target: "Processing", targetCountry: "JPN", value: 1600 },
          { source: "Processing", sourceCountry: "CHN", target: "Cathode", targetCountry: "CHN", value: 1800 },
          { source: "Processing", sourceCountry: "JPN", target: "Cathode", targetCountry: "KOR", value: 1500 },
          { source: "Cathode", sourceCountry: "CHN", target: "EV", targetCountry: "USA", value: 1700 },
          { source: "Cathode", sourceCountry: "KOR", target: "EV", targetCountry: "KOR", value: 1400 }
        ]
      },
      2022: {
        links: [
          { source: "Mining", sourceCountry: "IDN", target: "Processing", targetCountry: "JPN", value: 2100 },
          { source: "Mining", sourceCountry: "PHL", target: "Processing", targetCountry: "JPN", value: 1800 },
          { source: "Processing", sourceCountry: "JPN", target: "Cathode", targetCountry: "KOR", value: 2000 },
          { source: "Processing", sourceCountry: "JPN", target: "Cathode", targetCountry: "CHN", value: 1700 },
          { source: "Cathode", sourceCountry: "KOR", target: "EV", targetCountry: "KOR", value: 1900 },
          { source: "Cathode", sourceCountry: "CHN", target: "EV", targetCountry: "USA", value: 1600 }
        ]
      },
      2023: {
        links: [
          { source: "Mining", sourceCountry: "IDN", target: "Processing", targetCountry: "JPN", value: 2300 },
          { source: "Mining", sourceCountry: "PHL", target: "Processing", targetCountry: "JPN", value: 2000 },
          { source: "Processing", sourceCountry: "JPN", target: "Cathode", targetCountry: "KOR", value: 2200 },
          { source: "Processing", sourceCountry: "JPN", target: "Cathode", targetCountry: "CHN", value: 1900 },
          { source: "Cathode", sourceCountry: "KOR", target: "EV", targetCountry: "KOR", value: 2100 },
          { source: "Cathode", sourceCountry: "CHN", target: "EV", targetCountry: "USA", value: 1800 }
        ]
      },
      2024: {
        links: [
          { source: "Mining", sourceCountry: "IDN", target: "Processing", targetCountry: "JPN", value: 2500 },
          { source: "Mining", sourceCountry: "PHL", target: "Processing", targetCountry: "JPN", value: 2200 },
          { source: "Processing", sourceCountry: "JPN", target: "Cathode", targetCountry: "KOR", value: 2400 },
          { source: "Processing", sourceCountry: "JPN", target: "Cathode", targetCountry: "CHN", value: 2100 },
          { source: "Cathode", sourceCountry: "KOR", target: "EV", targetCountry: "KOR", value: 2300 },
          { source: "Cathode", sourceCountry: "CHN", target: "EV", targetCountry: "USA", value: 2000 }
        ]
      }
    }
  }
};