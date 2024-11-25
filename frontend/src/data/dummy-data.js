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
    links: [
      { source: 'Mining', target: 'Processing', value: 100 },
      { source: 'Processing', target: 'Manufacturing', value: 80 },
      { source: 'Manufacturing', target: 'Distribution', value: 60 }
    ],
    locations: {
      Mining: [
        { 
          country: 'AUS', 
          value: 40, 
          coordinates: [133.7751, -25.2744],
          company: 'Pilbara Minerals',
          site: 'Pilgangoora Operation'
        },
        { 
          country: 'CHL', 
          value: 2000, 
          coordinates: [-71.5430, -35.6751],
          company: 'SQM',
          site: 'Salar de Atacama'
        }
      ],
      Processing: [
        { 
          country: 'CHN', 
          value: 80, 
          coordinates: [104.1954, 35.8617],
          company: 'Ganfeng Lithium',
          site: 'Xinyu Processing Facility'
        }
      ],
      Manufacturing: [
        { 
          country: 'USA', 
          value: 30, 
          coordinates: [-95.7129, 37.0902],
          company: 'Tesla',
          site: 'Gigafactory Nevada'
        },
        { 
          country: 'DEU', 
          value: 30, 
          coordinates: [10.4515, 51.1657],
          company: 'BASF',
          site: 'Schwarzheide Plant'
        }
      ],
      Distribution: [
        { 
          country: 'Global', 
          value: 60, 
          coordinates: [0, 0],
          company: 'Multiple Distributors',
          site: 'Global Distribution Network'
        }
      ]
    },
    years: [2020, 2021, 2022, 2023, 2024],
    dataByYear: {
      2020: {
        links: [
          { source: 'Mining', target: 'Processing', value: 100 },
          { source: 'Processing', target: 'Manufacturing', value: 80 },
          { source: 'Manufacturing', target: 'Distribution', value: 60 }
        ],
        locations: {
          Mining: [
            { country: 'AUS', value: 40 },
            { country: 'CHL', value: 10000 }
          ],
          Processing: [
            { country: 'CHN', value: 80 }
          ],
          Manufacturing: [
            { country: 'USA', value: 30 },
            { country: 'DEU', value: 30 }
          ],
          Distribution: [
            { country: 'Global', value: 60 }
          ]
        }
      },
      2021: {
        links: [
          { source: 'Mining', target: 'Processing', value: 90 },
          { source: 'Processing', target: 'Manufacturing', value: 70 },
          { source: 'Manufacturing', target: 'Distribution', value: 50 }
        ],
        locations: {
          Mining: [
            { country: 'AUS', value: 50 },
            { country: 'CHL', value: 10 }
          ],
          Processing: [
            { country: 'CHN', value: 90 }
          ],
          Manufacturing: [
            { country: 'USA', value: 40 },
            { country: 'DEU', value: 25 }
          ],
          Distribution: [
            { country: 'Global', value: 70 }
          ]
        }
      },
      2022: {
        links: [
          { source: 'Mining', target: 'Processing', value: 95 },
          { source: 'Processing', target: 'Manufacturing', value: 75 },
          { source: 'Manufacturing', target: 'Distribution', value: 55 }
        ],
        locations: {
          Mining: [
            { country: 'AUS', value: 60 },
            { country: 'CHL', value: 1900 }
          ],
          Processing: [
            { country: 'CHN', value: 85 }
          ],
          Manufacturing: [
            { country: 'USA', value: 35 },
            { country: 'DEU', value: 30 }
          ],
          Distribution: [
            { country: 'Global', value: 80 }
          ]
        }
      },
      2023: {
        links: [
          { source: 'Mining', target: 'Processing', value: 85 },
          { source: 'Processing', target: 'Manufacturing', value: 65 },
          { source: 'Manufacturing', target: 'Distribution', value: 50 }
        ],
        locations: {
          Mining: [
            { country: 'AUS', value: 70 },
            { country: 'CHL', value: 2000 }
          ],
          Processing: [
            { country: 'CHN', value: 80 }
          ],
          Manufacturing: [
            { country: 'USA', value: 45 },
            { country: 'DEU', value: 35 }
          ],
          Distribution: [
            { country: 'Global', value: 90 }
          ]
        }
      },
      2024: {
        links: [
          { source: 'Mining', target: 'Processing', value: 80 },
          { source: 'Processing', target: 'Manufacturing', value: 60 },
          { source: 'Manufacturing', target: 'Distribution', value: 40 }
        ],
        locations: {
          Mining: [
            { country: 'AUS', value: 75 },
            { country: 'CHL', value: 2100 }
          ],
          Processing: [
            { country: 'CHN', value: 75 }
          ],
          Manufacturing: [
            { country: 'USA', value: 50 },
            { country: 'DEU', value: 40 }
          ],
          Distribution: [
            { country: 'Global', value: 100 }
          ]
        }
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
    links: [
      { source: 'Mining', target: 'Processing', value: 100 },
      { source: 'Processing', target: 'Manufacturing', value: 80 },
      { source: 'Manufacturing', target: 'Distribution', value: 50 }
    ],
    locations: {
      Mining: [
        { 
          country: 'COD', 
          value: 2000, 
          coordinates: [21.7587, -4.0383],
          company: 'Glencore',
          site: 'Mutanda Mining'
        }
      ],
      Processing: [
        { 
          country: 'CHN', 
          value: 60, 
          coordinates: [104.1954, 35.8617],
          company: 'Huayou Cobalt',
          site: 'Tongxiang Facility'
        }
      ],
      Manufacturing: [
        { 
          country: 'JPN', 
          value: 40, 
          coordinates: [138.2529, 36.2048],
          company: 'Panasonic',
          site: 'Kasai Plant'
        }
      ],
      Distribution: [
        { 
          country: 'Global', 
          value: 50, 
          coordinates: [0, 0],
          company: 'Multiple Distributors',
          site: 'Global Distribution Network'
        }
      ]
    },
    years: [2020, 2021, 2022, 2023, 2024],
    dataByYear: {
      2020: {
        links: [
          { source: 'Mining', target: 'Processing', value: 100 },
          { source: 'Processing', target: 'Manufacturing', value: 80 },
          { source: 'Manufacturing', target: 'Distribution', value: 50 }
        ],
        locations: {
          Mining: [
            { country: 'COD', value: 3000 }
          ],
          Processing: [
            { country: 'CHN', value: 60 }
          ],
          Manufacturing: [
            { country: 'JPN', value: 40 }
          ],
          Distribution: [
            { country: 'Global', value: 50 }
          ]
        }
      },
      2021: {
        links: [
          { source: 'Mining', target: 'Processing', value: 90 },
          { source: 'Processing', target: 'Manufacturing', value: 70 },
          { source: 'Manufacturing', target: 'Distribution', value: 40 }
        ],
        locations: {
          Mining: [
            { country: 'COD', value: 80 }
          ],
          Processing: [
            { country: 'CHN', value: 70 }
          ],
          Manufacturing: [
            { country: 'JPN', value: 50 }
          ],
          Distribution: [
            { country: 'Global', value: 60 }
          ]
        }
      },
      2022: {
        links: [
          { source: 'Mining', target: 'Processing', value: 85 },
          { source: 'Processing', target: 'Manufacturing', value: 65 },
          { source: 'Manufacturing', target: 'Distribution', value: 45 }
        ],
        locations: {
          Mining: [
            { country: 'COD', value: 90 }
          ],
          Processing: [
            { country: 'CHN', value: 75 }
          ],
          Manufacturing: [
            { country: 'JPN', value: 60 }
          ],
          Distribution: [
            { country: 'Global', value: 70 }
          ]
        }
      },
      2023: {
        links: [
          { source: 'Mining', target: 'Processing', value: 80 },
          { source: 'Processing', target: 'Manufacturing', value: 60 },
          { source: 'Manufacturing', target: 'Distribution', value: 50 }
        ],
        locations: {
          Mining: [
            { country: 'COD', value: 100 }
          ],
          Processing: [
            { country: 'CHN', value: 80 }
          ],
          Manufacturing: [
            { country: 'JPN', value: 70 }
          ],
          Distribution: [
            { country: 'Global', value: 80 }
          ]
        }
      },
      2024: {
        links: [
          { source: 'Mining', target: 'Processing', value: 75 },
          { source: 'Processing', target: 'Manufacturing', value: 55 },
          { source: 'Manufacturing', target: 'Distribution', value: 45 }
        ],
        locations: {
          Mining: [
            { country: 'COD', value: 110 }
          ],
          Processing: [
            { country: 'CHN', value: 85 }
          ],
          Manufacturing: [
            { country: 'JPN', value: 75 }
          ],
          Distribution: [
            { country: 'Global', value: 90 }
          ]
        }
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
    links: [
      { source: 'Mining', target: 'Processing', value: 100 },
      { source: 'Processing', target: 'Manufacturing', value: 85 },
      { source: 'Manufacturing', target: 'Distribution', value: 45 }
    ],
    locations: {
      Mining: [
        { 
          country: 'IDN', 
          value: 55, 
          coordinates: [113.9213, -0.7893],
          company: 'Vale Indonesia',
          site: 'Sorowako Mine'
        }
      ],
      Processing: [
        { 
          country: 'CHN', 
          value: 75, 
          coordinates: [104.1954, 35.8617],
          company: 'Tsingshan',
          site: 'Morowali Industrial Park'
        }
      ],
      Manufacturing: [
        { 
          country: 'KOR', 
          value: 45, 
          coordinates: [127.7669, 35.9078],
          company: 'LG Chem',
          site: 'Ochang Plant'
        }
      ],
      Distribution: [
        { 
          country: 'Global', 
          value: 45, 
          coordinates: [0, 0],
          company: 'Multiple Distributors',
          site: 'Global Distribution Network'
        }
      ]
    },
    years: [2020, 2021, 2022, 2023, 2024],
    dataByYear: {
      2020: {
        links: [
          { source: 'Mining', target: 'Processing', value: 100 },
          { source: 'Processing', target: 'Manufacturing', value: 85 },
          { source: 'Manufacturing', target: 'Distribution', value: 45 }
        ],
        locations: {
          Mining: [
            { country: 'IDN', value: 55 }
          ],
          Processing: [
            { country: 'CHN', value: 75 }
          ],
          Manufacturing: [
            { country: 'KOR', value: 45 }
          ],
          Distribution: [
            { country: 'Global', value: 45 }
          ]
        }
      },
      2021: {
        links: [
          { source: 'Mining', target: 'Processing', value: 90 },
          { source: 'Processing', target: 'Manufacturing', value: 80 },
          { source: 'Manufacturing', target: 'Distribution', value: 40 }
        ],
        locations: {
          Mining: [
            { country: 'IDN', value: 60 }
          ],
          Processing: [
            { country: 'CHN', value: 80 }
          ],
          Manufacturing: [
            { country: 'KOR', value: 50 }
          ],
          Distribution: [
            { country: 'Global', value: 50 }
          ]
        }
      },
      2022: {
        links: [
          { source: 'Mining', target: 'Processing', value: 85 },
          { source: 'Processing', target: 'Manufacturing', value: 75 },
          { source: 'Manufacturing', target: 'Distribution', value: 35 }
        ],
        locations: {
          Mining: [
            { country: 'IDN', value: 65 }
          ],
          Processing: [
            { country: 'CHN', value: 85 }
          ],
          Manufacturing: [
            { country: 'KOR', value: 55 }
          ],
          Distribution: [
            { country: 'Global', value: 55 }
          ]
        }
      },
      2023: {
        links: [
          { source: 'Mining', target: 'Processing', value: 3000 },
          { source: 'Processing', target: 'Manufacturing', value: 70 },
          { source: 'Manufacturing', target: 'Distribution', value: 30 }
        ],
        locations: {
          Mining: [
            { country: 'IDN', value: 3000 }
          ],
          Processing: [
            { country: 'CHN', value: 90 }
          ],
          Manufacturing: [
            { country: 'KOR', value: 60 }
          ],
          Distribution: [
            { country: 'Global', value: 60 }
          ]
        }
      },
      2024: {
        links: [
          { source: 'Mining', target: 'Processing', value: 75 },
          { source: 'Processing', target: 'Manufacturing', value: 65 },
          { source: 'Manufacturing', target: 'Distribution', value: 30 }
        ],
        locations: {
          Mining: [
            { country: 'IDN', value: 75 }
          ],
          Processing: [
            { country: 'CHN', value: 95 }
          ],
          Manufacturing: [
            { country: 'KOR', value: 65 }
          ],
          Distribution: [
            { country: 'Global', value: 65 }
          ]
        }
      }
    }
  }
};