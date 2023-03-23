export const databaseTables = () => {
  const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;
  return {
    productsTable:
      PRODUCTS_TABLE ?? 'shop-cloudx-backend-db-products-table-dev',
    stocksTable: STOCKS_TABLE ?? 'shop-cloudx-backend-db-stocks-table-dev',
  };
};
