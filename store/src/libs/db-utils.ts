export const databaseTables = () => {
  const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;
  return {
    productsTable: PRODUCTS_TABLE ?? 'unknown-products-table',
    stocksTable: STOCKS_TABLE ?? 'unknown-stocks-table',
  };
};
