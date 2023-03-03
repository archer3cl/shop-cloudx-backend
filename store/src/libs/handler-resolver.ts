export const handlerPath = (context: string) => {
  return `${context
    .slice([...context].findIndex((el, index) => el !== process.cwd()[index]))
    .substring(1)
    .replace(/\\/g, '/')}`;
};
