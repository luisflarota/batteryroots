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
          value: 70, 
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
    }
  }
};