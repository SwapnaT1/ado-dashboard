/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ADO_ORG: process.env.ADO_ORG,
    ADO_PROJECT: process.env.ADO_PROJECT,
    ADO_QUERY_GBF: process.env.ADO_QUERY_GBF,
    ADO_QUERY_RW: process.env.ADO_QUERY_RW,
    ADO_QUERY_ENH: process.env.ADO_QUERY_ENH,
    ADO_QUERY_PRIOR: process.env.ADO_QUERY_PRIOR,
    ADO_QUERY_RVE: process.env.ADO_QUERY_RVE,
    ADO_QUERY_OSL: process.env.ADO_QUERY_OSL,
  },
}

module.exports = nextConfig
