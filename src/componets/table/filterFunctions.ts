import type { RankingInfo } from '@tanstack/match-sorter-utils';
import type { Row } from '@tanstack/react-table';

import { rankItem, rankings } from '@tanstack/match-sorter-utils';

const fuzzy = <TData extends Record<string, any> = {}>(
  row: Row<TData>,
  columnId: string,
  filterValue: string | number,
  addMeta: (item: RankingInfo) => void
) => {
  const itemRank = rankItem(row.getValue(columnId), filterValue as string, {
    threshold: rankings.MATCHES,
  });

  addMeta(itemRank);

  return itemRank.passed;
};

fuzzy.autoRemove = (val: any) => !val;

const contains = <TData extends Record<string, any> = {}>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) => {
  const newRow = row.getValue<string | number>(id).toString().toLowerCase().trim();

  if (newRow === 'enabled' || newRow === 'disabled') return false;

  return newRow.includes(filterValue.toString().toLowerCase().trim());
};

contains.autoRemove = (val: any) => !val;

const startsWith = <TData extends Record<string, any> = {}>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) =>
  row
    .getValue<string | number>(id)
    .toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue.toString().toLowerCase().trim());

startsWith.autoRemove = (val: any) => !val;

export const filterFns = {
  fuzzy,
  contains,
  startsWith,
};
