export default function getTimestamp(): string {
  const date = new Date();
  const year = date.getUTCFullYear().toString();
  const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
  const day = ('0' + date.getUTCDate()).slice(-2);
  return year + month + day;
};